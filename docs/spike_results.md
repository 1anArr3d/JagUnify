# Spike Recovery Report – Milestone 1  
Project: JagUnify – Grounded TAMUSA Information Assistant  
Date: 3/5/2026

---

## 1. What Was Attempted

During the spike phase, the team built a basic LLM-powered chatbot to answer TAMUSA-related questions using prompt engineering and direct API calls.

The spike did not include:
- Document ingestion
- Vector indexing
- Retrieval mechanisms
- Citation formatting
- Grounding validation

The system relied entirely on the LLM’s internal knowledge.

---

## 2. Why the Demo Was Not Delivered

The demo was not delivered due to architectural misalignment.

Key issues:
- We treated the system as a generic chatbot rather than a grounded retrieval system.
- No Retrieval-Augmented Generation (RAG) pipeline was implemented.
- Responses were not traceable to TAMUSA source documents.
- No citation or refusal mechanism existed.

As a result, the system did not meet the engineering verification standard required.

---

## 3. Current System Status

The project has been restructured into a grounded RAG pipeline with:

- Document ingestion and chunking
- Embedding generation and vector indexing
- Top-k retrieval
- Context-restricted LLM generation
- Inline citation formatting
- Refusal behavior when no supporting document is found
- Evaluation framework with measurable metrics

The system now enforces document-backed responses.

---

## 4. Revised Architecture

Pipeline:

User Question  
→ Query Embedding  
→ Vector Search (Top-k)  
→ Retrieved Chunks  
→ Context Injection  
→ LLM Generation  
→ Citation Formatting  
→ Final Output  

Deterministic components:
- Ingestion
- Chunking
- Embeddings
- Retrieval
- Citation mapping

LLM components:
- Answer synthesis from retrieved context only
- Refusal logic

This ensures traceability and prevents unsupported claims.

---

## 5. Plan Before Milestone 2

Before Milestone 2, the team will:

- Expand indexed TAMUSA document coverage
- Tune chunk size and retrieval parameters
- Strengthen grounding enforcement and refusal logic
- Expand evaluation test set
- Improve logging and modular pipeline structure

---

## Conclusion

The spike failed due to overreliance on the LLM and lack of retrieval infrastructure.

Milestone 1 represents a transition to a fully engineered, citation-based RAG system with verifiable grounding and measurable accuracy.
