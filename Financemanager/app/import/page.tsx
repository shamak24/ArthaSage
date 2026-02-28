"use client"

import * as React from "react"
import { FileDropzone } from "@/components/upload/FileDropzone"
import { TransactionTable } from "@/components/TransactionTable"
import { Transaction } from "@/lib/types"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function ImportPage() {
    const [transactions, setTransactions] = React.useState<Transaction[]>([])
    const [uploadError, setUploadError] = React.useState<string | null>(null)
    const [uploadSuccess, setUploadSuccess] = React.useState(false)

    const handleUpload = async (file: File) => {
        setUploadError(null)
        setUploadSuccess(false)

        const formData = new FormData()
        formData.append("file", file)

        try {
            const response = await axios.post<Transaction[]>("http://localhost:8000/api/transactions/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            setTransactions(response.data)
            setUploadSuccess(true)
        } catch (err: any) {
            const detail = err?.response?.data?.detail || err?.message || "Failed to upload file. Please check the CSV format."
            setUploadError(detail)
            throw err  // re-throw so FileDropzone shows its own error state too
        }
    }

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Import Data</h1>
                <p className="text-muted-foreground">
                    Upload your bank statement (CSV) to get started.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload CSV</CardTitle>
                            <CardDescription>Drag and drop your file here.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FileDropzone onUpload={handleUpload} />
                        </CardContent>
                    </Card>

                    {uploadError && (
                        <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold">Upload Failed</p>
                                <p className="mt-1 text-xs opacity-80">{uploadError}</p>
                            </div>
                        </div>
                    )}

                    {uploadSuccess && (
                        <div className="flex items-start gap-3 rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-sm text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold">Upload Successful</p>
                                <p className="mt-1 text-xs opacity-80">{transactions.length} transactions imported.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    {transactions.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Parsed Transactions ({transactions.length})</h2>
                            </div>
                            <TransactionTable data={transactions} />
                        </>
                    ) : (
                        <div className="h-full border rounded-md border-dashed flex items-center justify-center p-12 text-muted-foreground">
                            <p>No data loaded yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
