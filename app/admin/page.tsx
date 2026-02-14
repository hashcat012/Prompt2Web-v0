"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Shield,
  Users,
  Zap,
  ArrowLeft,
  Save,
  Loader2,
  Search,
  ChevronDown,
  BarChart3,
  Settings,
  Key,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import {
  getAllUsers,
  updateUserPlan,
  getAdminSettings,
  updateAdminSettings,
} from "@/lib/firebase-server"
import { toast } from "sonner"
import Link from "next/link"

interface UserRecord {
  id: string
  username?: string
  email?: string
  plan?: string
  isAdmin?: boolean
  promptsUsed?: number
}

export default function AdminPage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [lemonSqueezyKey, setLemonSqueezyKey] = useState("")
  const [savingSettings, setSavingSettings] = useState(false)
  const [activeTab, setActiveTab] = useState<"users" | "settings">("users")

  useEffect(() => {
    if (!loading && (!user || !userData?.isAdmin)) {
      router.push("/builder")
      return
    }

    async function fetchData() {
      try {
        const [allUsers, settings] = await Promise.all([
          getAllUsers(),
          getAdminSettings(),
        ])
        setUsers(allUsers as UserRecord[])
        if (settings?.lemonSqueezyKey) {
          setLemonSqueezyKey(settings.lemonSqueezyKey as string)
        }
      } catch (err) {
        toast.error("Failed to load admin data")
      } finally {
        setLoadingUsers(false)
      }
    }

    if (userData?.isAdmin) {
      fetchData()
    }
  }, [user, userData, loading, router])

  const handlePlanChange = async (userId: string, newPlan: string) => {
    try {
      await updateUserPlan(userId, newPlan)
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, plan: newPlan } : u))
      )
      toast.success("Plan updated")
    } catch {
      toast.error("Failed to update plan")
    }
  }

  const handleSaveSettings = async () => {
    setSavingSettings(true)
    try {
      await updateAdminSettings({ lemonSqueezyKey })
      toast.success("Settings saved")
    } catch {
      toast.error("Failed to save settings")
    } finally {
      setSavingSettings(false)
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      (u.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalFree = users.filter((u) => u.plan === "free" || !u.plan).length
  const totalPro = users.filter((u) => u.plan === "pro").length
  const totalMax = users.filter((u) => u.plan === "max").length
  const totalPrompts = users.reduce((acc, u) => acc + (u.promptsUsed || 0), 0)

  if (loading || loadingUsers) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!userData?.isAdmin) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/builder"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Shield className="h-5 w-5 text-foreground" />
            <span className="text-lg font-semibold text-foreground">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <Zap className="h-4 w-4 text-background" />
            </div>
            <span className="text-sm font-medium text-foreground">Prompt2Web</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Total Users", value: users.length, icon: Users },
            { label: "Free Users", value: totalFree, icon: Users },
            { label: "Pro Users", value: totalPro, icon: Zap },
            { label: "Total Prompts", value: totalPrompts, icon: BarChart3 },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 rounded-xl bg-muted p-1">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "users"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" />
            Users
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "settings"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>

        {activeTab === "users" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6"
          >
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/30"
              />
            </div>

            {/* Users table */}
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Plan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Prompts</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-border last:border-0 bg-card hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-foreground">{u.username || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{u.email || "N/A"}</td>
                      <td className="px-4 py-3">
                        <select
                          value={u.plan || "free"}
                          onChange={(e) => handlePlanChange(u.id, e.target.value)}
                          className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none"
                        >
                          <option value="free">Free</option>
                          <option value="pro">Pro</option>
                          <option value="max">Max</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{u.promptsUsed || 0}</td>
                      <td className="px-4 py-3">
                        {u.isAdmin ? (
                          <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-medium text-background">
                            Admin
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">User</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">No users found</div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 max-w-xl"
          >
            {/* Lemon Squeezy settings */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Key className="h-5 w-5 text-foreground" />
                <h3 className="text-base font-semibold text-foreground">Lemon Squeezy API Key</h3>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                Enter your Lemon Squeezy API key to enable payment processing for Pro and Max plans.
              </p>
              <input
                type="password"
                value={lemonSqueezyKey}
                onChange={(e) => setLemonSqueezyKey(e.target.value)}
                placeholder="ls_live_..."
                className="mb-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/30"
              />
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="flex items-center gap-2 rounded-xl bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90 disabled:opacity-60"
              >
                {savingSettings ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Settings
              </button>
            </div>

            {/* DB Stats */}
            <div className="mt-6 rounded-xl border border-border bg-card p-6">
              <h3 className="text-base font-semibold text-foreground mb-3">Database Overview</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Total Users</span>
                  <span className="text-sm font-medium text-foreground">{users.length}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Free / Pro / Max</span>
                  <span className="text-sm font-medium text-foreground">{totalFree} / {totalPro} / {totalMax}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Total Prompts Used</span>
                  <span className="text-sm font-medium text-foreground">{totalPrompts}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
