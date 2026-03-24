import warnings
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", message=".*urllib3.*")
from llama_index.core import PromptTemplate, Settings
from llama_index.core.query_engine import CitationQueryEngine
from llama_index.core.postprocessor import SentenceTransformerRerank
from llama_index.llms.openai import OpenAI
from llama_index.core.llms import ChatMessage, MessageRole
from retrieval import load_index

CANDIDATE_K = 20  # Initial retrieval pool for the re-ranker to select from
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
        "3. Do NOT include any URLs or hyperlinks in your answer. Reference sources using citation numbers only.\n"
        "4. If the answer is not contained in the context, strictly say: "
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
    from citation_formatter import format_citations

    TEST_CASES = [
        # Grounded — catalog-scoped academic advising questions
        (1,  "What are the graduation requirements for undergraduate students at TAMUSA?"),
        (2,  "What is the required GPA to avoid academic probation?"),
        (3,  "What are the core curriculum requirements for a Bachelor of Science degree?"),
        (4,  "What courses are required for the Computer Science degree?"),
        (5,  "What is the maximum number of credit hours a student can take per semester?"),
        (6,  "How does a student appeal a grade at TAMUSA?"),
        (7,  "What are the admission requirements for first-year students?"),
        (8,  "What transfer credit policies apply to incoming transfer students?"),
        (9,  "What is the academic calendar for the upcoming fall semester?"),
        (10, "How can a student apply for financial aid at TAMUSA?"),
        (11, "What are the requirements for the Business Administration degree?"),
        (12, "What graduate programs does TAMUSA offer?"),
        (13, "What is the minimum GPA required to graduate?"),
        (14, "How many total credit hours are needed to earn a bachelor's degree?"),
        # Refusal — out of scope
        (15, "What are the operating hours of the TAMUSA library?"),
        (16, "What meal plans are available on campus?"),
        (17, "Where can I find on-campus parking at TAMUSA?"),
        (18, "Does TAMUSA have a football team?"),
        (19, "What NFL players graduated from TAMUSA?"),
        (20, "What is the average starting salary for TAMUSA graduates?"),
    ]

    index = load_index()
    engine = jag_query_engine(index)

    for num, question in TEST_CASES:
        print(f"\n{'='*60}")
        print(f"TEST CASE {num}")
        print(f"Question: {question}")

        response = engine.query(question)
        result = format_citations(response)

        print(f"Answer: {result['answer']}")

        if result['sources']:
            print("Sources:")
            for src in result['sources']:
                score_str = f" (score: {src['score']})" if src['score'] is not None else ""
                print(f"  [{src['id']}] {src['url']}{score_str}")
                print(f"       {src['snippet']}")
        else:
            print("Sources: None (Refusal)")

    print(f"\n{'='*60}")
    print("All test cases complete.")