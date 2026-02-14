"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { incrementPromptCount } from "@/lib/firebase-client"
import { toast } from "sonner"
import { BuilderNav } from "./builder-nav"
import { ChatPanel } from "./chat-panel"
import { CodePanel } from "./code-panel"
import { PreviewPanel } from "./preview-panel"

export interface ProjectFile {
  path: string
  content: string
  language: string
}

export interface GeneratedProject {
  projectName: string
  description: string
  files: ProjectFile[]
  steps: string[]
}

type Tab = "code" | "preview"

export function BuilderLayout() {
  const { user, userData, refreshUserData } = useAuth()
  const [project, setProject] = useState<GeneratedProject | null>(null)
  const [selectedFile, setSelectedFile] = useState<string>("")
  const [activeTab, setActiveTab] = useState<Tab>("preview")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState("")
  const [steps, setSteps] = useState<string[]>([])
  const [stepIndex, setStepIndex] = useState(-1)
  const [editMode, setEditMode] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const getPromptLimit = useCallback(() => {
    if (!userData) return 5
    switch (userData.plan) {
      case "pro": return 100
      case "max": return 500
      default: return 5
    }
  }, [userData])

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsGenerating(false)
    setCurrentStep("Generation stopped.")
    setStepIndex(-1)
    toast.info("Generation stopped.")
  }

  const handleGenerate = async (prompt: string) => {
    console.log("handleGenerate triggered with prompt:", prompt)

    if (!user) {
      toast.error("You must be logged in to generate a website.")
      return
    }

    if (!userData) {
      toast.error("User profile not found. Please try refreshing the page.")
      console.error("UserData is null for user:", user.uid)
      return
    }

    const limit = getPromptLimit()
    if (userData.promptsUsed >= limit) {
      toast.error(`You have reached your ${userData.plan} plan limit of ${limit} prompts. Please upgrade.`)
      return
    }

    setIsGenerating(true)
    setProject(null)
    setActiveTab("preview")
    setStepIndex(-1)
    setSteps([])
    setCurrentStep("Initializing Elite Architect Engine...")

    abortControllerRef.current = new AbortController()

    try {
      console.log("Starting generation flow for prompt:", prompt)
      setCurrentStep("Analyzing your requirements (Groq Llama 3.1)...")
      // Step 1: Planning / Enhancement
      let analysis = ""
      let aiSteps = [
        "Architecting project structure",
        "Designing responsive foundation",
        "Building core components",
        "Implementing visual styling",
        "Adding animations & transitions",
        "Final code generation"
      ]

      try {
        const planRes = await fetch("/api/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
          signal: abortControllerRef.current.signal,
        })

        if (planRes.ok) {
          const data = await planRes.json()
          analysis = data.analysis
          aiSteps = data.steps
          console.log("Custom plan received from AI")
        } else {
          console.warn("Planning API failed, using default steps")
        }
      } catch (err) {
        console.error("Planning error, falling back to defaults:", err)
      }

      setSteps(aiSteps)
      setStepIndex(0)
      setCurrentStep(aiSteps[0])

      // Step 2: Sequential progress simulation while generating
      const progressInterval = setInterval(() => {
        setStepIndex(prev => {
          if (prev < aiSteps.length - 2) {
            const next = prev + 1
            setCurrentStep(aiSteps[next])
            return next
          }
          return prev
        })
      }, 5000)

      // Step 3: Call Generate API
      setCurrentStep("Generating professional code structure (Gemini 2.0)...")
      const generateRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, analysis, steps: aiSteps }),
        signal: abortControllerRef.current.signal,
      })

      clearInterval(progressInterval)

      if (!generateRes.ok) {
        if (generateRes.status === 0) return // Aborted
        const err = await generateRes.json()
        throw new Error(err.error || "Generation failed")
      }

      const data: GeneratedProject = await generateRes.json()

      if (!data.files || data.files.length === 0) {
        throw new Error("No files generated")
      }

      setProject(data)
      setSelectedFile(data.files[0]?.path || "")
      setStepIndex(aiSteps.length - 1)
      setCurrentStep("Website ready for preview!")

      // Increment prompt count
      await incrementPromptCount(user.uid)
      await refreshUserData()

      toast.success("Website generated successfully!")
    } catch (error: any) {
      if (error.name === 'AbortError') return
      const msg = error instanceof Error ? error.message : "Generation failed"
      toast.error(msg)
      setCurrentStep("")
      setStepIndex(-1)
    } finally {
      setIsGenerating(false)
      abortControllerRef.current = null
    }
  }

  const handleFileUpdate = (path: string, content: string) => {
    if (!project) return
    setProject({
      ...project,
      files: project.files.map((f) =>
        f.path === path ? { ...f, content } : f
      ),
    })
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <BuilderNav
        editMode={editMode}
        onToggleEditMode={() => setEditMode(!editMode)}
        project={project}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Chat */}
        <div className="flex w-[400px] shrink-0 flex-col border-r border-border bg-card">
          <ChatPanel
            onGenerate={handleGenerate}
            onStop={handleStop}
            isGenerating={isGenerating}
            promptsUsed={userData?.promptsUsed || 0}
            promptLimit={getPromptLimit()}
            plan={userData?.plan || "free"}
            steps={steps}
            stepIndex={stepIndex}
          />
        </div>

        {/* Right panel - Code & Preview */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center gap-1 border-b border-border bg-card px-4 py-2">
            <button
              onClick={() => setActiveTab("code")}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${activeTab === "code"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
            >
              Code
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${activeTab === "preview"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
            >
              Preview
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "code" ? (
              <motion.div
                key="code"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 overflow-hidden"
              >
                <CodePanel
                  project={project}
                  selectedFile={selectedFile}
                  onSelectFile={setSelectedFile}
                  onFileUpdate={handleFileUpdate}
                  isGenerating={isGenerating}
                  currentStep={currentStep}
                />
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 overflow-hidden"
              >
                <PreviewPanel
                  project={project}
                  isGenerating={isGenerating}
                  currentStep={currentStep}
                  editMode={editMode}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
