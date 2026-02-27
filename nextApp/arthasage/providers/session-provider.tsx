"use client";
import { Session } from "@/lib/auth";
import { createContext, useState, useContext, useCallback } from "react";
import { authClient } from "@/lib/auth-client";

type SessionContextType = {
  session: Session | null;
  isSessionLoading: boolean;
  refreshSession: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider: React.FC<{
  children: React.ReactNode;
  initialSession: Session | null;
}> = ({ children, initialSession }) => {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [isSessionLoading, setIsSessionLoading] = useState(false); // Starts false now

  const refreshSession = useCallback(async () => {
    setIsSessionLoading(true);
    try {
      const response = await authClient.getSession();
      if (response.data) {
        setSession(response.data as Session);
      } else {
        setSession(null);
      }
    } catch (error) {
      console.error("Failed to refresh session:", error);
    } finally {
      setIsSessionLoading(false);
    }
  }, []);

  return (
    <SessionContext.Provider
      value={{
        session,
        isSessionLoading,
        refreshSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
