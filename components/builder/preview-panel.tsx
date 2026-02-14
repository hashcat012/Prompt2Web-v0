"use client"

import { useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Monitor, Smartphone, Tablet, RefreshCw, Loader2, Globe, Sparkles } from "lucide-react"
import type { GeneratedProject } from "./builder-layout"

interface PreviewPanelProps {
  project: GeneratedProject | null
  isGenerating: boolean
  currentStep: string
  editMode: boolean
}

type ViewportSize = "desktop" | "tablet" | "mobile"

export function PreviewPanel({
  project,
  isGenerating,
  currentStep,
  editMode,
}: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [viewport, setViewport] = useState<ViewportSize>("desktop")

  const previewHtml = useMemo(() => {
    if (!project) return ""

    const indexFile = project.files.find((f) => f.path === "index.html")
    if (!indexFile) return "<html><body><h1>No index.html found</h1></body></html>"

    let html = indexFile.content

    // Inline all CSS files
    const cssFiles = project.files.filter((f) => f.language === "css" || f.path.endsWith(".css"))
    let cssContent = ""
    cssFiles.forEach((f) => {
      cssContent += f.content + "\n"
    })

    // Inline all JS files
    const jsFiles = project.files.filter(
      (f) =>
        (f.language === "javascript" || f.language === "js" || f.path.endsWith(".js")) &&
        f.path !== "index.html"
    )
    let jsContent = ""
    jsFiles.forEach((f) => {
      jsContent += f.content + "\n"
    })

    // Remove existing link/script references that point to local files
    html = html.replace(/<link[^>]*href=["'](?!http)[^"']*\.css["'][^>]*>/gi, "")
    html = html.replace(/<script[^>]*src=["'](?!http)[^"']*\.js["'][^>]*><\/script>/gi, "")

    // Inject CSS before </head>
    if (cssContent) {
      const styleTag = `<style>${cssContent}</style>`
      if (html.includes("</head>")) {
        html = html.replace("</head>", `${styleTag}</head>`)
      } else {
        html = `<style>${cssContent}</style>` + html
      }
    }

    // Inject JS before </body>
    if (jsContent) {
      const scriptTag = `<script>${jsContent}</script>`
      if (html.includes("</body>")) {
        html = html.replace("</body>", `${scriptTag}</body>`)
      } else {
        html = html + `<script>${jsContent}</script>`
      }
    }

    // Add edit mode styles if active
    if (editMode) {
      const editStyles = `
        <style>
          [contenteditable]:hover { outline: 2px dashed rgba(255,255,255,0.5) !important; cursor: text !important; }
          [contenteditable]:focus { outline: 2px solid rgba(255,255,255,0.8) !important; }
        </style>
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,a,button,li,td,th,label,div').forEach(function(el) {
              if (el.children.length === 0 || el.textContent.trim().length < 200) {
                el.setAttribute('contenteditable', 'true');
              }
            });
          });
        </script>`
      if (html.includes("</head>")) {
        html = html.replace("</head>", `${editStyles}</head>`)
      }
    }

    return html
  }, [project, editMode])

  const viewportClass =
    viewport === "mobile"
      ? "max-w-[375px]"
      : viewport === "tablet"
        ? "max-w-[768px]"
        : "w-full"

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = previewHtml
    }
  }

  // Loading state
  if (isGenerating) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-card p-8">
        <div className="relative mb-12 flex items-center justify-center">
          {/* Elite Animated Spinner */}
          <div className="absolute h-32 w-32 rounded-full border-[3px] border-foreground/5" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute h-32 w-32 rounded-full border-[3px] border-transparent border-t-foreground/40"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute h-24 w-24 rounded-full border-[3px] border-transparent border-t-foreground/60"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute h-16 w-16 rounded-full border-[3px] border-transparent border-t-foreground"
          />
          <div className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-foreground shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <Sparkles className="h-4 w-4 text-background animate-pulse" />
          </div>
        </div>

        <div className="max-w-md space-y-4 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                Architecting Your Website
              </h3>
              <div className="flex items-center justify-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                  {currentStep}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-1.5 pt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="h-1.5 w-1.5 rounded-full bg-foreground"
              />
            ))}
          </div>

          <p className="text-[10px] text-muted-foreground uppercase tracking-tighter opacity-50">
            Elite AI Engine is crafting a professional masterpiece
          </p>
        </div>
      </div>
    )
  }

  // Empty state
  if (!project) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-card">
        <div className="relative">
          <Globe className="h-16 w-16 text-muted-foreground/20" />
          <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-foreground">
            <Loader2 className="h-3.5 w-3.5 text-background" />
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Your website preview will appear here
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Type a prompt in the chat and hit send
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewport("desktop")}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${viewport === "desktop"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            title="Desktop view"
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewport("tablet")}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${viewport === "tablet"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            title="Tablet view"
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${viewport === "mobile"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            title="Mobile view"
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1 text-xs text-muted-foreground">
          <Globe className="h-3 w-3" />
          <span>{project.projectName || "preview"}</span>
        </div>

        <button
          onClick={handleRefresh}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Refresh preview"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Preview iframe */}
      <div className="flex flex-1 items-start justify-center overflow-auto bg-muted/30 p-4">
        <div className={`h-full ${viewportClass} mx-auto transition-all duration-300`}>
          <div className="h-full overflow-hidden rounded-lg border border-border bg-background shadow-lg">
            <iframe
              ref={iframeRef}
              srcDoc={previewHtml}
              className="h-full w-full"
              title="Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
