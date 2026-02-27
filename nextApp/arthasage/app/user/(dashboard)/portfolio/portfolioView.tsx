"use client"

import { useMemo } from "react"
import { Cell, Pie, PieChart } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import {
  IconBriefcase,
  IconChartPie,
  IconCoins,
  IconInbox,
  IconTrendingUp,
} from "@tabler/icons-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type Holding = {
  id: string
  symbol: string
  companyName: string
  quantity: number
  avgPrice: string
  accountId: string
}

type Account = {
  id: string
  name: string
  provider: string
  type: string
  isSimulated: boolean
  transactions: unknown[]
  holdings: Holding[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function investedValue(h: Holding) {
  return parseFloat(h.avgPrice) * h.quantity
}

function fmt(amount: number) {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

// ─── Per-Account Panel ────────────────────────────────────────────────────────

function AccountHoldings({ account }: { account: Account }) {
  const holdings = account.holdings

  const totalInvested = useMemo(
    () => holdings.reduce((s, h) => s + investedValue(h), 0),
    [holdings]
  )

  const pieData = useMemo(
    () =>
      holdings.map((h) => ({
        name: h.symbol,
        value: Math.round(investedValue(h)),
        pct: totalInvested > 0
          ? ((investedValue(h) / totalInvested) * 100).toFixed(1)
          : "0.0",
      })),
    [holdings, totalInvested]
  )

  const chartConfig: ChartConfig = Object.fromEntries(
    holdings.map((h, i) => [
      h.symbol,
      { label: h.symbol, color: CHART_COLORS[i % CHART_COLORS.length] },
    ])
  )

  return (
    <div className="mt-4 space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardDescription>Holdings</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{holdings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardDescription>Total Invested</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-primary">
              ₹{totalInvested.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-2 sm:col-span-1">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardDescription>Avg per Holding</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">
              ₹{holdings.length > 0
                ? (totalInvested / holdings.length).toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })
                : "0"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart + Table row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Donut chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconChartPie className="size-4" />
              Allocation
            </CardTitle>
            <CardDescription>By invested value</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-55 w-full">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {pieData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        const item = pieData.find((d) => d.name === name)
                        return [`${item?.pct}% — ${fmt(Number(value))}`, name]
                      }}
                    />
                  }
                />
              </PieChart>
            </ChartContainer>

            {/* Legend */}
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              {pieData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="truncate text-xs text-muted-foreground">
                    {item.name}
                  </span>
                  <span className="ml-auto shrink-0 text-xs font-medium">
                    {item.pct}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Holdings table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCoins className="size-4" />
              Holdings
            </CardTitle>
            <CardDescription>Quantity and invested value</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Avg Price</TableHead>
                    <TableHead className="text-right">Invested</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holdings
                    .slice()
                    .sort((a, b) => investedValue(b) - investedValue(a))
                    .map((h, i) => (
                      <TableRow key={h.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{
                                backgroundColor:
                                  CHART_COLORS[i % CHART_COLORS.length],
                              }}
                            />
                            <div>
                              <p className="font-medium text-sm">{h.symbol}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-30">
                                {h.companyName}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {h.quantity.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {fmt(parseFloat(h.avgPrice))}
                        </TableCell>
                        <TableCell className="text-right text-sm font-semibold text-primary">
                          {fmt(investedValue(h))}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PortfolioView({ data }: { data: Account[] }) {
  const dematAccounts = data.filter(
    (a) => a.type === "demat" && a.holdings.length > 0
  )

  const totalPortfolioValue = useMemo(
    () =>
      dematAccounts
        .flatMap((a) => a.holdings)
        .reduce((s, h) => s + investedValue(h), 0),
    [dematAccounts]
  )

  const totalHoldings = dematAccounts.flatMap((a) => a.holdings).length

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Portfolio</h1>
          <p className="text-muted-foreground mt-1">
            Your investments across all demat accounts
          </p>
        </div>
        {dematAccounts.length > 0 && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Invested</p>
            <p className="text-2xl font-bold text-primary">
              ₹{totalPortfolioValue.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {totalHoldings} holdings · {dematAccounts.length}{" "}
              {dematAccounts.length === 1 ? "account" : "accounts"}
            </p>
          </div>
        )}
      </div>

      {dematAccounts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-20">
            <IconInbox className="size-10 text-muted-foreground opacity-40" />
            <p className="text-sm text-muted-foreground">
              No portfolio data found
            </p>
            <p className="text-xs text-muted-foreground">
              Connect a demat account to see your holdings
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={dematAccounts[0].id}>
          <TabsList className="flex h-auto flex-wrap gap-1 bg-transparent p-0">
            {dematAccounts.map((account) => (
              <TabsTrigger
                key={account.id}
                value={account.id}
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <IconBriefcase className="size-3.5" />
                {account.provider}
                <Badge
                  variant="secondary"
                  className="ml-1 text-xs"
                >
                  {account.holdings.length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {dematAccounts.map((account) => (
            <TabsContent key={account.id} value={account.id}>
              <AccountHoldings account={account} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
