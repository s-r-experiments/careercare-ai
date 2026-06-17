'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  Upload, MessageSquare, Cpu, Download, ArrowLeft, ArrowRight,
  CheckCircle, FileText, Loader2, Star, AlertTriangle, Target,
  TrendingUp, Sparkles, ChevronRight, Lock, Building2, Briefcase,
  Users, BookOpen, Clock, MapPin, Zap, X,
} from 'lucide-react'
import Logo from '../components/Logo'

interface SampleAnswer { text: string; designation: string }
interface Question { text: string; hint: string; cv_anchor?: string; sample_answers?: SampleAnswer[] }
interface PillarData { name: string; questions: Question[] }
interface Strength { strength: string; evidence: string; cited_from?: string; interview_story: string; relevance: string }
interface Gap { gap: string; surfaced_by?: string; impact: string; action: string; timeline: string }
interface SignalMoment { quote: string; insight: string }
interface Tension { observation: string; implication: string }
interface EnergyMap { energises: string[]; drains: string[]; ideal_environment: string }
interface ActionItem { phase: string; action: string; category: string; priority: string; target_date: string; notes: string }
interface NextSteps {
  industry_outlook: string
  company_categories: string[]
  priority_skills: { skill: string; why: string }[]
  market_timing: string
}
interface Synthesis {
  name: string
  positioning_statement: string
  current_state: { role: string; company: string; experience: string; domain: string; ctc_approx: string; notice_period: string }
  target_state: { roles: string[]; sectors: string[]; location: string; timeline: string; salary_min?: string; salary_max?: string; salary_aspirational?: string; salary_basis?: string }
  top_strengths: Strength[]
  key_gaps: Gap[]
  action_plan: ActionItem[]
  next_steps: NextSteps
  summary?: { headline: string; key_points: string[] }
  signal_moments?: SignalMoment[]
  tensions?: Tension[]
  energy_map?: EnergyMap
}

const PROCESSING_MESSAGES = [
  'Reading your career story carefully…',
  'Finding the patterns running through it…',
  'Noticing your growth edges…',
  'Sketching possible directions…',
  'Finding the language for who you are…',
  'Completing your career narrative…',
]

const RESEARCH_INSIGHTS = [
  { stat: '23%', body: 'better performance on tasks after structured reflection on your work', source: 'Harvard Business School, 2014' },
  { stat: '6×', body: 'more likely to be engaged at work when you use your strengths every day', source: 'Gallup, State of the American Workplace' },
  { stat: '15%', body: 'less likely to leave a role that genuinely fits your strengths', source: 'Gallup Workplace Research' },
  { stat: '3×', body: 'higher reported quality of life among people who use their strengths daily', source: 'Gallup Wellbeing Research' },
  { stat: '12.5%', body: 'more productive when managers focus on strengths instead of weaknesses', source: 'Gallup Workplace Research' },
  { stat: 'Clarity', body: 'Greater clarity on career direction is linked to higher satisfaction and a better long-term fit', source: 'Career Success Criteria Clarity research' },
]

function pickThreeInsights(): number[] {
  const pool = RESEARCH_INSIGHTS.map((_, i) => i)
  const picked: number[] = []
  while (picked.length < 3 && pool.length) {
    picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
  }
  return picked
}

function FloatingInsights() {
  const [indices, setIndices] = useState<number[]>(() => pickThreeInsights())
  useEffect(() => {
    const t = setInterval(() => setIndices(pickThreeInsights()), 4500)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="mt-10 w-full max-w-2xl mx-auto grid sm:grid-cols-3 gap-4 px-2">
      {indices.map((idx, slot) => {
        const insight = RESEARCH_INSIGHTS[idx]
        return (
          <div
            key={`${idx}-${slot}`}
            className="insight-tile bg-white rounded-xl p-4 border border-stone-200 shadow-sm text-left"
            style={{ animationDelay: `${slot * 150}ms` }}
          >
            <p className="text-xl font-semibold text-[#1C1917] tracking-tight mb-1">{insight.stat}</p>
            <p className="text-xs text-stone-500 font-light leading-snug">{insight.body}</p>
            <p className="text-[10px] text-stone-300 mt-1.5 font-light">{insight.source}</p>
          </div>
        )
      })}
    </div>
  )
}

const STEPS = [
  { label: 'Your Story', icon: Upload },
  { label: 'The Reflection', icon: MessageSquare },
  { label: 'Finding Patterns', icon: Cpu },
  { label: 'Your Navigation', icon: Download },
]

// ── Journey stages — each is a chapter in the reflection ─────────────
const JOURNEY_STAGES = [
  {
    chapter: 'Chapter I',
    label: 'Your Story',
    sub: "Where you've been, and what you've carried forward",
    gradient: 'from-stone-900 to-stone-800',
    dim: 'bg-stone-50',
  },
  {
    chapter: 'Chapter II',
    label: 'What Matters Most',
    sub: 'The values and needs at the core of how you work',
    gradient: 'from-green-900 to-green-800',
    dim: 'bg-green-50',
  },
  {
    chapter: 'Chapter III',
    label: 'Personal Patterns',
    sub: 'The things you consistently do well — whether or not you notice',
    gradient: 'from-slate-800 to-slate-700',
    dim: 'bg-slate-50',
  },
  {
    chapter: 'Chapter IV',
    label: 'Possible Directions',
    sub: 'Where your story might naturally lead next',
    gradient: 'from-amber-900 to-amber-800',
    dim: 'bg-amber-50',
  },
]

// ── Typewriter hook ────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 16) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    setDisplayed('')
    setDone(false)
    if (!text) return
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(timer); setDone(true) }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])
  return { displayed, done }
}

// ── Staggered fade-in wrapper ──────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <div className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${className}`}>
      {children}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
export default function ToolPage() {
  const [mode, setMode] = useState<'full' | 'quick' | null>(null)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [file, setFile] = useState<File | null>(null)
  const [cvText, setCvText] = useState('')
  const [pillars, setPillars] = useState<PillarData[]>([])
  const [currentRound, setCurrentRound] = useState(1)
  const [currentPillarIdx, setCurrentPillarIdx] = useState(0)
  const [allAnswers, setAllAnswers] = useState<string[]>(Array(12).fill(''))
  const [showContinueModal, setShowContinueModal] = useState(false)
  const [synthesis, setSynthesis] = useState<Synthesis | null>(null)
  const [loading, setLoading] = useState(false)
  const [processingMsgIdx, setProcessingMsgIdx] = useState(0)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const [recordId, setRecordId] = useState('')
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackShown, setFeedbackShown] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Trigger feedback modal at 80% scroll depth on results page
  useEffect(() => {
    if (step !== 4 || feedbackShown) return
    const handleScroll = () => {
      const el = document.documentElement
      const pct = (el.scrollTop + window.innerHeight) / el.scrollHeight
      if (pct >= 0.8) {
        setFeedbackOpen(true)
        setFeedbackShown(true)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [step, feedbackShown])

  useEffect(() => {
    if (step !== 3) return
    const interval = setInterval(() => {
      setProcessingMsgIdx(i => (i + 1) % PROCESSING_MESSAGES.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [step])

  useEffect(() => {
    if (step !== 2) return
    const t = setTimeout(() => textareaRef.current?.focus(), 700)
    return () => clearTimeout(t)
  }, [step, currentPillarIdx, currentRound])

  const handleFile = (f: File) => {
    const name = f.name.toLowerCase()
    if (!name.endsWith('.pdf') && !name.endsWith('.docx') && !name.endsWith('.doc')) {
      setError('Please upload a PDF or Word document (.pdf, .docx)')
      return
    }
    setError('')
    setFile(f)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  // Core synthesis runner — takes all params directly to avoid stale state
  const runSynthesise = useCallback(async (
    textArg: string,
    questionsArg: Question[],
    answersArg: string[],
    modeArg: 'full' | 'quick',
    recordIdArg: string,
    depthArg?: number
  ) => {
    setStep(3)
    setProcessingMsgIdx(0)
    try {
      const questionTexts = questionsArg.map(q => (typeof q === 'string' ? q : q.text))
      const res = await fetch('/api/synthesise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText: textArg, questions: questionTexts, answers: answersArg, mode: modeArg, recordId: recordIdArg, depth: depthArg }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setSynthesis(data.synthesis)
      setStep(4)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Analysis failed. Please try again.')
      setStep(modeArg === 'quick' ? 1 : 2)
    }
  }, [])

  const handleAnalyse = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const parseRes = await fetch('/api/parse-cv', { method: 'POST', body: fd })
      const parseData = await parseRes.json()
      if (parseData.error) throw new Error(parseData.error)
      const parsedText = parseData.text
      const rid = parseData.recordId || ''
      setCvText(parsedText)
      setRecordId(rid)

      if (mode === 'quick') {
        setLoading(false)
        await runSynthesise(parsedText, [], [], 'quick', rid)
        return
      }

      // Full mode — generate questions first
      const qRes = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText: parsedText }),
      })
      const qData = await qRes.json()
      if (qData.error) throw new Error(qData.error)
      setPillars(qData.pillars || [])
      setCurrentRound(1)
      setCurrentPillarIdx(0)
      setAllAnswers(Array(12).fill(''))
      setStep(2)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSynthesise = useCallback(async (answersArg: string[]) => {
    const flatQA: { q: Question; a: string }[] = []
    pillars.forEach((p, pi) => {
      p.questions.forEach((q, ri) => {
        flatQA.push({ q, a: answersArg[ri * 4 + pi] || '' })
      })
    })
    const answered = flatQA.filter(({ a }) => a.trim().length > 0)
    await runSynthesise(cvText, answered.map(({ q }) => q), answered.map(({ a }) => a), 'full', recordId, answered.length)
  }, [pillars, cvText, recordId, runSynthesise])

  const handleNextQuestion = useCallback(() => {
    const nextPillar = currentPillarIdx + 1
    if (nextPillar < pillars.length) {
      setCurrentPillarIdx(nextPillar)
    } else if (currentRound < 3) {
      setShowContinueModal(true)
    } else {
      handleSynthesise(allAnswers)
    }
  }, [currentPillarIdx, currentRound, pillars.length, allAnswers, handleSynthesise])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleNextQuestion()
    }
  }

  const handleDownload = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/generate-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ synthesis, recordId }),
      })
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Midcourse-${synthesis?.name?.replace(/\s+/g, '-') ?? 'Reflection'}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Download failed')
    } finally {
      setLoading(false)
    }
  }

  const handleWaitlist = async () => {
    if (!email) return
    setEmailLoading(true)
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: synthesis?.name }),
      })
      setEmailSubmitted(true)
    } catch {
      setEmailSubmitted(true)
    } finally {
      setEmailLoading(false)
    }
  }

  const stageBg = step === 2 && pillars.length > 0
    ? (JOURNEY_STAGES[currentPillarIdx]?.dim ?? 'bg-[#FAF8F5]')
    : 'bg-[#FAF8F5]'

  // Mode selection — shown before any step
  if (mode === null) {
    return (
      <div className="min-h-screen bg-[#FAF8F5]">
        <nav className="bg-white border-b border-stone-100 px-6 py-4">
          <div className="max-w-3xl mx-auto flex justify-center">
            <Link href="/"><Logo /></Link>
          </div>
        </nav>
        <ModeSelectionStep onSelect={setMode} />
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-700 ${stageBg}`}>
      {/* Nav */}
      <nav className="bg-white border-b border-stone-100 px-6 py-4">
        <div className="max-w-3xl mx-auto relative flex items-center justify-center">
          <Link href="/"><Logo /></Link>
          {step === 4 && synthesis && (
            <span className="absolute right-0 text-sm text-stone-400 font-light">
              {synthesis.name.split(' ')[0]}
            </span>
          )}
          {step === 1 && (
            <button
              onClick={() => setMode(null)}
              className="absolute right-0 text-xs text-stone-400 hover:text-stone-600 transition-colors font-light"
            >
              ← Change mode
            </button>
          )}
        </div>
      </nav>

      {/* Step progress bar */}
      <div className="bg-white border-b border-stone-100 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center">
            {STEPS.map((s, i) => {
              const stepNum = (i + 1) as 1 | 2 | 3 | 4
              const isActive = step === stepNum
              const isDone = step > stepNum
              const isSkipped = mode === 'quick' && stepNum === 2 && step >= 3
              return (
                <div key={i} className="flex items-center flex-1">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                      isSkipped ? 'bg-stone-200 text-stone-400'
                      : isDone ? 'bg-stone-700 text-white'
                      : isActive ? 'bg-[#1C1917] text-white ring-4 ring-[#1C1917]/10'
                      : 'bg-stone-200 text-stone-400'
                    }`}>
                      {isSkipped ? '—' : isDone ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block transition-colors ${
                      isSkipped ? 'text-stone-300'
                      : isActive ? 'text-[#1C1917]'
                      : isDone ? 'text-stone-500'
                      : 'text-stone-300'
                    }`}>
                      {isSkipped ? 'Skipped' : s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 mx-3 h-px rounded-full overflow-hidden bg-stone-200">
                      <div className={`h-full bg-stone-500 transition-all duration-700 ${isDone || isSkipped ? 'w-full' : 'w-0'}`} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {mode === 'quick' && step < 4 && (
            <p className="text-[10px] text-stone-400 mt-2 font-light">Quick Analysis — CV only</p>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        {/* ── Step 1: Upload ── */}
        {step === 1 && (
          <div>
            <h1 className="text-3xl font-light text-[#1C1917] mb-2 tracking-tight">
              {mode === 'quick' ? 'Upload your CV for a quick analysis.' : 'Your reflection begins here.'}
            </h1>
            <p className="text-stone-500 mb-8 font-light leading-relaxed">
              {mode === 'quick'
                ? 'Share your career history. We\'ll derive patterns, strengths, and salary benchmarks directly from what\'s on the page.'
                : 'Share your career history. We\'ll read it carefully — every role, every transition — before asking you a single question.'
              }
            </p>
            <div
              className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all duration-200 ${
                dragOver
                  ? 'border-stone-600 bg-stone-100 scale-[1.01]'
                  : 'border-stone-300 hover:border-stone-500 hover:bg-stone-50'
              }`}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept=".pdf,.docx,.doc" className="hidden"
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              <Upload className="w-10 h-10 text-stone-400 mx-auto mb-4" />
              <p className="text-base font-medium text-stone-600 mb-1">Drop your CV here</p>
              <p className="text-sm text-stone-400 font-light">or click to browse · PDF or DOCX</p>
            </div>
            {file && (
              <div className="mt-4 flex items-center gap-3 bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl">
                <CheckCircle className="w-5 h-5 text-stone-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-700 truncate">{file.name}</p>
                  <p className="text-xs text-stone-400 font-light">{(file.size / 1024).toFixed(0)} KB · Ready</p>
                </div>
                <button onClick={e => { e.stopPropagation(); setFile(null) }} className="text-stone-400 hover:text-stone-600 text-xs">Change</button>
              </div>
            )}
            <button onClick={handleAnalyse} disabled={!file || loading}
              className="mt-6 w-full bg-[#1C1917] text-white font-semibold py-4 rounded-xl hover:bg-stone-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base">
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" />{mode === 'quick' ? 'Analysing…' : 'Reading your story…'}</>
                : mode === 'quick'
                  ? <><Zap className="w-5 h-5" />Run Quick Analysis</>
                  : <>Begin my reflection <ChevronRight className="w-5 h-5" /></>
              }
            </button>
            {loading && (
              <p className="text-center text-sm text-stone-400 mt-3 animate-pulse font-light">
                {mode === 'quick'
                  ? 'Parsing your CV and building your career analysis…'
                  : 'Reading your career history and crafting your guided conversation…'
                }
              </p>
            )}
          </div>
        )}

        {/* ── Step 2: Questions ── */}
        {step === 2 && pillars.length > 0 && (
          <QuestionStep
            currentRound={currentRound}
            currentPillarIdx={currentPillarIdx}
            pillars={pillars}
            allAnswers={allAnswers}
            setAllAnswers={setAllAnswers}
            onNext={handleNextQuestion}
            onBack={() => {
              if (currentPillarIdx > 0) setCurrentPillarIdx(p => p - 1)
              else if (currentRound > 1) { setCurrentRound(r => r - 1 as 1|2|3); setCurrentPillarIdx(pillars.length - 1) }
            }}
            textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
            onKeyDown={handleKeyDown}
            onGenerateNow={() => handleSynthesise(allAnswers)}
          />
        )}

        {/* ── Step 3: Processing ── */}
        {step === 3 && <ProcessingStep msg={PROCESSING_MESSAGES[processingMsgIdx]} />}

        {/* ── Step 4: Results ── */}
        {step === 4 && synthesis && (
          <ResultsStep
            synthesis={synthesis}
            loading={loading}
            email={email}
            setEmail={setEmail}
            emailSubmitted={emailSubmitted}
            emailLoading={emailLoading}
            onDownload={handleDownload}
            onWaitlist={handleWaitlist}
            mode={mode ?? 'full'}
          />
        )}
      </div>

      {/* Continue modal — appears after completing each round */}
      {showContinueModal && (
        <ContinueModal
          round={currentRound}
          totalAnswered={allAnswers.filter(a => a.trim().length > 0).length}
          onContinue={() => {
            setShowContinueModal(false)
            setCurrentRound(r => (r + 1) as 1 | 2 | 3)
            setCurrentPillarIdx(0)
          }}
          onGenerateNow={() => {
            setShowContinueModal(false)
            handleSynthesise(allAnswers)
          }}
        />
      )}

      {/* Feedback modal — appears at 80% scroll on results */}
      {feedbackOpen && (
        <FeedbackModal
          onClose={() => setFeedbackOpen(false)}
          userName={synthesis?.name?.split(' ')[0]}
        />
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// Mode selection — editorial two-card layout
// ══════════════════════════════════════════════════════════════════════
function ModeSelectionStep({ onSelect }: { onSelect: (m: 'full' | 'quick') => void }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-light text-[#1C1917] tracking-tight mb-3">
          How would you like to begin?
        </h1>
        <p className="text-stone-400 font-light text-lg leading-relaxed max-w-lg mx-auto">
          You can take a guided reflection or let us read your CV and surface what we find.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Option 1 — Full Reflection (recommended) */}
        <button
          onClick={() => onSelect('full')}
          className="group relative bg-[#1C1917] rounded-2xl p-7 text-left hover:bg-stone-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#1C1917]/30"
        >
          <div className="absolute top-4 right-4">
            <span className="text-[10px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-full uppercase tracking-widest">
              Recommended
            </span>
          </div>

          {/* Waypoint icon */}
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-5">
            <MessageSquare className="w-5 h-5 text-white/70" />
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30 mb-2">Option 1</p>
          <h2 className="text-xl font-light text-white mb-2.5 tracking-tight">Guided Reflection</h2>
          <p className="text-sm text-white/50 leading-relaxed font-light mb-6">
            We read your career history, then ask 7 questions across four chapters — your story, what matters, patterns, and where you might go.
          </p>

          <div className="space-y-2 mb-7">
            {['Four reflective chapters', '7 personalised questions', 'Richer, more contextual insights'].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-amber-400/60 flex-shrink-0" />
                <p className="text-xs text-white/50 font-light">{item}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-white/30 font-light">~10 minutes</span>
            <div className="flex items-center gap-1.5 text-white/60 group-hover:text-white/90 transition-colors text-sm font-medium">
              Begin <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* Option 2 — Quick Analysis */}
        <button
          onClick={() => onSelect('quick')}
          className="group bg-white rounded-2xl p-7 text-left border border-stone-200 hover:border-stone-400 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-stone-400/20"
        >
          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center mb-5">
            <Zap className="w-5 h-5 text-stone-500" />
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400 mb-2">Option 2</p>
          <h2 className="text-xl font-light text-[#1C1917] mb-2.5 tracking-tight">Quick Analysis</h2>
          <p className="text-sm text-stone-500 leading-relaxed font-light mb-6">
            Upload your CV and we&apos;ll surface career patterns, strengths, growth edges, and salary benchmarks — derived entirely from your career history.
          </p>

          <div className="space-y-2 mb-7">
            {['No interview required', 'CV-derived insights', 'Market salary benchmarks'].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-stone-400 flex-shrink-0" />
                <p className="text-xs text-stone-400 font-light">{item}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400 font-light">~2 minutes</span>
            <div className="flex items-center gap-1.5 text-stone-400 group-hover:text-stone-700 transition-colors text-sm font-medium">
              Start <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>
      </div>

      <p className="text-center text-xs text-stone-400 mt-8 font-light">
        You can always come back and try the other path.
      </p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// Chapter stage card
// ══════════════════════════════════════════════════════════════════════
function StageHeader({ stageIdx }: { stageIdx: number }) {
  const stage = JOURNEY_STAGES[stageIdx]
  return (
    <div className={`rounded-2xl p-6 mb-8 bg-gradient-to-br ${stage.gradient} relative overflow-hidden`}>
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/[0.03] pointer-events-none" />

      <div className="flex gap-1.5 mb-6 relative z-10">
        {JOURNEY_STAGES.map((_, i) => (
          <div
            key={i}
            className={`h-[3px] flex-1 rounded-full transition-all duration-700 ${
              i < stageIdx ? 'bg-white/80'
              : i === stageIdx ? 'bg-white/50'
              : 'bg-white/15'
            }`}
          />
        ))}
      </div>

      <div className="relative z-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-2 text-white/35">{stage.chapter}</p>
        <h2 className="text-2xl sm:text-3xl font-light text-white mb-1.5 tracking-tight">{stage.label}</h2>
        <p className="text-sm text-white/50 leading-relaxed font-light">{stage.sub}</p>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// Quality indicator bar
// ══════════════════════════════════════════════════════════════════════
function QualityBar({ totalAnswered, compact = false }: { totalAnswered: number; compact?: boolean }) {
  const pct = Math.round((Math.min(totalAnswered, 12) / 12) * 100)
  const label = pct < 34 ? 'Low' : pct < 67 ? 'Mid' : pct < 100 ? 'High' : 'Excellent'
  // Gradient spans the full bar; fill width reveals how much of it is shown
  const gradient = 'linear-gradient(to right, #ef4444 0%, #f97316 25%, #eab308 50%, #84cc16 70%, #22c55e 85%, #10b981 100%)'

  if (compact) {
    const labelColor = label === 'Low' ? 'text-red-600 bg-red-50' : label === 'Mid' ? 'text-amber-700 bg-amber-50' : label === 'High' ? 'text-green-700 bg-green-50' : 'text-emerald-700 bg-emerald-50'
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-white/40 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: gradient }} />
        </div>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${labelColor}`}>{label}</span>
      </div>
    )
  }

  // Prominent inline version — sits below the textarea
  const labelText = label === 'Low' ? 'text-red-500' : label === 'Mid' ? 'text-amber-600' : label === 'High' ? 'text-green-600' : 'text-emerald-600'
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-stone-400 font-light">Analysis depth</span>
        <span className={`text-xs font-semibold transition-colors duration-700 ${labelText}`}>
          {label} · {totalAnswered} of 12 answered
        </span>
      </div>
      <div className="h-3 bg-white/60 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: pct === 0 ? '4px' : `${pct}%`, background: gradient }}
        />
      </div>
      <div className="flex justify-between mt-1.5 px-0.5">
        {['Low', 'Mid', 'High', 'Excellent'].map(l => (
          <span key={l} className={`text-[9px] font-medium transition-all duration-500 ${l === label ? `${labelText} opacity-100` : 'text-stone-300 opacity-70'}`}>{l}</span>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// Continue modal — shown between rounds
// ══════════════════════════════════════════════════════════════════════
function ContinueModal({ round, totalAnswered, onContinue, onGenerateNow }: {
  round: number; totalAnswered: number; onContinue: () => void; onGenerateNow: () => void
}) {
  const qualityLabel = totalAnswered >= 8 ? 'High' : 'Mid'
  const nextLabel = qualityLabel === 'Mid' ? 'High' : 'Excellent'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="bg-[#1C1917] px-6 pt-6 pb-5">
          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Round {round} complete</p>
          <h3 className="text-xl font-light text-white tracking-tight">
            {round === 1 ? "You've given us a good foundation." : "Excellent — you're going deeper."}
          </h3>
        </div>

        <div className="px-6 pt-5 pb-2">
          <div className="mb-4">
            <div className="flex justify-between text-xs text-stone-400 mb-1.5">
              <span>Current depth</span>
              <span className="font-medium text-amber-600">{qualityLabel} → could reach {nextLabel}</span>
            </div>
            <QualityBar totalAnswered={totalAnswered} />
          </div>
          <p className="text-sm text-stone-600 leading-relaxed font-light">
            We&apos;d genuinely love to learn more about your journey. Every layer you share allows us to build a more precise and actionable picture of where you stand and where you could go.
          </p>
          <p className="text-xs text-stone-400 mt-2 font-light">
            {round === 1
              ? "One more round — 4 deeper questions — and you'll reach High."
              : "One final round — our most introspective questions — to reach Excellent."
            }
          </p>
        </div>

        <div className="px-6 py-5 space-y-3">
          <button
            onClick={onContinue}
            className="w-full bg-[#1C1917] text-white font-semibold py-3.5 rounded-xl hover:bg-stone-800 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Tell me more — go deeper
          </button>
          <button
            onClick={onGenerateNow}
            className="w-full text-stone-400 text-sm py-2 hover:text-stone-600 transition-colors"
          >
            Generate my analysis now
          </button>
          <p className="text-[10px] text-stone-300 text-center font-light">
            Your analysis will be based on fewer inputs and may be less specific
          </p>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
function QuestionStep({ currentRound, currentPillarIdx, pillars, allAnswers, setAllAnswers, onNext, onBack, textareaRef, onKeyDown, onGenerateNow }: {
  currentRound: number; currentPillarIdx: number; pillars: PillarData[]
  allAnswers: string[]; setAllAnswers: (a: string[]) => void
  onNext: () => void; onBack: () => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onGenerateNow: () => void
}) {
  const flatIdx = (currentRound - 1) * 4 + currentPillarIdx
  const currentAnswer = allAnswers[flatIdx] || ''
  const q = pillars[currentPillarIdx]?.questions[currentRound - 1]
  const qText = q?.text ?? ''
  const qHint = q?.hint ?? ''
  const qAnchor = q?.cv_anchor ?? ''
  const qSamples = q?.sample_answers ?? []
  const totalAnswered = allAnswers.filter(a => a.trim().length > 0).length
  const { displayed, done } = useTypewriter(qText, 16)
  const [showSamples, setShowSamples] = useState(false)
  useEffect(() => { setShowSamples(false) }, [qText])
  const isFirstEver = currentRound === 1 && currentPillarIdx === 0
  const isLastOfRound = currentPillarIdx === pillars.length - 1
  const isLastRound = currentRound === 3
  const canGoBack = currentPillarIdx > 0 || currentRound > 1

  return (
    <div>
      {/* Round badge */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest border border-stone-200 px-2.5 py-1 rounded-full bg-white/60">
          Round {currentRound} of 3 · {pillars[currentPillarIdx]?.name}
        </span>
      </div>

      <StageHeader stageIdx={currentPillarIdx} />

      {/* Welcome note — only on very first question */}
      {isFirstEver && (
        <div className="mb-6 bg-white/70 border border-white rounded-xl px-5 py-4 text-sm text-stone-500 leading-relaxed backdrop-blur-sm shadow-sm font-light">
          <span className="font-medium text-[#1C1917]">We&apos;ve read your career history.</span> Now we want to hear from you — in your own words. There are no right answers. The more you share, the more precise your reflection becomes.
        </div>
      )}

      {/* CV anchor */}
      {qAnchor && (
        <div className="ml-[52px] mb-2">
          <p className="text-xs text-stone-400 leading-relaxed border-l-2 border-amber-400/50 pl-3 py-0.5 italic font-light">
            {qAnchor}
          </p>
        </div>
      )}

      {/* Coach mark + question bubble */}
      <div className="flex items-start gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-[#1C1917] flex items-center justify-center flex-shrink-0 shadow-lg mt-0.5">
          <svg width="18" height="8" viewBox="0 0 34 14" fill="none">
            <line x1="0" y1="7" x2="11" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="17" cy="7" r="4.5" stroke="white" strokeWidth="1.5"/>
            <circle cx="17" cy="7" r="1.5" fill="white"/>
            <line x1="23" y1="7" x2="34" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="bg-[#1C1917] text-white rounded-2xl rounded-tl-none px-6 py-5 shadow-lg flex-1 min-h-[80px]">
          <p className="text-base leading-relaxed font-light">
            {displayed}
            {!done && <span className="inline-block w-0.5 h-4 bg-amber-400/60 animate-pulse ml-0.5 align-middle rounded-full" />}
          </p>
        </div>
      </div>

      {/* Hint */}
      <div className={`ml-[52px] mb-5 transition-all duration-500 ${done && qHint ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'}`}>
        <p className="text-xs text-stone-400 italic font-light">💡 {qHint}</p>
      </div>

      {/* Example answers — illustrative, to spark thinking when stuck */}
      {done && qSamples.length > 0 && (
        <div className="ml-[52px] mb-5">
          <button
            onClick={() => setShowSamples(s => !s)}
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-2"
          >
            {showSamples ? 'Hide example answers' : 'Need a starting point? See example answers'}
          </button>
          {showSamples && (
            <div className="mt-3 grid sm:grid-cols-3 gap-3">
              {qSamples.slice(0, 3).map((s, i) => (
                <div key={i} className="bg-white/70 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-500 leading-relaxed font-light">
                  <p className="italic mb-1.5">&ldquo;{s.text}&rdquo;</p>
                  <p className="text-stone-400 not-italic">— {s.designation}</p>
                </div>
              ))}
              <p className="text-[10px] text-stone-300 font-light sm:col-span-3">Illustrative examples to spark your thinking — not real responses.</p>
            </div>
          )}
        </div>
      )}

      {/* Answer textarea */}
      <div className={`transition-all duration-500 ${done ? 'opacity-100' : 'opacity-0'}`}>
        <textarea
          ref={textareaRef}
          value={currentAnswer}
          onChange={e => {
            const next = [...allAnswers]
            next[flatIdx] = e.target.value
            setAllAnswers(next)
          }}
          onKeyDown={onKeyDown}
          placeholder="Take your time. There are no right or wrong answers here."
          rows={5}
          className="w-full border border-white/60 rounded-xl px-4 py-3.5 text-sm text-stone-700 resize-none focus:outline-none focus:ring-2 focus:ring-stone-400/20 focus:border-stone-400/40 transition-all bg-white/80 backdrop-blur placeholder:text-stone-300 font-light"
        />
        <p className="text-xs text-stone-300 mt-1.5 text-right font-light">⌘+Enter to continue</p>
        <QualityBar totalAnswered={totalAnswered} />
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {canGoBack && (
          <button onClick={onBack} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-stone-200 bg-white/60 text-stone-500 text-sm font-medium hover:bg-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!done}
          className="flex-1 bg-[#1C1917] hover:bg-stone-800 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40"
        >
          {isLastOfRound && isLastRound
            ? <><Sparkles className="w-4 h-4 text-amber-400" />Complete my reflection</>
            : isLastOfRound
              ? <>Finish Round {currentRound} <ChevronRight className="w-4 h-4" /></>
              : <>Continue <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>

      {/* Generate now shortcut */}
      {totalAnswered > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={onGenerateNow}
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-2"
          >
            Generate my analysis now
          </button>
          <p className="text-[10px] text-stone-300 mt-0.5 font-light">More answers = a sharper, more personalised result</p>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
function ProcessingStep({ msg }: { msg: string }) {
  const [dots, setDots] = useState('')
  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-10">
        <div className="w-24 h-24 rounded-full bg-stone-200/60 animate-ping absolute inset-0" />
        <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center relative">
          <Loader2 className="w-11 h-11 text-stone-500 animate-spin" />
        </div>
      </div>
      <h2 className="text-2xl font-light text-[#1C1917] mb-2 tracking-tight">Sitting with your story…</h2>
      <p className="text-stone-500 font-light text-base min-h-[1.5rem] transition-all duration-700">
        {msg}<span className="opacity-40">{dots}</span>
      </p>
      <p className="text-sm text-stone-300 mt-3 font-light">Give it 20–30 seconds.</p>
      <FloatingInsights />
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
function ResultsStep({ synthesis, loading, email, setEmail, emailSubmitted, emailLoading, onDownload, onWaitlist, mode }: {
  synthesis: Synthesis; loading: boolean; email: string; setEmail: (v: string) => void
  emailSubmitted: boolean; emailLoading: boolean; onDownload: () => void; onWaitlist: () => void
  mode: 'full' | 'quick'
}) {
  const firstName = synthesis.name?.split(' ')[0] || 'there'
  const { displayed: posStatement, done: posDone } = useTypewriter(synthesis.positioning_statement, 11)
  const cs = synthesis.current_state || {}
  const ts = synthesis.target_state || {}
  const ns = synthesis.next_steps || {} as NextSteps

  return (
    <div>
      {/* Greeting */}
      <FadeIn delay={0}>
        <div className="flex items-start gap-3 mb-6">
          <CheckCircle className="w-7 h-7 text-stone-500 flex-shrink-0 mt-1" />
          <div>
            <h1 className="text-3xl font-light text-[#1C1917] tracking-tight">Here&apos;s what your story tells us, {firstName}.</h1>
            <p className="text-stone-400 mt-1 font-light">
              {mode === 'quick'
                ? 'Derived from your career history. A full reflection will surface considerably more.'
                : 'Take your time with this. There\'s no rush.'
              }
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Summary card */}
      {synthesis.summary && (
        <FadeIn delay={80}>
          <div className="bg-[#1C1917] text-white rounded-2xl p-6 mb-6 shadow-xl">
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Summary</p>
            <h2 className="text-lg font-light leading-relaxed mb-4">{synthesis.summary.headline}</h2>
            <ul className="space-y-2.5">
              {(synthesis.summary.key_points || []).map((pt, i) => (
                <li key={i} className="flex items-start gap-3">
                  <ChevronRight className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-white/70 font-light leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      )}

      {/* Career Narrative */}
      <FadeIn delay={150}>
        <div className="bg-white border-l-4 border-[#1C1917] rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-stone-500" />
            <h2 className="font-semibold text-stone-500 text-xs uppercase tracking-widest">Your Career Narrative</h2>
          </div>
          <p className="text-[#1C1917] text-lg leading-relaxed italic font-light">
            &ldquo;{posStatement}
            {!posDone && <span className="inline-block w-0.5 h-5 bg-stone-400/40 animate-pulse ml-0.5 align-middle rounded-full" />}
            &rdquo;
          </p>
        </div>
      </FadeIn>

      {/* Current vs Target */}
      <FadeIn delay={350}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-100">
            <h3 className="font-semibold text-stone-400 mb-4 text-xs uppercase tracking-widest flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Where you are now
            </h3>
            <dl className="space-y-2.5 text-sm">
              {([['Role', cs.role], ['Company', cs.company], ['Experience', cs.experience], ['Domain', cs.domain], ['Notice Period', cs.notice_period]] as [string, string][])
                .filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-stone-400 flex-shrink-0 font-light">{k}</dt>
                    <dd className="font-medium text-stone-700 text-right">{v}</dd>
                  </div>
                ))}
            </dl>
          </div>
          <div className="bg-stone-50 rounded-xl p-5 border border-stone-200">
            <h3 className="font-semibold text-stone-500 mb-4 text-xs uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Where this might lead
            </h3>
            <dl className="space-y-2.5 text-sm">
              {([
                ['Target Roles', (ts.roles || []).slice(0, 2).join(', ')],
                ['Sectors', (ts.sectors || []).slice(0, 2).join(', ')],
                ['Location', ts.location],
                ['Timeline', ts.timeline],
                ['Indicative Range', ts.salary_min && ts.salary_max ? `${ts.salary_min} – ${ts.salary_max}` : ''],
              ] as [string, string][]).filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-stone-400 flex-shrink-0 font-light">{k}</dt>
                  <dd className="font-medium text-[#1C1917] text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        {ts.salary_basis && (
          <p className="text-xs text-stone-400 font-light -mt-2 mb-6 px-1">
            {ts.salary_basis} — indicative only, based on the Michael Page India Salary Guide 2026.
          </p>
        )}
      </FadeIn>

      {/* Signal Moments */}
      {(synthesis.signal_moments || []).length > 0 && (
        <FadeIn delay={420}>
          <div className="mb-6">
            <h2 className="font-semibold text-[#1C1917] mb-1 flex items-center gap-2 text-lg tracking-tight">
              <Sparkles className="w-5 h-5 text-amber-500" /> What you said that we couldn&apos;t ignore
            </h2>
            <p className="text-sm text-stone-400 mb-4 font-light">The moments in your answers that revealed something important.</p>
            <div className="space-y-3">
              {(synthesis.signal_moments || []).map((sm, i) => (
                <div key={i} className="bg-[#1C1917] rounded-xl p-5">
                  <p className="text-amber-300 text-sm italic font-light mb-3 border-l-2 border-amber-400/40 pl-3 leading-relaxed">
                    &ldquo;{sm.quote}&rdquo;
                  </p>
                  <p className="text-white/70 text-sm font-light leading-relaxed">{sm.insight}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {/* Tensions */}
      {(synthesis.tensions || []).length > 0 && (
        <FadeIn delay={480}>
          <div className="mb-6">
            <h2 className="font-semibold text-[#1C1917] mb-1 flex items-center gap-2 text-lg tracking-tight">
              <Zap className="w-5 h-5 text-amber-500" /> Tensions worth sitting with
            </h2>
            <p className="text-sm text-stone-400 mb-4 font-light">Where what your CV shows and what you said don&apos;t quite line up — often the most revealing part of a reflection.</p>
            <div className="space-y-3">
              {(synthesis.tensions || []).map((t, i) => (
                <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                  <p className="text-amber-900 font-medium text-sm mb-2 leading-relaxed">{t.observation}</p>
                  <p className="text-amber-700 text-sm font-light leading-relaxed">{t.implication}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {/* Energy Map */}
      {synthesis.energy_map && (
        <FadeIn delay={510}>
          <div className="mb-6">
            <h2 className="font-semibold text-[#1C1917] mb-1 flex items-center gap-2 text-lg tracking-tight">
              <Zap className="w-5 h-5 text-stone-400" /> Your energy map
            </h2>
            <p className="text-sm text-stone-400 mb-4 font-light">What your answers reveal about where you do your best work — and what quietly erodes you.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-widest mb-3">Energises you</p>
                <ul className="space-y-2">
                  {(synthesis.energy_map.energises || []).map((e, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-green-800 font-light">
                      <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>{e}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-widest mb-3">Drains you</p>
                <ul className="space-y-2">
                  {(synthesis.energy_map.drains || []).map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-800 font-light">
                      <span className="text-red-400 mt-0.5 flex-shrink-0">−</span>{d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {synthesis.energy_map.ideal_environment && (
              <div className="bg-white border border-stone-100 rounded-xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2">Ideal environment</p>
                <p className="text-sm text-stone-600 font-light leading-relaxed">{synthesis.energy_map.ideal_environment}</p>
              </div>
            )}
          </div>
        </FadeIn>
      )}

      {/* Personal Patterns (strengths) */}
      <FadeIn delay={550}>
        <div className="mb-6">
          <h2 className="font-semibold text-[#1C1917] mb-1 flex items-center gap-2 text-lg tracking-tight">
            <Star className="w-5 h-5 text-stone-400" /> Personal Patterns
          </h2>
          <p className="text-sm text-stone-400 mb-4 font-light">The things you consistently do well — with real evidence and interview stories in your document.</p>
          <div className="space-y-3">
            {(synthesis.top_strengths || []).slice(0, 3).map((s, i) => (
              <div key={i} className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex gap-3">
                <div className="w-6 h-6 rounded-full bg-stone-700 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                <div>
                  <p className="font-medium text-stone-800 mb-1">{s.strength}</p>
                  <p className="text-sm text-stone-500 leading-relaxed font-light">{s.evidence}</p>
                  {s.cited_from && (
                    <p className="text-xs text-stone-400 mt-2 italic border-l-2 border-stone-300 pl-2 font-light">{s.cited_from}</p>
                  )}
                </div>
              </div>
            ))}
            {(synthesis.top_strengths || []).length > 3 && (
              <p className="text-sm text-stone-400 text-center py-3 bg-stone-50 rounded-xl border border-dashed border-stone-200 font-light">
                +{synthesis.top_strengths.length - 3} more patterns with stories in your reflection document
              </p>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Growth Edges (gaps) */}
      <FadeIn delay={700}>
        <div className="mb-8">
          <h2 className="font-semibold text-[#1C1917] mb-1 flex items-center gap-2 text-lg tracking-tight">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> Growth Edges
          </h2>
          <p className="text-sm text-stone-400 mb-4 font-light">Areas worth developing — each with a concrete action and timeline in your 90-day plan.</p>
          <div className="space-y-3">
            {(synthesis.key_gaps || []).slice(0, 3).map((g, i) => (
              <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                <div>
                  <p className="font-medium text-amber-900 mb-1">{g.gap}</p>
                  {g.surfaced_by && (
                    <p className="text-xs text-amber-600 italic mb-1.5 font-light">{g.surfaced_by}</p>
                  )}
                  <p className="text-sm text-amber-700 leading-relaxed font-light">{g.action}</p>
                  <p className="text-xs text-amber-500 mt-1.5 font-medium">Timeline: {g.timeline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Questions worth sitting with */}
      <FurtherQuestionsSection />

      {/* ── FREE: Possible Directions ── */}
      <FadeIn delay={900}>
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-semibold text-[#1C1917] text-lg flex items-center gap-2 tracking-tight">
              <TrendingUp className="w-5 h-5 text-stone-500" /> Possible Directions
            </h2>
            <span className="text-xs font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full border border-stone-200">FREE</span>
          </div>
          <p className="text-sm text-stone-400 mb-5 font-light">High-level market context that emerges from your background.</p>

          {ns.industry_outlook && (
            <div className="bg-white border border-stone-100 rounded-xl p-5 mb-4 shadow-sm">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2">Landscape</p>
              <p className="text-sm text-stone-600 leading-relaxed font-light">{ns.industry_outlook}</p>
              {ns.market_timing && (
                <div className="mt-3 flex items-start gap-2 bg-stone-50 rounded-lg px-3 py-2">
                  <Clock className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-stone-500 font-light">{ns.market_timing}</p>
                </div>
              )}
            </div>
          )}

          {(ns.company_categories || []).length > 0 && (
            <div className="bg-white border border-stone-100 rounded-xl p-5 mb-4 shadow-sm">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">Environments that might fit</p>
              <div className="space-y-2">
                {ns.company_categories.map((cat, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Building2 className="w-3 h-3 text-stone-500" />
                    </div>
                    <p className="text-sm text-stone-600 font-light">{cat}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(ns.priority_skills || []).length > 0 && (
              <div className="bg-white border border-stone-100 rounded-xl p-5 shadow-sm">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">Worth developing</p>
                <div className="space-y-3">
                  {ns.priority_skills.map((s, i) => (
                    <div key={i}>
                      <p className="text-sm font-medium text-stone-700 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-stone-400" /> {s.skill}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5 ml-5 font-light">{s.why}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Salary — locked, moved to premium */}
            <div className="relative bg-white border border-stone-100 rounded-xl overflow-hidden shadow-sm">
              <div className="p-5 select-none">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Salary & Market Position
                </p>
                <div className="blur-sm opacity-50 pointer-events-none space-y-2">
                  <p className="text-sm text-stone-600 font-light">Your benchmark range based on role, experience, and sector...</p>
                  <p className="text-sm text-stone-600 font-light">Current market premium for a move: estimated X–Y%</p>
                  <p className="text-xs text-amber-700 font-medium">Market data: Michael Page India 2026</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/60 to-white/95 flex flex-col items-center justify-end pb-5">
                <div className="bg-stone-100 rounded-full p-2 mb-2">
                  <Lock className="w-4 h-4 text-stone-500" />
                </div>
                <p className="text-xs font-semibold text-stone-500">Unlocked when you share your salary expectations</p>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── PAID: Deeper Navigation ── */}
      <FadeIn delay={1050}>
        <div className="mb-8 mt-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-semibold text-[#1C1917] text-lg flex items-center gap-2 tracking-tight">
              <Lock className="w-5 h-5 text-stone-400" /> Deeper Navigation
            </h2>
            <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">COMING SOON</span>
          </div>
          <p className="text-sm text-stone-400 mb-5 font-light">Specific intelligence that turns direction into action.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LockedCard
              icon={<Building2 className="w-5 h-5 text-stone-500" />}
              title="Companies Aligned to Your Story"
              preview={[
                '● Razorpay — 3 open roles in your domain',
                '● PhonePe — Senior PM, Payments',
                '● CRED — Product Lead, Growth',
                '● Slice — Head of Product',
                '● Jupiter Money — Director of PM',
              ]}
            />
            <LockedCard
              icon={<Briefcase className="w-5 h-5 text-stone-500" />}
              title="Open Roles Matched to You"
              preview={[
                '● Senior Product Manager — FinTech',
                '● Product Lead, Lending — Series C',
                '● Head of Product — Neobank',
                '● Director of PM — Payments',
                '● Group PM — Consumer App',
              ]}
            />
            <LockedCard
              icon={<Users className="w-5 h-5 text-stone-500" />}
              title="Referral Tracker"
              preview={[
                '  Company | Contact | Status | Date',
                '  ────────────────────────────────',
                '  Razorpay | Priya S. | Pending | —',
                '  PhonePe  | Amit K.  | Warm    | —',
                '  CRED     | —        | Cold    | —',
              ]}
              mono
            />
            <LockedCard
              icon={<MapPin className="w-5 h-5 text-stone-500" />}
              title="Insider Context"
              preview={[
                '● Razorpay: hiring freeze lifted Q2',
                '● PhonePe: expanding Lending team',
                '● CRED: culture → ownership culture',
                '● Salary negotiation scripts included',
                '● LinkedIn DM templates per company',
              ]}
            />
          </div>

          <div className="mt-5 bg-stone-50 border border-stone-200 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold text-[#1C1917] mb-1">Join the waitlist for Deeper Navigation</p>
              <p className="text-sm text-stone-500 font-light">Specific companies, live open roles, referral tracker, salary scripts — updated weekly.</p>
            </div>
            <button
              onClick={() => { document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="bg-[#1C1917] text-white font-semibold px-6 py-3 rounded-xl hover:bg-stone-800 transition-colors whitespace-nowrap flex-shrink-0 text-sm"
            >
              Join Waitlist →
            </button>
          </div>
        </div>
      </FadeIn>

      {/* Download CTA */}
      <FadeIn delay={1200}>
        <div className="bg-[#1C1917] rounded-2xl p-8 text-center text-white mb-6 shadow-xl">
          <div className="w-14 h-14 bg-white/8 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download className="w-7 h-7 text-white/70" />
          </div>
          <h2 className="text-2xl font-light mb-2 tracking-tight">Your Career Reflection is Ready</h2>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-white/40 text-sm mb-6 font-light">
            <span>Career narrative</span><span>·</span><span>Personal patterns</span>
            <span>·</span><span>Growth edges</span><span>·</span><span>Possible directions</span>
          </div>
          <button onClick={onDownload} disabled={loading}
            className="bg-white text-[#1C1917] font-semibold px-10 py-4 rounded-xl hover:bg-stone-100 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2 mx-auto text-base">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            Download My Reflection (.xlsx)
          </button>
        </div>
      </FadeIn>

      {/* Email / waitlist capture */}
      <FadeIn delay={1350}>
        <div id="waitlist-form" className="bg-white rounded-2xl border border-stone-100 p-6 text-center shadow-sm">
          {emailSubmitted ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <CheckCircle className="w-7 h-7 text-stone-500" />
              <p className="font-semibold text-[#1C1917]">You&apos;re on the list, {firstName}.</p>
              <p className="text-sm text-stone-400 font-light">Check your inbox — we&apos;ve sent a confirmation. We&apos;ll reach out when Deeper Navigation opens.</p>
            </div>
          ) : (
            <>
              <div className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-600 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-stone-200">
                Coming Soon · Full Reflection
              </div>
              <h3 className="font-semibold text-[#1C1917] mb-1 tracking-tight">
                Specific companies · Open roles · Referral tracker · Salary context
              </h3>
              <p className="text-sm text-stone-400 mb-4 font-light">Join the waitlist and get early access at 50% off. We&apos;ll email you the moment it&apos;s ready.</p>
              <div className="flex gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && onWaitlist()}
                  placeholder="your@email.com"
                  className="flex-1 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400/20 focus:border-stone-400 font-light"
                />
                <button
                  onClick={onWaitlist}
                  disabled={!email || emailLoading}
                  className="bg-[#1C1917] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap disabled:opacity-50 flex items-center gap-1.5"
                >
                  {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Join Waitlist
                </button>
              </div>
            </>
          )}
        </div>
      </FadeIn>
    </div>
  )
}

// ── Further questions — reflection depth teaser ────────────────────────
function FurtherQuestionsSection() {
  const FURTHER_QS = [
    "What's your current compensation — and what would make your next move feel genuinely worthwhile?",
    "Are there specific roles or titles you've been quietly imagining? Or are you still figuring out what the next chapter might look like?",
    "How do you feel about where you're based? Would you relocate for the right opportunity, or is staying put important to you?",
    "Is there a version of this story where the next move isn't a new company — but a different role or team in your current one?",
    "When you imagine your professional life in five years, what does thriving actually look like?",
  ]
  return (
    <FadeIn delay={750}>
      <div className="mb-8">
        <div className="border border-dashed border-stone-300 rounded-2xl p-6 bg-white/60">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-stone-400" />
            <h2 className="font-semibold text-[#1C1917] text-base tracking-tight">Questions worth sitting with</h2>
            <span className="ml-auto text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-200">Full Reflection</span>
          </div>
          <p className="text-sm text-stone-400 mb-5 leading-relaxed font-light">
            Your reflection is built on what you&apos;ve shared. But there&apos;s more we&apos;d want to explore — answers that would sharpen the picture considerably.
          </p>
          <div className="space-y-3">
            {FURTHER_QS.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-stone-100 shadow-sm">
                <div className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-stone-400">{i + 1}</span>
                </div>
                <p className="text-sm text-stone-500 leading-relaxed italic font-light">&ldquo;{item}&rdquo;</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-300 mt-5 text-center leading-relaxed font-light">
            In Deeper Navigation, we go into each of these — and use your answers to surface specific companies, live roles, and a tighter plan.
          </p>
        </div>
      </div>
    </FadeIn>
  )
}

// ── Locked card ────────────────────────────────────────────────────────
function LockedCard({ icon, title, preview, mono = false }: {
  icon: React.ReactNode; title: string; preview: string[]; mono?: boolean
}) {
  return (
    <div className="relative bg-white border border-stone-100 rounded-xl overflow-hidden shadow-sm">
      <div className="p-5 select-none">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          {icon} {title}
        </p>
        <div className="blur-sm opacity-60 pointer-events-none">
          {preview.map((line, i) => (
            <p key={i} className={`text-xs text-stone-600 leading-relaxed font-light ${mono ? 'font-mono' : ''} ${i > 0 ? 'mt-1' : ''}`}>
              {line}
            </p>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/60 to-white/95 flex flex-col items-center justify-end pb-5">
        <div className="bg-stone-100 rounded-full p-2 mb-2">
          <Lock className="w-4 h-4 text-stone-500" />
        </div>
        <p className="text-xs font-semibold text-stone-500">Coming soon</p>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// Feedback modal — triggered at 80% scroll on results page
// ══════════════════════════════════════════════════════════════════════
const WORKED_CHIPS = [
  'Career narrative',
  'Personal patterns',
  'Salary context',
  'The questions asked',
  'Growth edge insights',
  'Action plan',
]

function FeedbackModal({ onClose, userName }: { onClose: () => void; userName?: string }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [workedChips, setWorkedChips] = useState<string[]>([])
  const [workedText, setWorkedText] = useState('')
  const [improvement, setImprovement] = useState('')
  const [name, setName] = useState(userName || '')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const toggleChip = (chip: string) =>
    setWorkedChips(prev => prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip])

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, workedWhat: workedChips, workedText, improvement, name, email, userName }),
      })
    } catch { /* silently */ }
    setSubmitted(true)
    setSubmitting(false)
  }

  const RATING_LABELS = ['', 'Not useful', 'Somewhat', 'Pretty useful', 'Very useful', 'Extremely useful']

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
          <CheckCircle className="w-10 h-10 text-stone-600 mx-auto mb-4" />
          <h3 className="text-xl font-light text-[#1C1917] mb-2 tracking-tight">Thank you{name ? `, ${name}` : ''}.</h3>
          <p className="text-stone-500 text-sm font-light leading-relaxed mb-6">
            Your feedback helps shape what Midcourse becomes.{email ? " We'll be in touch." : ''}
          </p>
          <button onClick={onClose} className="text-sm text-stone-400 hover:text-stone-600 font-medium transition-colors">
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full shadow-2xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-stone-100 flex-shrink-0">
          <div>
            <h3 className="text-lg font-light text-[#1C1917] tracking-tight">How did this land?</h3>
            <p className="text-xs text-stone-400 font-light mt-0.5">2 minutes · helps us make this better for everyone</p>
          </div>
          <button onClick={onClose} className="text-stone-300 hover:text-stone-500 transition-colors ml-4 mt-0.5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

          {/* Q1 — Star rating */}
          <div>
            <p className="text-sm font-medium text-stone-700 mb-3">Was this reflection useful to you?</p>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                >
                  <Star
                    className={`w-9 h-9 transition-colors ${
                      n <= (hoverRating || rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                    }`}
                  />
                </button>
              ))}
              {(hoverRating || rating) > 0 && (
                <span className="ml-2 text-xs text-stone-400 font-light">
                  {RATING_LABELS[hoverRating || rating]}
                </span>
              )}
            </div>
          </div>

          {/* Q2 — What worked */}
          <div>
            <p className="text-sm font-medium text-stone-700 mb-1">
              What worked for you? <span className="text-stone-400 font-normal text-xs">(optional)</span>
            </p>
            <p className="text-xs text-stone-400 font-light mb-3">Select any that resonated.</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {WORKED_CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => toggleChip(chip)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    workedChips.includes(chip)
                      ? 'bg-[#1C1917] text-white border-[#1C1917]'
                      : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
            <textarea
              value={workedText}
              onChange={e => setWorkedText(e.target.value)}
              placeholder="Anything else worth mentioning?"
              rows={2}
              className="w-full text-sm border border-stone-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-stone-400/20 focus:border-stone-400 font-light text-stone-700 placeholder:text-stone-300 transition-all"
            />
          </div>

          {/* Q3 — Improve */}
          <div>
            <p className="text-sm font-medium text-stone-700 mb-1">
              What would you improve? <span className="text-stone-400 font-normal text-xs">(optional)</span>
            </p>
            <p className="text-xs text-stone-400 font-light mb-3">Features, flow, depth, anything.</p>
            <textarea
              value={improvement}
              onChange={e => setImprovement(e.target.value)}
              placeholder="e.g. I wish the salary section had more detail for my domain..."
              rows={3}
              className="w-full text-sm border border-stone-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-stone-400/20 focus:border-stone-400 font-light text-stone-700 placeholder:text-stone-300 transition-all"
            />
          </div>

          {/* Q4 — Contact */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
            <p className="text-xs font-semibold text-stone-600 mb-0.5">
              Stay in the loop <span className="font-normal text-stone-400">— optional</span>
            </p>
            <p className="text-xs text-stone-400 font-light mb-3 leading-relaxed">
              Share your email and we&apos;ll send early access offers when we launch the full version. No spam, ever.
            </p>
            <div className="space-y-2">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400/20 focus:border-stone-400 font-light bg-white placeholder:text-stone-300 transition-all"
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400/20 focus:border-stone-400 font-light bg-white placeholder:text-stone-300 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-stone-100 bg-white rounded-b-2xl flex-shrink-0">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-[#1C1917] text-white font-semibold text-sm py-3 rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Submit feedback
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 text-sm text-stone-400 hover:text-stone-600 font-medium transition-colors flex-shrink-0"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
