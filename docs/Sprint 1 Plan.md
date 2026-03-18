## Venture 7 — Sprint 1 Plan

### 🎯 Goal
Make the RAG system **reliable, verifiable, and demo-ready** for MVP.

---

## ✅ Must Complete This Week

### 1. Strengthen Verification
- Add a simple validation step after generation:
  - Check if answer content is actually supported by retrieved text
- Improve refusal behavior when support is weak or missing

---

### 2. Fix Evaluation Rigor
- Re-evaluate all test cases
- Mark weakly grounded answers as FAIL
- Report honest:
  - retrieval accuracy
  - grounding accuracy

---

### 3. Add Source Traceability
- Create `docs/data_sources.md`
- Include:
  - indexed URLs/documents
  - categories (admissions, financial aid, etc.)

---

### 4. Improve Demo Flow
- Add minimal UI (Streamlit or clean CLI)
- Show:
  - user question
  - retrieved sources (top-k)
  - generated answer
  - citations
  - refusal case

---

### 5. Tune Retrieval Quality
- Review top-k results for common questions
- Adjust chunking / retrieval to ensure best source appears

---

### 6. Freeze MVP Scope
- Limit to a few reliable domains:
  - admissions
  - financial aid
  - registration
  - tutoring

---

## 🧪 Definition of Done
- Ask a question → see:
  - correct sources retrieved
  - grounded answer with citations
  - proper refusal when unsupported
- Results are consistent and trustworthy

---

## 🗣️ Instructor Note
> Focus on trust and correctness. A smaller but reliable assistant is better than a broad but inconsistent one.
