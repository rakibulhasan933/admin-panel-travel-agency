import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { packages } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { verifyAdminAuth } from "@/lib/middleware/auth"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authError = await verifyAdminAuth(request)
    if (authError) return authError

    try {
        const { id } = await params
        const body = await request.json();
        if (body.updatedAt) body.updatedAt = new Date(body.updatedAt);
        if (body.createdAt) body.createdAt = new Date(body.createdAt);

        const result = await db
            .update(packages)
            .set(body)
            .where(eq(packages.id, Number.parseInt(id)))
            .returning()

        return NextResponse.json({ data: result[0] })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update package" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authError = await verifyAdminAuth(request)
    if (authError) return authError

    try {
        const { id } = await params
        await db.delete(packages).where(eq(packages.id, Number.parseInt(id)))
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete package" }, { status: 500 })
    }
}