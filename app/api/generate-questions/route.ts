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
          content: `You are a warm, perceptive career coach having a genuine one-on-one conversation.
Generate exactly 7 deeply personalised career reflection questions based on this CV.

Rules:
- Each question MUST reference a specific detail from the CV (company name, role title, technology, timeline, domain)
- Tone: curious, empathetic, coaching — not clinical or generic
- Cover these 7 themes in order: (1) what drew them to their current/most recent role, (2) a peak moment or proudest achievement, (3) a frustration or thing they'd change, (4) what energises them vs drains them, (5) a skill they feel underrated for, (6) their ideal next role and why, (7) what success looks like in 2 years
- For each question, also write a short "hint" — a warm, 1-sentence prompt to help them reflect (e.g. "Think about a moment when time flew by and you felt completely absorbed.")

Return JSON: { "questions": [{ "text": string, "hint": string }] }`,
        },
        { role: 'user', content: cvText },
      ],
      response_format: { type: 'json_object' },
    })
    const content = completion.choices[0].message.content || '{}'
    const parsed = JSON.parse(content) as { questions?: { text: string; hint: string }[] }
    return NextResponse.json({ questions: parsed.questions || [] })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
