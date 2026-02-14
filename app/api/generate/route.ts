import { NextRequest, NextResponse } from "next/server"
import { callOpenRouter, getSystemPrompt } from "@/lib/ai-service"

export async function POST(request: NextRequest) {
  try {
    const { prompt, analysis, steps } = await request.json()

    const userPrompt = `Build a professional website based on this analysis and plan:
Analysis: ${analysis}
Plan: ${steps.join(", ")}
Target: ${prompt}`

    const content = await callOpenRouter([
      { role: "system", content: getSystemPrompt() },
      { role: "user", content: userPrompt },
    ], "google/gemini-2.0-flash-exp:free")

    // Robust extraction: find first { and last }
    try {
      const startIdx = content.indexOf("{")
      const endIdx = content.lastIndexOf("}")
      if (startIdx !== -1 && endIdx !== -1) {
        const jsonStr = content.substring(startIdx, endIdx + 1)
        const parsed = JSON.parse(jsonStr)
        return NextResponse.json(parsed)
      }
      throw new Error("No JSON object found")
    } catch (err) {
      console.error("Generate parsing error:", err, content)
      return NextResponse.json(
        { error: "Failed to parse AI response as JSON", raw: content.substring(0, 500) },
        { status: 500 }
      )
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
