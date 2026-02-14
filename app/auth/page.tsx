"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react"
import { signIn, signUp, signInWithGoogle } from "@/lib/firebase-client"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import Link from "next/link"

function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()

  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    const m = searchParams.get("mode")
    if (m === "login" || m === "signup") setMode(m)
  }, [searchParams])

  useEffect(() => {
    if (!authLoading && user) router.replace("/builder")
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === "signup") {
        if (!username.trim()) {
          toast.error("Username is required")
          setLoading(false)
          return
        }
        await signUp(email, password, username)
        toast.success("Account created successfully!")
      } else {
        await signIn(email, password)
        toast.success("Welcome back!")
      }
      router.replace("/builder")
    } catch (err: any) {
      const msg = err?.message ?? "Something went wrong"
      if (msg.includes("email-already-in-use")) toast.error("Email already in use")
      else if (msg.includes("wrong-password") || msg.includes("invalid-credential"))
        toast.error("Invalid email or password")
      else if (msg.includes("user-not-found")) toast.error("No account found")
      else if (msg.includes("weak-password"))
        toast.error("Password should be at least 6 characters")
      else toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      toast.success("Signed in with Google!")
      router.replace("/builder")
    } catch (err: any) {
      if (!err?.message?.includes("popup-closed-by-user")) {
        toast.error("Google sign in failed")
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6">
      {/* 🔮 Background glass effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-foreground/5 blur-3xl animate-morph" />
        <div
          className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-foreground/3 blur-3xl animate-morph"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-8 shadow-xl">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground">
              <Zap className="h-5 w-5 text-background" />
            </div>
            <span className="text-xl font-bold">Prompt2Web</span>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex rounded-xl bg-muted p-1">
            {["login", "signup"].map((t) => (
              <button
                key={t}
                onClick={() => setMode(t as any)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${mode === t
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === "login" ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "login" ? 10 : -10 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {mode === "signup" && (
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/30"
                  required
                />
              )}

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/30"
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 pr-10 outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "login" ? "Sign In" : "Create Account"}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background/50 py-3 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
              >
                {googleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                Google
              </button>
            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}

