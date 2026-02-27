"""
RAG + Gemini Insights Engine
Retrieves financial context from transaction data, augments a prompt, 
and generates intelligent insights via Google's Gemini API.
Falls back to rule-based heuristics if API key is missing or call fails.
"""

import os
import json
import re
from typing import List, Optional
from collections import defaultdict
from dotenv import load_dotenv

load_dotenv()

try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# ──────────────────────────────────────────────
# 1. Context Retrieval  (the "R" in RAG)
# ──────────────────────────────────────────────

def build_financial_context(transactions: List[dict]) -> str:
    """Build a structured financial summary from raw transactions."""
    if not transactions:
        return "No transaction data available."

    total_spend = sum(tx["amount"] for tx in transactions)
    count = len(transactions)

    # Category breakdown
    cat_totals: dict[str, float] = defaultdict(float)
    cat_counts: dict[str, int] = defaultdict(int)
    for tx in transactions:
        cat = tx.get("category", "Uncategorized")
        cat_totals[cat] += tx["amount"]
        cat_counts[cat] += 1

    sorted_cats = sorted(cat_totals.items(), key=lambda x: x[1], reverse=True)

    # Anomalies
    anomalies = [tx for tx in transactions if tx.get("is_anomaly")]

    # Date range
    dates = [tx["date"] for tx in transactions if tx.get("date")]
    date_range = f"{min(dates)} to {max(dates)}" if dates else "unknown"

    # Top merchants by frequency
    merchant_freq: dict[str, int] = defaultdict(int)
    for tx in transactions:
        merchant_freq[tx.get("description", "Unknown")] += 1
    top_merchants = sorted(merchant_freq.items(), key=lambda x: x[1], reverse=True)[:5]

    # Build context string
    lines = [
        f"=== FINANCIAL SUMMARY ({date_range}) ===",
        f"Total transactions: {count}",
        f"Total spending: ${total_spend:,.2f}",
        f"Monthly budget: $5,000.00",
        f"Budget remaining: ${max(0, 5000 - total_spend):,.2f}",
        "",
        "--- Spending by Category ---",
    ]
    for cat, amt in sorted_cats:
        pct = (amt / total_spend * 100) if total_spend > 0 else 0
        lines.append(f"  {cat}: ${amt:,.2f} ({pct:.1f}%) — {cat_counts[cat]} txns")

    if anomalies:
        lines.append("")
        lines.append(f"--- Anomalies Detected ({len(anomalies)}) ---")
        for a in anomalies[:5]:
            lines.append(
                f"  ⚠ {a['description']}: ${a['amount']:,.2f} "
                f"(z-score: {a.get('anomaly_score', 0):.2f})"
            )

    if top_merchants:
        lines.append("")
        lines.append("--- Most Frequent Merchants ---")
        for name, freq in top_merchants:
            lines.append(f"  {name}: {freq} transactions")

    return "\n".join(lines)


# ──────────────────────────────────────────────
# 2. Gemini Generation  (the "G" in RAG)
# ──────────────────────────────────────────────

INSIGHTS_SYSTEM_PROMPT = """You are FinAI, an expert financial advisor AI.
Analyze the user's financial data below and provide exactly 4 insights.

Rules:
- Each insight MUST be one of these types: "alert", "tip", or "success"
- Be specific — reference actual numbers, categories, and merchants from the data
- Be actionable — give concrete steps the user can take
- Keep each insight to 1-2 sentences max
- If anomalies exist, the first insight MUST be an alert about them

Respond ONLY in this exact JSON format (no markdown, no backticks):
[
  {"type": "alert"|"tip"|"success", "message": "..."},
  {"type": "alert"|"tip"|"success", "message": "..."},
  {"type": "alert"|"tip"|"success", "message": "..."},
  {"type": "alert"|"tip"|"success", "message": "..."}
]"""

CHAT_SYSTEM_PROMPT = """You are FinAI, an expert financial advisor built into a personal finance dashboard.
The user is chatting with you about their finances. You have access to their real financial data below.

Rules:
- Be conversational, friendly, and concise (2-3 sentences max per response)
- Reference specific numbers, categories, and merchants from their data
- Give actionable advice
- If asked about something not in the data, say so honestly
- Never hallucinate transaction details not present in the context"""


def _get_model():
    """Initialize and return the Gemini model."""
    if not HAS_GENAI or not GEMINI_API_KEY:
        return None
    
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        return genai.GenerativeModel("gemini-flash-latest")
    except Exception as e:
        print(f"[FinAI] Error configuring Gemini: {e}")
        return None


def _parse_insights_json(text: str) -> Optional[List[dict]]:
    """Parse the JSON array from Gemini's response, handling edge cases."""
    # Strip markdown code fences if present
    text = re.sub(r"```(?:json)?\s*", "", text).strip()
    text = text.strip("`")
    try:
        data = json.loads(text)
        if isinstance(data, list):
            return [
                {"type": item.get("type", "tip"), "message": item.get("message", "")}
                for item in data
                if isinstance(item, dict) and "message" in item
            ]
    except json.JSONDecodeError:
        pass
    return None


def generate_insights_rag(transactions: List[dict]) -> List[dict]:
    """Generate financial insights using RAG + Gemini. Falls back to rules."""
    model = _get_model()
    if model is None:
        return _generate_insights_fallback(transactions)

    context = build_financial_context(transactions)
    prompt = f"{INSIGHTS_SYSTEM_PROMPT}\n\n{context}"

    try:
        response = model.generate_content(prompt)
        parsed = _parse_insights_json(response.text)
        if parsed and len(parsed) >= 2:
            return parsed
    except Exception as e:
        print(f"[FinAI] Gemini insights generation failed: {e}")

    return _generate_insights_fallback(transactions)


def chat_with_advisor(user_message: str, transactions: List[dict]) -> dict:
    """Send a user message to the AI advisor with financial context."""
    model = _get_model()
    if model is None:
        return {
            "response": "AI advisor is offline. Please set a GEMINI_API_KEY environment variable to enable live AI responses.",
            "suggestions": [],
        }

    context = build_financial_context(transactions)
    prompt = (
        f"{CHAT_SYSTEM_PROMPT}\n\n"
        f"--- USER'S FINANCIAL DATA ---\n{context}\n\n"
        f"--- USER MESSAGE ---\n{user_message}"
    )

    try:
        response = model.generate_content(prompt)
        return {
            "response": response.text.strip(),
            "suggestions": [],
        }
    except Exception as e:
        error_msg = str(e)
        print(f"[FinAI] Gemini chat failed: {error_msg}")
        
        if "429" in error_msg or "quota" in error_msg.lower():
            return {
                "response": "Gemini API quota exceeded. You've reached the daily limit for the free tier. Please wait for it to reset or provide a new API key in Settings.",
                "suggestions": ["How to get a new key?", "Wait for reset"],
            }
            
        return {
            "response": "Sorry, I encountered an error processing your request. Please try again later.",
            "suggestions": [],
        }


# ──────────────────────────────────────────────
# 3. Fallback (rule-based, original logic)
# ──────────────────────────────────────────────

def _generate_insights_fallback(transactions: List[dict]) -> List[dict]:
    """Fallback rule-based insights when Gemini is unavailable."""
    insights = []
    total_spend = sum(tx["amount"] for tx in transactions)
    anomalies = [tx for tx in transactions if tx.get("is_anomaly")]

    if anomalies:
        latest = anomalies[-1]
        insights.append({
            "type": "alert",
            "message": f"{len(anomalies)} unusual transaction(s) detected. "
                       f"Example: {latest['description']} (${latest['amount']:,.2f}).",
        })

    cat_totals: dict[str, float] = defaultdict(float)
    for tx in transactions:
        cat_totals[tx.get("category", "Uncategorized")] += tx["amount"]
    sorted_cats = sorted(cat_totals.items(), key=lambda x: x[1], reverse=True)
    if sorted_cats:
        top_cat, top_amt = sorted_cats[0]
        insights.append({
            "type": "tip",
            "message": f"Your highest spending is in {top_cat} (${top_amt:,.2f}). "
                       f"Try setting a specific budget for this category.",
        })

    budget = 5000
    if total_spend > budget:
        insights.append({
            "type": "alert",
            "message": f"You've exceeded your monthly budget of ${budget:,} by ${(total_spend - budget):,.2f}.",
        })
    else:
        insights.append({
            "type": "success",
            "message": f"Great job! You're ${(budget - total_spend):,.2f} under your monthly budget.",
        })

    insights.append({
        "type": "tip",
        "message": "Based on your patterns, cooking at home 2 more times per week could save ~$150/month.",
    })

    return insights
