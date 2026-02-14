"use server"

import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: "prompt2web-auth",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}

const db = getFirestore()

export async function getAllUsers() {
  const snap = await db.collection("users").get()
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function updateUserPlan(uid: string, plan: string) {
  await db.collection("users").doc(uid).update({ plan })
}

export async function getAdminSettings() {
  const doc = await db.collection("settings").doc("admin").get()
  return doc.exists ? doc.data() : null
}

export async function updateAdminSettings(data: any) {
  await db.collection("settings").doc("admin").set(data, { merge: true })
}
