"use client"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { X, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { UploadButton } from "@/lib/uploadthing"


interface ImageUploadProps {
  onImageUrl: (url: string) => void
  label?: string
  preview?: string
  required?: boolean
}

export function ImageUpload({ onImageUrl, label = "Upload Image", preview, required = false }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(preview || "")
  const [isUploading, setIsUploading] = useState(false)

  return (
    <div className="space-y-3">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {imageUrl && (
        <div className="relative w-full h-48 bg-linear-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden group border border-slate-200">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt="Preview"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Success indicator badge */}
          <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            Uploaded
          </div>
          {/* Delete button */}
          <button
            type="button"
            onClick={() => {
              setImageUrl("")
              onImageUrl("")
              toast.success("Image removed")
            }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {!imageUrl && (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors bg-slate-50">
          <UploadButton
            endpoint="imageUploader"
            onUploadBegin={() => {
              setIsUploading(true)
            }}
            onClientUploadComplete={(res) => {
              if (res && res.length > 0) {
                const uploadedUrl = res[0].url
                setImageUrl(uploadedUrl)
                onImageUrl(uploadedUrl)
                setIsUploading(false)
                toast.success("Image uploaded successfully!", {
                  description: "Your image is ready to use.",
                })
              }
            }}
            onUploadError={(error: Error) => {
              console.error("Upload error:", error)
              setIsUploading(false)
              toast.error(`Upload failed: ${error.message}`)
            }}
            content={{
              button: isUploading ? "Uploading..." : "Click to upload or drag and drop",
              allowedContent: "PNG, JPG, GIF (max 64MB)",
            }}
            appearance={{
              button:
                "ut-ready:bg-green-500 ut-uploading:cursor-not-allowed rounded-r-none bg-blue-500 bg-none after:bg-orange-400",

            }}
          />
        </div>
      )}
    </div>
  )
}
