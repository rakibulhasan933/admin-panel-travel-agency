"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, CheckCircle, Loader2 } from "lucide-react"
import { useIsMobile } from "./ui/use-mobile"

const SERVICES = [
  { value: "tour-planning", label: "Tour Planning" },
  { value: "flight-booking", label: "Flight Booking" },
  { value: "hotel-reservation", label: "Hotel Reservation" },
  { value: "visa-assistance", label: "Visa Assistance" },
  { value: "group-tours", label: "Group Tours" },
  { value: "travel-insurance", label: "Travel Insurance" },
  { value: "other", label: "Other" },
]

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<string>("")
  const isMobile = useIsMobile()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      service: selectedService,
      message: formData.get("message") as string,
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setIsSuccess(true)
          ; (e.target as HTMLFormElement).reset()
        setSelectedService("")
      } else {
        setError(result.error || "Something went wrong. Please try again.")
      }
    } catch {
      setError("Failed to send message. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <section className="md:py-20 mt-10 py-10 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Message Sent Successfully!</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-8">
                Thank you for contacting us. We've received your message and will get back to you within 24 hours.
              </p>
              <Button onClick={() => setIsSuccess(false)} variant="outline">
                Send Another Message
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="md:py-20 py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl shadow-lg p-6 md:p-12">
            {isMobile && (
              <div className="mb-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">Get in Touch</h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6">
              <div className="space-y-1">
                <Label className="text-xs md:text-sm" htmlFor="name">
                  Name *
                </Label>
                <Input id="name" name="name" placeholder="John" required className="h-9 md:h-12 text-sm md:text-base" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs md:text-sm" htmlFor="email">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"

                  className="h-9 md:h-12 text-sm md:text-base"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs md:text-sm" htmlFor="phone">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  required
                  type="tel"
                  placeholder="+88017 0000-0000"
                  className="h-9 md:h-12 text-sm md:text-base"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs md:text-sm" htmlFor="service">
                  Service Interested In *
                </Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger id="service" className="h-9 md:h-12 text-sm md:text-base">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICES.map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs md:text-sm" htmlFor="message">
                  Your Message *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us how we can help you..."
                  required
                  className="min-h-20 md:min-h-32 text-sm md:text-base resize-none"
                />
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs md:text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-10 md:h-14 text-sm md:text-lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </>
                )}
              </Button>

              <p className="text-center text-xs md:text-sm text-muted-foreground">
                By submitting this form, you agree to our privacy policy. We'll never share your information.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
