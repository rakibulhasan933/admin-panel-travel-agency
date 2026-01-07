"use client"

import { useEffect, useState } from "react"
import { ServicesDialog } from "@/components/services-dialog"
import { FeatureCard } from "@/components/feature-card"
import { Loader2, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Package {
  id: number
  image: string
  name: string
  description: string
  bulletPoints: string[]
  serviceId: number
}

interface FeatureCardData {
  id: number
  icon: string
  title: string
  description: string
  bulletPoints: string[]
  url: string
  packages?: Package[]
}

export default function ServicesPage() {
  const [cards, setCards] = useState<FeatureCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const { toast } = useToast()

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/services")
      if (!response.ok) throw new Error("Failed to fetch services")
      const data = await response.json()
      setCards(data.data)
    } catch (error) {
      console.error("Error fetching services:", error)
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleRemoveCard = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete service")

      setCards(cards.filter((card) => card.id !== id))
      toast({
        title: "Success",
        description: "Service deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting service:", error)
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      })
    }
  }

  const handleEditCard = (id: number) => {
    setEditingId(id)
  }

  const handleEditComplete = () => {
    setEditingId(null)
    fetchServices()
  }

  return (
    <main className="min-h-screen bg-background px-4 md:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">Services Management</h1>
                <p className="text-muted-foreground text-sm md:text-base mt-1">
                  Create and manage travel services and packages
                </p>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <ServicesDialog
              onServiceAdded={fetchServices}
              editingId={editingId}
              editingCard={editingId ? cards.find((c) => c.id === editingId) : undefined}
              onEditComplete={handleEditComplete}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center space-y-3">
              <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Loading services...</p>
            </div>
          </div>
        ) : cards.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 gap-6">
              {cards.map((card, index) => (
                <div key={card.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <FeatureCard
                    {...card}
                    onDelete={handleRemoveCard}
                    onEdit={handleEditCard}
                    onRefresh={fetchServices}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4 max-w-md">
              <div className="p-4 bg-accent/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No services yet</h3>
              <p className="text-muted-foreground text-sm">
                Create your first service to get started. You can manage multiple travel services and their packages
                from here.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
