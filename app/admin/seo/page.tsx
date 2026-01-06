"use client"

import type React from "react"
import { useCallback, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Plus, Edit2, Trash2, Search, Loader } from "lucide-react"
import useSWR from "swr"

interface SEOPage {
  id: number
  pagePath: string
  pageTitle: string
  metaDescription: string
  keywords: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonicalUrl?: string
}

interface FormData extends Omit<SEOPage, "id"> {
  id?: number
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
}

export default function SEOManagementPage() {
  const { data: response, isLoading, mutate } = useSWR("/api/admin/seo", fetcher)
  const pages = response?.data || []

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    pagePath: "",
    pageTitle: "",
    metaDescription: "",
    keywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    canonicalUrl: "",
  })

  const filteredPages = useMemo(
    () =>
      pages.filter(
        (page: SEOPage) =>
          page.pagePath.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.pageTitle.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [pages, searchQuery],
  )

  const handleOpenDialog = useCallback((page?: SEOPage) => {
    if (page) {
      setFormData({
        id: page.id,
        pagePath: page.pagePath,
        pageTitle: page.pageTitle,
        metaDescription: page.metaDescription,
        keywords: page.keywords,
        ogTitle: page.ogTitle || "",
        ogDescription: page.ogDescription || "",
        ogImage: page.ogImage || "",
        canonicalUrl: page.canonicalUrl || "",
      })
      setEditingId(page.id)
    } else {
      setFormData({
        pagePath: "",
        pageTitle: "",
        metaDescription: "",
        keywords: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        canonicalUrl: "",
      })
      setEditingId(null)
    }
    setIsOpen(true)
  }, [])

  const handleCloseDialog = useCallback(() => {
    setIsOpen(false)
    setEditingId(null)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingId ? `/api/admin/seo/${editingId}` : "/api/admin/seo"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error()

      toast.success(editingId ? "SEO page updated successfully" : "SEO page created successfully")
      handleCloseDialog()
      mutate() // Revalidate the data
    } catch (error) {
      toast.error(editingId ? "Failed to update SEO page" : "Failed to create SEO page")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this SEO page?")) return

    try {
      const response = await fetch(`/api/admin/seo/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error()
      toast.success("SEO page deleted successfully")
      mutate()
    } catch (error) {
      toast.error("Failed to delete SEO page")
    }
  }

  const getCharacterCount = (text: string, max: number) => {
    return `${text.length}/${max}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading SEO pages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">SEO Management</h1>
          <p className="text-muted-foreground mt-2">Manage SEO tags and metadata for all pages</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shrink-0" onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4" />
              New Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit SEO Page" : "Create New SEO Page"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic SEO Fields */}
              <div className="space-y-4 border-b pb-4">
                <h3 className="text-sm font-semibold text-foreground">Basic SEO</h3>
                <div>
                  <Label htmlFor="pagePath">Page Path *</Label>
                  <Input
                    id="pagePath"
                    placeholder="/"
                    value={formData.pagePath}
                    onChange={(e) => setFormData({ ...formData, pagePath: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pageTitle">Page Title *</Label>
                  <div className="space-y-1">
                    <Input
                      id="pageTitle"
                      placeholder="Enter page title"
                      value={formData.pageTitle}
                      onChange={(e) => setFormData({ ...formData, pageTitle: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended: 30-60 characters ({formData.pageTitle.length})
                    </p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="metaDescription">Meta Description *</Label>
                  <div className="space-y-1">
                    <Textarea
                      id="metaDescription"
                      placeholder="Enter meta description"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      required
                      rows={2}
                      maxLength={160}
                    />
                    <p className="text-xs text-muted-foreground">
                      {getCharacterCount(formData.metaDescription, 160)} (Max 160)
                    </p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    placeholder="Enter keywords separated by commas"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  />
                </div>
              </div>

              {/* Open Graph Fields */}
              <div className="space-y-4 border-b pb-4">
                <h3 className="text-sm font-semibold text-foreground">Open Graph (Social Sharing)</h3>
                <div>
                  <Label htmlFor="ogTitle">OG Title</Label>
                  <Input
                    id="ogTitle"
                    placeholder="Optional: Custom title for social media"
                    value={formData.ogTitle}
                    onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="ogDescription">OG Description</Label>
                  <Textarea
                    id="ogDescription"
                    placeholder="Optional: Custom description for social media"
                    value={formData.ogDescription}
                    onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="ogImage">OG Image URL</Label>
                  <Input
                    id="ogImage"
                    placeholder="https://example.com/image.jpg"
                    value={formData.ogImage}
                    onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                  />
                </div>
              </div>

              {/* Advanced Fields */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Advanced</h3>
                <div>
                  <Label htmlFor="canonicalUrl">Canonical URL</Label>
                  <Input
                    id="canonicalUrl"
                    placeholder="https://example.com/page"
                    value={formData.canonicalUrl}
                    onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save SEO Page"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* Pages List */}
      <div className="space-y-3">
        {filteredPages.length === 0 ? (
          <Card>
            <CardContent className="p-8">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground font-medium">
                  {searchQuery ? "No pages found matching your search" : "No SEO pages yet"}
                </p>
                {!searchQuery && (
                  <p className="text-sm text-muted-foreground">
                    Click "New Page" to create your first SEO configuration
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredPages.map((page: SEOPage) => (
            <Card key={page.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg text-foreground break-all">{page.pagePath}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">SEO Configured</span>
                    </div>
                    <p className="text-sm font-medium text-foreground mt-3 line-clamp-1">{page.pageTitle}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{page.metaDescription}</p>
                    {page.keywords && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {page.keywords.split(",").map((keyword, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded truncate"
                          >
                            {keyword.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(page)} className="gap-2">
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(page.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {filteredPages.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Pages</p>
                <p className="text-2xl font-bold mt-1">{pages.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Configured</p>
                <p className="text-2xl font-bold mt-1">{filteredPages.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Missing Keywords</p>
                <p className="text-2xl font-bold mt-1">{pages.filter((p: SEOPage) => !p.keywords).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
