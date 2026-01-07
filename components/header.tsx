"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { LogOut, Menu, Plane } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { toast } from "sonner"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const [userEmail, setUserEmail] = useState<string>("")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isInternalPage = pathname !== "/"
  const showSolidHeader = true // Always show solid background for distinct separation

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

  console.log({ userEmail })

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "bg-card border-b border-border/50 shadow-sm py-2 md:py-3",
        isScrolled && "shadow-md py-1.5 md:py-2",
      )}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-20 flex items-center justify-between">
        {/* Logo */}
        <Link prefetch={false} href="/" className="flex items-center gap-2 md:gap-3 group">
          <div
            className={cn("relative w-auto h-10 md:h-14 lg:h-14 transition-all duration-500 overflow-hidden shrink-0")}
          >
            <Image
              src="/logo.png"
              alt="Mumo Travels & Tours Logo"
              className="object-contain h-full w-auto"
              height={100}
              width={200}
              priority
              sizes="(max-width: 768px) 160px, (max-width: 1024px) 192px, 224px"
            />
          </div>
        </Link>

        <div className="flex items-center gap-3 md:gap-4 ml-auto">
          <span className="text-sm font-medium text-muted-foreground hidden sm:block truncate max-w-xs">
            {userEmail}
          </span>
          {
            userEmail && (
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="gap-2 border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50 text-destructive hover:text-destructive font-medium transition-all bg-transparent"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            )
          }
        </div>


        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-lg md:rounded-xl h-9 w-9 md:h-10 md:w-10 shrink-0",
                showSolidHeader ? "text-foreground hover:bg-secondary" : "text-card hover:bg-card/10",
              )}
            >
              <Menu className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-280 sm:w-80 bg-card border-l border-border/50">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col h-full py-4 md:py-6">
              <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-10">
                <div className="p-2 md:p-2.5 rounded-lg md:rounded-xl bg-linear-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                  <Plane className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg md:text-xl font-bold text-foreground leading-tight">
                    Mu<span className="text-primary">mo</span>
                  </span>
                  <span className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] font-medium text-muted-foreground">
                    Travels & Tours
                  </span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
