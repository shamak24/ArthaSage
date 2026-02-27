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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Building2, Users, ArrowRight, Check, Loader2, Landmark, TrendingUp, Upload, FileText, X, BarChart3, Receipt } from "lucide-react";
import { useSession } from "@/providers/session-provider";
import Link from 'next/dist/client/link';
import { Badge } from "@/components/ui/badge";
import { finishOnboarding } from "@/lib/actions/onboardingComplete";

// import { onboardingAction } from "@/lib/actions/user-actions";

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

    // CSV Import simulation states
    const [uploadedFiles, setUploadedFiles] = useState<{
      name: string, 
      type: 'transactions' | 'holdings', 
      size: string,
      file: File
    }[]>([]);
    const [importState, setImportState] = useState<"idle" | "processing" | "success">("idle");
    const [currentProcessing, setCurrentProcessing] = useState<string>("");

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

    const handleFileUpload = (type: 'transactions' | 'holdings', event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      
      // Validate file type
      if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        setError("Please upload only CSV or Excel files");
        return;
      }

      const fileSize = file.size < 1024 
        ? `${file.size}B`
        : file.size < 1024 * 1024
        ? `${(file.size / 1024).toFixed(1)}KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)}MB`;

      setUploadedFiles(prev => [...prev, { 
        name: file.name, 
        type, 
        size: fileSize,
        file 
      }]);
      
      // Reset the input
      event.target.value = '';
    };

    const removeFile = (fileName: string) => {
      setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
    };

    const handleProcessFiles = async () => {
      if (uploadedFiles.length === 0) {
        setError("Please upload at least one file");
        return;
      }

      setError("");
      setImportState("processing");

      // Simulate processing each file with actual parsing
      for (const fileData of uploadedFiles) {
        setCurrentProcessing(fileData.name);
        
        // Actually read the file content (optional - for validation)
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result;
          console.log(`Processing ${fileData.name}:`, content);
          // Here you could parse CSV and validate structure
        };
        reader.readAsText(fileData.file);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      setImportState("success");
      setCurrentProcessing("");
    };

    const handleImportContinue = () => {
      router.push("/user/dashboard");
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <div className="container max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Welcome to Fin AI
          </h1>
          <p className="text-muted-foreground text-lg">
            Let's get you started. Choose how you'd like to proceed.
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

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="create" className="gap-2">
              <Building2 className="size-4" />
              Link Banking & Demat Accounts
            </TabsTrigger>
            <TabsTrigger value="join" className="gap-2">
              <Users className="size-4" />
              Import CSV or Excel Files
            </TabsTrigger>
          </TabsList>

          {/* Link Banking Accounts Tab */}
          <TabsContent value="create">
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
          </TabsContent>

          {/* Import CSV or Excel Files Tab */}
          <TabsContent value="join">
            <Card>
              <CardHeader>
                <CardTitle>Import CSV or Excel Files</CardTitle>
                <CardDescription>
                    To import your financial data, please upload CSV or Excel files containing your transactions, account statements, or other relevant financial information. This will allow us to analyze your data and provide you with insights and recommendations based on your financial history.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {importState === "idle" && (
                  <>
                    {/* Transaction Files Upload */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Receipt className="size-5 text-blue-500" />
                        <h3 className="font-medium">Transaction History</h3>
                      </div>
                      <label
                        htmlFor="transactions-upload"
                        className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
      >
                        <Upload className="size-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium mb-1">
                          Upload Transaction CSV/Excel
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Bank statements, credit card bills, expenses
                        </p>
                        <input
                          id="transactions-upload"
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          className="hidden"
                          onChange={(e) => handleFileUpload('transactions', e)}
                        />
      </label>
                    </div>

                    {/* Stock Holdings Upload */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="size-5 text-green-500" />
                        <h3 className="font-medium">Stock Holdings</h3>
                      </div>
                      <label
                        htmlFor="holdings-upload"
                        className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
      >
                        <Upload className="size-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium mb-1">
                          Upload Holdings CSV/Excel
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Portfolio, demat account holdings, stock investments
                        </p>
                        <input
                          id="holdings-upload"
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          className="hidden"
                          onChange={(e) => handleFileUpload('holdings', e)}
                        />
      </label>
                    </div>

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                      <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                        <p className="text-sm font-medium">Uploaded Files:</p>
                        <div className="space-y-2">
                          {uploadedFiles.map((file) => (
                            <div
                              key={file.name}
                              className="flex items-center justify-between bg-background rounded-lg p-3"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <FileText className="size-4 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{file.name}</p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{file.size}</span>
                                    <span>•</span>
                                    <Badge
                                      variant="outline"
                                      className={
                                        file.type === "transactions"
                                          ? "border-blue-500/50 text-blue-500"
                                          : "border-green-500/50 text-green-500"
                                      }
                                    >
                                      {file.type === "transactions"
                                        ? "Transactions"
                                        : "Holdings"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(file.name)}
                              >
                                <X className="size-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      <Button
                        onClick={handleProcessFiles}
                        disabled={uploadedFiles.length === 0}
                        className="w-full"
                        size="lg"
                      >
                        Process {uploadedFiles.length > 0 && `${uploadedFiles.length} `}
                        File{uploadedFiles.length !== 1 ? "s" : ""}
                        <ArrowRight className="ml-2 size-4" />
                      </Button>
                    </div>
                  </>
                )}

                {importState === "processing" && (
                  <div className="py-8 space-y-6">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <Loader2 className="size-16 text-primary animate-spin" />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-semibold">
                          Processing Files...
                        </h3>
                        {currentProcessing && (
                          <p className="text-muted-foreground">
                            Analyzing {currentProcessing}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                      <p className="text-sm font-medium">Processing steps:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>✓ Validating file format</li>
                        <li>✓ Parsing data columns</li>
                        <li>✓ Categorizing transactions</li>
                        <li>⏳ Importing to database...</li>
                      </ul>
                    </div>
                  </div>
                )}

                {importState === "success" && (
                  <div className="py-8 space-y-6">
                    <div className="flex flex-col items-center gap-4">
                      <div className="rounded-full bg-green-500/10 p-4">
                        <Check className="size-16 text-green-500" />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-2xl font-semibold">
                          Import Successful!
                        </h3>
                        <p className="text-muted-foreground">
                          Your financial data has been processed and imported
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                      <p className="text-sm font-medium">Import Summary:</p>
                      <div className="grid grid-cols-2 gap-4">
                        {uploadedFiles.filter(f => f.type === 'transactions').length > 0 && (
                          <div className="rounded-lg bg-blue-500/10 p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="size-4 text-blue-500" />
                              <span className="text-sm font-medium">Transactions</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-500">
                              {Math.floor(Math.random() * 500 + 200)}
                            </p>
                            <p className="text-xs text-muted-foreground">records imported</p>
                          </div>
                        )}
                        {uploadedFiles.filter(f => f.type === 'holdings').length > 0 && (
                          <div className="rounded-lg bg-green-500/10 p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <BarChart3 className="size-4 text-green-500" />
                              <span className="text-sm font-medium">Holdings</span>
                            </div>
                            <p className="text-2xl font-bold text-green-500">
                              {Math.floor(Math.random() * 50 + 10)}
                            </p>
                            <p className="text-xs text-muted-foreground">stocks imported</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 space-y-2">
                      <Button
                        onClick={handleImportContinue}
                        className="w-full"
                        size="lg"
                      >
                        Continue to Dashboard
                        <ArrowRight className="ml-2 size-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => {
                          setImportState("idle");
                          setUploadedFiles([]);
                        }}
                      >
                        Back to Upload
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    );
}

