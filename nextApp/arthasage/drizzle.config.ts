import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import path from "path";

// force absolute path loading
dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

console.log("SUPABASE_DB_URL =", process.env.SUPABASE_DB_URL); // DEBUG LINE

export default defineConfig({
  out: "./drizzle",
  schema: "./lib/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.SUPABASE_DB_URL!,
  },
});