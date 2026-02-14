import { NextRequest, NextResponse } from "next/server"
import { analyzePrompt, createPlan } from "@/lib/ai-service"

export async function POST(request: NextRequest) {
    try {
        const { prompt } = await request.json()
        console.log("[PLAN API] Received prompt:", prompt)

        // Step 1: Analyze
        console.log("[PLAN API] Analyzing prompt...")
        const analysis = await analyzePrompt(prompt)

        // Step 2: Create custom plan
        console.log("[PLAN API] Creating plan...")
        const steps = await createPlan(prompt, analysis)

        console.log("[PLAN API] Plan created successfully:", steps)
        return NextResponse.json({ analysis, steps })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
