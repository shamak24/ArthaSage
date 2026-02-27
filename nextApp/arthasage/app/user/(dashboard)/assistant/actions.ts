"use server"

import { askQuestion } from "@/lib/dashboard/chatApi"
import type { ChatAnswer } from "@/lib/dashboard/chatApi"

export async function askAction(
  userId: string,
  question: string
): Promise<{ answer: ChatAnswer } | { error: string }> {
  try {
    const result = await askQuestion(userId, question.trim())
    return result
  } catch (err) {
    console.error("askAction error:", err)
    return { error: "Failed to get a response. Please check that the backend is running." }
  }
}
