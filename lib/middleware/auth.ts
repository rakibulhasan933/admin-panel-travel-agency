import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function verifyAdminAuth(request: NextRequest) {
  const token = request.cookies.get("auth")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const verified = await verifyToken(token)
  if (!verified) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }

  return null
}
