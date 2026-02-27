"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { InsightsData, AnalysisResult } from "@/lib/dashboard/dashboardApi";
import {
  IconTrendingUp,
  IconAlertTriangle,
  IconShoppingCart,
  IconPigMoney,
  IconShield,
  IconChartPie,
  IconBulb,
  IconAlertCircle,
} from "@tabler/icons-react";

interface DashboardViewProps {
  data: AnalysisResult;
}

export default function DashboardView({ data }: DashboardViewProps) {
  const { insights } = data;

  const getHealthColor = (health: string) => {
    const healthLower = health.toLowerCase();
    if (healthLower.includes("good") || healthLower.includes("excellent")) return "text-green-600";
    if (healthLower.includes("fair") || healthLower.includes("moderate")) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskColor = (risk: string) => {
    const riskLower = risk.toLowerCase();
    if (riskLower.includes("low")) return "bg-green-100 text-green-800";
    if (riskLower.includes("medium")) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getImpactColor = (impact: string) => {
    if (impact === "high") return "bg-red-100 text-red-800";
    if (impact === "medium") return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Financial Dashboard</h1>
        <p className="text-lg text-muted-foreground">Your complete financial analysis and insights</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Financial Health</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getHealthColor(insights.financial_health)}`}>
              {insights.financial_health}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <IconShield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={getRiskColor(insights.risk_level)} variant="secondary">
              {insights.risk_level}
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spending Behavior</CardTitle>
            <IconShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{insights.spending_behavior}</div>
          </CardContent>
        </Card>
      </div>

      {/* Scores */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <IconChartPie className="h-5 w-5" />
            Financial Scores
          </CardTitle>
          <CardDescription>Your performance across key financial metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <IconPigMoney className="h-4 w-4" />
                  Savings Score
                </span>
                <span className={`text-2xl font-bold ${getScoreColor(insights.scores.savings_score)}`}>
                  {insights.scores.savings_score}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className={`h-2 rounded-full ${insights.scores.savings_score >= 70 ? "bg-green-600" : insights.scores.savings_score >= 40 ? "bg-yellow-600" : "bg-red-600"}`}
                  style={{ width: `${insights.scores.savings_score}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <IconAlertTriangle className="h-4 w-4" />
                  Risk Score
                </span>
                <span className={`text-2xl font-bold ${getScoreColor(100 - insights.scores.risk_score)}`}>
                  {insights.scores.risk_score}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className={`h-2 rounded-full ${insights.scores.risk_score <= 30 ? "bg-green-600" : insights.scores.risk_score <= 60 ? "bg-yellow-600" : "bg-red-600"}`}
                  style={{ width: `${insights.scores.risk_score}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <IconChartPie className="h-4 w-4" />
                  Diversification
                </span>
                <span className={`text-2xl font-bold ${getScoreColor(insights.scores.diversification_score)}`}>
                  {insights.scores.diversification_score}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className={`h-2 rounded-full ${insights.scores.diversification_score >= 70 ? "bg-green-600" : insights.scores.diversification_score >= 40 ? "bg-yellow-600" : "bg-red-600"}`}
                  style={{ width: `${insights.scores.diversification_score}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Message */}
      <Card className="border-primary/20 bg-primary/5 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <IconBulb className="h-5 w-5" />
            Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed">{insights.summary_message}</p>
        </CardContent>
      </Card>

      {/* Key Findings */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <IconAlertCircle className="h-5 w-5" />
            Key Findings
          </CardTitle>
          <CardDescription>Important observations from your financial data</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {insights.key_findings.map((finding, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span className="text-base leading-relaxed">{finding}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <IconBulb className="h-5 w-5" />
            Recommendations
          </CardTitle>
          <CardDescription>Personalized suggestions to improve your financial health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.recommendations.map((rec, index) => (
              <div key={index} className="rounded-lg border bg-card p-4 space-y-2 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-base">{rec.title}</h3>
                  <Badge className={getImpactColor(rec.impact)} variant="secondary">
                    {rec.impact.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
                <Badge variant="outline" className="text-xs">
                  {rec.category}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Anomalies (if any) */}
      {insights.anomalies && insights.anomalies.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-destructive">
              <IconAlertTriangle className="h-5 w-5" />
              Anomalies Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.anomalies.map((anomaly, index) => (
                <li key={index} className="text-sm text-destructive">{JSON.stringify(anomaly)}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}