"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import {
  IconAlertTriangle,
  IconCheck,
  IconTrendingUp,
  IconWallet,
  IconPigMoney,
} from "@tabler/icons-react"
import type { RawAnalysis } from "@/lib/dashboard/dashboardApi"

// ─── Constants ────────────────────────────────────────────────────────────────

const PIE_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
]

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AnalyticsClient({ data }: { data: RawAnalysis }) {
  const { financial_context, portfolio_context, transaction_anomalies, status } = data

  // ── Category Spending Bar Chart Data ──
  const barData = Object.entries(financial_context.category_spending)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)

const barChartConfig: ChartConfig = Object.fromEntries(
    barData.map((item) => [
        item.category,
        {
            label: item.category,
            color: "var(--color-chart-1)",
        },
    ])
)

  // ── Portfolio Donut Chart Data ──
  const pieData = Object.entries(portfolio_context.allocation).map(([name, value]) => ({
    name,
    percentage: Math.round(value * 100),
    amount: Math.round(value * portfolio_context.portfolio_value),
  }))

  const pieChartConfig: ChartConfig = Object.fromEntries(
    pieData.map((item, i) => [
      item.name,
      { label: item.name, color: PIE_COLORS[i % PIE_COLORS.length] },
    ])
  )

  return (
    <div className="space-y-6 pb-8">

      {/* ── Header ─────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">Detailed breakdown of your finances</p>
        </div>
        <Badge variant={status === "attention_needed" ? "destructive" : "default"}>
          {status === "attention_needed" ? "⚠ Attention Needed" : "✓ All Good"}
        </Badge>
      </div>

      {/* ── Overview Cards ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            <IconTrendingUp className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ₹{financial_context.income.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <IconWallet className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">
              ₹{financial_context.expenses.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Savings</CardTitle>
            <IconPigMoney className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              ₹{financial_context.savings.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {((financial_context.savings / financial_context.income) * 100).toFixed(1)}% savings rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Charts Row ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Category Spending - Horizontal Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Category Spending</CardTitle>
            <CardDescription>Expenses broken down by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[340px] w-full">
              <BarChart
                data={barData}
                layout="vertical"
                margin={{ top: 0, right: 24, bottom: 0, left: 8 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fontSize: 11 }}
                  width={88}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => [
                        `₹${Number(value).toLocaleString()}`,
                        "Spent",
                      ]}
                    />
                  }
                />
                <Bar
                  dataKey="amount"
                  fill="var(--color-chart-1)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Portfolio Allocation - Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
            <CardDescription>
              Total Value: ₹{portfolio_context.portfolio_value.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieChartConfig} className="h-[240px] w-full">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="percentage"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={3}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        const item = pieData.find((d) => d.name === name)
                        return [
                          `${value}% — ₹${item?.amount.toLocaleString()}`,
                          name,
                        ]
                      }}
                    />
                  }
                />
              </PieChart>
            </ChartContainer>

            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {pieData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <span className="text-xs text-muted-foreground truncate">{item.name}</span>
                  <span className="text-xs font-medium ml-auto">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Transaction Anomalies ──────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction Anomalies</CardTitle>
              <CardDescription>{transaction_anomalies.message}</CardDescription>
            </div>
            {transaction_anomalies.anomalies.length > 0 ? (
              <Badge variant="destructive" className="flex items-center gap-1">
                <IconAlertTriangle className="size-3" />
                {transaction_anomalies.anomalies.length} Found
              </Badge>
            ) : (
              <Badge className="flex items-center gap-1 bg-green-500 hover:bg-green-600">
                <IconCheck className="size-3" />
                All Clear
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {transaction_anomalies.anomalies.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">
              No anomalies detected in your transactions.
            </p>
          ) : (
            <div className="space-y-3">
              {transaction_anomalies.anomalies.map((anomaly, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5"
                >
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium">{anomaly.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{anomaly.category}</Badge>
                      <Badge variant="destructive" className="text-xs">{anomaly.severity}</Badge>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-destructive shrink-0 ml-4">
                    ₹{Number(anomaly.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
