"use client"

import { DollarSign, TrendingUp, TrendingDown, Sparkles, CreditCard } from "lucide-react"

interface OverviewCardsProps {
    totalSpend: number
    budget: number
    anomalyCount: number
}

export function OverviewCards({ totalSpend, budget, anomalyCount }: OverviewCardsProps) {
    const savingsForecast = Math.max(0, budget - totalSpend) * 0.3
    const spendChange = -5.2 // Mock change percentage
    const netWorthChange = 2.4

    return (
        <div className="overview-cards">
            {/* Total Net Worth */}
            <div className="overview-card">
                <div className="overview-card-glow" style={{ background: "oklch(0.55 0.2 264)" }} />
                <div className="overview-card-header">
                    <span className="overview-card-label">Total Net Worth</span>
                    <div className="overview-card-icon" style={{ background: "oklch(0.55 0.2 264 / 0.12)" }}>
                        <DollarSign className="h-4 w-4" style={{ color: "oklch(0.65 0.2 264)" }} />
                    </div>
                </div>
                <div className="overview-card-value">
                    ${(124592).toLocaleString()}.00
                </div>
                <span className="overview-card-change overview-card-change-up">
                    <TrendingUp className="h-3 w-3" />
                    +{netWorthChange}%
                </span>
            </div>

            {/* Monthly Spending */}
            <div className="overview-card">
                <div className="overview-card-glow" style={{ background: "oklch(0.6 0.18 300)" }} />
                <div className="overview-card-header">
                    <span className="overview-card-label">Monthly Spending</span>
                    <div className="overview-card-icon" style={{ background: "oklch(0.6 0.18 300 / 0.12)" }}>
                        <CreditCard className="h-4 w-4" style={{ color: "oklch(0.7 0.18 300)" }} />
                    </div>
                </div>
                <div className="overview-card-value">
                    ${totalSpend > 0 ? totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "3,240.00"}
                </div>
                <span className="overview-card-change overview-card-change-down">
                    <TrendingDown className="h-3 w-3" />
                    {spendChange}%
                </span>
            </div>

            {/* AI Savings Forecast */}
            <div className="overview-card">
                <div className="overview-card-glow" style={{ background: "oklch(0.6 0.18 155)" }} />
                <div className="overview-card-header">
                    <span className="overview-card-label">AI Savings Forecast</span>
                    <div className="overview-card-icon" style={{ background: "oklch(0.6 0.18 155 / 0.12)" }}>
                        <Sparkles className="h-4 w-4" style={{ color: "oklch(0.7 0.18 155)" }} />
                    </div>
                </div>
                <div className="overview-card-value">
                    ${savingsForecast > 0 ? savingsForecast.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "450.00"}
                </div>
                <span className="overview-card-change overview-card-change-up">
                    <TrendingUp className="h-3 w-3" />
                    Projected
                </span>
            </div>
        </div>
    )
}
