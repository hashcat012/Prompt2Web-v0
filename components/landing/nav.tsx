"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Sun, Moon, Zap } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function LandingNav() {
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground">
            <Zap className="h-5 w-5 text-background" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Prompt2Web
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            How it Works
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-all hover:bg-accent"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user ? (
            <Link
              href="/builder"
              className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-all hover:opacity-90"
            >
              Open App
            </Link>
          ) : (
            <>
              <Link
                href="/auth?mode=login"
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-accent"
              >
                Sign In
              </Link>
              <Link
                href="/auth?mode=signup"
                className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-all hover:opacity-90"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  )
}
