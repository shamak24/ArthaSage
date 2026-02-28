"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface CategoryData {
    name: string
    value: number
    color: string
}

interface CategoryChartProps {
    data: CategoryData[]
}

const CURATED_COLORS: Record<string, string> = {
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

const FALLBACK_COLORS = [
    "oklch(0.55 0.2 264)",
    "oklch(0.6 0.18 155)",
    "oklch(0.7 0.15 45)",
    "oklch(0.6 0.18 300)",
    "oklch(0.65 0.22 350)",
]

function getCategoryColor(name: string, index: number): string {
    return CURATED_COLORS[name] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]
}

export function CategoryChart({ data }: CategoryChartProps) {
    const chartData = data.length > 0
        ? data.map((d, i) => ({ ...d, color: getCategoryColor(d.name, i) }))
        : [
            { name: "Food & Dining", value: 820, color: CURATED_COLORS["Food & Dining"] },
            { name: "Transportation", value: 340, color: CURATED_COLORS["Transportation"] },
            { name: "Shopping", value: 280, color: CURATED_COLORS["Shopping"] },
            { name: "Entertainment", value: 180, color: CURATED_COLORS["Entertainment"] },
            { name: "Utilities", value: 120, color: CURATED_COLORS["Utilities"] },
        ]

    const total = chartData.reduce((s, d) => s + d.value, 0)

    return (
        <div className="chart-card">
            <div className="chart-card-header">
                <h3 className="chart-card-title">Spending by Category</h3>
            </div>
            <p className="chart-card-subtitle">
                ${total.toLocaleString()} total
            </p>
            <div style={{ height: 200, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                border: '1px solid var(--border)',
                                borderRadius: '10px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                fontSize: '0.8125rem',
                            }}
                            itemStyle={{ color: 'var(--foreground)' }}
                            formatter={(value: number | string | undefined) => [`$${Number(value ?? 0).toLocaleString()}`, '']}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", marginTop: 8 }}>
                {chartData.map((entry, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem" }}>
                        <div style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: entry.color,
                            flexShrink: 0,
                        }} />
                        <span style={{ color: "var(--muted-foreground)" }}>{entry.name}</span>
                        <span style={{ color: "var(--foreground)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                            ${entry.value.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
