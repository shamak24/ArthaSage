"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    TrendingUp,
    TrendingDown,
    BarChart3,
    Briefcase,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    Link2,
    IndianRupee,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Holding, PortfolioSummary } from "@/lib/types"
import axios from "axios"

export default function PortfolioPage() {
    const [portfolio, setPortfolio] = React.useState<PortfolioSummary | null>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        fetchPortfolio()
    }, [])

    const fetchPortfolio = async () => {
        setLoading(true)
        try {
            const res = await axios.get("http://localhost:8000/api/accounts/portfolio")
            setPortfolio(res.data)
        } catch {
            // Demo fallback
            setPortfolio({
                totalInvested: 234580,
                currentValue: 280369.50,
                totalPnl: 45789.50,
                totalPnlPercent: 19.52,
                dayChange: 2340.75,
                dayChangePercent: 0.84,
                holdings: [],
            })
        }
        setLoading(false)
    }

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val)

    const formatNumber = (val: number) =>
        new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(val)

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "80vh" }}>
                <RefreshCw className="h-8 w-8 animate-spin" style={{ color: "oklch(0.55 0.2 264)" }} />
            </div>
        )
    }

    const hasHoldings = portfolio && portfolio.holdings.length > 0

    if (!hasHoldings) {
        return (
            <div className="page-container" style={{ padding: "2rem", maxWidth: 600, margin: "0 auto", textAlign: "center", marginTop: "10vh" }}>
                <div style={{
                    width: 80, height: 80, borderRadius: 24,
                    background: "oklch(0.25 0.05 264)", display: "flex",
                    alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem",
                }}>
                    <Briefcase style={{ width: 36, height: 36, color: "oklch(0.55 0.15 264)" }} />
                </div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "white", marginBottom: 8 }}>
                    No Portfolio Data Yet
                </h2>
                <p style={{ fontSize: "0.9rem", color: "oklch(0.55 0.02 264)", marginBottom: 24, lineHeight: 1.6 }}>
                    Connect your demat account to see your holdings, P&L, and investment insights all in one place.
                </p>
                <Button
                    onClick={() => window.location.href = "/connect"}
                    style={{
                        gap: 8, height: 48, paddingInline: 28, borderRadius: 12,
                        background: "linear-gradient(135deg, oklch(0.55 0.2 264), oklch(0.5 0.22 280))",
                        border: "none", color: "white", fontWeight: 700, fontSize: "0.9rem",
                    }}
                >
                    <Link2 style={{ width: 18, height: 18 }} />
                    Connect Demat Account
                </Button>
            </div>
        )
    }

    // Sector breakdown
    const sectorMap = portfolio!.holdings.reduce((acc, h) => {
        acc[h.sector] = (acc[h.sector] || 0) + h.value
        return acc
    }, {} as Record<string, number>)
    const sectors = Object.entries(sectorMap)
        .sort((a, b) => b[1] - a[1])
        .map(([name, value]) => ({
            name,
            value,
            percent: (value / portfolio!.currentValue * 100),
        }))

    const sectorColors: Record<string, string> = {
        "IT": "#5367ff",
        "Banking": "#387ed1",
        "Energy": "#ff6b35",
        "Finance": "#10b981",
        "Automobile": "#f59e0b",
    }

    return (
        <div className="page-container" style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>
                        Portfolio
                    </h1>
                    <p style={{ fontSize: "0.85rem", color: "oklch(0.55 0.02 264)", marginTop: 4 }}>
                        Your investment overview across all connected demat accounts.
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchPortfolio}
                    style={{ gap: 6, borderColor: "oklch(0.3 0.02 264)" }}
                >
                    <RefreshCw style={{ width: 14, height: 14 }} />
                    Refresh
                </Button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: "2rem" }}>
                {/* Total Value */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: "linear-gradient(135deg, oklch(0.25 0.08 264), oklch(0.2 0.06 290))",
                        border: "1px solid oklch(0.35 0.1 264)", borderRadius: 18, padding: "1.25rem",
                    }}
                >
                    <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "oklch(0.6 0.1 264)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                        Current Value
                    </p>
                    <p style={{ fontSize: "1.75rem", fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>
                        {formatCurrency(portfolio!.currentValue)}
                    </p>
                </motion.div>

                {/* Total Invested */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                    style={{
                        background: "oklch(0.18 0.01 264)", border: "1px solid oklch(0.25 0.02 264)",
                        borderRadius: 18, padding: "1.25rem",
                    }}
                >
                    <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "oklch(0.5 0.02 264)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                        Total Invested
                    </p>
                    <p style={{ fontSize: "1.75rem", fontWeight: 900, color: "white" }}>
                        {formatCurrency(portfolio!.totalInvested)}
                    </p>
                </motion.div>

                {/* Total P&L */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
                    style={{
                        background: "oklch(0.18 0.01 264)", border: `1px solid ${portfolio!.totalPnl >= 0 ? "oklch(0.3 0.1 145)" : "oklch(0.3 0.1 25)"}`,
                        borderRadius: 18, padding: "1.25rem",
                    }}
                >
                    <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "oklch(0.5 0.02 264)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                        Total P&L
                    </p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <p style={{
                            fontSize: "1.75rem", fontWeight: 900,
                            color: portfolio!.totalPnl >= 0 ? "oklch(0.7 0.2 145)" : "oklch(0.7 0.2 25)",
                        }}>
                            {portfolio!.totalPnl >= 0 ? "+" : ""}{formatCurrency(portfolio!.totalPnl)}
                        </p>
                        <span style={{
                            display: "inline-flex", alignItems: "center", gap: 2,
                            fontSize: "0.75rem", fontWeight: 700,
                            color: portfolio!.totalPnl >= 0 ? "oklch(0.7 0.2 145)" : "oklch(0.7 0.2 25)",
                        }}>
                            {portfolio!.totalPnl >= 0
                                ? <ArrowUpRight style={{ width: 12, height: 12 }} />
                                : <ArrowDownRight style={{ width: 12, height: 12 }} />
                            }
                            {portfolio!.totalPnlPercent.toFixed(2)}%
                        </span>
                    </div>
                </motion.div>

                {/* Day Change */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
                    style={{
                        background: "oklch(0.18 0.01 264)", border: `1px solid ${portfolio!.dayChange >= 0 ? "oklch(0.3 0.1 145)" : "oklch(0.3 0.1 25)"}`,
                        borderRadius: 18, padding: "1.25rem",
                    }}
                >
                    <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "oklch(0.5 0.02 264)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                        Today&apos;s Change
                    </p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <p style={{
                            fontSize: "1.75rem", fontWeight: 900,
                            color: portfolio!.dayChange >= 0 ? "oklch(0.7 0.2 145)" : "oklch(0.7 0.2 25)",
                        }}>
                            {portfolio!.dayChange >= 0 ? "+" : ""}{formatCurrency(portfolio!.dayChange)}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Sector Breakdown */}
            <div style={{
                background: "oklch(0.18 0.01 264)", border: "1px solid oklch(0.25 0.02 264)",
                borderRadius: 18, padding: "1.25rem", marginBottom: "2rem",
            }}>
                <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "oklch(0.75 0.02 264)", marginBottom: 16 }}>
                    Sector Allocation
                </h3>
                <div style={{ display: "flex", gap: 4, height: 10, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
                    {sectors.map(s => (
                        <div key={s.name} style={{
                            width: `${s.percent}%`, height: "100%",
                            background: sectorColors[s.name] || "#666",
                            transition: "width 0.5s ease",
                        }} />
                    ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                    {sectors.map(s => (
                        <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{
                                width: 10, height: 10, borderRadius: 3,
                                background: sectorColors[s.name] || "#666",
                            }} />
                            <span style={{ fontSize: "0.75rem", color: "oklch(0.6 0.02 264)" }}>
                                {s.name} ({s.percent.toFixed(1)}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Holdings Table */}
            <div style={{
                background: "oklch(0.18 0.01 264)", border: "1px solid oklch(0.25 0.02 264)",
                borderRadius: 18, overflow: "hidden",
            }}>
                <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid oklch(0.25 0.02 264)" }}>
                    <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "oklch(0.75 0.02 264)" }}>
                        Your Holdings ({portfolio!.holdings.length})
                    </h3>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid oklch(0.22 0.01 264)" }}>
                                {["Stock", "Qty", "Avg Price", "LTP", "Current Value", "P&L", "Change"].map(h => (
                                    <th key={h} style={{
                                        padding: "10px 16px", fontSize: "0.7rem", fontWeight: 600,
                                        color: "oklch(0.45 0.02 264)", textTransform: "uppercase",
                                        letterSpacing: "0.08em", textAlign: h === "Stock" ? "left" : "right",
                                    }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {portfolio!.holdings.map((h, i) => (
                                <motion.tr
                                    key={h.symbol}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    style={{
                                        borderBottom: i < portfolio!.holdings.length - 1
                                            ? "1px solid oklch(0.22 0.01 264)" : "none",
                                    }}
                                >
                                    <td style={{ padding: "14px 16px" }}>
                                        <div>
                                            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "white" }}>
                                                {h.symbol}
                                            </div>
                                            <div style={{ fontSize: "0.7rem", color: "oklch(0.45 0.02 264)", marginTop: 2 }}>
                                                {h.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "0.85rem", color: "oklch(0.7 0.02 264)" }}>
                                        {h.quantity}
                                    </td>
                                    <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "0.85rem", color: "oklch(0.6 0.02 264)" }}>
                                        ₹{formatNumber(h.avgPrice)}
                                    </td>
                                    <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "0.85rem", fontWeight: 600, color: "white" }}>
                                        ₹{formatNumber(h.currentPrice)}
                                    </td>
                                    <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "0.85rem", fontWeight: 600, color: "white" }}>
                                        ₹{formatNumber(h.value)}
                                    </td>
                                    <td style={{
                                        padding: "14px 16px", textAlign: "right", fontSize: "0.85rem", fontWeight: 700,
                                        color: h.pnl >= 0 ? "oklch(0.7 0.2 145)" : "oklch(0.7 0.2 25)",
                                    }}>
                                        {h.pnl >= 0 ? "+" : ""}₹{formatNumber(h.pnl)}
                                        <div style={{ fontSize: "0.7rem", fontWeight: 500 }}>
                                            ({h.pnlPercent >= 0 ? "+" : ""}{h.pnlPercent.toFixed(2)}%)
                                        </div>
                                    </td>
                                    <td style={{
                                        padding: "14px 16px", textAlign: "right",
                                    }}>
                                        <span style={{
                                            display: "inline-flex", alignItems: "center", gap: 3,
                                            padding: "3px 8px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 600,
                                            background: h.change >= 0 ? "oklch(0.3 0.1 145)" : "oklch(0.3 0.1 25)",
                                            color: h.change >= 0 ? "oklch(0.75 0.2 145)" : "oklch(0.75 0.2 25)",
                                        }}>
                                            {h.change >= 0
                                                ? <TrendingUp style={{ width: 12, height: 12 }} />
                                                : <TrendingDown style={{ width: 12, height: 12 }} />
                                            }
                                            {h.changePercent >= 0 ? "+" : ""}{h.changePercent.toFixed(2)}%
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
