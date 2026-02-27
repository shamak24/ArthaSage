import numpy as np
from app.services.rag.embedder import embed
from app.services.rag.vectordb import load_vector_store


def cosine(a, b):
    a, b = np.array(a), np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


def retrieve(question, k=3):
    vector_store = load_vector_store()
    q_emb = embed(question)

    scored = []
    for item in vector_store:
        score = cosine(q_emb, item["embedding"])
        scored.append((score, item["text"]))

    scored.sort(reverse=True)
    return [{"text": text} for _, text in scored[:k]]