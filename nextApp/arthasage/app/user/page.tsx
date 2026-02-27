"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/providers/session-provider";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
  const router = useRouter();
  const { session } = useSession();

  useEffect(() => {
    if (!session) return;
    
    if(session.user.firstTimeUser){
      router.push("/user/onboarding");
    } else {
      router.push(`/user/dashboard`);
    }
  }, [session, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Spinner className="size-8" />
      <p className="text-muted-foreground">
        {session?.user.firstTimeUser ? "Redirecting to onboarding..." : "Redirecting to dashboard..."}
      </p>
    </div>
  );
}
