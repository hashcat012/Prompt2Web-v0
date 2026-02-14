"use client"

import { motion } from "framer-motion"
import { Code2, Eye, Layers, Zap, Palette, FileCode2 } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate complete websites in seconds, not hours. Our AI understands your vision instantly.",
  },
  {
    icon: Code2,
    title: "Clean Code",
    description: "Production-ready code with proper structure, components, and modern best practices.",
  },
  {
    icon: Eye,
    title: "Live Preview",
    description: "See your website come to life in real-time with instant preview as the AI builds it.",
  },
  {
    icon: Layers,
    title: "Multi-File Projects",
    description: "Not just a single HTML file. Get organized projects with CSS, JS, components, and more.",
  },
  {
    icon: Palette,
    title: "Modern Design",
    description: "Glassmorphism, animations, gradients, and micro-interactions built into every project.",
  },
  {
    icon: FileCode2,
    title: "Full Editor",
    description: "Built-in Monaco editor with syntax highlighting. Edit any file directly in the browser.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function LandingFeatures() {
  return (
    <section id="features" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to build
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Prompt2Web is not just another AI tool. It is a complete development environment 
            that generates professional, multi-file websites.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-foreground/20 hover:shadow-lg"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-foreground/[0.06] transition-colors group-hover:bg-foreground/10">
                <feature.icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
