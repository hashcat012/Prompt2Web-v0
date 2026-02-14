"use client"

import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Describe Your Vision",
    description:
      "Type what you want in plain language. Attach images or files for reference. Our AI auto-enhances your prompt for best results.",
  },
  {
    number: "02",
    title: "Watch AI Build",
    description:
      "See each step as the AI creates your project: layout, navigation, hero section, animations, and more. Real-time progress with live preview.",
  },
  {
    number: "03",
    title: "Edit & Export",
    description:
      "Fine-tune your website in the built-in code editor with full file explorer. Toggle edit mode for visual changes. Download or deploy when ready.",
  },
]

export function LandingHow() {
  return (
    <section id="how-it-works" className="relative py-32 px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Three steps. One amazing website.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            From idea to production-ready website in under a minute.
          </p>
        </motion.div>

        <div className="mt-20 space-y-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col items-start gap-6 md:flex-row md:items-center"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-card text-2xl font-bold text-foreground">
                {step.number}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 max-w-lg text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
