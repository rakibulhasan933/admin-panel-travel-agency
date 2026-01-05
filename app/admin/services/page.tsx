"use client"

import { useEffect, useState } from "react"
import { ServicesDialog } from "@/components/services-dialog"
import { FeatureCard } from "@/components/feature-card"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Package {
  id: number
  image: string
  name: string
  description: string
  bulletPoints: string[]
  badge?: string
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

export default function Home() {
  const [cards, setCards] = useState<FeatureCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const { toast } = useToast()

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/services")
      if (!response.ok) throw new Error("Failed to fetch services")
      const data = await response.json();
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
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Services</h1>
          <p className="text-muted-foreground text-lg">Manage and showcase your services</p>
        </div>

        <div className="mb-12 flex justify-start">
          <ServicesDialog
            onServiceAdded={fetchServices}
            editingId={editingId}
            editingCard={editingId ? cards.find((c) => c.id === editingId) : undefined}
            onEditComplete={handleEditComplete}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : cards.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-foreground">Available Services</h2>
            <div className="grid grid-cols-1 gap-6">
              {cards.map((card) => (
                <FeatureCard
                  key={card.id}
                  {...card}
                  onDelete={handleRemoveCard}
                  onEdit={handleEditCard}
                  onRefresh={fetchServices}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No services yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </main>
  )
}
