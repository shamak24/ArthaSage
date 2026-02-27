"use client";
import { SessionProvider } from "@/providers/session-provider";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Session } from "@/lib/auth";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [initialSession, setInitialSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await authClient.getSession();
        setInitialSession(response.data as Session | null);
      } catch (error) {
        console.error("Failed to fetch initial session:", error);
        setInitialSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  if (isLoading) {
    return null; // Or return a loading spinner
  }

  return (
    <SessionProvider initialSession={initialSession}>
      {children}
    </SessionProvider>
  );
}