import os
from dotenv import load_dotenv
load_dotenv()
from llama_index.core import VectorStoreIndex, StorageContext, Settings
from llama_index.core.node_parser import SentenceSplitter
from llama_index.vector_stores.chroma import ChromaVectorStore
import chromadb

from ingestion import load_tamusa_data

#Chunks documents, creates embeddings, and saves them to a local ChromaDB vector store
def build_vector_store_index(data_directory='../docs/tamusa_data', persist_directory='./storage'):
    documents = load_tamusa_data(data_directory)

    #We use 1024 token chunks with a 50 token overlap to ensure context flows
    Settings.node_parser = SentenceSplitter(chunk_size=1024, chunk_overlap=50)

    #Initialize ChromaDB vector store
    db = chromadb.PersistentClient(path=persist_directory)
    chroma_collection = db.get_or_create_collection(name="tamusa_collection")
    vector_store = ChromaVectorStore(chroma_collection=chroma_collection)

    storage_context = StorageContext.from_defaults(vector_store=vector_store)

    #Create the VectorStoreIndex and persist it to disk
    index = VectorStoreIndex.from_documents(documents, storage_context=storage_context, show_progress=True)
    return index

#Loads an existing persisted index from ChromaDB
def load_index(persist_directory='./storage'):
    db = chromadb.PersistentClient(path=persist_directory)
    chroma_collection = db.get_or_create_collection(name="tamusa_collection")
    vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
    return VectorStoreIndex.from_vector_store(vector_store=vector_store)

#Returns a retriever for standalone use or testing
def get_retriever(index=None, similarity_top_k=7, persist_directory='./storage'):
    if index is None:
        index = load_index(persist_directory)
    return index.as_retriever(similarity_top_k=similarity_top_k)

if __name__ == "__main__":
    my_index = build_vector_store_index()
    retriever = get_retriever(index=my_index)
    print("Index built successfully.")