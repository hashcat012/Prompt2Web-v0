"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { motion } from "framer-motion"
import { BuilderLayout } from "@/components/builder/builder-layout"
import { Loader2 } from "lucide-react"

export default function BuilderPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth?mode=login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="h-10 w-10 rounded-full border-2 border-muted animate-spin-slow" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-foreground" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-sm font-medium text-foreground tracking-tight">Accessing Environment</span>
            <p className="text-xs text-muted-foreground opacity-60">Initializing Prompt2Web Elite Architect Engine...</p>
          </div>

          {/* Fallback */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5 }}
            className="pt-4"
          >
            <button
              onClick={() => window.location.href = "/"}
              className="text-[10px] text-muted-foreground underline hover:text-foreground transition-colors"
            >
              Taking too long? Go back to landing
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return <BuilderLayout />
}
