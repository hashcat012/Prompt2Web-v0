"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileCode2,
  FolderOpen,
  Folder,
  ChevronRight,
  ChevronDown,
  FileText,
  FileType,
  Loader2,
} from "lucide-react"
import dynamic from "next/dynamic"
import type { GeneratedProject } from "./builder-layout"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

interface CodePanelProps {
  project: GeneratedProject | null
  selectedFile: string
  onSelectFile: (path: string) => void
  onFileUpdate: (path: string, content: string) => void
  isGenerating: boolean
  currentStep: string
}

interface FolderNode {
  name: string
  type: "folder" | "file"
  path: string
  children: FolderNode[]
  language?: string
}

function buildFileTree(files: GeneratedProject["files"]): FolderNode[] {
  const root: FolderNode[] = []

  for (const file of files) {
    const parts = file.path.split("/")
    let current = root

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isFile = i === parts.length - 1

      const existing = current.find((n) => n.name === part)
      if (existing) {
        current = existing.children
      } else {
        const node: FolderNode = {
          name: part,
          type: isFile ? "file" : "folder",
          path: isFile ? file.path : parts.slice(0, i + 1).join("/"),
          children: [],
          language: isFile ? file.language : undefined,
        }
        current.push(node)
        if (!isFile) {
          current = node.children
        }
      }
    }
  }

  // Sort: folders first, then files
  function sortTree(nodes: FolderNode[]) {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1
      return a.name.localeCompare(b.name)
    })
    nodes.forEach((n) => sortTree(n.children))
  }
  sortTree(root)

  return root
}

function getFileIcon(name: string) {
  if (name.endsWith(".html")) return <FileCode2 className="h-3.5 w-3.5 text-orange-400" />
  if (name.endsWith(".css")) return <FileType className="h-3.5 w-3.5 text-blue-400" />
  if (name.endsWith(".js") || name.endsWith(".ts"))
    return <FileCode2 className="h-3.5 w-3.5 text-yellow-400" />
  if (name.endsWith(".json")) return <FileText className="h-3.5 w-3.5 text-green-400" />
  return <FileText className="h-3.5 w-3.5 text-muted-foreground" />
}

function getMonacoLanguage(language: string | undefined, path: string) {
  if (language === "html") return "html"
  if (language === "css") return "css"
  if (language === "javascript" || language === "js") return "javascript"
  if (language === "typescript" || language === "ts") return "typescript"
  if (language === "json") return "json"
  if (path.endsWith(".html")) return "html"
  if (path.endsWith(".css")) return "css"
  if (path.endsWith(".js")) return "javascript"
  if (path.endsWith(".ts")) return "typescript"
  if (path.endsWith(".json")) return "json"
  return "plaintext"
}

function FileTreeNode({
  node,
  depth,
  selectedFile,
  onSelectFile,
}: {
  node: FolderNode
  depth: number
  selectedFile: string
  onSelectFile: (path: string) => void
}) {
  const [expanded, setExpanded] = useState(depth < 2)

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {expanded ? (
            <ChevronDown className="h-3 w-3 shrink-0" />
          ) : (
            <ChevronRight className="h-3 w-3 shrink-0" />
          )}
          {expanded ? (
            <FolderOpen className="h-3.5 w-3.5 shrink-0 text-foreground/70" />
          ) : (
            <Folder className="h-3.5 w-3.5 shrink-0 text-foreground/70" />
          )}
          <span className="truncate">{node.name}</span>
        </button>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              {node.children.map((child) => (
                <FileTreeNode
                  key={child.path}
                  node={child}
                  depth={depth + 1}
                  selectedFile={selectedFile}
                  onSelectFile={onSelectFile}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <button
      onClick={() => onSelectFile(node.path)}
      className={`flex w-full items-center gap-1.5 px-2 py-1 text-xs transition-colors ${selectedFile === node.path
        ? "bg-foreground/10 text-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      style={{ paddingLeft: `${depth * 12 + 20}px` }}
    >
      {getFileIcon(node.name)}
      <span className="truncate">{node.name}</span>
    </button>
  )
}

export function CodePanel({
  project,
  selectedFile,
  onSelectFile,
  onFileUpdate,
  isGenerating,
  currentStep,
}: CodePanelProps) {
  const fileTree = useMemo(
    () => (project ? buildFileTree(project.files) : []),
    [project]
  )

  const currentFile = project?.files.find((f) => f.path === selectedFile)

  if (isGenerating) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-card p-8">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-background" />
        </div>
        <div className="max-w-md w-full rounded-xl border border-border bg-background p-6 font-mono text-xs shadow-2xl">
          <div className="mb-4 flex items-center gap-2 border-b border-border pb-2 opacity-50">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="ml-2">Elite-Architect-Engine.sh</span>
          </div>
          <div className="space-y-1.5 overflow-hidden">
            <div className="flex gap-2">
              <span className="text-green-500">➜</span>
              <span className="text-muted-foreground">Initializing build sequence...</span>
            </div>
            <div className="flex gap-2">
              <span className="text-green-500">➜</span>
              <span className="text-muted-foreground">Optimizing project graph...</span>
            </div>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-2"
            >
              <span className="text-blue-500">➜</span>
              <span className="text-foreground font-bold uppercase tracking-wider animate-pulse">
                {currentStep}...
              </span>
            </motion.div>
          </div>
        </div>
        <p className="mt-6 text-sm font-medium text-muted-foreground">
          Writing logical, multi-file code structure
        </p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center bg-card">
        <div className="text-center">
          <FileCode2 className="mx-auto h-10 w-10 text-muted-foreground/30" />
          <p className="mt-3 text-sm text-muted-foreground">
            Generate a project to see the code
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* File tree sidebar */}
      <div className="w-56 shrink-0 overflow-y-auto border-r border-border bg-card py-2">
        <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Explorer
        </div>
        {fileTree.map((node) => (
          <FileTreeNode
            key={node.path}
            node={node}
            depth={0}
            selectedFile={selectedFile}
            onSelectFile={onSelectFile}
          />
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        {currentFile ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-2">
              {getFileIcon(currentFile.path)}
              <span className="text-xs text-muted-foreground">{currentFile.path}</span>
            </div>
            <div className="flex-1">
              <MonacoEditor
                height="100%"
                language={getMonacoLanguage(currentFile.language, currentFile.path)}
                value={currentFile.content}
                onChange={(value) => {
                  if (value !== undefined) {
                    onFileUpdate(currentFile.path, value)
                  }
                }}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  fontFamily: "var(--font-jetbrains), monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 12 },
                  lineNumbers: "on",
                  renderLineHighlight: "gutter",
                  bracketPairColorization: { enabled: true },
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: "on",
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">Select a file to edit</p>
          </div>
        )}
      </div>
    </div>
  )
}
