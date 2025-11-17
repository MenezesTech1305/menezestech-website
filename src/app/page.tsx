"use client"

import { Suspense } from "react"
import { HeroSection } from "@/components/sections/hero"
import { ServicesSection } from "@/components/sections/services"
import { AboutSection } from "@/components/sections/about"
import { PartnersSection } from "@/components/sections/partners"
import { TestimonialsSection } from "@/components/sections/testimonials"
import { ContactSection } from "@/components/sections/contact"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <Suspense fallback={<div className="animate-pulse h-screen bg-gray-100" />}>
          <HeroSection />
        </Suspense>
        
        <Suspense fallback={<div className="animate-pulse h-64 bg-gray-50" />}>
          <AboutSection />
        </Suspense>
        
        <Suspense fallback={<div className="animate-pulse h-64 bg-gray-100" />}>
          <ServicesSection />
        </Suspense>
        
        <PartnersSection />
        
        <Suspense fallback={<div className="animate-pulse h-64 bg-gray-50" />}>
          <TestimonialsSection />
        </Suspense>
        
        <Suspense fallback={<div className="animate-pulse h-64 bg-gray-100" />}>
          <ContactSection />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  )
} 