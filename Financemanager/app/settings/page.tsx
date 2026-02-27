"use client"

import * as React from "react"
import {
    User,
    Bell,
    Shield,
    Cpu,
    Wallet,
    Key,
    Save,
    LogOut,
    CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

export default function SettingsPage() {
    const [saved, setSaved] = React.useState(false)

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="page-container p-8 max-w-5xl mx-auto">
            <header className="mb-12">
                <h1 className="text-4xl font-black text-white tracking-tight">Settings</h1>
                <p className="text-lg text-muted-foreground mt-2">Manage your account, budget, and AI preferences.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Tabs Sidebar */}
                <div className="md:col-span-1 space-y-1">
                    {[
                        { label: "Profile", icon: User, active: true },
                        { label: "Budgeting", icon: Wallet },
                        { label: "Notifications", icon: Bell },
                        { label: "AI & Security", icon: Shield },
                    ].map(tab => (
                        <button
                            key={tab.label}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${tab.active
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    ))}
                    <div className="pt-4 mt-4 border-t border-white/5">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all">
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-3 space-y-8">

                    {/* Profile Section */}
                    <div className="bg-white/5 rounded-3xl border border-white/10 p-8 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 p-[2px]">
                                <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl font-bold text-white">
                                    JD
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Personal Profile</h2>
                                <p className="text-sm text-muted-foreground">This info will be used for AI insights.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Full Name</label>
                                <Input defaultValue="John Doe" className="bg-black/20 border-white/10 text-white h-12" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email Address</label>
                                <Input defaultValue="john@example.com" className="bg-black/20 border-white/10 text-white h-12" />
                            </div>
                        </div>
                    </div>

                    {/* AI Configuration */}
                    <div className="bg-white/5 rounded-3xl border border-white/10 p-8 backdrop-blur-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <Cpu className="h-24 w-24 text-indigo-400" />
                        </div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                <Key className="h-5 w-5 text-indigo-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">AI Engine Config</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Gemini API Key</label>
                                <Input
                                    type="password"
                                    defaultValue="AIzaSyBbRVmTFtx4CA8J08vIJtuSqT1ID3AbsA4"
                                    className="bg-black/20 border-white/10 text-white h-12 font-mono"
                                />
                                <p className="text-[10px] text-muted-foreground italic">Your key is stored locally and used for real-time RAG generation.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Model Selection</label>
                                <select className="w-full bg-black/20 border border-white/10 rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors h-12 appearance-none">
                                    <option>Gemini 2.0 Flash (Fastest)</option>
                                    <option>Gemini 1.5 Pro (Deepest Analysis)</option>
                                    <option>Gemini 1.5 Flash (Legacy)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center justify-end gap-4">
                        <AnimatePresence>
                            {saved && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2 text-emerald-400 text-sm font-medium"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Settings saved successfully!
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-500 h-12 px-8 rounded-xl font-bold gap-2 shadow-lg shadow-indigo-600/20"
                            onClick={handleSave}
                        >
                            <Save className="h-4 w-4" />
                            Save Changes
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    )
}
