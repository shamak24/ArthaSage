"use client"

import * as React from "react"
import { Bot, Sparkles, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import axios from "axios"

interface ChatMessage {
    role: "ai" | "user"
    text: string
}

export function AIAdvisorChat() {
    const [messages, setMessages] = React.useState<ChatMessage[]>([])
    const [inputValue, setInputValue] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [initialLoading, setInitialLoading] = React.useState(true)
    const messagesEndRef = React.useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom when messages change
    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Fetch initial AI greeting on mount
    React.useEffect(() => {
        const fetchGreeting = async () => {
            try {
                const res = await axios.post("http://localhost:8000/api/insights/chat", {
                    message: "Give me a brief overview of my current financial health and one quick tip."
                })
                setMessages([{ role: "ai", text: res.data.response }])
            } catch {
                setMessages([{
                    role: "ai",
                    text: "Welcome! I'm your AI financial advisor. Ask me anything about your spending, savings, or budget — I'll analyze your transactions and give personalized advice."
                }])
            } finally {
                setInitialLoading(false)
            }
        }
        fetchGreeting()
    }, [])

    const sendMessage = async () => {
        const msg = inputValue.trim()
        if (!msg || loading) return

        const userMsg: ChatMessage = { role: "user", text: msg }
        setMessages(prev => [...prev, userMsg])
        setInputValue("")
        setLoading(true)

        try {
            const res = await axios.post("http://localhost:8000/api/insights/chat", {
                message: msg,
            })
            setMessages(prev => [...prev, { role: "ai", text: res.data.response }])
        } catch {
            setMessages(prev => [...prev, {
                role: "ai",
                text: "Sorry, I couldn't process that request. Please check that the backend is running.",
            }])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className="ai-chat">
            {/* Header */}
            <div className="ai-chat-header">
                <div className="ai-chat-header-left">
                    <div className="ai-chat-avatar">
                        <Bot className="h-4 w-4" />
                    </div>
                    <div>
                        <h3 className="ai-chat-title">AI Advisor</h3>
                        <span className="ai-chat-status">
                            <span className="ai-chat-status-dot" />
                            {loading ? "Thinking..." : "Online"}
                        </span>
                    </div>
                </div>
                <Sparkles className="h-4 w-4 text-indigo-400" />
            </div>

            {/* Messages */}
            <div className="ai-chat-messages">
                {initialLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
                        <Loader2 className="h-5 w-5 animate-spin" style={{ color: "oklch(0.55 0.2 264)" }} />
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`ai-chat-bubble ${msg.role === "ai" ? "ai-chat-bubble-ai" : "ai-chat-bubble-user"
                                }`}
                        >
                            {msg.role === "ai" && (
                                <Sparkles className="ai-chat-bubble-icon" />
                            )}
                            <p>{msg.text}</p>
                        </motion.div>
                    ))
                )}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ai-chat-bubble ai-chat-bubble-ai"
                        style={{ paddingLeft: 34 }}
                    >
                        <Sparkles className="ai-chat-bubble-icon" />
                        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                            <span className="typing-dot" />
                            <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
                            <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="ai-chat-input-wrapper">
                <input
                    type="text"
                    placeholder="Ask your AI advisor..."
                    className="ai-chat-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />
                <Button
                    size="icon"
                    className="ai-chat-send"
                    variant="ghost"
                    onClick={sendMessage}
                    disabled={loading || !inputValue.trim()}
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </div>
    )
}
