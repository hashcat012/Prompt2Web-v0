"use client"

import { initializeApp, getApps, getApp } from "firebase/app"
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBbFmV1FabIZc-ZI-wTr4JvAoHd67nOyys",
  authDomain: "prompt2web-auth.firebaseapp.com",
  projectId: "prompt2web-auth",
  storageBucket: "prompt2web-auth.firebasestorage.app",
  messagingSenderId: "159147217562",
  appId: "1:159147217562:web:8c80fb3f5ec6a7e1870523",
  measurementId: "G-74MFBCL19E",
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

const googleProvider = new GoogleAuthProvider()

/* ---------- AUTH ---------- */
export function onAuthChange(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb)
}

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function signInWithGoogle() {
  const { user } = await signInWithPopup(auth, googleProvider)

  // Check if user exists in Firestore
  const userDoc = await getDoc(doc(db, "users", user.uid))
  if (!userDoc.exists()) {
    await setDoc(doc(db, "users", user.uid), {
      username: user.displayName || user.email?.split("@")[0] || "User",
      email: user.email,
      plan: "free",
      isAdmin: false,
      promptsUsed: 0,
      createdAt: serverTimestamp(),
    })
  }
  return user
}

export async function signUp(email: string, password: string, username: string) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  await setDoc(doc(db, "users", user.uid), {
    username,
    email,
    plan: "free",
    isAdmin: false,
    promptsUsed: 0,
    createdAt: serverTimestamp(),
  })
  return user
}

export async function logOut() {
  return signOut(auth)
}

export async function incrementPromptCount(uid: string) {
  await updateDoc(doc(db, "users", uid), {
    promptsUsed: increment(1),
  })
}

export type { User }
