def build_transaction_context(transactions):
    income = 0
    expenses = 0
    category_spending = {}

    for t in transactions:
        if t.type == "income":
            income += t.amount
        else:
            expenses += t.amount
            if t.category:
                category_spending[t.category] = (
                    category_spending.get(t.category, 0)
                    + t.amount
                )

    savings = income - expenses

    return {
        "income": income,
        "expenses": expenses,
        "savings": savings,
        "category_spending": category_spending,
    }

def build_portfolio_context(holdings):
    total_value = 0
    positions = []

    for h in holdings:
        value = h.quantity * h.avgPrice
        total_value += value

        positions.append({
            "symbol": h.symbol,
            "value": value
        })

    allocation = {}

    if total_value > 0:
        for p in positions:
            allocation[p["symbol"]] = round(
                p["value"] / total_value, 2
            )

    return {
        "portfolio_value": total_value,
        "allocation": allocation,
    }