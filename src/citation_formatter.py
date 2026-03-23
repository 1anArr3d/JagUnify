import re

REFUSAL_MSG = "I cannot find supporting information in the indexed TAMUSA documents."

# Patterns that indicate the LLM issued a refusal rather than a grounded answer
_REFUSAL_PATTERNS = [
    "cannot find supporting information",
    "i am sorry",
    "i'm sorry",
    "not contained in the context",
]

def format_citations(response):
    # No response or nothing was retrieved
    if not response or not response.source_nodes:
        return {"answer": REFUSAL_MSG, "sources": []}

    answer_text = response.response

    # If the LLM itself refused, normalize to the standard refusal message
    if any(pattern in answer_text.lower() for pattern in _REFUSAL_PATTERNS):
        return {"answer": REFUSAL_MSG, "sources": []}

    # If no citation brackets present, the LLM produced an ungrounded answer
    if "[" not in answer_text:
        return {"answer": REFUSAL_MSG, "sources": []}

    # Build source list with position-based IDs matching the LLM's [1],[2]... numbering.
    # Scores come from the re-ranker — higher means the chunk better answers the question.
    formatted_sources = []
    for i, node in enumerate(response.source_nodes, start=1):
        url = node.metadata.get('source_url', 'https://www.tamusa.edu')
        snippet = node.get_content()[:150].strip().replace("\n", " ") + "..."
        score = round(node.score, 4) if node.score is not None else None
        formatted_sources.append({
            "id": i,
            "url": url,
            "snippet": snippet,
            "score": score,
        })

    return {
        "answer": answer_text,
        "sources": formatted_sources,
    }

def print_display(formatted_output):
    print(f"\nResponse: {formatted_output['answer']}")
    if formatted_output['sources']:
        print("\nSources:")
        for src in formatted_output['sources']:
            score_str = f" (score: {src['score']})" if src['score'] is not None else ""
            print(f"[{src['id']}] {src['url']}{score_str}")
    else:
        print("\n(No sources verified for this response)")
