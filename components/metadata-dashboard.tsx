"use client"

import { MetadataForm } from "./metadata-form"


export default function MetadataDashboard() {
    return (
        <main className="min-h-screen bg-linear-to-br from-background via-background to-accent/5">
            <div className="container mx-auto py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-12 text-center">
                        <h1 className="text-5xl font-bold tracking-tight text-foreground mb-2">Website Metadata Manager</h1>
                        <p className="text-lg text-muted-foreground">
                            Configure your site's SEO, social media, and general metadata in just 3 easy steps
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-card rounded-2xl shadow-xl p-8 border border-border/50">
                        <MetadataForm />
                    </div>
                </div>
            </div>
        </main>
    )
}
