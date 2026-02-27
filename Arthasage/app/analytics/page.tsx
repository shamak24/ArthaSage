"use client"

import * as React from "react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts'
import { TrendingUp, PieChart as PieIcon, Building2, Wallet } from "lucide-react"

// Mock data for deep analytics
const monthlyData = [
    { month: 'Oct', spend: 4200, budget: 5000 },
    { month: 'Nov', spend: 3800, budget: 5000 },
    { month: 'Dec', spend: 5400, budget: 5000 },
    { month: 'Jan', spend: 4600, budget: 5000 },
    { month: 'Feb', spend: 3200, budget: 5000 },
]

const categoryData = [
    { name: 'Food', value: 1200, color: '#6366f1' },
    { name: 'Rent', value: 2000, color: '#818cf8' },
    { name: 'Transport', value: 400, color: '#a5b4fc' },
    { name: 'Entertainment', value: 600, color: '#c7d2fe' },
]

const topMerchants = [
    { name: "Amazon", amount: 1240.50, count: 8 },
    { name: "Starbucks", amount: 156.20, count: 12 },
    { name: "Whole Foods", amount: 840.00, count: 4 },
    { name: "Uber", amount: 245.75, count: 15 },
    { name: "Apple", amount: 999.00, count: 1 },
]

export default function AnalyticsPage() {
    return (
        <div className="page-container p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Analytics</h1>
                <p className="text-muted-foreground mt-1">Detailed breakdown of your financial habits.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Cash Flow History */}
                <div className="lg:col-span-2 bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-indigo-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">Cash Flow History</h2>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    tickFormatter={(val) => `$${val}`}
                                />
                                <Tooltip
                                    contentStyle={{ background: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="spend" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Spending by Category */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <PieIcon className="h-5 w-5 text-purple-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Categories</h2>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Merchants */}
                <div className="lg:col-span-1 bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Building2 className="h-5 w-5 text-emerald-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Top Merchants</h2>
                    </div>
                    <div className="space-y-4">
                        {topMerchants.map((merchant, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-xs font-bold text-indigo-400">
                                        {merchant.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">{merchant.name}</p>
                                        <p className="text-xs text-muted-foreground">{merchant.count} transactions</p>
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-white">${merchant.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Financial Health Core */}
                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Wallet className="h-32 w-32" />
                    </div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-4">
                            PHASE 2 ANALYTICS
                        </div>
                        <h2 className="text-4xl font-black text-white mb-2">Health Score: 84/100</h2>
                        <p className="text-lg text-indigo-200/70 max-w-md mx-auto">
                            You're in the top 15% of savers this month! Your spending on non-essentials is down 12% from January.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
