import { NextRequest, NextResponse } from "next/server"

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ""

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://prompt2web.vercel.app",
        "X-Title": "Prompt2Web",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          {
            role: "system",
            content: `You are a prompt enhancement AI. Take the user's website description and expand it into a detailed, professional specification. Add details about:
- Layout structure (hero, features, testimonials, CTA, footer)
- Color scheme suggestions
- Typography recommendations  
- Animation and interaction ideas
- Responsive design requirements
- Specific sections and components needed

Keep it concise (3-5 sentences) but comprehensive. Just output the enhanced prompt directly, no explanations.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ enhanced: prompt })
    }

    const data = await response.json()
    const enhanced = data.choices?.[0]?.message?.content || prompt

    return NextResponse.json({ enhanced })
  } catch {
    return NextResponse.json({ enhanced: prompt })
  }
}
