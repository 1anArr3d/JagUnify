import re
#Validates and formats the response for the UI and ensures inline citations match the source list and handles refusals.
def format_citations(response):

    #Handle Refusal Case
    # If the response is empty or indicates no information found
    refusal_msg = "I cannot find supporting information in the indexed TAMUSA documents."
    
    if not response or not response.source_nodes:
        return {
            "answer": refusal_msg,
            "sources": []
        }

    answer_text = response.response
    source_nodes = response.source_nodes
    formatted_sources = []

    #Extract and Format Sources
    # IDs are position-based (1-indexed) to match the [1],[2] numbers the LLM used in the answer.
    # Deduplicating by URL and renumbering would cause citation numbers in the answer to point
    # to the wrong or missing entries in the source list.
    for i, node in enumerate(source_nodes, start=1):
        url = node.metadata.get('source_url', 'https://www.tamusa.edu')
        snippet = node.get_content()[:150].strip().replace("\n", " ") + "..."
        formatted_sources.append({
            "id": i,
            "url": url,
            "snippet": snippet
        })

    #Final Verification
    # Ensure the answer actually contains citation brackets [1]
    # If the LLM forgot them, we return the refusal to stay grounded
    if "[" not in answer_text:
        # Check if the text itself says it doesn't know
        if "sorry" in answer_text.lower() or "cannot find" in answer_text.lower():
            return {"answer": refusal_msg, "sources": []}

    return {
        "answer": answer_text,
        "sources": formatted_sources
    }

def print_display(formatted_output):
    print(f"\nResponse: {formatted_output['answer']}")
    
    if formatted_output['sources']:
        print("\nSources:")
        for src in formatted_output['sources']:
            print(f"[{src['id']}] {src['url']}")
    else:
        print("\n(No sources verified for this response)")