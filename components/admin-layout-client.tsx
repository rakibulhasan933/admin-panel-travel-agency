"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { LucideIcon } from "lucide-react"
import {
    LayoutDashboard,
    ImageIcon,
    Package,
    MessageSquare,
    BookOpen,
    Star,
} from "lucide-react"

interface NavItem {
    label: string
    icon: LucideIcon
    href: string
}

interface AdminLayoutClientProps {
    children: React.ReactNode
}

const navItems = [
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
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:static lg:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-blue-600">Mumo Admin</h1>
                        <p className="text-sm text-gray-600">Control Panel</p>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-200">
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-2 bg-transparent"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between lg:px-8">
                    <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-gray-100 rounded-lg lg:hidden">
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 hidden sm:block">Admin Panel</span>
                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
            </div>
        </div>
    )
}
