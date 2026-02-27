"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

const metadata = {
  title: "Sign Out",
  description: "Securely sign out of your account and end your session.",
};

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace("/sign-in");
          },
        },
      });
    })();
  }, [router]);
  return (
    <Card className="w-full max-w-md mx-auto mt-16">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="flex flex-col items-center gap-4">
            <Spinner className="size-6 text-primary" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">Signing You Out</h2>
            <p className="text-sm text-muted-foreground">
              Please wait while we securely sign you out...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}