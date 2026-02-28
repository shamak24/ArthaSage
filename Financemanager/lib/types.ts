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

export interface DematProvider {
    id: string
    name: string
    logo: string
    color: string
    description: string
    supported: boolean
}

export interface ConnectedAccount {
    id: string
    provider: string
    type: 'bank' | 'demat'
    accountName: string
    accountNumber: string
    status: 'connected' | 'syncing' | 'error' | 'disconnected'
    lastSynced?: string
    balance?: number
}

export interface Holding {
    symbol: string
    name: string
    quantity: number
    avgPrice: number
    currentPrice: number
    change: number
    changePercent: number
    value: number
    pnl: number
    pnlPercent: number
    sector: string
}

export interface PortfolioSummary {
    totalInvested: number
    currentValue: number
    totalPnl: number
    totalPnlPercent: number
    dayChange: number
    dayChangePercent: number
    holdings: Holding[]
}
