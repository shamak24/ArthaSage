"use client"

import { useState, useMemo } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  IconSearch,
  IconArrowUpRight,
  IconArrowDownRight,
  IconBuildingBank,
  IconInbox,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type Transaction = {
  id: string
  date: Date
  description: string | null
  amount: string
  type: string
  category: string | null
  accountId: string
}

type Account = {
  id: string
  name: string
  provider: string
  type: string
  isSimulated: boolean
  transactions: Transaction[]
  holdings: unknown[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function formatAmount(amount: string) {
  return `₹${parseFloat(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

// ─── Per-Account Panel ────────────────────────────────────────────────────────

function AccountTransactions({ account }: { account: Account }) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return account.transactions
      .filter((t) => {
        if (!q) return true
        return (
          t.description?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q) ||
          t.type.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [account.transactions, search])

  const totalIncome = account.transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + parseFloat(t.amount), 0)

  const totalExpense = account.transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + parseFloat(t.amount), 0)

  return (
    <div className="mt-4 space-y-4">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardDescription>Transactions</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{account.transactions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardDescription>Total Income</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-green-600">
              ₹{totalIncome.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardDescription>Total Expenses</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-destructive">
              ₹{totalExpense.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search by description, category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
              <IconInbox className="size-8 opacity-40" />
              <p className="text-sm">No transactions match your search</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                        {formatDate(tx.date)}
                      </TableCell>
                      <TableCell className="max-w-[220px] truncate text-sm">
                        {tx.description ?? "—"}
                      </TableCell>
                      <TableCell>
                        {tx.category ? (
                          <Badge variant="secondary" className="text-xs font-normal">
                            {tx.category}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-xs font-medium",
                            tx.type === "income"
                              ? "text-green-600"
                              : "text-destructive"
                          )}
                        >
                          {tx.type === "income" ? (
                            <IconArrowUpRight className="size-3.5" />
                          ) : (
                            <IconArrowDownRight className="size-3.5" />
                          )}
                          {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-semibold text-sm whitespace-nowrap",
                          tx.type === "income" ? "text-green-600" : "text-destructive"
                        )}
                      >
                        {tx.type === "income" ? "+" : "-"}{formatAmount(tx.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TransactionView({ data }: { data: Account[] }) {
  const accounts = data.filter((a) => a.transactions.length > 0)

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Transactions</h1>
        <p className="text-muted-foreground mt-1">
          All your transactions, organised by bank
        </p>
      </div>

      {accounts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-20">
            <IconInbox className="size-10 text-muted-foreground opacity-40" />
            <p className="text-muted-foreground text-sm">No transactions found</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={accounts[0].id}>
          <TabsList className="flex h-auto flex-wrap gap-1 bg-transparent p-0">
            {accounts.map((account) => (
              <TabsTrigger
                key={account.id}
                value={account.id}
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <IconBuildingBank className="size-3.5" />
                {account.provider}
                <Badge
                  variant="secondary"
                  className="ml-1 text-xs data-[state=active]:bg-primary-foreground data-[state=active]:text-primary"
                >
                  {account.transactions.length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {accounts.map((account) => (
            <TabsContent key={account.id} value={account.id}>
              <AccountTransactions account={account} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
