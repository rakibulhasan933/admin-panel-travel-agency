"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"
import { ImageUpload } from "./image-upload"

interface PackageData {
    id?: number
    image: string
    name: string
    description: string
    bulletPoints: string[]
    serviceId?: number
}

interface PackageFormProps {
    onSubmit: (data: PackageData) => void | Promise<void>
    isLoading?: boolean
    initialData?: PackageData
    serviceId: number
}

export function PackageForm({ onSubmit, isLoading = false, initialData, serviceId }: PackageFormProps) {
    const [formData, setFormData] = useState<PackageData>({
        image: "",
        name: "",
        description: "",
        bulletPoints: ["", ""],
        serviceId: serviceId,
    })

    useEffect(() => {
        if (initialData) {
            setFormData(initialData)
        }
    }, [initialData])

    const handleBulletPointChange = (index: number, value: string) => {
        const newBullets = [...formData.bulletPoints]
        newBullets[index] = value
        setFormData({ ...formData, bulletPoints: newBullets })
    }

    const addBulletPoint = () => {
        setFormData({
            ...formData,
            bulletPoints: [...formData.bulletPoints, ""],
        })
    }

    const removeBulletPoint = (index: number) => {
        setFormData({
            ...formData,
            bulletPoints: formData.bulletPoints.filter((_, i) => i !== index),
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.image.trim() || !formData.name.trim() || !formData.description.trim()) {
            alert("Please fill in image URL, name, and description")
            return
        }

        const filteredBullets = formData.bulletPoints.filter((point) => point.trim())

        await onSubmit({
            ...formData,
            bulletPoints: filteredBullets,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <div className="">
                    <ImageUpload
                        label="Image"
                        onImageUrl={(url) => setFormData({ ...formData, image: url })}
                        preview={formData.image}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Package Name</label>
                <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Dhaka to Bangkok"
                    className="bg-input text-foreground"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Description</label>
                <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Package description"
                    className="bg-input text-foreground min-h-24"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Features</label>
                <div className="space-y-2">
                    {formData.bulletPoints.map((point, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                type="text"
                                value={point}
                                onChange={(e) => handleBulletPointChange(index, e.target.value)}
                                placeholder={`Feature ${index + 1}`}
                                className="bg-input text-foreground"
                            />
                            {formData.bulletPoints.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeBulletPoint(index)}
                                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addBulletPoint}
                    className="inline-flex items-center gap-2 mt-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Feature
                </button>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (initialData ? "Updating..." : "Creating...") : initialData ? "Update Package" : "Create Package"}
            </Button>
        </form>
    )
}
