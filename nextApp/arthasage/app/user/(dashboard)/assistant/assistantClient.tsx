"use client"

import * as React from "react"
import { Send, Loader2, Bot, Sparkles, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { askAction } from "./actions"
import type { ChatAnswer } from "@/lib/dashboard/chatApi"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant"
  content: string
  answer?: ChatAnswer
  error?: boolean
}

// ─── Answer Renderer ──────────────────────────────────────────────────────────

function AnswerBubble({ answer }: { answer: ChatAnswer }) {
  const direct = answer["Direct Answer"]
  const explanation = answer["Explanation"]
  const action = answer["Suggested Action"]

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {direct && (
        <p className="font-semibold text-foreground">{direct}</p>
      )}
      {explanation && (
        <p className="text-muted-foreground">{explanation}</p>
      )}
      {action && (
        <div className="mt-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            Suggested Action
          </span>
          <p className="mt-0.5 text-foreground">{action}</p>
        </div>
      )}
    </div>
  )
}

// ─── Typing Dots ──────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AssistantClient({
  username,
  userId,
}: {
  username: string
  userId: string
}) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content: "",
      answer: {
        "Direct Answer": `Hello ${username}! I'm your AI financial advisor.`,
        "Explanation":
          "Ask me anything about your spending, savings, investments, or budget — I'll analyze your financial data and give you personalized insights.",
      },
    },
  ])
  const [input, setInput] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const bottomRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const sendMessage = async () => {
    const question = input.trim()
    if (!question || loading) return

    setMessages((prev) => [...prev, { role: "user", content: question }])
    setInput("")
    setLoading(true)

    const result = await askAction(userId, question)

    if ("error" in result) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", answer: { "Direct Answer": result.error }, error: true },
      ])
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", answer: result.answer },
      ])
    }

    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b mb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Bot className="size-4" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">AI Financial Advisor</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className={cn(
                "h-1.5 w-1.5 rounded-full",
                loading ? "bg-yellow-400 animate-pulse" : "bg-green-500"
              )} />
              {loading ? "Thinking..." : "Online"}
            </p>
          </div>
        </div>
        <Sparkles className="size-4 text-muted-foreground" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pr-2 min-h-0">
        <div className="space-y-4 pb-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex items-end gap-2",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mb-0.5">
                  <Sparkles className="size-3.5" />
                </div>
              )}

              {msg.role === "user" ? (
                <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                  {msg.content}
                </div>
              ) : (
                <Card className={cn(
                  "max-w-[80%] rounded-2xl rounded-bl-sm shadow-sm",
                  msg.error && "border-destructive/30 bg-destructive/5"
                )}>
                  <CardContent className="px-4 py-3">
                    {msg.answer ? (
                      <AnswerBubble answer={msg.answer} />
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                  </CardContent>
                </Card>
              )}

              {msg.role === "user" && (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground mb-0.5">
                  <User className="size-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-end gap-2 justify-start">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="size-3.5" />
              </div>
              <Card className="rounded-2xl rounded-bl-sm shadow-sm">
                <CardContent className="px-4 py-3">
                  <TypingDots />
                </CardContent>
              </Card>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 pt-4 border-t mt-4">
        <Input
          placeholder="Ask your AI advisor..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="flex-1 rounded-full bg-muted border-0 focus-visible:ring-1"
        />
        <Button
          size="icon"
          className="rounded-full shrink-0"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </div>
    </div>
  )
}

