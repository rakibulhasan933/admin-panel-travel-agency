"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

interface HeroSlider {
  id: number
  title: string
  subtitle: string
  image: string
}

export default function HeroSliderPage() {
  const [sliders, setSliders] = useState<HeroSlider[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    active: true,
  })

  useEffect(() => {
    fetchSliders()
  }, [])

  const fetchSliders = async () => {
    try {
      const response = await fetch("/api/admin/hero-sliders")
      const data = await response.json()
      setSliders(data.data || [])
    } catch (error) {
      toast.error("Failed to fetch sliders")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingId ? `/api/admin/hero-sliders/${editingId}` : "/api/admin/hero-sliders"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error()

      toast.success(editingId ? "Slider updated" : "Slider created")
      setFormData({ title: "", subtitle: "", image: "", active: true })
      setEditingId(null)
      setIsOpen(false)
      fetchSliders()
    } catch (error) {
      toast.error("Failed to save slider")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return

    try {
      const response = await fetch(`/api/admin/hero-sliders/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error()
      toast.success("Slider deleted")
      fetchSliders()
    } catch (error) {
      toast.error("Failed to delete slider")
    }
  }

  const handleEdit = (slider: HeroSlider) => {
    setFormData({
      title: slider.title,
      subtitle: slider.subtitle,
      image: slider.image,
      active: true,
    })
    setEditingId(slider.id)
    setIsOpen(true)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hero Slider Management</h1>
          <p className="text-gray-600 mt-2">Manage homepage hero section slides</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Slide" : "Create New Slide"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>
              <div>
                <ImageUpload
                  label="Image (Recommended size: 1920x1080px) 16:9"
                  onImageUrl={(url) => setFormData({ ...formData, image: url })}
                  preview={formData.image}
                  required
                />
              </div>
              <Button type="submit">Save Slide</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {sliders.map((slider) => (
          <Card key={slider.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <img
                  src={slider.image || "/placeholder.svg"}
                  alt={slider.title}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{slider.title}</h3>
                  <p className="text-sm text-gray-600">{slider.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(slider)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(slider.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
