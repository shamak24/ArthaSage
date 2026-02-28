"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, ArrowRight, Check, Loader2, Landmark, TrendingUp } from "lucide-react";
import { useSession } from "@/providers/session-provider";
import Link from 'next/dist/client/link';
import { Badge } from "@/components/ui/badge";
import { finishOnboarding } from "@/lib/actions/onboardingComplete";

const FAKE_BANKS = [
  { id: "HDFC", name: "HDFC Bank", icon: "🏦", type: "bank" },
  { id: "ICICI", name: "ICICI Bank", icon: "🏦", type: "bank" },
  { id: "SBI", name: "State Bank of India", icon: "🏦", type: "bank" },
  { id: "AXIS", name: "Axis Bank", icon: "🏦", type: "bank" },
];

const FAKE_DEMAT = [
  { id: "ZERODHA", name: "Zerodha", icon: "📈", type: "demat" },
  { id: "UPSTOX", name: "Upstox", icon: "📈", type: "demat" },
  { id: "GROWW", name: "Groww", icon: "📈", type: "demat" },
  { id: "ANGELONE", name: "Angel One", icon: "📈", type: "demat" },
];

export default function OnboardingComponent() {
    const router = useRouter();
    const { session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState("welcome");
    
    // Linking simulation states
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
    const [linkingState, setLinkingState] = useState<"idle" | "linking" | "success">("idle");
    const [currentLinking, setCurrentLinking] = useState<string>("");

    const toggleAccount = (accountId: string) => {
      setSelectedAccounts(prev => 
        prev.includes(accountId) 
          ? prev.filter(id => id !== accountId)
          : [...prev, accountId]
      );
    };

    const handleLinkAccounts = async () => {
      if (selectedAccounts.length === 0) {
        setError("Please select at least one account to link");
        return;
      }

      setError("");
      setLinkingState("linking");

      // Simulate linking each account with a delay
      const allAccounts = [...FAKE_BANKS, ...FAKE_DEMAT];
      for (const accountId of selectedAccounts) {
        const account = allAccounts.find(acc => acc.id === accountId);
        if (account) {
          setCurrentLinking(account.name);
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      setLinkingState("success");
      setCurrentLinking("");
    };

    const handleContinue = async () => {
      try {
        await finishOnboarding(selectedAccounts);
        router.push("/user/dashboard");
      } catch (error) {
        setError("Failed to complete onboarding");
      }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <div className="container max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Welcome to <span className="text-primary"> ArthaSage</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Let's get you started by linking your accounts.
          </p>

          {/* Sign out button */}
            <div className="absolute top-4 right-4">
                <Link href="/sign-out">
                <Button variant="outline" size="sm">
                    Sign Out
                </Button>
                </Link>
            </div>
        </div>

          <Card>
              <CardHeader>
                <CardTitle>Link Banking & Demat Accounts</CardTitle>
                <CardDescription>
                    To get started with Fin AI, you can link your banking and demat accounts. This will allow us to securely access your financial data and provide you with personalized insights and recommendations. Don't worry, we use industry-leading security measures to protect your information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {linkingState === "idle" && (
                  <>
                    {/* Banking Accounts Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Landmark className="size-5 text-primary" />
                        <h3 className="font-semibold">Select Banking Accounts</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {FAKE_BANKS.map((bank) => (
                          <button
                            key={bank.id}
                            onClick={() => toggleAccount(bank.id)}
                            className={`relative flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                              selectedAccounts.includes(bank.id)
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <span className="text-2xl">{bank.icon}</span>
                            <span className="font-medium text-left">{bank.name}</span>
                            {selectedAccounts.includes(bank.id) && (
                              <div className="ml-auto rounded-full bg-primary p-1">
                                <Check className="size-3 text-primary-foreground" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Demat Accounts Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="size-5 text-primary" />
                        <h3 className="font-semibold">Select Demat Accounts</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {FAKE_DEMAT.map((demat) => (
                          <button
                            key={demat.id}
                            onClick={() => toggleAccount(demat.id)}
                            className={`relative flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                              selectedAccounts.includes(demat.id)
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <span className="text-2xl">{demat.icon}</span>
                            <span className="font-medium text-left">{demat.name}</span>
                            {selectedAccounts.includes(demat.id) && (
                              <div className="ml-auto rounded-full bg-primary p-1">
                                <Check className="size-3 text-primary-foreground" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={handleLinkAccounts}
                        disabled={selectedAccounts.length === 0}
                        className="w-full"
                        size="lg"
                      >
                        Link {selectedAccounts.length > 0 && `${selectedAccounts.length} `}
                        Account{selectedAccounts.length !== 1 ? "s" : ""}
                        <ArrowRight className="ml-2 size-4" />
                      </Button>
                    </div>
                  </>
                )}

                {linkingState === "linking" && (
                  <div className="py-8 space-y-6">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <Loader2 className="size-16 text-primary animate-spin" />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-semibold">
                          Linking Accounts...
                        </h3>
                        {currentLinking && (
                          <p className="text-muted-foreground">
                            Securely connecting to {currentLinking}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                      <p className="text-sm font-medium">What's happening:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>✓ Establishing secure connection</li>
                        <li>✓ Verifying account credentials</li>
                        <li>✓ Syncing transaction data</li>
                        <li>⏳ Finalizing setup...</li>
                      </ul>
                    </div>
                  </div>
                )}

                {linkingState === "success" && (
                  <div className="py-8 space-y-6">
                    <div className="flex flex-col items-center gap-4">
                      <div className="rounded-full bg-green-500/10 p-4">
                        <Check className="size-16 text-green-500" />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-2xl font-semibold">
                          Successfully Linked!
                        </h3>
                        <p className="text-muted-foreground">
                          Your accounts have been securely connected
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                      <p className="text-sm font-medium">Linked Accounts:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedAccounts.map((accountId) => {
                          const account = [...FAKE_BANKS, ...FAKE_DEMAT].find(
                            (acc) => acc.id === accountId
                          );
                          return account ? (
                            <Badge key={account.id} variant="secondary" className="gap-1">
                              <span>{account.icon}</span>
                              <span>{account.name}</span>
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={handleContinue}
                        className="w-full"
                        size="lg"
                      >
                        Continue to Dashboard
                        <ArrowRight className="ml-2 size-4" />
                      </Button>
                      <Button variant="outline" className="w-full mt-2" onClick={() => setLinkingState("idle")}>
                        Back to Linking
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
      </div>
    </div>
    );
}

