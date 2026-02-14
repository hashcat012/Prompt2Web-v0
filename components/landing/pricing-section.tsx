"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out Prompt2Web",
    features: [
      "5 prompt generations",
      "Live preview",
      "Code editor",
      "Basic file structure",
      "Community support",
    ],
    cta: "Get Started Free",
    href: "/auth?mode=signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$1",
    originalPrice: "$10",
    period: "/month",
    description: "For builders who need more power",
    features: [
      "100 prompt generations",
      "Extended prompt limits",
      "Priority AI processing",
      "Advanced multi-file projects",
      "Export & download projects",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    href: "/pricing",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Max",
    price: "$4.99",
    originalPrice: "$30",
    period: "/month",
    description: "For teams and power users",
    features: [
      "500 prompt generations",
      "5x more extended prompt limits than Pro",
      "Fastest AI processing",
      "Premium multi-file projects",
      "Custom themes & templates",
      "Advanced code editor features",
      "Dedicated support",
    ],
    cta: "Go Max",
    href: "/pricing",
    highlighted: false,
  },
]

export function LandingPricing() {
  return (
    <section id="pricing" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            Start free. Upgrade when you need more generations.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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

              <Link
                href={plan.href}
                className={`mt-8 block rounded-xl py-3 text-center text-sm font-medium transition-all ${
                  plan.highlighted
                    ? "bg-foreground text-background hover:opacity-90"
                    : "border border-border bg-card text-foreground hover:bg-accent"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
