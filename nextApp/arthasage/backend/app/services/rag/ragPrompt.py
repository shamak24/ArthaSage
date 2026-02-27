def build_rag_prompt(analysis, question, retrieved_docs, k=3):

    # --- Edge case: empty or invalid question ---
    if not question or not isinstance(question, str) or not question.strip():
        return None

    question = question.strip()

    # --- Edge case: k must be a positive integer ---
    k = max(1, int(k)) if isinstance(k, (int, float)) else 3

    # --- Edge case: analysis is None or not a dict ---
    if not analysis or not isinstance(analysis, dict):
        analysis = {}

    # Safely extract top-level keys with fallbacks
    raw_context  = analysis.get("financial_context") or {}
    raw_portfolio = analysis.get("portfolio_context") or {}
    anomalies    = analysis.get("anomalies") or "No anomalies detected."

    # --- Edge case: financial_context fields may be missing ---
    income           = raw_context.get("income", "N/A")
    expenses         = raw_context.get("expenses", "N/A")
    savings          = raw_context.get("savings", "N/A")
    category_spending = raw_context.get("category_spending", "N/A")

    # --- Edge case: portfolio_context fields may be missing ---
    portfolio_value = raw_portfolio.get("portfolio_value", "N/A")
    allocation      = raw_portfolio.get("allocation", "N/A")

    # Flag when all user financial data is unavailable
    no_financial_data = all(
        v == "N/A"
        for v in [income, expenses, savings, category_spending, portfolio_value, allocation]
    )

    # --- Edge case: retrieved_docs is None, empty, or contains malformed items ---
    valid_docs = []
    if retrieved_docs and isinstance(retrieved_docs, list):
        for doc in retrieved_docs[:k]:
            if isinstance(doc, dict) and isinstance(doc.get("text"), str) and doc["text"].strip():
                valid_docs.append(doc)

    formatted_docs = "\n\n".join(
        f"[Source {i+1}]: {doc['text'][:500]}..."
        for i, doc in enumerate(valid_docs)
    ) if valid_docs else "No relevant knowledge retrieved."

    # Build a note if financial data is entirely absent
    data_availability_note = (
        "\n> NOTE: No user financial data is available. Answer using FINANCIAL KNOWLEDGE only.\n"
        if no_financial_data else ""
    )

    prompt = f"""
You are an AI Financial Copilot designed to help users understand and improve their financial decisions.

Your responsibilities:

1. Provide clear, practical financial guidance.
2. Use USER FINANCIAL CONTEXT when the question relates to the user's personal finances.
3. Use FINANCIAL KNOWLEDGE for general education or conceptual questions.
4. Combine both sources when appropriate.
5. Never invent financial data that is not provided.
6. Be concise, structured, and easy to understand.
7. Avoid giving risky or speculative investment advice.
8. If information is insufficient, say so clearly.
{data_availability_note}
----------------------------------------

USER FINANCIAL CONTEXT:

Income: {income}
Expenses: {expenses}
Savings: {savings}

Category Spending:
{category_spending}

PORTFOLIO CONTEXT:

Portfolio Value: {portfolio_value}
Asset Allocation:
{allocation}

DETECTED ANOMALIES:
{anomalies}

----------------------------------------

RETRIEVED FINANCIAL KNOWLEDGE:
{formatted_docs}

----------------------------------------

USER QUESTION:
{question}

----------------------------------------

INSTRUCTIONS:

- First determine whether the question is:
  (A) Personal finance analysis
  (B) General financial education
  (C) Hybrid (both)

- If (A): prioritize USER FINANCIAL CONTEXT. If user data shows "N/A", state that data is unavailable.
- If (B): rely mainly on FINANCIAL KNOWLEDGE.
- If (C): combine both naturally.

- Explain reasoning briefly when giving advice.
- Use actual numbers from the context when available.
- Do NOT mention embeddings, retrieval, or internal systems.
- Do NOT invent numbers or assumptions not present in the data.
- If data is insufficient to answer, clearly state: "insufficient_data".

----------------------------------------

RESPONSE FORMAT:

Answer in this exact structure:

1. **Direct Answer**
2. **Explanation**
3. **Suggested Action** (if applicable)

Keep tone professional, supportive, and educational.
"""

    return prompt