import { getDashboardData } from "./get-dashboard-data";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// The answer shape from Gemini (structured markdown-style JSON)
export interface ChatAnswer {
  "Direct Answer"?: string;
  "Explanation"?: string;
  "Suggested Action"?: string;
  // fallback for any other keys Gemini may return
  [key: string]: string | undefined;
}

export interface ChatResponse {
  answer: ChatAnswer;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string | ChatAnswer;
}

async function prepareFinancialData(userId: string) {
  const data = await getDashboardData(userId);

  const transactions = data.flatMap((account) =>
    account.transactions.map((tx) => ({
      id: tx.id,
      amount: parseFloat(tx.amount),
      date: tx.date.toISOString(),
      category: tx.category,
      type: tx.type,
    }))
  );

  const holdings = data.flatMap((account) =>
    account.holdings.map((holding) => ({
      symbol: holding.symbol,
      quantity: holding.quantity,
      avgPrice: parseFloat(holding.avgPrice),
    }))
  );

  return { transactions, holdings };
}

/**
 * Send a question to the /ask RAG endpoint.
 * The question is sent as a query param; transactions + holdings go in the body.
 */
export async function askQuestion(
  userId: string,
  question: string
): Promise<ChatResponse> {
  const { transactions, holdings } = await prepareFinancialData(userId);

  const url = new URL(`${BACKEND_URL}/ask`);
  url.searchParams.set("question", question);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transactions, holdings }),
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status} ${response.statusText}`);
  }

  const result: ChatResponse = await response.json();
  return result;
}
