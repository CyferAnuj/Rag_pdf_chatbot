import os

os.environ["ANONYMIZED_TELEMETRY"] = "False"

import chromadb
from chromadb.config import Settings
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

CHROMA_DIR = "./chroma_db"
COLLECTION_NAME = "pdf_collection"

_embedding_model = None
_client = None


def get_chroma_client():
    global _client
    if _client is None:
        _client = chromadb.PersistentClient(
            path=CHROMA_DIR,
            settings=Settings(anonymized_telemetry=False)
        )
    return _client


def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
    return _embedding_model


def create_vector_store(split_docs):
    client = get_chroma_client()
    embedding_model = get_embedding_model()

    # DELETE PREVIOUS COLLECTION
    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass

    # CREATE NEW VECTOR STORE
    vectordb = Chroma.from_documents(
        documents=split_docs,
        embedding=embedding_model,
        client=client,
        collection_name=COLLECTION_NAME
    )

    return vectordb


def clear_vector_store():
    try:
        client = get_chroma_client()
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass
