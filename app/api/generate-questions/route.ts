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
- "text": the question itself — flows naturally from the cv_anchor, specific and human. IMPORTANT: never repeat a company name or other identifying proper noun from cv_anchor inside "text" — refer back to it generically instead ("that move", "your time there", "this transition", "the company you joined after"). The cv_anchor already carries the specific detail; "text" should still make sense as a question even read on its own, without naming the company again.
- "hint": one sentence that helps them access the memory or feeling — not a generic prompt, something that opens the door

Tone: like a brilliant coach who has done their homework. Warm but not soft. Curious but not clinical.

Also return "companies": every company/organisation name that appears anywhere in the CV (for our own internal bookkeeping, not shown to the user).

Return JSON:
{
  "companies": string[],
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
    const parsed = JSON.parse(content) as {
      companies?: string[]
      pillars?: { name: string; questions: { text: string; cv_anchor?: string; hint: string; sample_answers?: { text: string; designation: string }[] }[] }[]
    }
    const pillars = parsed.pillars || []
    const companies = parsed.companies || []

    // The model sometimes ignores the "don't repeat the company name in text"
    // instruction above, so redact known company names before this text is used
    // to generate sample answers — otherwise they leak straight through into the
    // "generic" examples too.
    const redactCompanies = (text: string): string => {
      let result = text
      for (const company of [...companies].sort((a, b) => b.length - a.length)) {
        if (!company) continue
        const escaped = company.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        result = result.replace(new RegExp(escaped, 'gi'), 'that company')
      }
      return result
    }

    // Second pass — generate sample answers from the question text ALONE, with no CV
    // in context (and with any company names redacted), so they read as generic,
    // broadening perspectives rather than echoes of the user's own career details.
    const flatQuestions = pillars.flatMap(p => p.questions.map(q => redactCompanies(q.text)))
    if (flatQuestions.length > 0) {
      try {
        const sampleCompletion = await groq.chat.completions.create({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: `You write illustrative example answers for career-reflection questions, to help someone who's stuck see a few different angles before writing their own answer in their own words.

You are NOT given any information about the specific person answering — only the question text. That is intentional: the examples must be generic, professional, and broadening, not tailored to any one career story.

For EACH question, write exactly 3 short example answers (1–2 sentences each), in first person, each attributed to a distinct, plausible professional designation (e.g. "VP of Engineering, 12 yrs", "Marketing Lead, 6 yrs", "Operations Director, 9 yrs"). Across the 3 examples for a given question, deliberately vary the industry, seniority, and scenario as much as possible — put them in DIFFERENT, unrelated industries from each other and, where the question itself implies a domain (e.g. "payments", "engineering"), actively pick examples from industries outside that domain too. The goal is to show the reader a spread of different professional lives, not one consistent persona or sector.

CRITICAL — vary designations across the WHOLE batch, not just within one question: you are answering many questions in this one request, and it will look obviously templated if the same designation (e.g. "Product Manager, 4 yrs") shows up as the answer to nearly every question. Treat every single designation across all questions as a chance to use a NEW title, seniority, and industry you haven't used yet in this batch — draw from a wide pool (engineering, sales, HR, legal, manufacturing, healthcare, education, hospitality, finance, design, operations, nonprofit, government, retail, media, logistics, at every seniority from a few years in to 20+ years) and only repeat a designation if you've genuinely exhausted fresh options.

Never name a real company (no Flipkart, Amazon, Google, etc.) — describe the employer generically instead ("a mid-sized logistics firm", "a 200-person fintech startup", "a regional hospital network"). Each answer should still be concrete (a specific scenario or detail), just not tied to any real or identifiable organisation.

Return JSON:
{ "answers": [ { "sample_answers": [{ "text": string, "designation": string }, { "text": string, "designation": string }, { "text": string, "designation": string }] }, ... one entry per question, in the exact order given ] }`,
            },
            { role: 'user', content: flatQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n\n') },
          ],
          response_format: { type: 'json_object' },
          max_tokens: 3500,
        })
        const sampleContent = sampleCompletion.choices[0].message.content || '{}'
        const sampleParsed = JSON.parse(sampleContent) as { answers?: { sample_answers?: { text: string; designation: string }[] }[] }
        const sampleAnswers = sampleParsed.answers || []

        let idx = 0
        for (const pillar of pillars) {
          for (const q of pillar.questions) {
            q.sample_answers = sampleAnswers[idx]?.sample_answers || []
            idx++
          }
        }
      } catch {
        // sample answers are a nice-to-have — proceed without them if this pass fails
      }
    }

    return NextResponse.json({ pillars })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
