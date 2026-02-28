"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Insight } from "@/lib/types"
import axios from "axios"
import { Sparkles, AlertTriangle, CheckCircle, Lightbulb, RefreshCw } from "lucide-react"

export function FinancialInsights() {
    const [insights, setInsights] = React.useState<Insight[]>([])
    const [loading, setLoading] = React.useState(false)

    const fetchInsights = async () => {
        setLoading(true)
        try {
            const res = await axios.post("http://localhost:8000/api/insights/generate")
            setInsights(res.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchInsights()
    }, [])

    return (
        <Card className="col-span-1 md:col-span-3 border-indigo-500/20 bg-indigo-50/5 dark:bg-indigo-950/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-500" />
                    <CardTitle>AI Financial Insights</CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={fetchInsights} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {insights.length === 0 && !loading && (
                    <p className="text-sm text-muted-foreground">No insights available yet. Upload some data!</p>
                )}

                {insights.map((insight, i) => (
                    <div key={i} className="flex gap-3 items-start p-3 rounded-lg border bg-card/50">
                        <div className="mt-0.5">
                            {insight.type === 'alert' && <AlertTriangle className="h-4 w-4 text-destructive" />}
                            {insight.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {insight.type === 'tip' && <Lightbulb className="h-4 w-4 text-amber-500" />}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm">{insight.message}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
