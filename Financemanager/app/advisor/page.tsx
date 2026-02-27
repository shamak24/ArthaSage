"use client"

import * as React from "react"
import { Bot, Sparkles, Send, Loader2, ArrowLeft, Trash2, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import axios from "axios"
import Link from "next/link"

interface ChatMessage {
    role: "ai" | "user"
    text: string
}

export default function AdvisorPage() {
    const [messages, setMessages] = React.useState<ChatMessage[]>([])
    const [inputValue, setInputValue] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [initialLoading, setInitialLoading] = React.useState(true)
    const messagesEndRef = React.useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Initial greeting
    React.useEffect(() => {
        const fetchGreeting = async () => {
            try {
                const res = await axios.post("http://localhost:8000/api/insights/chat", {
                    message: "Hi! I'm in the full advisor view now. Can you give me a deep analysis of my spending and suggest a 3-step savings plan?"
                })
                setMessages([{ role: "ai", text: res.data.response }])
            } catch {
                setMessages([{
                    role: "ai",
                    text: "Hello! I am your FinAI Financial Advisor. In this full-screen view, we can dive deep into your financial habits. How can I help you today?"
                }])
            } finally {
                setInitialLoading(false)
            }
        }
        fetchGreeting()
    }, [])

    const sendMessage = async (textOverride?: string) => {
        const msg = textOverride || inputValue.trim()
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
                text: "Sorry, I couldn't process that. Is the backend running?",
            }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] m-4 bg-white/5 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="hover:bg-white/10">
                            <ArrowLeft className="h-5 w-5 text-white" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center">
                            <Bot className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Dedicated AI Advisor</h1>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Interactive Financial Context Active
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" title="View History">
                        <History className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Clear Chat" onClick={() => setMessages([])}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {initialLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: msg.role === "ai" ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex ${msg.role === "ai" ? "justify-start" : "justify-end"}`}
                        >
                            <div className={`max-w-[80%] p-4 rounded-2xl relative ${msg.role === "ai"
                                    ? "bg-white/10 text-white rounded-tl-none border border-white/5"
                                    : "bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/20"
                                }`}>
                                {msg.role === "ai" && <Sparkles className="absolute -left-8 top-1 h-5 w-5 text-indigo-400 opacity-50" />}
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </motion.div>
                    ))
                )}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                            <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {!loading && messages.length > 0 && (
                <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar justify-center">
                    {["Where can I save?", "Budget update", "Top categories", "Anomaly check"].map(label => (
                        <button
                            key={label}
                            onClick={() => sendMessage(label)}
                            className="whitespace-nowrap px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 hover:bg-white/10 transition-colors"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="p-6 bg-black/20 border-t border-white/10">
                <div className="relative group max-w-4xl mx-auto">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pr-16 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        disabled={loading}
                    />
                    <Button
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-indigo-600 hover:bg-indigo-500"
                        onClick={() => sendMessage()}
                        disabled={loading || !inputValue.trim()}
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </div>
    )
}
