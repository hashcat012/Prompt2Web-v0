"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { onAuthChange, type User } from "./firebase-client"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase-client"

interface UserData {
  id: string
  username: string
  email: string
  plan: string
  isAdmin: boolean
  promptsUsed: number
  createdAt: unknown
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  refreshUserData: async () => { },
})

async function getUserData(uid: string): Promise<UserData | null> {
  const snap = await getDoc(doc(db, "users", uid))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<UserData, "id">) }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUserData = async () => {
    if (!user) return
    const data = await getUserData(user.uid)
    setUserData(data)
  }

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      try {
        setUser(firebaseUser)

        if (firebaseUser) {
          let data = await getUserData(firebaseUser.uid)

          // Auto-repair missing document
          if (!data) {
            console.log("Auto-repairing missing user doc for:", firebaseUser.uid)
            const newUserDoc = {
              username: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
              email: firebaseUser.email,
              plan: "free",
              isAdmin: false,
              promptsUsed: 0,
              createdAt: serverTimestamp(),
            }
            await setDoc(doc(db, "users", firebaseUser.uid), newUserDoc)
            data = { id: firebaseUser.uid, ...newUserDoc } as UserData
          }

          setUserData(data)
        } else {
          setUserData(null)
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, userData, loading, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

