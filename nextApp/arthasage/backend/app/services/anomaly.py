import statistics

def detect_transaction_anomalies(transactions):
    grouped = {}
    anomalies = []

    for t in transactions:
        if t.type != "expense" or not t.category:
            continue

        grouped.setdefault(t.category, []).append(t.amount)

    for category, values in grouped.items():
        if len(values) < 4:
            continue

        avg = statistics.mean(values)
        std = statistics.stdev(values)

        threshold = avg + 2 * std

        for t in transactions:
            if (
                t.category == category
                and t.type == "expense"
                and t.amount > threshold
            ):
                anomalies.append({
                    "transactionId": t.id,
                    "category": category,
                    "amount": t.amount,
                    "average": avg,
                    "severity": "high"
                })

    if len(anomalies) == 0:
        return {"message": "No transaction anomalies detected", "anomalies": []}
    return {"message": f"{len(anomalies)} transaction anomalies detected", "anomalies": anomalies}

def detect_portfolio_anomalies(portfolio_context):
    anomalies = []

    for symbol, share in portfolio_context["allocation"].items():
        if share > 0.6:
            anomalies.append({
                "type": "portfolio",
                "reason": f"High concentration in {symbol}",
                "severity": "medium"
            })

    if len(anomalies) == 0:
        return {"message": "No portfolio anomalies detected", "anomalies": []}
    return {"message": f"{len(anomalies)} portfolio anomalies detected", "anomalies": anomalies}