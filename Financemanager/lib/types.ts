export interface Transaction {
    id: string
    date: string
    description: string
    amount: number
    currency: string
    category?: string
    is_anomaly: boolean
    anomaly_score: number
}

export interface Insight {
    type: 'alert' | 'tip' | 'success'
    message: string
    related_transactions?: string[]
}
