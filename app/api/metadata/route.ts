import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { metadata } from "@/lib/db/schema"

export async function GET() {
    try {
        const result = await db.select().from(metadata).limit(1)

        if (result.length === 0) {
            return NextResponse.json({
                metadata: [],
                keywords: [],
            })
        }

        const record = result[0]

        // Convert the database record to the format expected by the form
        const metadataArray = Object.entries(record)
            .filter(([key, value]) => !["id", "createdAt", "updatedAt", "keywords"].includes(key) && value)
            .map(([key, value]) => ({
                key: key,
                value: value as string,
            }))

        return NextResponse.json({
            metadata: metadataArray,
            keywords: (record.keywords as string[]) || [],
        })
    } catch (error) {
        console.error("Error fetching metadata:", error)
        return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Convert form data to database record format
        const dbRecord = {
            siteUrl: body.siteUrl || null,
            titleDefault: body.titleDefault || null,
            titleTemplate: body.titleTemplate || null,
            description: body.description || null,
            siteName: body.siteName || null,
            logoUrl: body.logoUrl || null,
            ogTitle: body.ogTitle || null,
            ogDescription: body.ogDescription || null,
            ogImageUrl: body.ogImageUrl || null,
            twitterTitle: body.twitterTitle || null,
            twitterDescription: body.twitterDescription || null,
            canonicalUrl: body.canonicalUrl || null,
            category: body.category || null,
            creator: body.creator || null,
            publisher: body.publisher || null,
            keywords: body.keywords || [],
            updatedAt: new Date(),
        }

        // Check if metadata already exists
        const existing = await db.select().from(metadata).limit(1)

        if (existing.length > 0) {
            await db.update(metadata).set(dbRecord).where(eq(metadata.id, existing[0].id))

            return NextResponse.json({ message: "Metadata updated successfully", id: existing[0].id }, { status: 200 })
        } else {
            const result = await db.insert(metadata).values(dbRecord).returning({ id: metadata.id })

            return NextResponse.json({ message: "Metadata saved successfully", id: result[0].id }, { status: 201 })
        }
    } catch (error) {
        console.error("Error saving metadata:", error)
        return NextResponse.json({ error: "Failed to save metadata" }, { status: 500 })
    }
}
