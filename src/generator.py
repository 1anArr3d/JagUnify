import warnings
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", message=".*urllib3.*")
import os
from llama_index.core import PromptTemplate, Settings
from llama_index.core.query_engine import CitationQueryEngine
from llama_index.core.postprocessor import SentenceTransformerRerank
from llama_index.llms.openai import OpenAI
from llama_index.core.llms import ChatMessage, MessageRole
from retrieval import load_index

CANDIDATE_K = 14  # Initial retrieval pool for the re-ranker to select from
TOP_K = 7         # Final chunks passed to the LLM after re-ranking

# Sets up the engine that turns retrieved chunks into a final answer with citations
def jag_query_engine(index):

    Settings.llm = OpenAI(model="gpt-4o-mini", temperature=0.1)

    # Custom prompt template for strict grounding
    qa_prompt_tmpl_str = (
        "You are the JagUnify Assistant, an official resource for Texas A&M University-San Antonio.\n"
        "Context information is provided below from campus documents.\n"
        "---------------------\n"
        "{context_str}\n"
        "---------------------\n"
        "Instructions:\n"
        "1. Answer the query using ONLY the context provided.\n"
        "2. Use inline citations in the format [1], [2], etc.\n"
        "3. If the answer is not contained in the context, strictly say: "
        "'I am sorry, but I cannot find supporting information in the indexed TAMUSA documents.'\n\n"
        "Query: {query_str}\n"
        "Answer: "
    )

    qa_prompt = PromptTemplate(template=qa_prompt_tmpl_str)

    # Re-ranker: scores each (question, chunk) pair together so the best chunks
    # reach the LLM regardless of surface-level wording overlap between doc types
    reranker = SentenceTransformerRerank(
        model="cross-encoder/ms-marco-MiniLM-L-12-v2",
        top_n=TOP_K,
    )

    query_engine = CitationQueryEngine.from_args(
        index=index,
        similarity_top_k=CANDIDATE_K,
        citation_chunk_size=1024,
        node_postprocessors=[reranker],
    )

    query_engine.update_prompts({"response_synthesizer:text_qa_template": qa_prompt})

    return query_engine


# Rewrites the latest question as a standalone question given prior conversation turns.
# history is a list of {"role": "human"|"bot", "text": "..."} dicts.
# Returns the condensed question string (or original question if no history).
def condense_question(history: list, question: str) -> str:
    if not history:
        return question

    llm = OpenAI(model="gpt-4o-mini", temperature=0)

    convo_lines = []
    for turn in history:
        role = "User" if turn.get("role") == "human" else "Assistant"
        convo_lines.append(f"{role}: {turn.get('text', '')}")
    convo_text = "\n".join(convo_lines)

    system_msg = ChatMessage(
        role=MessageRole.SYSTEM,
        content=(
            "Given the conversation history and a follow-up question, "
            "rewrite the follow-up question as a fully self-contained standalone question. "
            "Do not answer the question — only rewrite it. "
            "If the follow-up is already standalone, return it unchanged."
        ),
    )
    user_msg = ChatMessage(
        role=MessageRole.USER,
        content=f"Conversation:\n{convo_text}\n\nFollow-up question: {question}\n\nStandalone question:",
    )

    response = llm.chat([system_msg, user_msg])
    return response.message.content.strip()

if __name__ == "__main__":
    from citation_formatter import format_citations, print_display

    # 1. Load the existing storage
    # (Only use build_vector_store_index() if you have deleted the /storage folder)
    index = load_index()
    
    # 2. Initialize the grounded engine
    engine = jag_query_engine(index)
    
    # --- TEST 1: Grounded Policy Question ---
    print("TEST 1: GROUNDED TAMUSA INQUIRY")

    query_1 = "What are the graduation requirements for the Computer Science degree?"
    response_1 = engine.query(query_1)

    # Pass raw response through the Citation Layer
    final_output_1 = format_citations(response_1)
    print_display(final_output_1)

    # --- TEST 2: Out-of-Scope (Refusal) ---
    print("TEST 2: OUT-OF-SCOPE REFUSAL")

    query_2 = "What should I eat for lunch tomorrow?"
    response_2 = engine.query(query_2)
    
    # Pass through Citation Layer to ensure it triggers the mandatory refusal message
    final_output_2 = format_citations(response_2)
    print_display(final_output_2)