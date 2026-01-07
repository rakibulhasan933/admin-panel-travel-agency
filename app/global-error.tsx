"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <main className="min-h-screen py-20 md:py-24 flex items-center justify-center bg-slate-50">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                            {/* Warning icon */}
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-red-100 flex items-center justify-center mb-6 md:mb-8">
                                <AlertTriangle className="w-12 h-12 md:w-16 md:h-16 text-red-500" />
                            </div>

                            {/* Error message */}
                            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-3 md:mb-4">Critical Error</h1>
                            <p className="text-sm md:text-lg text-slate-600 mb-6 md:mb-8 max-w-md leading-relaxed">
                                A critical error occurred. Please try refreshing the page.
                            </p>

                            {/* Error ID */}
                            {error.digest && (
                                <div className="mb-6 md:mb-8 px-4 py-2 bg-slate-200 rounded-lg">
                                    <p className="text-xs text-slate-500 font-mono">Error ID: {error.digest}</p>
                                </div>
                            )}

                            {/* Retry button */}
                            <Button onClick={reset} size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </Button>
                        </div>
                    </div>
                </main>
            </body>
        </html>
    )
}
