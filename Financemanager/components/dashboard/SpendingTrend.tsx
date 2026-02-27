"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Sparkles } from 'lucide-react'

interface TrendData {
    date: string
    amount: number
}

interface SpendingTrendProps {
    data: TrendData[]
}

// Demo data if no real data
const demoData: TrendData[] = [
    { date: "Aug", amount: 3200 },
    { date: "Sep", amount: 2800 },
    { date: "Oct", amount: 4230 },
    { date: "Nov", amount: 3600 },
    { date: "Dec", amount: 3100 },
    { date: "Jan", amount: 3800 },
]

export function SpendingTrend({ data }: SpendingTrendProps) {
    const chartData = data.length > 0 ? data : demoData

    return (
        <div className="chart-card">
            <div className="chart-card-header">
                <h3 className="chart-card-title">Cash Flow Forecast</h3>
            </div>
            <p className="chart-card-subtitle">
                <Sparkles className="h-3 w-3" style={{ color: "oklch(0.55 0.2 264)" }} />
                AI prediction based on last 6 months
            </p>
            <div style={{ height: 260, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="oklch(0.55 0.2 264)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="oklch(0.55 0.2 264)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="var(--muted-foreground)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="var(--muted-foreground)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                border: '1px solid var(--border)',
                                borderRadius: '10px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                fontSize: '0.8125rem',
                            }}
                            itemStyle={{ color: 'var(--foreground)' }}
                            labelStyle={{ color: 'var(--muted-foreground)', marginBottom: 4 }}
                            formatter={(value: number | string | undefined) => [`$${Number(value ?? 0).toLocaleString()}`, 'Amount']}
                        />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="oklch(0.55 0.2 264)"
                            strokeWidth={2.5}
                            fill="url(#colorAmount)"
                            dot={false}
                            activeDot={{
                                r: 5,
                                fill: "oklch(0.55 0.2 264)",
                                stroke: "var(--card)",
                                strokeWidth: 2,
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
