import { hash, compare } from "bcryptjs"
import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"

const secretKey = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function hashPassword(password: string) {
  return hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return compare(password, hash)
}

export async function createToken(email: string) {
  const secret = new TextEncoder().encode(secretKey)
  const token = await new SignJWT({ email }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("24h").sign(secret)
  return token
}

export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(secretKey)
    const verified = await jwtVerify(token, secret)
    return verified.payload as { email: string }
  } catch (err) {
    return null
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 86400,
    path: "/",
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth")
}

export async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get("auth")?.value
}
