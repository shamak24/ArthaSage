from app.services.context_builder import build_transaction_context, build_portfolio_context
from app.services.anomaly import detect_transaction_anomalies, detect_portfolio_anomalies

def analyze_finances(transactions, holdings):

    financial_context = build_transaction_context(transactions)

    transaction_anomalies = detect_transaction_anomalies(transactions)

    portfolio_context = build_portfolio_context(holdings)

    portfolio_anomalies = detect_portfolio_anomalies(
        portfolio_context
    )

    anomalies = {**transaction_anomalies, **portfolio_anomalies}

    status = "stable" if len(anomalies) == 0 else "attention_needed"

    return {
        "financial_context": financial_context,
        "portfolio_context": portfolio_context,
        "portfolio_anomalies": portfolio_anomalies,
        "transaction_anomalies": transaction_anomalies,
        "anomalies": anomalies,
        "status": status,
    }