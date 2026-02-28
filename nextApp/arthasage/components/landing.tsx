"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Brain,
  MessageSquare,
  Activity,
  BarChart3,
  Wallet,
  BrainCircuit,
} from "lucide-react";
import { Session } from "@/lib/auth";
import { ToggleTheme } from "@/components/theme-switch";

export function Landing({ session }: { session: Session | null }) {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="border-b fixed top-0 left-0 right-0 backdrop-blur-md bg-background/80 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary tracking-tight">ArthaSage</span>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link href="/user/dashboard">
                  <Button className="transition-all duration-200 hover:scale-[1.03] active:scale-95">Go to Dashboard</Button>
                </Link>
                <ToggleTheme />
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" className="transition-all duration-200 hover:scale-[1.03]">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="transition-all duration-200 hover:scale-[1.03] active:scale-95">Sign Up</Button>
                </Link>
                <ToggleTheme />
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2 inline" />
            AI-Powered Financial Intelligence
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-50 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent pb-4">
            ArthaSage
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl">
            Your money has a story. ArthaSage reads it. Link your accounts and let AI surface the patterns, anomalies, and insights that drive smarter financial decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {session ? (
              <Link href="/user/dashboard">
                <Button size="lg" className="text-lg px-8 py-6">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button size="lg" className="text-lg px-8 py-6">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* Features Section */}
      <section className="relative container mx-auto px-4 py-20">
        <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 rounded-full bg-blue-400/10 dark:bg-blue-600/5 blur-3xl" />
        <div className="text-center mb-14 relative z-10">
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5">
            <Sparkles className="w-3 h-3 mr-1 inline text-primary" /> Core Capabilities
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            What ArthaSage actually does
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Six capabilities built around understanding your finances — not just tracking them.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {[
            {
              icon: <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
              bg: "bg-blue-100 dark:bg-blue-900/60",
              border: "hover:border-blue-400/40",
              glow: "hover:shadow-blue-500/10",
              title: "Financial Health Dashboard",
              desc: "See your income, expenses, and savings analysed together into a single AI-computed financial health score.",
            },
            {
              icon: <Activity className="w-6 h-6 text-orange-600 dark:text-orange-400" />,
              bg: "bg-orange-100 dark:bg-orange-900/60",
              border: "hover:border-orange-400/40",
              glow: "hover:shadow-orange-500/10",
              title: "Anomaly Detection",
              desc: "Statistical models flag unusual spending patterns before they become problems — with clear plain-language explanations.",
            },
            {
              icon: <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />,
              bg: "bg-green-100 dark:bg-green-900/60",
              border: "hover:border-green-400/40",
              glow: "hover:shadow-green-500/10",
              title: "AI Financial Copilot",
              desc: "Ask anything about your finances in plain English. ArthaSage answers using your actual account data — not generic advice.",
            },
            {
              icon: <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
              bg: "bg-purple-100 dark:bg-purple-900/60",
              border: "hover:border-purple-400/40",
              glow: "hover:shadow-purple-500/10",
              title: "Portfolio & Holdings Insights",
              desc: "Understand your demat account positions, allocation balance, and investment trends at a glance.",
            },
            {
              icon: <Brain className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
              bg: "bg-sky-100 dark:bg-sky-900/60",
              border: "hover:border-sky-400/40",
              glow: "hover:shadow-sky-500/10",
              title: "AI Spending Intelligence",
              desc: "Transactions are automatically categorised and modelled so you understand where your money actually goes — not just where you think it does.",
            },
            {
              icon: <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
              bg: "bg-indigo-100 dark:bg-indigo-900/60",
              border: "hover:border-indigo-400/40",
              glow: "hover:shadow-indigo-500/10",
              title: "Knowledge-Grounded AI",
              desc: "Answers are backed by a financial knowledge base — so explanations are accurate, contextual, and never hallucinated.",
            },
          ].map(({ icon, bg, border, glow, title, desc }) => (
            <Card
              key={title}
              className={`group border-2 ${border} hover:-translate-y-2 hover:shadow-xl ${glow} transition-all duration-300 cursor-default`}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  {icon}
                </div>
                <CardTitle className="transition-colors duration-200 group-hover:text-primary">{title}</CardTitle>
                <CardDescription className="leading-relaxed">{desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* How It Works Section */}
      <section className="relative container mx-auto px-4 py-20 overflow-hidden">
        <div className="pointer-events-none absolute bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-400/10 dark:bg-indigo-600/5 blur-3xl" />
        <div className="text-center mb-14 relative z-10">
          <Badge className="mb-4">Simple by Design</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            From linked account to AI insight in minutes
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            No data entry. No uploads. ArthaSage does the heavy lifting the moment you connect.
          </p>
        </div>
        <div className="relative grid md:grid-cols-3 gap-8 z-10">
          {/* Connecting dashed line — desktop only */}
          <div className="hidden md:block absolute top-[52px] left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px border-t-2 border-dashed border-slate-300 dark:border-slate-700 z-0" />
          {[
            {
              step: "01",
              icon: <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
              bg: "bg-blue-100 dark:bg-blue-900/60",
              num: "bg-blue-600",
              ring: "ring-blue-200 dark:ring-blue-900",
              title: "Link Your Accounts",
              desc: "Securely connect your simulated bank and demat accounts. No manual file handling needed.",
            },
            {
              step: "02",
              icon: <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
              bg: "bg-purple-100 dark:bg-purple-900/60",
              num: "bg-purple-600",
              ring: "ring-purple-200 dark:ring-purple-900",
              title: "AI Analyses Your Data",
              desc: "ArthaSage runs statistical models and AI reasoning across your real transaction history and holdings.",
            },
            {
              step: "03",
              icon: <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
              bg: "bg-indigo-100 dark:bg-indigo-900/60",
              num: "bg-indigo-600",
              ring: "ring-indigo-200 dark:ring-indigo-900",
              title: "Receive Personalised Insights",
              desc: "Get your financial health score, spending breakdowns, anomaly alerts, and answers to questions — all grounded in your own data.",
            },
          ].map(({ step, icon, bg, num, ring, title, desc }) => (
            <div
              key={step}
              className="group relative flex flex-col items-center text-center p-8 rounded-2xl border-2 bg-slate-50 dark:bg-slate-900/80 hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
            >
              <div className={`relative z-10 w-12 h-12 rounded-full ${num} ring-4 ${ring} flex items-center justify-center mb-4 text-sm font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                {step}
              </div>
              <div className={`w-12 h-12 rounded-xl ${bg} p-2.5 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                {icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-50 transition-colors group-hover:text-primary">{title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Benefits Section */}
      <section className="relative container mx-auto px-4 py-20">
        <div className="pointer-events-none absolute top-10 right-0 w-72 h-72 rounded-full bg-green-400/10 dark:bg-green-600/5 blur-3xl" />
        <div className="grid lg:grid-cols-2 gap-14 items-center relative z-10">
          <div>
            <Badge className="mb-4">Why ArthaSage?</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-8 leading-snug">
              AI that understands your finances, not just records them
            </h2>
            <div className="space-y-4">
              {[
                "Financial health score updated with every transaction",
                "Anomaly alerts before patterns become problems",
                "Ask follow-up questions — the AI remembers your context",
                "Answers grounded in a verified financial knowledge base",
                "Built for students and young professionals, not enterprises",
                "Zero manual data entry from day one",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 group hover:translate-x-1 transition-transform duration-200">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  <span className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-2 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to understand your money?</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                ArthaSage is built for the generation that wants to be financially intelligent — not just financially organised. Link your accounts and see what AI can reveal about your financial life.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "6", label: "AI capabilities" },
                  { value: "0", label: "Manual entry" },
                  { value: "∞", label: "Questions to ask" },
                ].map(({ value, label }) => (
                  <Card
                    key={label}
                    className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:-translate-y-1 transition-all duration-200"
                  >
                    <CardContent className="pt-5 pb-4 text-center">
                      <div className="text-3xl font-bold text-primary mb-1">{value}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Link href={session ? "/org" : "/sign-up"} className="w-full block">
                <Button
                  className="w-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-200 active:scale-95"
                  size="lg"
                >
                  {session ? "Go to Dashboard" : "Start Free Trial"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-4 py-16">
        <Card className="relative overflow-hidden bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 border-0 text-white">
          {/* Decorative orbs */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-2xl animate-pulse" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/10 blur-2xl animate-pulse [animation-delay:1s]" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white/5 blur-xl animate-pulse [animation-delay:0.5s]" />
          <CardContent className="relative z-10 py-16 text-center">
            <Badge variant="outline" className="mb-6 border-white/30 text-white bg-white/10 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1 inline animate-pulse" /> Get started today
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Stop guessing.<br className="hidden md:block" /> Start understanding.
            </h2>
            <p className="text-lg md:text-xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Most people know how much they earn. Very few understand how they actually spend, save, and grow. ArthaSage closes that gap — with AI that works on your data, for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session ? (
                <Link href="/dashboard">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-6 hover:scale-[1.03] transition-all duration-200 active:scale-95 shadow-xl">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-up">
                    <Button size="lg" variant="secondary" className="text-lg px-8 py-6 hover:scale-[1.03] transition-all duration-200 active:scale-95 shadow-xl">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 py-6 bg-transparent text-white border-white/60 hover:bg-white/10 hover:scale-[1.03] transition-all duration-200 active:scale-95"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
