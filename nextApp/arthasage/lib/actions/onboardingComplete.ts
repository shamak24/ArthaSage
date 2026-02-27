"use server";

import { connectSelectedProviders } from "@/lib/connectors/connect-selected";
import { auth } from "../auth";
import { headers } from "next/headers";
import db from "../db";
import { user } from "../db/schema";
import { eq } from "drizzle-orm";

export async function finishOnboarding(selected: string[]) {
  const session = await auth.api.getSession({
        headers: await headers(),
  });

  if (!session?.user) throw new Error("Unauthorized");

  try {
    await connectSelectedProviders(
      session.user.id,
      selected as any
    );
    
    // Update user in database to mark onboarding as complete
    await db
      .update(user)
      .set({ firstTimeUser: false })
      .where(eq(user.id, session.user.id));
      
  } catch (error) {
    console.error("Onboarding error:", error);
    throw error; // Re-throw the actual error instead of a generic message
  }
}