import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { SERVICE_UNAVAILABLE_MESSAGE } from '../../lib/errors'

function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY || '' })
}

// Michael Page India Salary Guide 2026 — used to ground the indicative salary range insight
const SALARY_BENCHMARKS = `
=== INDIA SALARY BENCHMARKS 2026 (Michael Page, base CTC ₹L/year, excl. bonuses/ESOPs) ===

TECHNOLOGY – Software / Product / Fintech companies:
  Software Development:    4-10yr→30-60L  | 10-15yr→50-100L | 15-20yr→80-150L  | 20yr+→150-200L
  Product Management:      4-10yr→35-70L  | 10-15yr→70-140L | 15-20yr→140-200L | 20yr+→180-250L
  Data Engineering:        3-6yr→30-45L   | 6-10yr→45-70L   | 10-15yr→70-100L  | 15yr+→100-150L
  AI/ML (Traditional):     3-6yr→30-50L   | 6-10yr→50-80L   | 10-15yr→80-130L  | 15yr+→130-200L
  AI/ML (GenAI/New Age):   3-6yr→35-60L   | 6-10yr→60-90L   | 10-15yr→90-150L  | 15yr+→150-250L
  DevOps:                  4-10yr→25-55L  | 10-15yr→40-100L | 15-20yr→80-150L  | 20yr+→140-180L
  Cybersecurity:           4-10yr→35-55L  | 10-15yr→55-70L  | 15-20yr→65-90L   | 20yr+→85-120L
  CTO / Head of Eng:       4-10yr→50-90L  | 10-15yr→70-150L | 15-20yr→120-200L | 20yr+→170-350L
  QA / Testing:            4-10yr→25-45L  | 10-15yr→45-70L  | 15-20yr→75-110L  | 20yr+→110-150L

TECHNOLOGY – GCCs (Mid/Large Captive Centres):
  App Development:         5-10yr→40-65L  | 10-15yr→50-85L  | 15-20yr→75-100L  | 20yr+→90-130L
  Data Eng/Architecture:   5-10yr→30-55L  | 10-15yr→45-65L  | 15-20yr→55-80L   | 20yr+→75-100L
  AI/ML:                   6-10yr→60-90L  | 10-15yr→90-150L | 15yr+→150-250L
  Head of GCC:             10-15yr→80-150L | 15-20yr→150-250L | 20yr+→300-500L

BANKING & FINANCIAL SERVICES:
  Investment Banking (MNC):    AVP→55-90L  | VP→100-150L | Dir→160-220L | MD→250-400L
  Private Equity (Global):     Assoc→60-120L | VP→130-200L | Dir→185-400L | MD→400-600L
  Corporate Banking (MNC, Sales): AVP→18-28L | VP→30-80L | Dir→70-110L | MD→100-180L
  Risk Management (MNC):       AVP→25-35L  | VP→35-55L   | Dir→55-70L   | MD→100-150L
  CFO (Large Co):              100-200L | CFO (Very Large Co): 150-300L
  Fintech/NBFC (Risk/Compliance): AVP→16-26L | VP→35-60L | Dir→60-100L | MD→100-180L

FINANCE & ACCOUNTING:
  Financial Controller:    AVP→35-45L | VP→45-65L  | Dir→70-100L
  FP&A / Business Finance: AVP→20-35L | VP→35-50L  | Dir→55-70L
  Treasury / Fund Raising: AVP→35-45L | VP→45-65L  | Dir→75-100L
  Internal Audit (MNC):    AVP→22-32L | VP→32-60L  | Dir→50-100L | MD→100-180L

SALES & MARKETING:
  Sales/Channel (Top B-School): 3-5yr→22-38L  | 5-10yr→30-70L | 10-15yr→60-110L | 15-22yr→80-180L
  Sales/Channel (General):      3-5yr→12-26L  | 5-10yr→24-55L | 10-15yr→40-90L  | 15-22yr→70-140L
  Brand / Category Management:  3-5yr→19-28L  | 5-10yr→24-65L | 10-15yr→45-110L
  Digital Marketing:            3-5yr→16-24L  | 5-10yr→30-60L | 10-15yr→50-110L | 15yr+→60-100L
  D2C E-commerce:               3-5yr→12-30L  | 5-10yr→30-70L | 10-15yr→60-120L | 15yr+→80-180L

HUMAN RESOURCES:
  HR Business Partner / Generalist: 3-5yr→12-20L | 5-10yr→20-40L | 10-15yr→35-65L | 15yr+→60-120L
  Talent Acquisition:              3-5yr→8-15L  | 5-10yr→15-30L | 10-15yr→25-50L
  HRBP (MNC, Senior):              5-10yr→25-45L | 10-15yr→40-70L | 15yr+→70-150L
  CHRO (Large Org):                150-300L+

PROCUREMENT & SUPPLY CHAIN:
  Supply Chain (FMCG/Top B-School): 3-5yr→25-40L | 5-10yr→40-70L | 10-15yr→70-100L | 15yr+→90-140L
  Strategic Sourcing (Top B-School): 3-5yr→20-45L | 5-10yr→50-85L | 10-15yr→90-130L | 15yr+→125-250L
  Logistics / Warehousing:           3-5yr→25-40L | 5-10yr→40-70L | 10-15yr→70-100L | 15yr+→90-140L

LEGAL (In-house):
  General Counsel (Large Co): 150-250L | Very Large Co: 250L+
  In-house Lawyer:            5-10yr→20-60L | 10-15yr→40-100L | 15yr+→75L+

ENGINEERING & MANUFACTURING:
  CTO (Manufacturing):   Sr→80-130L | Exec→170-250L
  Head of Engineering:   10-15yr→35-80L | 15-20yr→60-120L | 20yr+→100-180L
  R&D / Technical Lead:  5-10yr→15-35L  | 10-15yr→25-55L  | 15yr+→50-100L

HEALTHCARE & LIFE SCIENCES:
  Medical Affairs:       3-5yr→8-18L | 5-10yr→12-40L | 10-15yr→30-60L | 15yr+→50-120L
  Sales (Pharma, pedigree): 3-5yr→12-25L | 5-10yr→18-40L | 10-15yr→35-60L | 15yr+→50-150L

MARKET CONTEXT 2026:
  - General annual increment: 8-12% across most industries
  - Job change premium: 15-25% typical increase
  - Niche/AI skills premium: up to 30% when switching
  - GCC sector growth remains the strongest talent magnet
  - Private equity and fintech driving highest comp at senior levels
`

export async function POST(req: NextRequest) {
  try {
    const { cvText, questions, answers, mode, recordId, depth } = await req.json() as {
      cvText: string
      questions: string[]
      answers: string[]
      mode?: 'full' | 'quick'
      recordId?: string
      depth?: number
    }

    const isQuickMode = mode === 'quick' || questions.length === 0

    const qa = isQuickMode
      ? '[No interview conducted — analysis based on CV only]'
      : questions.map((q: string, i: number) => `Q: ${q}\nA: ${answers[i] || '(no answer)'}`).join('\n\n')

    const depthLabel = !depth || depth === 0 ? 'CV-only'
      : depth < 4 ? `${depth}/12 questions answered (low depth)`
      : depth < 8 ? `${depth}/12 questions answered (mid depth)`
      : depth < 12 ? `${depth}/12 questions answered (high depth)`
      : '12/12 questions answered (excellent depth — full reflection)'

    const modeInstruction = isQuickMode
      ? 'The user chose quick CV-only analysis — no interview was conducted. Derive all insights from the CV alone. Be explicit where inferences are based on observable career patterns rather than stated preferences.'
      : `The user completed a reflective interview (${depthLabel}). Use both the CV and the interview answers to build a rich, personalised narrative. The more questions answered, the more you should draw on what the user said rather than inferring.`

    const groq = getGroq()
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a deeply perceptive career coach who has just conducted an in-depth interview. You have the person's CV AND their actual answers to reflective questions. ${modeInstruction}

YOUR CORE OBLIGATION: Do not generate plausible-sounding generic insights. Surface what THIS specific person's story reveals, using their own words as evidence. A stranger reading your output should feel it could only have been written about this one person.

FIVE RULES THAT CANNOT BE BROKEN:

1. CITE THE USER'S WORDS IN EVERY INSIGHT. Each strength and gap must reference a specific thing they said or a specific CV moment. Quote them directly or paraphrase closely — "When you described X...", "Your answer about Y showed...", "You mentioned that...". If they gave short answers, note it: "You didn't say much about X, which itself is worth reflecting on."

2. FIND AND NAME THE TENSIONS. Look hard for where the CV contradicts what they said, where two of their answers conflict, or where their stated aspirations clash with their observed patterns. These are the most valuable insights a coach can offer. Example: "Your CV shows 6 years of steady team-building, yet you said you want an individual contributor role — that tension is worth sitting with."

3. EXTRACT SIGNAL MOMENTS. Identify the 2–3 moments in their interview where something important slipped through — a specific phrase, an admission, an enthusiasm they didn't name as such, or a conspicuous silence. Name precisely what it reveals about them.

4. MAP THEIR ENERGY HONESTLY. From what they said energises and drains them, describe — in concrete terms — what kind of work, environment, pace, and culture would allow them to thrive versus slowly erode them. Be specific, not aspirational.

5. USE THEIR OWN LANGUAGE. The positioning statement must sound like THEM, not a LinkedIn headline generator. Pull their actual phrases and cadence. If they speak plainly, the statement should be plain. If they used a striking metaphor, use it.

To estimate an indicative salary range for their next move, ground it in this real benchmark data — do not invent figures that ignore it:
${SALARY_BENCHMARKS}

Produce a JSON object matching this exact shape:
{
  "name": string,
  "positioning_statement": string,
  "summary": {
    "headline": string,
    "key_points": string[]
  },
  "signal_moments": [
    { "quote": string, "insight": string }
  ],
  "tensions": [
    { "observation": string, "implication": string }
  ],
  "energy_map": {
    "energises": string[],
    "drains": string[],
    "ideal_environment": string
  },
  "current_state": {
    "role": string,
    "company": string,
    "experience": string,
    "domain": string,
    "ctc_approx": string,
    "notice_period": string
  },
  "target_state": {
    "roles": string[],
    "sectors": string[],
    "location": string,
    "timeline": string,
    "salary_min": string,
    "salary_max": string,
    "salary_aspirational": string,
    "salary_basis": string
  },
  "top_strengths": [{ "strength": string, "evidence": string, "cited_from": string, "interview_story": string, "relevance": string }],
  "key_gaps": [{ "gap": string, "surfaced_by": string, "impact": string, "action": string, "timeline": string }],
  "action_plan": [{ "phase": string, "action": string, "category": string, "priority": string, "target_date": string, "notes": string }],
  "next_steps": {
    "industry_outlook": string,
    "company_categories": string[],
    "priority_skills": [{ "skill": string, "why": string }],
    "market_timing": string
  }
}

Rules:
- summary.headline: one punchy sentence in their own register — who they are and where they're headed
- summary.key_points: exactly 3 bullets — one on their defining strength (cited from interview), one on their most important gap, one on the single most important next action
- signal_moments: exactly 3 items. "quote" = a verbatim phrase or close paraphrase of something they said that reveals something important. "insight" = 2 sentences on what it means for their career
- tensions: exactly 2 items. "observation" = the specific contradiction (CV vs stated, or answer vs answer). "implication" = 2 sentences on what this means for their next move
- energy_map.energises: exactly 4 specific activities/situations (e.g. "Designing systems that scale across teams", not "problem solving")
- energy_map.drains: exactly 4 specific activities/situations
- energy_map.ideal_environment: 3 concrete sentences — culture, pace, team structure — based on their actual answers
- top_strengths: exactly 5 items. "cited_from" = "When you said '...' / Your answer about X / Your CV shows Y years of..." — must be specific
- key_gaps: exactly 4 items. "surfaced_by" = what in the interview or CV revealed this gap — be specific
- action_plan: exactly 16 items (4 per phase). Phases: "Days 1–15 (Foundation)" | "Days 16–30 (Network + Prep)" | "Days 31–45 (Active Search)" | "Days 46–90 (Offers)"
- company_categories: exactly 4 concrete types derived from their energy map and targets
- priority_skills: exactly 3 skills, each connected to something they said or a gap you identified
- salary_min / salary_max: an indicative annual CTC range (e.g. "₹70L" and "₹110L") for their realistic next move, chosen by matching their role/domain/seniority/years of experience against the INDIA SALARY BENCHMARKS table above. Interpolate sensibly if their experience falls between listed brackets
- salary_aspirational: a single stretch figure (e.g. "₹130L") applying the job-change or niche-skill premium noted in the Market Context section of the benchmarks, if it plausibly applies to them
- salary_basis: one short sentence naming exactly which row/category and seniority bracket you matched them to (e.g. "Matched to Product Management, 10-15 yrs, Technology sector"). If their CV/target is clearly outside India, say so explicitly and still give your best indicative range with that caveat
- Return only valid JSON, no markdown`,
        },
        {
          role: 'user',
          content: `CV:\n${cvText}\n\nInterview Q&A:\n${qa}`,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 7000,
    })

    const content = completion.choices[0].message.content || '{}'
    let synthesis: unknown
    try {
      synthesis = JSON.parse(content)
    } catch {
      return NextResponse.json({ error: 'Failed to parse synthesis' }, { status: 500 })
    }

    // Fire-and-forget: save session Q&A to Google Sheets Sessions tab
    const webhookUrl = process.env.FEEDBACK_WEBHOOK_URL
    if (webhookUrl && recordId) {
      const qaRows = questions.map((q, i) => ({ q, a: answers[i] || '' }))
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'session',
          recordId,
          mode: mode || 'full',
          name: (synthesis as Record<string, string>)?.name || '',
          qa: qaRows,
        }),
        redirect: 'manual',
      }).catch(() => {})
    }

    return NextResponse.json({ synthesis })
  } catch (e: unknown) {
    console.error('synthesise failed:', e)
    return NextResponse.json({ error: SERVICE_UNAVAILABLE_MESSAGE }, { status: 500 })
  }
}
