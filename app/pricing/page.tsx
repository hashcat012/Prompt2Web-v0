"use client"

import { motion } from "framer-motion"
import { Check, ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Try out Prompt2Web and see what AI can build",
    features: [
      "5 prompt generations",
      "Live preview",
      "Monaco code editor",
      "Basic file structure",
      "Community support",
    ],
    cta: "Current Plan",
    planKey: "free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$1",
    originalPrice: "$10",
    period: "/month",
    description: "For serious builders who need more power",
    features: [
      "100 prompt generations",
      "Extended prompt limits",
      "Priority AI model access",
      "Advanced multi-file projects",
      "Full project download",
      "Priority support",
      "Edit mode for visual changes",
    ],
    cta: "Upgrade to Pro",
    planKey: "pro",
    highlighted: true,
    badge: "Most Popular",
    discount: "90% OFF",
  },
  {
    name: "Max",
    price: "$4.99",
    originalPrice: "$30",
    period: "/month",
    description: "For teams and power users who want it all",
    features: [
      "500 prompt generations",
      "5x more extended prompt limits than Pro",
      "Fastest AI model processing",
      "Premium multi-file projects",
      "Custom themes & branding",
      "Advanced editor features",
      "Team collaboration (coming soon)",
      "Dedicated support",
    ],
    cta: "Go Max",
    planKey: "max",
    highlighted: false,
    discount: "83% OFF",
  },
]

export default function PricingPage() {
  const { userData } = useAuth()
  const { theme, setTheme } = useTheme()
  const currentPlan = userData?.plan || "free"

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/builder"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
                <Zap className="h-4 w-4 text-background" />
              </div>
              <span className="text-sm font-semibold text-foreground">Prompt2Web</span>
            </div>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground">
            Choose your plan
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            Start free, then scale as you grow. All plans include live preview, code editor, and AI generation.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 hover:shadow-lg ${
                plan.highlighted
                  ? "border-foreground/30 bg-foreground/[0.03] shadow-md"
                  : "border-border bg-card"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-4 py-1 text-xs font-medium text-background">
                  {plan.badge}
                </div>
              )}

              {plan.discount && (
                <div className="absolute -top-3 right-4 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-0.5 text-[10px] font-bold text-destructive">
                  {plan.discount}
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                {plan.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">{plan.originalPrice}</span>
                )}
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 rounded-xl py-3 text-center text-sm font-medium transition-all ${
                  currentPlan === plan.planKey
                    ? "cursor-default border border-border bg-muted text-muted-foreground"
                    : plan.highlighted
                    ? "bg-foreground text-background hover:opacity-90"
                    : "border border-border text-foreground hover:bg-accent"
                }`}
                disabled={currentPlan === plan.planKey}
              >
                {currentPlan === plan.planKey ? "Current Plan" : plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-xs text-muted-foreground"
        >
          Payment processing powered by Lemon Squeezy. Cancel anytime.
        </motion.p>
      </div>
    </div>
  )
}
