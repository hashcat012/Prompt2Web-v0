"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import {
  Zap,
  Sun,
  Moon,
  LogOut,
  Download,
  MousePointer,
  MousePointerClick,
  Shield,
} from "lucide-react"
import { logOut } from "@/lib/firebase-client"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import type { GeneratedProject } from "./builder-layout"

interface BuilderNavProps {
  editMode: boolean
  onToggleEditMode: () => void
  project: GeneratedProject | null
}

export function BuilderNav({ editMode, onToggleEditMode, project }: BuilderNavProps) {
  const { theme, setTheme } = useTheme()
  const { userData } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logOut()
    router.push("/")
  }

  const handleDownload = () => {
    if (!project) {
      toast.error("No project to download")
      return
    }

    // Create a simple downloadable HTML
    const indexFile = project.files.find((f) => f.path === "index.html")
    if (indexFile) {
      const blob = new Blob([indexFile.content], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${project.projectName || "prompt2web-project"}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("Project downloaded!")
    }
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
          <Zap className="h-4 w-4 text-background" />
        </div>
        <span className="text-sm font-semibold text-foreground">Prompt2Web</span>
        {project && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
          >
            {project.projectName}
          </motion.span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Plan badge */}
        <div className="mr-2 rounded-full border border-border px-3 py-0.5 text-xs font-medium text-muted-foreground">
          {userData?.plan === "pro" ? "Pro" : userData?.plan === "max" ? "Max" : "Free"}
        </div>

        {/* Edit mode toggle */}
        <button
          onClick={onToggleEditMode}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${editMode
              ? "bg-foreground text-background"
              : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          title="Toggle edit mode - click on elements in preview to edit them"
        >
          {editMode ? (
            <MousePointerClick className="h-3.5 w-3.5" />
          ) : (
            <MousePointer className="h-3.5 w-3.5" />
          )}
          Edit Mode
        </button>

        {/* Download */}
        <button
          onClick={handleDownload}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          title="Download project"
        >
          <Download className="h-4 w-4" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Admin link */}
        {userData?.isAdmin && (
          <button
            onClick={() => router.push("/admin")}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            title="Admin Dashboard"
          >
            <Shield className="h-4 w-4" />
          </button>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
