"use client"

import { Transaction } from "@/lib/types"
import { AlertTriangle } from "lucide-react"

interface TransactionTableProps {
    data: Transaction[]
}

const CATEGORY_COLORS: Record<string, string> = {
    "Food & Dining": "oklch(0.55 0.2 264)",
    "Transportation": "oklch(0.6 0.18 155)",
    "Utilities": "oklch(0.7 0.15 45)",
    "Shopping": "oklch(0.6 0.18 300)",
    "Entertainment": "oklch(0.65 0.22 350)",
    "Income": "oklch(0.65 0.15 145)",
    "Health": "oklch(0.6 0.15 200)",
    "Housing": "oklch(0.55 0.15 80)",
    "Uncategorized": "oklch(0.45 0.03 264)",
}

export function TransactionTable({ data }: TransactionTableProps) {
    // Demo data if empty
    const transactions: Transaction[] = data.length > 0 ? data : [
        { id: "1", date: "2023-10-01", description: "Starbucks Coffee", amount: 5.50, currency: "USD", category: "Food & Dining", is_anomaly: false, anomaly_score: 0 },
        { id: "2", date: "2023-10-01", description: "Uber Ride", amount: 24.00, currency: "USD", category: "Transportation", is_anomaly: false, anomaly_score: 0 },
        { id: "3", date: "2023-10-02", description: "Whole Foods Market", amount: 145.20, currency: "USD", category: "Food & Dining", is_anomaly: false, anomaly_score: 0 },
        { id: "4", date: "2023-10-05", description: "Netflix Subscription", amount: 15.99, currency: "USD", category: "Entertainment", is_anomaly: false, anomaly_score: 0 },
        { id: "5", date: "2023-10-10", description: "Salary Deposit", amount: 4000.00, currency: "USD", category: "Income", is_anomaly: false, anomaly_score: 0 },
    ]

    return (
        <div className="tx-table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th style={{ textAlign: "right" }}>Amount</th>
                        <th style={{ width: 40 }}></th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx) => (
                        <tr key={tx.id}>
                            <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                                {tx.date}
                            </td>
                            <td>
                                <div className="tx-desc-cell">
                                    <span>{tx.description}</span>
                                </div>
                            </td>
                            <td>
                                {tx.category ? (
                                    <span style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 6,
                                        fontSize: "0.75rem",
                                        fontWeight: 500,
                                        padding: "3px 10px",
                                        borderRadius: 6,
                                        background: "var(--secondary)",
                                        color: "var(--foreground)",
                                    }}>
                                        <span
                                            className="tx-cat-dot"
                                            style={{ background: CATEGORY_COLORS[tx.category] || "var(--muted-foreground)" }}
                                        />
                                        {tx.category}
                                    </span>
                                ) : (
                                    <span style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}>—</span>
                                )}
                            </td>
                            <td style={{
                                textAlign: "right",
                                fontFamily: "var(--font-mono)",
                                fontWeight: 600,
                                fontVariantNumeric: "tabular-nums",
                            }} className={tx.category === "Income" ? "tx-amount-positive" : "tx-amount-negative"}>
                                {tx.category === "Income" ? "+" : "-"}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td>
                                {tx.is_anomaly && (
                                    <AlertTriangle className="h-4 w-4" style={{ color: "oklch(0.65 0.2 25)" }} />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
