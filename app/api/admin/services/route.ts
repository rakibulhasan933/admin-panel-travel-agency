import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { services } from "@/lib/db/schema"
import { verifyAdminAuth } from "@/lib/middleware/auth"

export async function GET(request: NextRequest) {
  try {
    const data = await db.query.services.findMany({
      orderBy: (services, { desc }) => [desc(services.createdAt)],
      with: {
        packages: true
      }
    })
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authError = await verifyAdminAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const result = await db.insert(services).values(body).returning()
    return NextResponse.json({ data: result[0] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
