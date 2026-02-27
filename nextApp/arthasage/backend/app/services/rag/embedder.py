from google import genai
import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(__file__)
dotenv_path = os.path.abspath(os.path.join(BASE_DIR, "../../../.env"))
load_dotenv(dotenv_path=dotenv_path)

def embed(text):
    client = genai.Client()

    res = client.models.embed_content(
            model="gemini-embedding-001",
            contents="What is the meaning of life?"
    )
    return res.embeddings[0].values



