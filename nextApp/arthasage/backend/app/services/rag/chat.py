from app.services.rag.ragPrompt import build_rag_prompt
from google import genai
import google.genai.types as types
import json
from app.services.rag.retriever import retrieve

def answer_question(analysis, question):
    retrieved_docs = retrieve(question)

    prompt = build_rag_prompt(analysis, question, retrieved_docs)

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=[prompt],
    config=types.GenerateContentConfig(
        temperature=0.2,
        response_mime_type="application/json"
        )
    )

    # Parse the JSON string into a Python dict
    return json.loads(response.text)