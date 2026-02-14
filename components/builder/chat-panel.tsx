"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Paperclip, X, Image, FileText, Sparkles, Loader2, Square, CheckCircle2, Circle } from "lucide-react"
import Link from "next/link"

interface ChatPanelProps {
  onGenerate: (prompt: string) => void
  onStop: () => void
  isGenerating: boolean
  promptsUsed: number
  promptLimit: number
  plan: string
  steps: string[]
  stepIndex: number
}

interface Attachment {
  name: string
  type: string
  url: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  attachments?: Attachment[]
  isSteps?: boolean
}

export function ChatPanel({
  onGenerate,
  onStop,
  isGenerating,
  promptsUsed,
  promptLimit,
  plan,
  steps,
  stepIndex,
}: ChatPanelProps) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to Prompt2Web! Describe the website you want to build, and I will generate it for you. Be as detailed as possible for best results.",
    },
  ])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isGenerating, steps])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || isGenerating) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setAttachments([])
    onGenerate(trimmed)

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      setAttachments((prev) => [
        ...prev,
        { name: file.name, type: file.type, url },
      ])
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-foreground" />
          <span className="text-sm font-medium text-foreground">Chat</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {promptsUsed}/{promptLimit}
          </span>
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-foreground"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((promptsUsed / promptLimit) * 100, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {plan === "free" && (
            <Link
              href="/pricing"
              className="rounded-md bg-foreground/10 px-2 py-0.5 text-[10px] font-medium text-foreground transition-colors hover:bg-foreground/20"
            >
              Upgrade
            </Link>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-medium ${message.role === "user"
                  ? "bg-foreground text-background"
                  : "bg-muted text-foreground"
                  }`}
              >
                {message.role === "user" ? "U" : <Sparkles className="h-3.5 w-3.5" />}
              </div>
              <div
                className={`max-w-[280px] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${message.role === "user"
                  ? "bg-foreground text-background"
                  : "bg-muted text-foreground"
                  }`}
              >
                {message.content}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.attachments.map((att, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 rounded-md bg-background/20 px-2 py-1 text-xs"
                      >
                        {att.type.startsWith("image/") ? (
                          <Image className="h-3 w-3" />
                        ) : (
                          <FileText className="h-3 w-3" />
                        )}
                        <span className="max-w-[100px] truncate">{att.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Dynamic Steps Message */}
          {isGenerating && (
            <motion.div
              key="generation-steps"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="max-w-[280px] rounded-2xl bg-muted px-4 py-2.5 text-sm leading-relaxed text-foreground">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Elite Architect at work...
                  </div>
                  <div className="space-y-2 border-l border-border pl-4">
                    {steps.length > 0 ? (
                      steps.map((step, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 text-xs transition-colors ${idx <= stepIndex ? "text-foreground" : "text-muted-foreground/30"
                            }`}
                        >
                          {idx < stepIndex ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          ) : idx === stepIndex ? (
                            <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                              <div className="absolute inset-0 animate-ping rounded-full bg-foreground/20" />
                              <Circle className="relative h-2 w-2 fill-foreground text-foreground" />
                            </div>
                          ) : (
                            <Circle className="h-3.5 w-3.5" />
                          )}
                          <span className={idx === stepIndex ? "font-medium" : ""}>{step}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
                        <Circle className="h-3.5 w-3.5" />
                        <span>Analyzing requirements...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Attachments preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border px-4"
          >
            <div className="flex flex-wrap gap-2 py-2">
              {attachments.map((att, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-xs text-foreground"
                >
                  {att.type.startsWith("image/") ? (
                    <Image className="h-3.5 w-3.5" />
                  ) : (
                    <FileText className="h-3.5 w-3.5" />
                  )}
                  <span className="max-w-[120px] truncate">{att.name}</span>
                  <button
                    onClick={() => removeAttachment(i)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="border-t border-border p-4">
        <div className={`flex items-end gap-2 rounded-xl border border-border bg-background p-2 transition-all focus-within:border-foreground/20 focus-within:ring-1 focus-within:ring-foreground/20`}>
          {/* Attach button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Attach files"
            disabled={isGenerating}
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.html,.css,.js,.json,.txt"
            onChange={handleFileAttach}
            className="hidden"
          />

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the website you want to build..."
            rows={1}
            disabled={isGenerating}
            className="flex-1 resize-none bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
            style={{ maxHeight: "120px" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = "auto"
              target.style.height = Math.min(target.scrollHeight, 120) + "px"
            }}
          />

          {/* Send/Stop button */}
          <button
            onClick={isGenerating ? onStop : handleSend}
            disabled={!isGenerating && !input.trim()}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all hover:opacity-90 disabled:opacity-30 ${isGenerating ? "bg-red-500 text-white" : "bg-foreground text-background"
              }`}
          >
            {isGenerating ? (
              <Square className="h-3.5 w-3.5 fill-current" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>

        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Prompt2Web can make mistakes. Review generated code before using.
        </p>
      </div>
    </div>
  )
}
