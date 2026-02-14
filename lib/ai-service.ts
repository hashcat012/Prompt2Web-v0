const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ""
const GROQ_API_KEY = process.env.GROQ_API_KEY || ""

export type ModelProvider = "openrouter" | "groq"

export interface AIMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export async function callOpenRouter(messages: AIMessage[], model: string = "google/gemini-2.0-flash-exp:free") {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://prompt2web.vercel.app",
      "X-Title": "Prompt2Web",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 16000,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenRouter API error: ${err}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ""
}

export async function callGroq(messages: AIMessage[], model: string = "llama-3.3-70b-versatile") {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 8000,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Groq API error: ${err}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ""
}

// Specialized Functions
export async function analyzePrompt(prompt: string) {
  // Use a fast model for analysis (Llama 8B or Gemini Flash)
  const system = "You are an expert project analyzer. Analyze the user prompt and extract key requirements, technical needs, and stylistic preferences. Respond in a clear, brief format (max 100 words)."
  return callGroq([
    { role: "system", content: system },
    { role: "user", content: prompt }
  ], "llama-3.1-8b-instant")
}

export async function createPlan(prompt: string, analysis: string) {
  // Use a smart model for planning
  const system = `You are an Elite Architect. Based on the prompt and analysis, create a detailed 6-8 step plan for building this website. 
Respond ONLY with a JSON array of strings. Example: ["Step 1...", "Step 2..."]`
  const result = await callGroq([
    { role: "system", content: system },
    { role: "user", content: `Prompt: ${prompt}\nAnalysis: ${analysis}` }
  ], "llama-3.3-70b-versatile")

  try {
    const startIdx = result.indexOf("[")
    const endIdx = result.lastIndexOf("]")
    if (startIdx !== -1 && endIdx !== -1) {
      const jsonStr = result.substring(startIdx, endIdx + 1)
      return JSON.parse(jsonStr)
    }
    throw new Error("No JSON array found")
  } catch (err) {
    console.error("Plan parsing error:", err, result)
    return [
      "Architecting the project structure",
      "Designing the responsive foundation",
      "Building core components",
      "Implementing visual styling",
      "Adding animations & transitions",
      "Optimizing global performance"
    ]
  }
}

export function getSystemPrompt() {
  return `You are Prompt2Web Elite Architect, the world's most advanced AI web developer. You create breathtaking, ultra-premium websites.

CRITICAL RULES:
1. Respond ONLY with a single JSON object. No markdown blocks, no text before or after.
2. Structure: index.html must be in the root. Styles in src/css/, logic in src/js/.
3. Design: Use "Liquid Glass" - deep blurs (backdrop-filter), vibrant mesh gradients, glossy surfaces, and subtle neumorphic shadows.
4. Typography: Use premium Google Fonts (Outfit, Inter, Playfair Display).
5. Animations:
   - Intersection Observer for scroll-triggered "reveal" effects.
   - Smooth parallax on hero sections.
   - Micro-interactions on every button and card (magnetic effects, glow).
6. Completeness: NEVER truncate. Every file must be 100% complete and functional.

JSON Schema:
{
  "projectName": "string",
  "description": "string",
  "files": [
    { "path": "string", "content": "string", "language": "html|css|javascript|json" }
  ]
}`
}
