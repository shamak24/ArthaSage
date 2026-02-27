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
  Zap,
  Shield,
  TrendingUp,
  FileText,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Session } from "@/lib/auth";
import { ToggleTheme } from "@/components/theme-switch";

export function Landing({ session }: { session: Session | null }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">ArthaSage</span>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/user/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button>Sign Up</Button>
                </Link>
                <ToggleTheme/>
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
            Next-Gen CA Automation
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-50 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent pb-4">
            ArthaSage
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl">
            ArthaSage is the finance manager with AI insights that helps you make smarter financial decisions, automate tasks, and achieve your financial goals faster than ever before.
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

      <Separator className="my-12" />

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                Key Features of ArthaSage
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Discover how ArthaSage can revolutionize your financial management with cutting-edge AI capabilities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Lightning Fast Processing</CardTitle>
              <CardDescription>
                Process financial data and documents in seconds
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Bank-Grade Security</CardTitle>
              <CardDescription>
                Your sensitive financial data is protected with enterprise-level
                encryption
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Real-Time Analytics</CardTitle>
              <CardDescription>
                Get instant insights and reports to make data-driven decisions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle>Smart Document Management</CardTitle>
              <CardDescription>
                Automatically organize, categorize, and retrieve documents with
                ease
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-900 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <CardTitle>Collaboration Tools</CardTitle>
              <CardDescription>
                Work seamlessly with your team and clients in real-time
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle>Compliance Ready</CardTitle>
              <CardDescription>
                Stay compliant with latest regulations and automated audit
                trails
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4">Why Choose Fin AI?</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-6">
                Transform Your Financial Management with Fin AI
            </h2>
            <div className="space-y-4">
              {[
                "Reduce manual work by up to 80%",
                "Process documents 10x faster",
                "Eliminate data entry errors",
                "24/7 automated workflows",
                "Seamless integration with existing tools",
                "Dedicated support team",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-lg text-slate-700 dark:text-slate-300">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-base">
                Fin AI is trusted by hundreds of CA firms and professionals worldwide. Join them in revolutionizing financial management with AI-powered automation. Start your free trial today and experience the future of finance!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                      500+
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                        CA Firms Using Fin AI
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                      1M+
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                        Tasks Automated 
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                      99.9%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Uptime Guarantee
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Link
                href={session ? "/org" : "/sign-up"}
                className="w-full"
              >
                <Button className="w-full" size="lg">
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
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Experience the Future of Financial Management with Fin AI
            </h2>
            <p className="text-xl mb-8 text-blue-50 max-w-2xl mx-auto">
                Join the revolution in financial management. Sign up for Fin AI today and see how our cutting-edge AI technology can transform your workflow, boost productivity, and help you achieve your financial goals faster than ever before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session ? (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg px-8 py-6"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-up">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="text-lg px-8 py-6"
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 py-6 bg-transparent text-white border-white hover:bg-white/10"
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
