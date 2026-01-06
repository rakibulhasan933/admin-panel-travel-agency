"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const slides = [
  {
    image: "/beautiful-paris-eiffel-tower-sunset-romantic-trave.jpg",
    title: "Explore The World With Us",
    subtitle: "Trusted travel and visa consultancy for your global journey",
    location: "Paris, France",
  },
  {
    image: "/dubai-skyline-burj-khalifa-luxury-modern-city-at-n.jpg",
    title: "Discover Luxury Destinations",
    subtitle: "Premium travel experiences tailored just for you",
    location: "Dubai, UAE",
  },
  {
    image: "/maldives-tropical-beach-overwater-villa-crystal-cl.jpg",
    title: "Your Dream Vacation Awaits",
    subtitle: "Create unforgettable memories with our expert planning",
    location: "Maldives",
  },
  {
    image: "/istanbul-turkey-blue-mosque-historic-architecture-.jpg",
    title: "Experience Rich Cultures",
    subtitle: "Journey through history and tradition worldwide",
    location: "Istanbul, Turkey",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      handleSlideChange((currentSlide + 1) % slides.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [currentSlide])

  const handleSlideChange = (index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide(index)
    setTimeout(() => setIsTransitioning(false), 1000)
  }

  const nextSlide = () => handleSlideChange((currentSlide + 1) % slides.length)
  const prevSlide = () => handleSlideChange((currentSlide - 1 + slides.length) % slides.length)

  return (
    <section
      id="home"
      className="relative h-[65vh] md:h-[75vh] lg:h-[85vh] overflow-hidden mt-8 md:mt-16 bg-foreground/5"
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 z-0 transition-all duration-1000 ease-out",
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105",
          )}
        >
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.location}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-r from-foreground/80 via-foreground/50 to-foreground/30" />
          <div className="absolute inset-0 bg-linear-to-t from-foreground/60 via-transparent to-foreground/40" />
        </div>
      ))}

      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse hidden md:block" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-sky/20 rounded-full blur-[120px] animate-pulse hidden md:block"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10 h-full flex items-center justify-start py-0 md:py-0">
        <div className="container mx-auto px-4 md:px-6 lg:px-20">
          <div className="max-w-4xl">
            <div className="overflow-hidden mb-3 md:mb-6">
              <div
                key={`location-${currentSlide}`}
                className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-card/10 backdrop-blur-md border border-card/20 animate-fade-in-up"
              >
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-card/90 text-xs md:text-sm font-medium tracking-wide">
                  {slides[currentSlide].location}
                </span>
              </div>
            </div>

            <div className="overflow-hidden mb-3 md:mb-6">
              <h1
                key={`title-${currentSlide}`}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-card leading-[1.15] md:leading-[1.1] animate-fade-in-up text-balance"
              >
                {slides[currentSlide].title.split(" ").map((word, i) => (
                  <span
                    key={i}
                    className={cn("inline-block mr-2 md:mr-4", word === "World" && "text-primary")}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {word}
                  </span>
                ))}
              </h1>
            </div>

            <div className="overflow-hidden mb-4 md:mb-10">
              <p
                key={`subtitle-${currentSlide}`}
                className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-card/80 max-w-2xl animate-fade-in-up leading-relaxed"
                style={{ animationDelay: "300ms" }}
              >
                {slides[currentSlide].subtitle}
              </p>
            </div>

            <div
              className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 md:gap-4 animate-fade-in-up"
              style={{ animationDelay: "400ms" }}
            >
              <Button
                size="lg"
                className={cn(
                  "group relative overflow-hidden",
                  "bg-primary hover:bg-primary/90 text-primary-foreground",
                  "rounded-full px-5 md:px-8 py-4 md:py-6 text-sm md:text-base font-semibold",
                  "shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40",
                  "transition-all duration-300 hover:scale-[1.02]",
                  "w-full sm:w-auto",
                )}
                asChild
              >
                <Link prefetch={false} href="/services">
                  <span className="relative z-10">View Packages</span>
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-card/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={cn(
                  "group border-2 border-card/40 text-card",
                  "bg-card/5 backdrop-blur-sm",
                  "hover:bg-card hover:text-foreground hover:border-card",
                  "rounded-full px-5 md:px-8 py-4 md:py-6 text-sm md:text-base font-semibold",
                  "transition-all duration-300",
                  "w-full sm:w-auto",
                )}
                asChild
              >
                <Link prefetch={false} href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className={cn(
          "absolute left-2 sm:left-4 md:left-10 top-1/2 -translate-y-1/2 z-20",
          "w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full",
          "bg-card/10 backdrop-blur-md border border-card/20",
          "text-card hover:bg-card hover:text-foreground",
          "flex items-center justify-center",
          "transition-all duration-300 hover:scale-110",
          "disabled:opacity-50 disabled:pointer-events-none",
        )}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className={cn(
          "absolute right-2 sm:right-4 md:right-10 top-1/2 -translate-y-1/2 z-20",
          "w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full",
          "bg-card/10 backdrop-blur-md border border-card/20",
          "text-card hover:bg-card hover:text-foreground",
          "flex items-center justify-center",
          "transition-all duration-300 hover:scale-110",
          "disabled:opacity-50 disabled:pointer-events-none",
        )}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      <div className="absolute bottom-4 sm:bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 md:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            disabled={isTransitioning}
            className={cn(
              "relative h-1.5 md:h-2 lg:h-3 rounded-full transition-all duration-500 overflow-hidden",
              index === currentSlide
                ? "w-6 md:w-8 lg:w-10 bg-primary"
                : "w-1.5 md:w-2 lg:w-3 bg-card/40 hover:bg-card/60",
            )}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlide && (
              <span
                className="absolute inset-0 bg-card/30 origin-left animate-[slideProgress_7s_linear]"
                style={{ animationPlayState: isTransitioning ? "paused" : "running" }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="absolute bottom-10 right-10 z-20 hidden xl:flex flex-col items-center gap-3">
        <span className="text-card/60 text-xs tracking-[0.3em] uppercase rotate-90 origin-center translate-x-6 mb-4">
          Scroll
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-card/30 flex justify-center pt-2">
          <span className="w-1 h-2 bg-card/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
