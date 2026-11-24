
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()


def get_llm():
    model_name = os.getenv("OLLAMA_MODEL", "openai/gpt-oss-120b")

    llm = ChatGroq(
        model=model_name,
        temperature=0.2,
        max_retries=2
    )

    return llm

