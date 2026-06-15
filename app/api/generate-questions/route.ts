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
          content: `You are a deeply perceptive career coach who has just carefully read someone's CV. You will conduct a 3-round reflection across 4 pillars.

Generate 12 highly personalised questions — 3 rounds × 4 pillars — designed to surface insights that go far beyond what the CV alone reveals.

The 4 pillars:
1. "Your Story" — the arc of their career, what they've built and what they've walked away from
2. "What Matters Most" — what actually drives them, what they need from work that they rarely say aloud
3. "Personal Patterns" — the strengths they take for granted, the ways of working they don't notice in themselves
4. "Possible Directions" — where their story is pointing, what they're moving toward and what they're moving away from

ROUND 1 — Anchor in specific moments. Do NOT ask "what motivates you" — ask them to DESCRIBE A SPECIFIC TIME. The answer to a specific moment reveals far more than a general reflection. Questions should be easy to start answering but open-ended enough to go deep.
Good: "Tell us about a specific project where you felt completely absorbed — what were you actually doing day to day?"
Bad: "What kind of work do you enjoy?"

ROUND 2 — Go where it's slightly uncomfortable. Ask about friction, trade-offs, and what they don't talk about. Probe what they're uncertain or ambivalent about. Surface the thing they might have glossed over in Round 1.
Good: "You described that project as a highlight — but what about it quietly frustrated you, even if it was successful?"
Bad: "What are your areas for improvement?"

ROUND 3 — The questions a coach asks when they really know you. Challenge assumptions gently. Surface what they haven't admitted yet. Ask about the version of their career they're not pursuing and why. These should feel like they came from someone who has been listening carefully.
Good: "You haven't mentioned [specific pattern from CV]. Is that a chapter you've closed deliberately, or one you haven't revisited?"
Bad: "Where do you see yourself in 5 years?"

For EACH question:
- "cv_anchor": 1–2 warm sentences referencing a SPECIFIC detail from the CV — company name, a transition, a gap, a tenure length, a domain shift. Must feel like you truly read their story. Start with "We noticed...", "Your CV shows...", "You've moved from [X] to [Y]...", "We see you spent [N] years at [Company]..."
- "text": the question itself — flows naturally from the cv_anchor, specific and human
- "hint": one sentence that helps them access the memory or feeling — not a generic prompt, something that opens the door

Tone: like a brilliant coach who has done their homework. Warm but not soft. Curious but not clinical.

Return JSON:
{
  "pillars": [
    {
      "name": "Your Story",
      "questions": [
        { "text": string, "cv_anchor": string, "hint": string },
        { "text": string, "cv_anchor": string, "hint": string },
        { "text": string, "cv_anchor": string, "hint": string }
      ]
    },
    { "name": "What Matters Most", "questions": [ ...3 questions... ] },
    { "name": "Personal Patterns", "questions": [ ...3 questions... ] },
    { "name": "Possible Directions", "questions": [ ...3 questions... ] }
  ]
}`,
        },
        { role: 'user', content: cvText },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 3000,
    })
    const content = completion.choices[0].message.content || '{}'
    const parsed = JSON.parse(content) as { pillars?: { name: string; questions: { text: string; cv_anchor?: string; hint: string }[] }[] }
    return NextResponse.json({ pillars: parsed.pillars || [] })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
