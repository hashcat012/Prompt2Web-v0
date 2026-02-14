"use client"

import { Zap } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
            <Zap className="h-4 w-4 text-background" />
          </div>
          <span className="font-semibold text-foreground">Prompt2Web</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Built with AI. Designed for builders.
        </p>
      </div>
    </footer>
  )
}
