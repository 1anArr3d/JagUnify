# JagUnify

JagUnify is an AI-powered academic advisor chatbot for Texas A&M University–San Antonio students. It answers questions about degree requirements, admissions, financial aid, academic policies, and registration using official catalog sources — with verifiable citations.

## MVP Scope
* **User Question Input:** A text-based interface where students can submit inquiries.
* **Document Retrieval:** A retrieval engine that pulls relevant context from indexed TAMUSA documents.
* **Answer Generation:** The LLM will respond to the query with an answer grounded in evidence pulled from the data sources, or will refuse to provide an answer if evidence is not available
* **Providing Citations:** The response from the LLM will have both in-line citations to denote information pulled from a source, as well as a list of clickable links that take the user to the cited page.


## Features

- Grounded answers with inline citations linking to official catalog pages
- Multi-turn conversation memory — follow-up questions retain prior context
- Refusal when a question falls outside the indexed catalog
- Re-ranker pipeline for high-quality source retrieval
- React chat interface with campus background

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** FastAPI (Python)
- **RAG Pipeline:** LlamaIndex + ChromaDB + OpenAI
- **Re-ranker:** cross-encoder/ms-marco-MiniLM-L-12-v2

## Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- An OpenAI API key

### Backend

1. Clone the repo
2. Create a `.env` file in the root folder (see `.env.example`):
   ```
   OPENAI_API_KEY=your_api_key
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Build the vector index (first time only):
   ```
   cd src
   python retrieval.py
   ```
5. Start the API server:
   ```
   cd src
   python -m uvicorn app:app --reload
   ```

### Frontend

1. Navigate to the frontend directory:
   ```
   cd "frontend"
   ```
2. Create a `.env` file (see `.env.example`):
   ```
   VITE_API_URL=http://localhost:8000
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the dev server:
   ```
   npm run dev
   ```
5. Open `http://localhost:5173`

## Grounded Example

The user asks the tool, "What is the required GPA to avoid academic probation?" The LLM will respond by stating that the GPA for avoiding academic probation is 2.0, as well as providing more specific information for other specific rpograms. It will include in-line citations that back up its answer, as well as  

## Refusal Example

The user will ask the tool what the operating hours for the university's library are. This information isn't actually available within any of the documents the system is able to pull from, so it responds by saying "I cannot find supporting information in the included TAMUSA documents."

## Project Status

Currently in active development for an academic course (Milestone 2 complete).

## Team

- Oscar Hernandez (Team Lead)
- Ian Arredondo
- Christian Hernandez
- Dustin Heagerty
- Trieu Do
