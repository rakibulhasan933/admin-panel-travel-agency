"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, ChevronRight, Check, AlertCircle } from "lucide-react"
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

interface ValidationErrors {
    [key: string]: string
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

    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
    const [errors, setErrors] = useState<ValidationErrors>({})

    useEffect(() => {
        fetchMetadata()
    }, [])

    const fetchMetadata = async () => {
        try {
            const response = await fetch("/api/metadata")
            const data = await response.json()

            if (!data.metadata || data.metadata.length === 0) {
                // No data in database yet, just set loading to false
                setIsLoading(false)
                return
            }

            // Map the metadata array to form data
            const metadataMap: Record<string, string> = {}
            data.metadata.forEach((item: { key: string; value: string }) => {
                metadataMap[item.key] = item.value
            })

            setFormData({
                siteUrl: metadataMap["siteUrl"] || "",
                titleDefault: metadataMap["titleDefault"] || "",
                titleTemplate: metadataMap["titleTemplate"] || "",
                description: metadataMap["description"] || "",
                siteName: metadataMap["siteName"] || "",
                logoUrl: metadataMap["logoUrl"] || "",
                ogTitle: metadataMap["ogTitle"] || "",
                ogDescription: metadataMap["ogDescription"] || "",
                ogImageUrl: metadataMap["ogImageUrl"] || "",
                twitterTitle: metadataMap["twitterTitle"] || "",
                twitterDescription: metadataMap["twitterDescription"] || "",
                canonicalUrl: metadataMap["canonicalUrl"] || "",
                category: metadataMap["category"] || "",
                creator: metadataMap["creator"] || "",
                publisher: metadataMap["publisher"] || "",
                keywords: data.keywords || [],
            })
        } catch (error) {
            console.error("[v0] Error fetching metadata:", error)
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
        e.preventDefault();

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
                // Reset to first step after successful save
            } else {
                const error = await response.json()
                setMessage({ type: "error", text: error.error || "Failed to save metadata" })
            }
        } catch (error) {
            console.error("[v0] Error saving metadata:", error)
            setMessage({ type: "error", text: "Error saving metadata" })
        } finally {
            setIsSaving(false)
        }
    }

    const validateStep = (step: number): boolean => {
        const newErrors: ValidationErrors = {}

        if (step === 1) {
            // Step 1: Basic Info - All fields required
            if (!formData.siteUrl?.trim()) {
                newErrors.siteUrl = "Site URL is required"
            } else if (!/^https?:\/\/.+/.test(formData.siteUrl)) {
                newErrors.siteUrl = "Please enter a valid URL (e.g., https://example.com)"
            }

            if (!formData.siteName?.trim()) {
                newErrors.siteName = "Site Name is required"
            }

            if (!formData.description?.trim()) {
                newErrors.description = "Site Description is required"
            } else if (formData.description.length < 10) {
                newErrors.description = "Description must be at least 10 characters"
            }

            if (!formData.category?.trim()) {
                newErrors.category = "Category is required"
            }

            if (!formData.logoUrl?.trim()) {
                newErrors.logoUrl = "Site Logo / Featured Image is required"
            }
        } else if (step === 2) {
            // Step 2: SEO Settings - All fields required
            if (!formData.titleDefault?.trim()) {
                newErrors.titleDefault = "Default Page Title is required"
            }

            if (!formData.titleTemplate?.trim()) {
                newErrors.titleTemplate = "Title Template is required"
            }

            if (!formData.canonicalUrl?.trim()) {
                newErrors.canonicalUrl = "Canonical URL is required"
            }

            if (formData.keywords.length === 0) {
                newErrors.keywords = "At least one keyword is required"
            } else if (formData.keywords.some((k) => !k.trim())) {
                newErrors.keywords = "All keywords must be filled"
            }

            if (!formData.creator?.trim()) {
                newErrors.creator = "Creator/Author is required"
            }

            if (!formData.publisher?.trim()) {
                newErrors.publisher = "Publisher is required"
            }
        } else if (step === 3) {
            // Step 3: Social Media - All fields required
            if (!formData.ogTitle?.trim()) {
                newErrors.ogTitle = "OG Title is required"
            }

            if (!formData.ogDescription?.trim()) {
                newErrors.ogDescription = "OG Description is required"
            }

            if (!formData.ogImageUrl?.trim()) {
                newErrors.ogImageUrl = "OG Image URL is required"
            }

            if (!formData.twitterTitle?.trim()) {
                newErrors.twitterTitle = "Twitter Title is required"
            }

            if (!formData.twitterDescription?.trim()) {
                newErrors.twitterDescription = "Twitter Description is required"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1)
            setErrors({})
        }
    }

    const handlePreviousStep = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentStep(Math.max(1, currentStep - 1))
        setErrors({})
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        )
    }

    const StepIndicator = ({ step }: { step: number }) => (
        <div className="flex justify-between mb-8">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex flex-col items-center flex-1">
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${s < step
                            ? "bg-accent text-white"
                            : s === step
                                ? "bg-primary text-white"
                                : "bg-neutral-200 text-neutral-600"
                            }`}
                    >
                        {s < step ? <Check className="w-5 h-5" /> : s}
                    </div>
                    <span className="text-sm font-medium text-center">
                        {s === 1 ? "Basic Info" : s === 2 ? "SEO Settings" : "Social Media"}
                    </span>
                    {s < 3 && (
                        <div
                            className={`hidden md:block absolute w-24 h-1 mt-5 transition-all ${s < step ? "bg-accent" : "bg-neutral-200"
                                }`}
                            style={{ marginLeft: "2rem" }}
                        />
                    )}
                </div>
            ))}
        </div>
    )

    const FormError = ({ message }: { message?: string }) => {
        if (!message) return null
        return (
            <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                <span>{message}</span>
            </div>
        )
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                if (validateStep(currentStep)) {
                    handleSubmit(e)
                }
            }}
            className="space-y-8"
        >
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

            <StepIndicator step={currentStep} />

            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
                <Card className="border-2 border-primary/20 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                        <CardTitle className="text-2xl">Basic Information</CardTitle>
                        <CardDescription>Let's start with your site's essential details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div>
                            <ImageUpload
                                label="Site Logo / Featured Image"
                                onImageUrl={(url) => setFormData({ ...formData, logoUrl: url })}
                                preview={formData.logoUrl}
                                required
                            />
                            <FormError message={errors.logoUrl} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="siteUrl" className="font-semibold">
                                    Site URL <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="siteUrl"
                                    value={formData.siteUrl}
                                    onChange={(e) => {
                                        handleInputChange("siteUrl", e.target.value)
                                        if (errors.siteUrl) setErrors({ ...errors, siteUrl: "" })
                                    }}
                                    placeholder="https://example.com"
                                    className={`mt-2 ${errors.siteUrl ? "border-red-500" : ""}`}
                                />
                                <FormError message={errors.siteUrl} />
                            </div>
                            <div>
                                <Label htmlFor="siteName" className="font-semibold">
                                    Site Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="siteName"
                                    value={formData.siteName}
                                    onChange={(e) => {
                                        handleInputChange("siteName", e.target.value)
                                        if (errors.siteName) setErrors({ ...errors, siteName: "" })
                                    }}
                                    placeholder="Your Site Name"
                                    className={`mt-2 ${errors.siteName ? "border-red-500" : ""}`}
                                />
                                <FormError message={errors.siteName} />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description" className="font-semibold">
                                Site Description <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => {
                                    handleInputChange("description", e.target.value)
                                    if (errors.description) setErrors({ ...errors, description: "" })
                                }}
                                placeholder="Brief description of your site"
                                rows={4}
                                className={`mt-2 ${errors.description ? "border-red-500" : ""}`}
                            />
                            <FormError message={errors.description} />
                        </div>

                        <div>
                            <Label htmlFor="category" className="font-semibold">
                                Category <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="category"
                                value={formData.category}
                                onChange={(e) => {
                                    handleInputChange("category", e.target.value)
                                    if (errors.category) setErrors({ ...errors, category: "" })
                                }}
                                placeholder="e.g., travel, technology, business"
                                className={`mt-2 ${errors.category ? "border-red-500" : ""}`}
                            />
                            <FormError message={errors.category} />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: SEO Settings */}
            {currentStep === 2 && (
                <Card className="border-2 border-primary/20 shadow-lg">
                    <CardHeader className="bg-linear-r from-primary/5 to-accent/5">
                        <CardTitle className="text-2xl">SEO Settings</CardTitle>
                        <CardDescription>Optimize your site for search engines</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="titleDefault" className="font-semibold">
                                    Default Page Title <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="titleDefault"
                                    value={formData.titleDefault}
                                    onChange={(e) => {
                                        handleInputChange("titleDefault", e.target.value)
                                        if (errors.titleDefault) setErrors({ ...errors, titleDefault: "" })
                                    }}
                                    placeholder="Page Title"
                                    className={`mt-2 ${errors.titleDefault ? "border-red-500" : ""}`}
                                />
                                <FormError message={errors.titleDefault} />
                            </div>
                            <div>
                                <Label htmlFor="titleTemplate" className="font-semibold">
                                    Title Template <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="titleTemplate"
                                    value={formData.titleTemplate}
                                    onChange={(e) => {
                                        handleInputChange("titleTemplate", e.target.value)
                                        if (errors.titleTemplate) setErrors({ ...errors, titleTemplate: "" })
                                    }}
                                    placeholder="%s | Site Name"
                                    className={`mt-2 ${errors.titleTemplate ? "border-red-500" : ""}`}
                                />
                                <p className="text-xs text-muted-foreground mt-1">Use %s as placeholder for page title</p>
                                <FormError message={errors.titleTemplate} />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="canonicalUrl" className="font-semibold">
                                Canonical URL <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="canonicalUrl"
                                value={formData.canonicalUrl}
                                onChange={(e) => {
                                    handleInputChange("canonicalUrl", e.target.value)
                                    if (errors.canonicalUrl) setErrors({ ...errors, canonicalUrl: "" })
                                }}
                                placeholder="/"
                                className={`mt-2 ${errors.canonicalUrl ? "border-red-500" : ""}`}
                            />
                            <FormError message={errors.canonicalUrl} />
                        </div>

                        <div>
                            <Label className="font-semibold">
                                Keywords <span className="text-red-500">*</span>
                            </Label>
                            <div className="space-y-2 mt-2">
                                {formData.keywords.map((keyword, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={keyword}
                                            onChange={(e) => {
                                                handleKeywordChange(index, e.target.value)
                                                if (errors.keywords) setErrors({ ...errors, keywords: "" })
                                            }}
                                            placeholder={`Keyword ${index + 1}`}
                                            className={errors.keywords ? "border-red-500" : ""}
                                        />
                                        <Button type="button" variant="outline" onClick={() => removeKeyword(index)}>
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addKeyword}
                                    className="w-full bg-transparent"
                                >
                                    + Add Keyword
                                </Button>
                            </div>
                            <FormError message={errors.keywords} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="creator" className="font-semibold">
                                    Creator/Author <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="creator"
                                    value={formData.creator}
                                    onChange={(e) => {
                                        handleInputChange("creator", e.target.value)
                                        if (errors.creator) setErrors({ ...errors, creator: "" })
                                    }}
                                    className={`mt-2 ${errors.creator ? "border-red-500" : ""}`}
                                />
                                <FormError message={errors.creator} />
                            </div>
                            <div>
                                <Label htmlFor="publisher" className="font-semibold">
                                    Publisher <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="publisher"
                                    value={formData.publisher}
                                    onChange={(e) => {
                                        handleInputChange("publisher", e.target.value)
                                        if (errors.publisher) setErrors({ ...errors, publisher: "" })
                                    }}
                                    className={`mt-2 ${errors.publisher ? "border-red-500" : ""}`}
                                />
                                <FormError message={errors.publisher} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Social Media */}
            {currentStep === 3 && (
                <div className="space-y-6">
                    <Card className="border-2 border-primary/20 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                            <CardTitle className="text-2xl">Open Graph</CardTitle>
                            <CardDescription>Configure social media sharing</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div>
                                <Label htmlFor="ogTitle" className="font-semibold">
                                    OG Title <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="ogTitle"
                                    value={formData.ogTitle}
                                    onChange={(e) => {
                                        handleInputChange("ogTitle", e.target.value)
                                        if (errors.ogTitle) setErrors({ ...errors, ogTitle: "" })
                                    }}
                                    className={`mt-2 ${errors.ogTitle ? "border-red-500" : ""}`}
                                />
                                <FormError message={errors.ogTitle} />
                            </div>
                            <div>
                                <Label htmlFor="ogDescription" className="font-semibold">
                                    OG Description <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="ogDescription"
                                    value={formData.ogDescription}
                                    onChange={(e) => {
                                        handleInputChange("ogDescription", e.target.value)
                                        if (errors.ogDescription) setErrors({ ...errors, ogDescription: "" })
                                    }}
                                    rows={3}
                                    className={`mt-2 ${errors.ogDescription ? "border-red-500" : ""}`}
                                />
                                <FormError message={errors.ogDescription} />
                            </div>
                            <div>
                                <ImageUpload
                                    label="OG Image"
                                    onImageUrl={(url) => setFormData({ ...formData, ogImageUrl: url })}
                                    preview={formData.ogImageUrl}
                                    required
                                />
                                <FormError message={errors.ogImageUrl} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-primary/20 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                            <CardTitle className="text-2xl">Twitter Card</CardTitle>
                            <CardDescription>Configure Twitter sharing settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div>
                                <Label htmlFor="twitterTitle" className="font-semibold">
                                    Twitter Title <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="twitterTitle"
                                    value={formData.twitterTitle}
                                    onChange={(e) => {
                                        handleInputChange("twitterTitle", e.target.value)
                                        if (errors.twitterTitle) setErrors({ ...errors, twitterTitle: "" })
                                    }}
                                    className={`mt-2 ${errors.twitterTitle ? "border-red-500" : ""}`}
                                />
                                <FormError message={errors.twitterTitle} />
                            </div>
                            <div>
                                <Label htmlFor="twitterDescription" className="font-semibold">
                                    Twitter Description <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="twitterDescription"
                                    value={formData.twitterDescription}
                                    onChange={(e) => {
                                        handleInputChange("twitterDescription", e.target.value)
                                        if (errors.twitterDescription) setErrors({ ...errors, twitterDescription: "" })
                                    }}
                                    rows={3}
                                    className={`mt-2 ${errors.twitterDescription ? "border-red-500" : ""}`}
                                />
                                <FormError message={errors.twitterDescription} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 justify-between pt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1}
                    className="px-6 bg-transparent"
                >
                    Previous
                </Button>

                {currentStep < 3 ? (
                    <Button type="button" onClick={handleNextStep} className="px-6 gap-2">
                        Next <ChevronRight className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button type="submit" disabled={isSaving} className="px-6 gap-2">
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                Save & Submit <Check className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                )}
            </div>
        </form>
    )
}