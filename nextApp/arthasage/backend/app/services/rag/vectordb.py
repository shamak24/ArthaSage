import json
import os
from app.services.rag.embedder import embed

BASE_DIR = os.path.dirname(__file__)
KNOWLEDGE_RAW_PATH = os.path.join(BASE_DIR, "knowledge_raw.json")
VECTOR_STORE_PATH = os.path.join(BASE_DIR, "vector_store.json")

def chunk_text(text, chunk_size=500):
    """Split text into chunks of approximately chunk_size characters."""
    chunks = []
    for i in range(0, len(text), chunk_size):
        chunks.append(text[i:i + chunk_size])
    return chunks

def build_vector_store():
    vector_store = []
    with open(KNOWLEDGE_RAW_PATH, encoding="utf-8") as f:
        docs = json.load(f)

    for doc in docs:
        chunks = chunk_text(doc["text"])
        for chunk in chunks:
            vector_store.append({
                "text": chunk,
                "embedding": embed(chunk)
            })

    with open(VECTOR_STORE_PATH, "w", encoding="utf-8") as f:
        json.dump(vector_store, f, ensure_ascii=False)

    print(f"✅ Vector store built with {len(vector_store)} chunks.")

def load_vector_store():
    if not os.path.exists(VECTOR_STORE_PATH):
        raise FileNotFoundError(
            f"vector_store.json not found at {VECTOR_STORE_PATH}. "
            "Run `python vectordb.py` first to build it."
        )
    with open(VECTOR_STORE_PATH, encoding="utf-8") as f:
        return json.load(f)

if __name__ == "__main__":
    build_vector_store()

vector_store = load_vector_store()