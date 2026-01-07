"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Login failed")
        return
      }

      toast.success("Login successful!")
      router.push("/admin/dashboard")
      router.refresh()
    } catch (error) {
      toast.error("An error occurred during login")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/10 via-background to-accent/10 px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="border-border/40 shadow-2xl backdrop-blur-sm">
          <CardHeader className="space-y-5 text-center pb-8">
            <div className="flex justify-center mb-2">
              <div>
                <Image src="/logo.jpg" alt="Mumo Travels Logo" width={100} height={100} />
              </div>
            </div>
            <div className="space-y-3">
              <CardTitle className="text-4xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Admin Login
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Access the Mumo Travels admin panel
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2.5">
                <Label htmlFor="email" className="font-semibold text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-border/40 focus:border-primary focus:ring-1 focus:ring-primary/30 bg-muted/30 transition-all"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="password" className="font-semibold text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 border-border/40 focus:border-primary focus:ring-1 focus:ring-primary/30 bg-muted/30 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-linear-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary font-semibold text-base shadow-lg shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 transition-all"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
