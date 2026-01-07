"use client"

import { Card } from "@/components/ui/card"
import { Check, Trash2, Edit } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { PackageDialog } from "./package-dialog"
import { PackageCard } from "./package-card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "./ui/button"

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
        <div className="space-y-2">
            <div className="relative group">
                <Card className="p-6 flex flex-col lg:flex-row lg:items-start gap-6 bg-card border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                    <div className="text-4xl shrink-0 p-4 bg-primary/10 rounded-lg h-fit">{icon}</div>

                    <div className="flex-1 min-w-0 space-y-4">
                        <div>
                            <h3 className="text-2xl font-bold mb-2 text-foreground">{title}</h3>
                            <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
                        </div>

                        {bulletPoints.length > 0 && (
                            <ul className="space-y-2">
                                {bulletPoints.map((point, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                        <span className="text-sm text-muted-foreground">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="pt-4 space-y-4">
                            <PackageDialog
                                serviceId={id as number}
                                onPackageAdded={onRefresh || (() => { })}
                                editingId={editingPackageId}
                                title={title}
                                editingPackage={packages?.find((p) => p?.id === editingPackageId)}
                                onEditComplete={handleEditPackageComplete}
                            />

                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <div className="space-y-3">
                                        <AccordionTrigger className="p-0 hover:bg-transparent focus:bg-transparent focus:ring-0">
                                            <Button
                                                size={"default"}
                                                variant={"outline"}
                                                className="text-base font-semibold text-foreground"
                                            >
                                                View {packages.length} Package{packages.length !== 1 ? "s" : ""}
                                            </Button>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            {packages.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                                                    {packages.map((pkg) => (
                                                        <PackageCard
                                                            key={pkg.id}
                                                            {...pkg}
                                                            onDelete={handleDeletePackage}
                                                            onEdit={handleEditPackage}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground py-4">No packages yet. Add one to get started!</p>
                                            )}
                                        </AccordionContent>
                                    </div>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </Card>

                {(onDelete || onEdit) && id !== undefined && (
                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(id)}
                                className="p-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all hover:shadow-md active:scale-95"
                                aria-label="Edit service"
                                title="Edit service"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(id)}
                                className="p-2.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-all hover:shadow-md active:scale-95"
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
