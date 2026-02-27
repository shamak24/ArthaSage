import { getDashboardData } from "./get-dashboard-data";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface Transaction {
  id: string;
  amount: number;
  date: string;
  category: string | null;
  type: string;
}

interface Holding {
  symbol: string;
  quantity: number;
  avgPrice: number;
}

interface Recommendation {
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
  category: string;
}

interface Scores {
  savings_score: number;
  risk_score: number;
  diversification_score: number;
}

export interface InsightsData {
  financial_health: string;
  risk_level: string;
  spending_behavior: string;
  scores: Scores;
  key_findings: string[];
  anomalies: any[];
  recommendations: Recommendation[];
  summary_message: string;
}

export interface AnalysisResult {
  analysis: any; // Add proper type based on your analyze_finances response
  insights: InsightsData;
}

async function prepareFinancialData(userId: string) {
  const data = await getDashboardData(userId);

  // Flatten all transactions from all accounts
  const allTransactions: Transaction[] = data.flatMap(account =>
    account.transactions.map(tx => ({
      id: tx.id,
      amount: parseFloat(tx.amount),
      date: tx.date.toISOString(),
      category: tx.category,
      type: tx.type,
    }))
  );

  // Flatten all holdings from all accounts
  const allHoldings: Holding[] = data.flatMap(account =>
    account.holdings.map(holding => ({
      symbol: holding.symbol,
      quantity: holding.quantity,
      avgPrice: parseFloat(holding.avgPrice),
    }))
  );

  return { allTransactions, allHoldings };
}

export interface RawAnalysis {
  financial_context: {
    income: number
    expenses: number
    savings: number
    category_spending: Record<string, number>
  }
  portfolio_context: {
    portfolio_value: number
    allocation: Record<string, number>
  }
  portfolio_anomalies: { message: string; anomalies: any[] }
  transaction_anomalies: {
    message: string
    anomalies: Array<{
      transactionId: string
      amount: number
      category: string
      average: number
      severity: string
      description: string
    }>
  }
  anomalies: any
  status: string
}

export async function getRawAnalysis(userId: string): Promise<RawAnalysis> {
  const { allTransactions, allHoldings } = await prepareFinancialData(userId);

  const response = await fetch(`${BACKEND_URL}/analyze-finances`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transactions: allTransactions, holdings: allHoldings }),
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status} ${response.statusText}`);
  }

  const result: RawAnalysis = await response.json();
  console.log("Analysis result:", result);
  return result;
}

export async function getAnalysis(userId: string): Promise<AnalysisResult> {
  const { allTransactions, allHoldings } = await prepareFinancialData(userId);

  console.log(`Sending ${allTransactions.length} transactions and ${allHoldings.length} holdings to backend`);

  try {
    const response = await fetch(`${BACKEND_URL}/generate-insights`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactions: allTransactions,
        holdings: allHoldings,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status} ${response.statusText}`);
    }

    const result: AnalysisResult = await response.json();
    console.log("Analysis result:", result);
    return result;
  } catch (error) {
    console.error("Error calling backend:", error);
    throw error;
  }
}

