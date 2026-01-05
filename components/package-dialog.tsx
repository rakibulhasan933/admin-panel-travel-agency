"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PackageForm } from "./package-form"

interface PackageData {
    id?: number
    image: string
    name: string
    description: string
    bulletPoints: string[]
    badge?: string
}


interface PackageDialogProps {
    serviceId: number
    onPackageAdded: () => void
    editingId?: number | null
    editingPackage?: PackageData
    onEditComplete?: () => void
    title: string
}

export function PackageDialog({
    serviceId,
    onPackageAdded,
    editingId,
    title,
    editingPackage,
    onEditComplete,
}: PackageDialogProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const isEditMode = editingId && editingPackage

    const handleSubmit = async (data: PackageData) => {
        setIsLoading(true)
        try {
            if (isEditMode) {
                console.log('edit packages')
                const response = await fetch(`/api/admin/packages/${editingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })

                if (!response.ok) throw new Error("Failed to update package")

                toast({
                    title: "Success",
                    description: "Package updated successfully",
                })
            } else {
                console.log('create packages')
                const response = await fetch(`/api/admin/packages`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })

                if (!response.ok) throw new Error("Failed to create package")

                toast({
                    title: "Success",
                    description: "Package created successfully",
                })
            }

            setOpen(false)
            if (isEditMode && onEditComplete) {
                onEditComplete()
            } else {
                onPackageAdded()
            }
        } catch (error) {
            console.error("Error saving package:", error)
            toast({
                title: "Error",
                description: isEditMode ? "Failed to update package" : "Failed to create package",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (isEditMode && !open) {
        setOpen(true)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                    <Plus className="w-4 h-4" />
                    Add Package
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? `Edit Package (${title})` : `Create New Package (${title})`}</DialogTitle>
                </DialogHeader>
                <PackageForm onSubmit={handleSubmit} isLoading={isLoading} serviceId={serviceId as number} initialData={editingPackage} />
            </DialogContent>
        </Dialog>
    )
}