import { config } from "dotenv"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/postgres-js"
import { hash } from "bcryptjs"
import postgres from "postgres"
import { adminUsers } from "./lib/db/schema"

config({ path: ".env" })
config({ path: ".env.local", override: true })

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database.")
}

const client = postgres(databaseUrl, { max: 1 })
const db = drizzle(client)

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com"
  const plainPassword = process.env.ADMIN_PASSWORD ?? "Admin@123456"
  const name = process.env.ADMIN_NAME ?? "Admin User"

  const password = await hash(plainPassword, 10)
  const existingAdmin = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1)

  if (existingAdmin.length > 0) {
    await db
      .update(adminUsers)
      .set({
        password,
        name,
        role: "admin",
        updatedAt: new Date(),
      })
      .where(eq(adminUsers.email, email))

    console.log(`Admin user updated: ${email}`)
    return
  }

  await db.insert(adminUsers).values({
    email,
    password,
    name,
    role: "admin",
  })

  console.log(`Admin user created: ${email}`)
}

main()
  .catch((error) => {
    console.error("Failed to seed admin user:", error)
    process.exitCode = 1
  })
  .finally(async () => {
    await client.end()
  })
