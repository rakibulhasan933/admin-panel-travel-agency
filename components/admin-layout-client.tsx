"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LogOut, Menu, X, ChevronRight, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { LucideIcon } from "lucide-react"
import { LayoutDashboard, ImageIcon, Package, MessageSquare, BookOpen, Star } from "lucide-react"
import Image from "next/image"

interface NavItem {
    label: string
    icon: LucideIcon
    href: string
}

interface AdminLayoutClientProps {
    children: React.ReactNode
}

const navItems: NavItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Hero Slider", icon: ImageIcon, href: "/admin/hero-slider" },
    { label: "Services", icon: Package, href: "/admin/services" },
    { label: "FAQ", icon: MessageSquare, href: "/admin/faq" },
    { label: "Blog", icon: BookOpen, href: "/admin/blog" },
    { label: "Testimonials", icon: Star, href: "/admin/testimonials" },
]

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [userEmail, setUserEmail] = useState<string>("")

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("/api/auth/verify")
                if (response.ok) {
                    const data = await response.json()
                    setUserEmail(data.email)
                }
            } catch (error) {
                console.error("Failed to fetch user:", error)
            }
        }
        fetchUser()
    }, [])

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" })
            toast.success("Logged out successfully")
            router.push("/admin/login")
        } catch (error) {
            toast.error("Logout failed")
        }
    }

    return (
        <div className="flex h-screen bg-background">
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:static lg:translate-x-0 flex flex-col`}
            >
                {/* Sidebar Header */}
                <div className="p-6 border-b border-sidebar-border/50">
                    <div className="flex items-center gap-3">
                        <div >
                            <Image src={"/logo.jpg"} alt="Logo" width={100} height={100} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-sidebar-foreground">Mumo</h1>
                            <p className="text-xs text-sidebar-accent-foreground font-medium">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                    ? "bg-linear-to-r from-sidebar-primary to-sidebar-primary/90 text-sidebar-primary-foreground font-semibold shadow-md shadow-sidebar-primary/20"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                                    }`}
                            >
                                <Icon
                                    className={`w-5 h-5 transition-colors ${isActive
                                        ? "text-sidebar-primary-foreground"
                                        : "text-sidebar-accent-foreground group-hover:text-sidebar-foreground"
                                        }`}
                                />
                                <span className="flex-1">{item.label}</span>
                                {isActive && <ChevronRight className="w-4 h-4" />}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-sidebar-border/50 space-y-4">

                </div>

                {/* Mobile close button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-sidebar-accent lg:hidden transition-colors"
                >
                    <X className="w-5 h-5 text-sidebar-foreground" />
                </button>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <nav className="sticky top-0 z-40 bg-card border-b border-border/40 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between shadow-sm">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors lg:hidden"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* Center - Title */}
                    <div className="flex-1 flex justify-center md:justify-start md:ml-4">
                        <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
                    </div>
                </nav>

                {/* Content Area */}
                <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-background">{children}</main>
            </div>
        </div>
    )
}
