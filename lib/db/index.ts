import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

config({ path: ".env" })

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required. Add it to your Vercel project environment variables.")
}

const client = postgres(databaseUrl, {
  max: 1,
  prepare: false,
  ssl: "require",
})

export const db = drizzle({ client, schema })
