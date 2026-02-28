"use client"

import * as React from "react"
import { OverviewCards } from "@/components/dashboard/OverviewCards"
import { CategoryChart } from "@/components/dashboard/CategoryChart"
import { SpendingTrend } from "@/components/dashboard/SpendingTrend"
import { AnomalyBanner } from "@/components/dashboard/AnomalyBanner"
import { AIAdvisorChat } from "@/components/dashboard/AIAdvisorChat"
import { TransactionTable } from "@/components/TransactionTable"
import { Button } from "@/components/ui/button"
import { Transaction } from "@/lib/types"
import axios from "axios"
import { Loader2, Upload, Database, Bell } from "lucide-react"

export default function DashboardPage() {
  const [data, setData] = React.useState<Transaction[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/transactions/")
      setData(res.data)
    } catch (e) {
      console.error("Failed to fetch transactions", e)
    } finally {
      setLoading(false)
    }
  }

  // Calculate metrics
  const totalSpend = data.reduce((acc, tx) => acc + tx.amount, 0)
  const anomalies = data.filter(tx => tx.is_anomaly)

  // Category Data
  const categoryMap = data.reduce((acc, tx) => {
    const cat = tx.category || "Uncategorized"
    acc[cat] = (acc[cat] || 0) + tx.amount
    return acc
  }, {} as Record<string, number>)

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
    color: "",
  }))

  // Trend Data (Group by date)
  const trendMap = data.reduce((acc, tx) => {
    acc[tx.date] = (acc[tx.date] || 0) + tx.amount
    return acc
  }, {} as Record<string, number>)

  const trendData = Object.entries(trendMap)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "80vh" }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "oklch(0.55 0.2 264)" }} />
      </div>
    )
  }

  return (
    <div className="dashboard-grid">
      {/* Header */}
      <div>
        <div className="dashboard-header">
          <h1>Overview</h1>
          <div className="dashboard-header-actions">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/import'}
              style={{ gap: 6 }}
            >
              <Upload className="h-3.5 w-3.5" />
              Import CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                setLoading(true)
                await axios.post("http://localhost:8000/api/transactions/seed")
                fetchData()
              }}
              style={{ gap: 6 }}
            >
              <Database className="h-3.5 w-3.5" />
              Load Demo
            </Button>
            <Button variant="ghost" size="icon" style={{ position: "relative" }}>
              <Bell className="h-4 w-4" />
              {anomalies.length > 0 && (
                <span style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "oklch(0.55 0.2 25)",
                }} />
              )}
            </Button>
          </div>
        </div>
        <p className="dashboard-subtitle">Welcome back, here&apos;s your financial health today.</p>
      </div>

      {/* Anomaly Banner */}
      {anomalies.length > 0 && (
        <AnomalyBanner
          description={anomalies[0].description}
          amount={anomalies[0].amount}
          location="Unknown"
          timeAgo="2 hours ago"
        />
      )}

      {/* Main 2-Column Layout */}
      <div className="dashboard-main-row">
        {/* Left Column - Main Content */}
        <div className="dashboard-content">
          {/* Overview Cards */}
          <OverviewCards
            totalSpend={totalSpend}
            budget={5000}
            anomalyCount={anomalies.length}
          />

          {/* Charts Row */}
          <div className="charts-row">
            <SpendingTrend data={trendData} />
            <CategoryChart data={categoryData} />
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="section-header">
              <h2 className="section-title">Recent Transactions</h2>
              <a className="section-link" href="/transactions">View All →</a>
            </div>
            <TransactionTable data={data.slice(0, 5)} />
          </div>
        </div>

        {/* Right Column - AI Advisor */}
        <AIAdvisorChat />
      </div>
    </div>
  )
}
