"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
    id: string
    email: string
    name: string
    role: string
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [authenticated, setAuthenticated] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth/verify")
                if (response.ok) {
                    const data = await response.json()
                    setAuthenticated(true)
                    // In a real app, you might fetch user details here
                    setUser({
                        email: data.email,
                        id: "",
                        name: "",
                        role: "admin",
                    })
                } else {
                    setAuthenticated(false)
                    setUser(null)
                }
            } catch (error) {
                setAuthenticated(false)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" })
            setUser(null)
            setAuthenticated(false)
            router.push("/admin/login")
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    return {
        user,
        loading,
        authenticated,
        logout,
    }
}