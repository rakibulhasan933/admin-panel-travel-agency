import { type NextRequest, NextResponse } from "next/server"

const IMGBB_API_KEY = process.env.IMGBB_API_KEY

export async function POST(request: NextRequest) {
  try {
    if (!IMGBB_API_KEY) {
      console.error(" IMGBB_API_KEY not configured")
      return NextResponse.json(
        { error: "Image service not configured. Please add IMGBB_API_KEY to environment variables." },
        { status: 500 },
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)
    const base64 = Buffer.from(uint8Array).toString("base64")

    // Create FormData for ImgBB API
    const imgbbFormData = new FormData()
    imgbbFormData.append("image", base64)
    imgbbFormData.append("key", IMGBB_API_KEY)

    const imgbbResponse = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: imgbbFormData,
    })

    if (!imgbbResponse.ok) {
      throw new Error(`ImgBB API error: ${imgbbResponse.statusText}`)
    }

    const data = (await imgbbResponse.json()) as {
      data: { url: string; display_url: string }
    }
    const imageUrl = data.data.display_url || data.data.url

    return NextResponse.json({ url: imageUrl, success: true })
  } catch (error) {
    console.error(" Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
