
from app.services.ai.prompt_builder import build_financial_prompt
from google import genai
import google.genai.types as types

def generate_insights(analysis):

    prompt = build_financial_prompt(analysis)

    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=[prompt],
    config=types.GenerateContentConfig(
        temperature=0.2,
        response_mime_type="application/json"
        )
    )

    return {"response": response.text}