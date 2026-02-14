"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

export function LandingHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-foreground/5 blur-3xl animate-morph" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-foreground/3 blur-3xl animate-morph" style={{ animationDelay: "4s" }} />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.02] blur-3xl animate-morph" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Powered Website Generation</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-balance text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          Describe it.{" "}
          <span className="relative">
            We build it.
            <motion.div
              className="absolute -bottom-2 left-0 h-[3px] bg-foreground"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.8 }}
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
        >
          Transform your ideas into professional, production-ready websites in seconds. 
          Just describe what you want and watch Prompt2Web bring it to life with clean code, 
          modern design, and smooth animations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/auth?mode=signup"
            className="group flex items-center gap-2 rounded-xl bg-foreground px-8 py-3.5 text-base font-semibold text-background transition-all hover:opacity-90 hover:shadow-lg"
          >
            Start Building Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 text-base font-medium text-foreground transition-all hover:bg-accent"
          >
            See How It Works
          </a>
        </motion.div>

        {/* Demo preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <div className="glass rounded-2xl p-1 glow">
            <div className="rounded-xl bg-card p-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
                <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
                <div className="ml-4 flex-1 rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground">
                  prompt2web.app/builder
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground">
                    <Sparkles className="h-4 w-4 text-background" />
                  </div>
                  <div className="glass flex-1 rounded-xl px-4 py-3 text-left text-sm text-muted-foreground">
                    <TypingEffect text="Create a modern SaaS landing page with a hero section, feature grid, testimonial carousel, and pricing table with glassmorphism effects..." />
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-11">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground" />
                  <span className="text-xs text-muted-foreground animate-pulse">Generating your website...</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function TypingEffect({ text }: { text: string }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.02, delay: i * 0.015 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}
