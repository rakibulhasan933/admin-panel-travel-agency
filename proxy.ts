import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    if (pathname === "/") {
        return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // Protect admin routes except login
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        const token = request.cookies.get("auth")?.value

        if (!token) {
            return NextResponse.redirect(new URL("/admin/login", request.url))
        }

        try {
            const verified = await verifyToken(token)
            if (!verified) {
                return NextResponse.redirect(new URL("/admin/login", request.url))
            }
        } catch (error) {
            return NextResponse.redirect(new URL("/admin/login", request.url))
        }
    }

    // Redirect authenticated users away from login
    if (pathname === "/admin/login") {
        const token = request.cookies.get("auth")?.value

        if (token) {
            try {
                const verified = await verifyToken(token)
                if (verified) {
                    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
                }
            } catch (error) {
                // Continue to login page
            }
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/", "/admin/:path*"],
}
