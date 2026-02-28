"use client"

import * as React from "react"
import { Search, Filter, ArrowUpDown, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TransactionTable } from "@/components/TransactionTable"
import { Transaction } from "@/lib/types"
import axios from "axios"

export default function TransactionsPage() {
    const [transactions, setTransactions] = React.useState<Transaction[]>([])
    const [filteredTransactions, setFilteredTransactions] = React.useState<Transaction[]>([])
    const [searchQuery, setSearchQuery] = React.useState("")
    const [selectedCategory, setSelectedCategory] = React.useState("All")
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/transactions")
                setTransactions(res.data)
                setFilteredTransactions(res.data)
            } catch (error) {
                console.error("Failed to fetch transactions:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTransactions()
    }, [])

    React.useEffect(() => {
        let filtered = transactions.filter(tx =>
            tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.category?.toLowerCase().includes(searchQuery.toLowerCase())
        )

        if (selectedCategory !== "All") {
            filtered = filtered.filter(tx => tx.category === selectedCategory)
        }

        setFilteredTransactions(filtered)
    }, [searchQuery, selectedCategory, transactions])

    const categories = ["All", ...Array.from(new Set(transactions.map(tx => tx.category)))]

    return (
        <div className="page-container p-8">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Transactions</h1>
                    <p className="text-muted-foreground mt-1">Manage and track your full transaction history.</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </header>

            <div className="flex flex-col gap-6">
                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search transactions..."
                            className="pl-10 bg-black/20 border-white/10 focus:border-indigo-500 transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <select
                            className="bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <ArrowUpDown className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-md">
                    {loading ? (
                        <div className="h-64 flex items-center justify-center text-muted-foreground">
                            Loading transactions...
                        </div>
                    ) : filteredTransactions.length > 0 ? (
                        <TransactionTable data={filteredTransactions} />
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-muted-foreground gap-2">
                            <Filter className="h-8 w-8 opacity-20" />
                            <p>No transactions found matching your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
