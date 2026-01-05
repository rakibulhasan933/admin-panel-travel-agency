"use client"

import { Card } from "@/components/ui/card"
import { Check, Trash2, Edit } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { PackageDialog } from "./package-dialog"
import { PackageCard } from "./package-card"

interface Package {
    id: number
    image: string
    name: string
    description: string
    bulletPoints: string[]
    badge?: string
}

interface FeatureCardProps {
    id?: number
    icon: string
    title: string
    description: string
    bulletPoints: string[]
    packages?: Package[]
    onDelete?: (id: number) => void
    onEdit?: (id: number) => void
    onRefresh?: () => void
}

export function FeatureCard({
    id,
    icon,
    title,
    description,
    bulletPoints,
    packages = [],
    onDelete,
    onEdit,
    onRefresh,
}: FeatureCardProps) {
    const [editingPackageId, setEditingPackageId] = useState<number | null>(null)
    const { toast } = useToast()

    const handleDeletePackage = async (id: number) => {
        if (!confirm("Are you sure you want to delete this package?")) return

        try {
            const response = await fetch(`/api/admin/packages/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete package")

            toast({
                title: "Success",
                description: "Package deleted successfully",
            })
            onRefresh?.()
        } catch (error) {
            console.error("Error deleting package:", error)
            toast({
                title: "Error",
                description: "Failed to delete package",
                variant: "destructive",
            })
        }
    }

    const handleEditPackage = (packageId: number) => {
        setEditingPackageId(packageId)
    }

    const handleEditPackageComplete = () => {
        setEditingPackageId(null)
        onRefresh?.()
    }

    return (
        <div className="space-y-6">
            {/* Service Card */}
            <div className="relative group">
                <Card className="p-6 flex flex-row items-start gap-6 bg-card border border-border hover:border-primary/50 transition-colors rounded-lg">
                    <div className="text-5xl shrink-0 pt-1">{icon}</div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-bold mb-2 text-foreground">{title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{description}</p>
                        <ul className="space-y-2">
                            {bulletPoints.map((point, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                    <span className="text-sm text-muted-foreground">{point}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-lg font-semibold text-foreground">Packages</h4>
                                <PackageDialog
                                    serviceId={id as number}
                                    onPackageAdded={onRefresh || (() => { })}
                                    editingId={editingPackageId}
                                    title={title}
                                    editingPackage={packages?.find((p) => p?.id === editingPackageId)}
                                    onEditComplete={handleEditPackageComplete}
                                />
                            </div>

                            {packages.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {packages.map((pkg) => (
                                        <PackageCard key={pkg.id} {...pkg} onDelete={handleDeletePackage} onEdit={handleEditPackage} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground py-1">No packages yet. Add one to get started!</p>
                            )}
                        </div>
                    </div>
                </Card>
                {(onDelete || onEdit) && id !== undefined && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(id)}
                                className="p-2 bg-primary/80 hover:bg-primary text-primary-foreground rounded-md transition-all"
                                aria-label="Edit service"
                                title="Edit service"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(id)}
                                className="p-2 bg-destructive/80 hover:bg-destructive text-destructive-foreground rounded-md transition-all"
                                aria-label="Delete service"
                                title="Delete service"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
