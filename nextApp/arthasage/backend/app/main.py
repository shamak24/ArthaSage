from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import dotenv
from typing import List
from app.models.schemas import Transaction
from app.services.analyze import analyze_finances
from app.models.schemas import AnalyzeRequest
from app.services.ai.generate_insights import generate_insights
from app.services.rag.chat import answer_question

dotenv.load_dotenv()  # Load environment variables from .env file
app = FastAPI(title="AI Finance Manager API")

# Configure CORS
origins = [
    "http://localhost:3000",  # Next.js frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "AI Finance Manager Backend is running"}

@app.post("/analyze-finances")
def analyze(request: AnalyzeRequest):
    result = analyze_finances(
        request.transactions,
        request.holdings
    )
    return result

@app.post("/generate-insights")
def insights(request: AnalyzeRequest):

    analysis = analyze_finances(
        request.transactions,
        request.holdings
    )

    insights_data = generate_insights(analysis)

    return {
        "analysis": analysis,
        "insights": insights_data
    }

@app.post("/ask")
def ask_question(request: AnalyzeRequest, question: str):
    analysis = analyze_finances(
        request.transactions,
        request.holdings
    )
    answer = answer_question(question, analysis)

    return {"answer": answer}