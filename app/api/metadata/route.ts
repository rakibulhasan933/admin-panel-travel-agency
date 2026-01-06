import { MetadataFormData } from "@/components/metadata-form"
import { db } from "@/lib/db"
import { metadata as metadataTable, keywords as keywordsTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"


// GET metadata and keywords
export async function GET() {
    try {
        const metadataRecords = await db.select().from(metadataTable)
        const keywordRecords = await db.select().from(keywordsTable)

        return Response.json({
            metadata: metadataRecords,
            keywords: keywordRecords.map((k) => k.keyword),
        })
    } catch (error) {
        console.error(" Error fetching metadata:", error)
        return Response.json({ error: "Failed to fetch metadata" }, { status: 500 })
    }
}

// POST save metadata
export async function POST(request: Request) {
    try {
        const body: MetadataFormData = await request.json()

        // Save metadata key-value pairs
        const metadataUpdates = [
            { key: "site_url", value: body.siteUrl },
            { key: "title_default", value: body.titleDefault },
            { key: "title_template", value: body.titleTemplate },
            { key: "description", value: body.description },
            { key: "site_name", value: body.siteName },
            { key: "logo_url", value: body.logoUrl },
            { key: "og_title", value: body.ogTitle },
            { key: "og_description", value: body.ogDescription },
            { key: "og_image_url", value: body.ogImageUrl },
            { key: "twitter_title", value: body.twitterTitle },
            { key: "twitter_description", value: body.twitterDescription },
            { key: "canonical_url", value: body.canonicalUrl },
            { key: "category", value: body.category },
            { key: "creator", value: body.creator },
            { key: "publisher", value: body.publisher },
        ]

        return Response.json({ message: "Metadata saved successfully" })
    } catch (error) {
        console.error(" Error saving metadata:", error)
        return Response.json({ error: "Failed to save metadata" }, { status: 500 })
    }
}
