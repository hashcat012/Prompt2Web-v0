"use client"

import { LandingHero } from "@/components/landing/hero"
import { LandingFeatures } from "@/components/landing/features"
import { LandingHow } from "@/components/landing/how-it-works"
import { LandingPricing } from "@/components/landing/pricing-section"
import { LandingFooter } from "@/components/landing/footer"
import { LandingNav } from "@/components/landing/nav"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <LandingNav />
      <LandingHero />
      <LandingFeatures />
      <LandingHow />
      <LandingPricing />
      <LandingFooter />
    </main>
  )
}
