# from fastapi import APIRouter
# from typing import List

# from .transactions import TRANSACTIONS_DB
# from ..models.schemas import Insight, ChatRequest, ChatResponse
# from ..services.insights_engine import generate_insights_rag, chat_with_advisor

# router = APIRouter()


# @router.post("/generate", response_model=List[Insight])
# def generate_insights():
#     """Generate AI-powered financial insights using RAG + Gemini.
#     Falls back to rule-based heuristics if Gemini is unavailable."""
#     raw_insights = generate_insights_rag(TRANSACTIONS_DB)
#     return [Insight(type=i["type"], message=i["message"]) for i in raw_insights]


# @router.post("/chat", response_model=ChatResponse)
# def chat(request: ChatRequest):
#     """Chat with the AI financial advisor. Sends user message + financial context to Gemini."""
#     result = chat_with_advisor(request.message, TRANSACTIONS_DB)
#     return ChatResponse(**result)
