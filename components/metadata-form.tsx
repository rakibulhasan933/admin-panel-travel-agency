"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { ImageUpload } from "./image-upload"

export interface MetadataFormData {
    siteUrl: string
    titleDefault: string
    titleTemplate: string
    description: string
    siteName: string
    logoUrl: string
    ogTitle: string
    ogDescription: string
    ogImageUrl: string
    twitterTitle: string
    twitterDescription: string
    canonicalUrl: string
    category: string
    creator: string
    publisher: string
    keywords: string[]
}

export function MetadataForm() {
    const [formData, setFormData] = useState<MetadataFormData>({
        siteUrl: "",
        titleDefault: "",
        titleTemplate: "",
        description: "",
        siteName: "",
        logoUrl: "",
        ogTitle: "",
        ogDescription: "",
        ogImageUrl: "",
        twitterTitle: "",
        twitterDescription: "",
        canonicalUrl: "",
        category: "",
        creator: "",
        publisher: "",
        keywords: [],
    })

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

    useEffect(() => {
        fetchMetadata()
    }, [])

    const fetchMetadata = async () => {
        try {
            const response = await fetch("/api/metadata")
            const data = await response.json()

            const metadataMap: Record<string, string> = {}
            data.metadata.forEach((item: any) => {
                metadataMap[item.key] = item.value
            })

            setFormData({
                siteUrl: metadataMap["site_url"] || "",
                titleDefault: metadataMap["title_default"] || "",
                titleTemplate: metadataMap["title_template"] || "",
                description: metadataMap["description"] || "",
                siteName: metadataMap["site_name"] || "",
                logoUrl: metadataMap["logo_url"] || "",
                ogTitle: metadataMap["og_title"] || "",
                ogDescription: metadataMap["og_description"] || "",
                ogImageUrl: metadataMap["og_image_url"] || "",
                twitterTitle: metadataMap["twitter_title"] || "",
                twitterDescription: metadataMap["twitter_description"] || "",
                canonicalUrl: metadataMap["canonical_url"] || "",
                category: metadataMap["category"] || "",
                creator: metadataMap["creator"] || "",
                publisher: metadataMap["publisher"] || "",
                keywords: data.keywords || [],
            })
        } catch (error) {
            console.error(" Error fetching metadata:", error)
            setMessage({ type: "error", text: "Failed to load metadata" })
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: keyof Omit<MetadataFormData, "keywords">, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }))
    }

    const handleKeywordChange = (index: number, value: string) => {
        setFormData((prev: any) => {
            const newKeywords = [...prev.keywords]
            newKeywords[index] = value
            return { ...prev, keywords: newKeywords }
        })
    }

    const addKeyword = () => {
        setFormData((prev: any) => ({ ...prev, keywords: [...prev.keywords, ""] }))
    }

    const removeKeyword = (index: number) => {
        setFormData((prev: any) => ({
            ...prev,
            keywords: prev.keywords.filter((_: any, i: number) => i !== index),
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setIsSaving(true)
        setMessage(null)

        try {
            const response = await fetch("/api/metadata", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                setMessage({ type: "success", text: "Metadata saved successfully!" })
            } else {
                const error = await response.json()
                setMessage({ type: "error", text: error.error || "Failed to save metadata" })
            }
        } catch (error) {
            console.error(" Error saving metadata:", error)
            setMessage({ type: "error", text: "Error saving metadata" })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
                <div
                    className={`p-4 rounded-lg ${message.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="seo">SEO Settings</TabsTrigger>
                    <TabsTrigger value="social">Social Media</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Metadata</CardTitle>
                            <CardDescription>Manage your site's basic information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            <div>
                                <ImageUpload
                                    label="Blog Featured Image *"
                                    onImageUrl={(url) => setFormData({ ...formData, logoUrl: url })}
                                    preview={formData.logoUrl}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="siteUrl">Site URL</Label>
                                <Input
                                    id="siteUrl"
                                    value={formData.siteUrl}
                                    onChange={(e) => handleInputChange("siteUrl", e.target.value)}
                                    placeholder="https://example.com"
                                />
                            </div>
                            <div>
                                <Label htmlFor="siteName">Site Name</Label>
                                <Input
                                    id="siteName"
                                    value={formData.siteName}
                                    onChange={(e) => handleInputChange("siteName", e.target.value)}
                                    placeholder="Your Site Name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Site Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    placeholder="Brief description of your site"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) => handleInputChange("category", e.target.value)}
                                    placeholder="e.g., travel, technology, business"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="seo" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>SEO Settings</CardTitle>
                            <CardDescription>Configure search engine optimization</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="titleDefault">Default Page Title</Label>
                                <Input
                                    id="titleDefault"
                                    value={formData.titleDefault}
                                    onChange={(e) => handleInputChange("titleDefault", e.target.value)}
                                    placeholder="Page Title"
                                />
                            </div>
                            <div>
                                <Label htmlFor="titleTemplate">Title Template</Label>
                                <Input
                                    id="titleTemplate"
                                    value={formData.titleTemplate}
                                    onChange={(e) => handleInputChange("titleTemplate", e.target.value)}
                                    placeholder="%s | Site Name"
                                />
                                <p className="text-sm text-muted-foreground mt-1">Use %s as placeholder for page title</p>
                            </div>
                            <div>
                                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                                <Input
                                    id="canonicalUrl"
                                    value={formData.canonicalUrl}
                                    onChange={(e) => handleInputChange("canonicalUrl", e.target.value)}
                                    placeholder="/"
                                />
                            </div>
                            <div>
                                <Label>Keywords</Label>
                                <div className="space-y-2">
                                    {formData.keywords.map((keyword, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={keyword}
                                                onChange={(e) => handleKeywordChange(index, e.target.value)}
                                                placeholder={`Keyword ${index + 1}`}
                                            />
                                            <Button type="button" variant="outline" onClick={() => removeKeyword(index)}>
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" onClick={addKeyword} className="w-full bg-transparent">
                                        Add Keyword
                                    </Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="creator">Creator/Author</Label>
                                    <Input
                                        id="creator"
                                        value={formData.creator}
                                        onChange={(e) => handleInputChange("creator", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="publisher">Publisher</Label>
                                    <Input
                                        id="publisher"
                                        value={formData.publisher}
                                        onChange={(e) => handleInputChange("publisher", e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="social" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Open Graph</CardTitle>
                            <CardDescription>Configure social media sharing</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="ogTitle">OG Title</Label>
                                <Input
                                    id="ogTitle"
                                    value={formData.ogTitle}
                                    onChange={(e) => handleInputChange("ogTitle", e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="ogDescription">OG Description</Label>
                                <Textarea
                                    id="ogDescription"
                                    value={formData.ogDescription}
                                    onChange={(e) => handleInputChange("ogDescription", e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div>
                                <Label htmlFor="ogImageUrl">OG Image URL</Label>
                                <Input
                                    id="ogImageUrl"
                                    value={formData.ogImageUrl}
                                    onChange={(e) => handleInputChange("ogImageUrl", e.target.value)}
                                    placeholder="https://example.com/image.png"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Twitter Card</CardTitle>
                            <CardDescription>Configure Twitter sharing settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="twitterTitle">Twitter Title</Label>
                                <Input
                                    id="twitterTitle"
                                    value={formData.twitterTitle}
                                    onChange={(e) => handleInputChange("twitterTitle", e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="twitterDescription">Twitter Description</Label>
                                <Textarea
                                    id="twitterDescription"
                                    value={formData.twitterDescription}
                                    onChange={(e) => handleInputChange("twitterDescription", e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    "Save Metadata"
                )}
            </Button>
        </form>
    )
}
