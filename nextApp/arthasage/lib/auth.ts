import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "./db";
import * as schema from "./db/schema";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_BASE_URL,
  experimental: { joins: true },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    nextCookies(),
  ],
  user: {
    additionalFields: {
      firstTimeUser: {
        type: "boolean",
        required: true,
        input: false,
        defaultValue: true,
      },
    },
  },
  rateLimit: {
    window: 10, // time window in seconds
    max: 100, // max requests in the window
  },
});

export type Session = typeof auth.$Infer.Session;