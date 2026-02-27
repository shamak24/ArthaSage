"use client"

import * as React from "react"
import { Send, Loader2, Bot, Sparkles, User, Zap } from "lucide-react"
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
    <div className="space-y-2.5 text-sm leading-relaxed">
      {direct && (
        <p className="font-semibold text-foreground text-[0.9rem]">{direct}</p>
      )}
      {explanation && (
        <p className="text-muted-foreground leading-relaxed">{explanation}</p>
      )}
      {action && (
        <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 px-3.5 py-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="size-3 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Suggested Action
            </span>
          </div>
          <p className="text-foreground text-sm">{action}</p>
        </div>
      )}
    </div>
  )
}

// ─── Typing Dots ──────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-0.5 px-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
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

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-4 border-b mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Bot className="size-5" />
            </div>
            <span className={cn(
              "absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background",
              loading ? "bg-yellow-400 animate-pulse" : "bg-green-500"
            )} />
          </div>
          <div>
            <h1 className="text-base font-bold text-primary leading-tight">
              AI Financial Advisor
            </h1>
            <p className="text-xs text-muted-foreground">
              {loading ? "Thinking…" : "Online · Ready to help"}
            </p>
          </div>
        </div>
        <div className="flex size-8 items-center justify-center rounded-full bg-muted">
          <Sparkles className="size-3.5 text-muted-foreground" />
        </div>
      </div>

      {/* ── Messages ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        <div className="space-y-5 pb-2 py-1">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex items-end gap-2",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {/* Assistant avatar */}
              {msg.role === "assistant" && (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary mb-0.5">
                  <Sparkles className="size-3.5" />
                </div>
              )}

              {/* Bubble */}
              {msg.role === "user" ? (
                <div className="max-w-[72%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-sm">
                  {msg.content}
                </div>
              ) : (
                <Card className={cn(
                  "max-w-[80%] rounded-2xl rounded-bl-sm border shadow-sm",
                  msg.error
                    ? "border-destructive/30 bg-destructive/5"
                    : "bg-card"
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

              {/* User avatar */}
              {msg.role === "user" && (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground mb-0.5">
                  <User className="size-3.5" />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex items-end gap-2 justify-start">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="size-3.5" />
              </div>
              <Card className="rounded-2xl rounded-bl-sm border shadow-sm">
                <CardContent className="px-4 py-3">
                  <TypingDots />
                </CardContent>
              </Card>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Input ──────────────────────────────────────────────── */}
      <div className="pt-4 border-t mt-2">
        <div className="flex items-center gap-2 rounded-2xl border bg-muted/40 pl-4 pr-1.5 py-1.5 focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
          <Input
            placeholder="Ask your AI advisor…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="flex-1 border-0 bg-transparent p-0 h-auto focus-visible:ring-0 text-sm placeholder:text-muted-foreground/60"
          />
          <Button
            size="icon"
            className="rounded-xl size-8 shrink-0"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-3.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

