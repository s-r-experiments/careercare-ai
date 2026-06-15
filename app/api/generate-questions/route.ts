import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY || '' })
}

export async function POST(req: NextRequest) {
  try {
    const { cvText } = await req.json()
    const groq = getGroq()
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a warm, perceptive career coach who has just carefully read someone's CV and is now sitting down with them for a genuine one-on-one conversation.

Generate exactly 7 deeply personalised career reflection questions based on this CV.

Rules:
- Before each question, write a "cv_anchor": a 1–2 sentence warm observation that references a SPECIFIC detail from the CV — a company name, a career switch, a time gap, a tenure length, a role transition, a domain shift. This is what you, the coach, noticed when reading their CV. Start with phrases like "We noticed you...", "Looking at your journey...", "Your CV shows...", "You've made several moves — from [X] to [Y]...", "We see you spent [N] years at [Company]..." Make it feel like you truly read their CV and are referencing something real.
- The main question ("text") then flows naturally from that anchor — it should feel like you're asking because of what you noticed, not despite it
- When a question might be hard or when they might not yet have a clear answer, acknowledge it gently (e.g. "You might not have full clarity on this yet — and that's exactly what we want to explore together.")
- Tone: curious, empathetic, human — not a form, not clinical, not generic
- Cover these 7 themes in order: (1) what drew them to their current/most recent role, (2) a peak moment or proudest achievement, (3) a frustration or thing they'd change, (4) what energises them vs drains them, (5) a skill they feel underrated for, (6) their ideal next role and why, (7) what success looks like in 2 years
- For each question, also write a short "hint" — a warm, 1-sentence prompt to help them reflect (e.g. "Think about a moment when time flew by and you felt completely absorbed.")

Return JSON: { "questions": [{ "text": string, "cv_anchor": string, "hint": string }] }`,
        },
        { role: 'user', content: cvText },
      ],
      response_format: { type: 'json_object' },
    })
    const content = completion.choices[0].message.content || '{}'
    const parsed = JSON.parse(content) as { questions?: { text: string; cv_anchor?: string; hint: string }[] }
    return NextResponse.json({ questions: parsed.questions || [] })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
