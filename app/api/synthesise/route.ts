import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY || '' })
}

export async function POST(req: NextRequest) {
  try {
    const { cvText, questions, answers } = await req.json() as {
      cvText: string
      questions: string[]
      answers: string[]
    }
    const qa = questions.map((q: string, i: number) => `Q: ${q}\nA: ${answers[i] || ''}`).join('\n\n')

    const groq = getGroq()
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert career coach synthesising a comprehensive career analysis. Based on the CV and Q&A answers, produce a JSON object matching this exact shape:
{
  "name": string,
  "positioning_statement": string,
  "current_state": { "role": string, "company": string, "experience": string, "domain": string, "ctc_approx": string, "notice_period": string },
  "target_state": { "roles": string[], "sectors": string[], "location": string, "salary_min": string, "salary_max": string, "salary_aspirational": string, "timeline": string },
  "top_strengths": [{ "strength": string, "evidence": string, "interview_story": string, "relevance": string }],
  "key_gaps": [{ "gap": string, "impact": string, "action": string, "timeline": string }],
  "action_plan": [{ "phase": string, "action": string, "category": string, "priority": string, "target_date": string, "notes": string }]
}
top_strengths must have exactly 5 items. key_gaps must have exactly 4 items. action_plan must have exactly 16 items (4 per phase).
Phases must be exactly: "Days 1-15 (Foundation)" | "Days 16-30 (Network + Prep)" | "Days 31-45 (Active Search)" | "Days 46-90 (Offers)"
Return only valid JSON with no markdown.`,
        },
        { role: 'user', content: `CV:\n${cvText}\n\nQ&A:\n${qa}` },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4000,
    })

    const content = completion.choices[0].message.content || '{}'
    let synthesis: unknown
    try {
      synthesis = JSON.parse(content)
    } catch {
      return NextResponse.json({ error: 'Failed to parse synthesis' }, { status: 500 })
    }
    return NextResponse.json({ synthesis })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
