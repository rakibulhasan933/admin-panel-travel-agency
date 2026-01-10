"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface ImageUploadProps {
  onImageUrl: (url: string) => void
  label?: string
  preview?: string
  required?: boolean
}

export function ImageUpload({ onImageUrl, label = "Upload Image", preview, required = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(preview || "")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    if (file.size > 30 * 1024 * 1024) {
      toast.error("Image must be less than 30MB")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setImageUrl(data.url)
      onImageUrl(data.url)
      toast.success("Image uploaded successfully")
    } catch (error) {
      console.log({ error })
      console.error("Upload error:", error)
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {imageUrl && (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
          <Image src={imageUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
          <button
            type="button"
            onClick={() => {
              setImageUrl("")
              onImageUrl("")
            }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <label className="flex-1">
          <Input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
          <Button
            type="button"
            variant="outline"
            className="w-full cursor-pointer bg-transparent"
            disabled={uploading}
            onClick={(e) => {
              e.currentTarget.parentElement?.querySelector("input")?.click()
            }}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Choose Image"}
          </Button>
        </label>
      </div>
    </div>
  )
}
