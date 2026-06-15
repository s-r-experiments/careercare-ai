'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  Upload, MessageSquare, Cpu, Download, ArrowLeft, ArrowRight,
  CheckCircle, FileText, Loader2, Star, AlertTriangle, Target,
  TrendingUp, Sparkles, ChevronRight, Lock, Building2, Briefcase,
  Users, BookOpen, Clock, MapPin,
} from 'lucide-react'
import Logo from '../components/Logo'

interface Question { text: string; hint: string; cv_anchor?: string }
interface Strength { strength: string; evidence: string; interview_story: string; relevance: string }
interface Gap { gap: string; impact: string; action: string; timeline: string }
interface ActionItem { phase: string; action: string; category: string; priority: string; target_date: string; notes: string }
interface NextSteps {
  industry_outlook: string
  company_categories: string[]
  priority_skills: { skill: string; why: string }[]
  market_timing: string
  salary_context: string
}
interface Synthesis {
  name: string
  positioning_statement: string
  current_state: { role: string; company: string; experience: string; domain: string; ctc_approx: string; notice_period: string }
  target_state: { roles: string[]; sectors: string[]; location: string; salary_min: string; salary_max: string; salary_aspirational: string; timeline: string }
  top_strengths: Strength[]
  key_gaps: Gap[]
  action_plan: ActionItem[]
  next_steps: NextSteps
}

const PROCESSING_MESSAGES = [
  'Reading your career story carefully…',
  'Finding the patterns running through it…',
  'Noticing your growth edges…',
  'Sketching possible directions…',
  'Finding the language for who you are…',
  'Completing your career narrative…',
]

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

function getStageIndex(qIdx: number, total: number): number {
  const pct = (qIdx + 0.5) / total
  if (pct <= 0.30) return 0
  if (pct <= 0.57) return 1
  if (pct <= 0.86) return 2
  return 3
}

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
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [file, setFile] = useState<File | null>(null)
  const [cvText, setCvText] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>(Array(7).fill(''))
  const [synthesis, setSynthesis] = useState<Synthesis | null>(null)
  const [loading, setLoading] = useState(false)
  const [processingMsgIdx, setProcessingMsgIdx] = useState(0)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
  }, [step, currentQuestion])

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
      setCvText(parseData.text)

      const qRes = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText: parseData.text }),
      })
      const qData = await qRes.json()
      if (qData.error) throw new Error(qData.error)
      setQuestions(qData.questions)
      setAnswers(Array(qData.questions.length).fill(''))
      setCurrentQuestion(0)
      setStep(2)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSynthesise = useCallback(async (finalAnswers: string[]) => {
    setStep(3)
    setProcessingMsgIdx(0)
    try {
      const questionTexts = questions.map(q => (typeof q === 'string' ? q : q.text))
      const res = await fetch('/api/synthesise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText, questions: questionTexts, answers: finalAnswers }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setSynthesis(data.synthesis)
      setStep(4)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Analysis failed. Please try again.')
      setStep(2)
    }
  }, [cvText, questions])

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(q => q + 1)
    } else {
      handleSynthesise(answers)
    }
  }, [currentQuestion, questions.length, answers, handleSynthesise])

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
        body: JSON.stringify({ synthesis }),
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

  const stageBg = step === 2 && questions.length > 0
    ? JOURNEY_STAGES[getStageIndex(currentQuestion, questions.length)].dim
    : 'bg-[#FAF8F5]'

  return (
    <div className={`min-h-screen transition-colors duration-700 ${stageBg}`}>
      {/* Nav */}
      <nav className="bg-white border-b border-stone-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/"><Logo /></Link>
          {step === 4 && synthesis && (
            <span className="text-sm text-stone-400 font-light">
              {synthesis.name.split(' ')[0]}
            </span>
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
              return (
                <div key={i} className="flex items-center flex-1">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                      isDone ? 'bg-stone-700 text-white'
                      : isActive ? 'bg-[#1C1917] text-white ring-4 ring-[#1C1917]/10'
                      : 'bg-stone-200 text-stone-400'
                    }`}>
                      {isDone ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block transition-colors ${
                      isActive ? 'text-[#1C1917]' : isDone ? 'text-stone-500' : 'text-stone-300'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 mx-3 h-px rounded-full overflow-hidden bg-stone-200">
                      <div className={`h-full bg-stone-500 transition-all duration-700 ${isDone ? 'w-full' : 'w-0'}`} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
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
            <h1 className="text-3xl font-light text-[#1C1917] mb-2 tracking-tight">Your reflection begins here.</h1>
            <p className="text-stone-500 mb-8 font-light leading-relaxed">
              Share your career history. We&apos;ll read it carefully — every role, every transition — before asking you a single question.
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
                ? <><Loader2 className="w-5 h-5 animate-spin" />Reading your story…</>
                : <>Begin my reflection <ChevronRight className="w-5 h-5" /></>}
            </button>
            {loading && <p className="text-center text-sm text-stone-400 mt-3 animate-pulse font-light">Reading your career history and crafting your guided conversation…</p>}
          </div>
        )}

        {/* ── Step 2: Questions ── */}
        {step === 2 && questions.length > 0 && (
          <QuestionStep
            currentQuestion={currentQuestion}
            questions={questions}
            answers={answers}
            setAnswers={setAnswers}
            onNext={handleNextQuestion}
            onBack={() => setCurrentQuestion(q => q - 1)}
            textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
            onKeyDown={handleKeyDown}
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
          />
        )}
      </div>
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
function QuestionStep({ currentQuestion, questions, answers, setAnswers, onNext, onBack, textareaRef, onKeyDown }: {
  currentQuestion: number; questions: Question[]; answers: string[]
  setAnswers: (a: string[]) => void; onNext: () => void; onBack: () => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}) {
  const q = questions[currentQuestion]
  const qText = typeof q === 'string' ? q : (q?.text ?? '')
  const qHint = typeof q === 'string' ? '' : (q?.hint ?? '')
  const qAnchor = typeof q === 'string' ? '' : (q?.cv_anchor ?? '')
  const stageIdx = getStageIndex(currentQuestion, questions.length)
  const { displayed, done } = useTypewriter(qText, 16)
  const isLast = currentQuestion === questions.length - 1

  return (
    <div>
      <StageHeader stageIdx={stageIdx} />

      {/* Welcome note — only on first question */}
      {currentQuestion === 0 && (
        <div className="mb-6 bg-white/70 border border-white rounded-xl px-5 py-4 text-sm text-stone-500 leading-relaxed backdrop-blur-sm shadow-sm font-light">
          <span className="font-medium text-[#1C1917]">We&apos;ve read your career history.</span> Now we want to hear from you — in your own words. There are no right answers. The more honest you are, the more useful your reflection will be.
        </div>
      )}

      {/* CV anchor — what we noticed in their career */}
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

      {/* Answer textarea */}
      <div className={`transition-all duration-500 ${done ? 'opacity-100' : 'opacity-0'}`}>
        <textarea
          ref={textareaRef}
          value={answers[currentQuestion]}
          onChange={e => { const next = [...answers]; next[currentQuestion] = e.target.value; setAnswers(next) }}
          onKeyDown={onKeyDown}
          placeholder="Take your time. There are no right or wrong answers here."
          rows={5}
          className="w-full border border-white/60 rounded-xl px-4 py-3.5 text-sm text-stone-700 resize-none focus:outline-none focus:ring-2 focus:ring-stone-400/20 focus:border-stone-400/40 transition-all bg-white/80 backdrop-blur placeholder:text-stone-300 font-light"
        />
        <p className="text-xs text-stone-300 mt-1.5 text-right font-light">⌘+Enter to continue</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {currentQuestion > 0 && (
          <button onClick={onBack} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-stone-200 bg-white/60 text-stone-500 text-sm font-medium hover:bg-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!done}
          className="flex-1 bg-[#1C1917] hover:bg-stone-800 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40"
        >
          {isLast
            ? <><Sparkles className="w-4 h-4 text-amber-400" />Complete my reflection</>
            : <>Continue <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
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
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
function ResultsStep({ synthesis, loading, email, setEmail, emailSubmitted, emailLoading, onDownload, onWaitlist }: {
  synthesis: Synthesis; loading: boolean; email: string; setEmail: (v: string) => void
  emailSubmitted: boolean; emailLoading: boolean; onDownload: () => void; onWaitlist: () => void
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
        <div className="flex items-start gap-3 mb-8">
          <CheckCircle className="w-7 h-7 text-stone-500 flex-shrink-0 mt-1" />
          <div>
            <h1 className="text-3xl font-light text-[#1C1917] tracking-tight">Here&apos;s what your story tells us, {firstName}.</h1>
            <p className="text-stone-400 mt-1 font-light">Take your time with this. There&apos;s no rush.</p>
          </div>
        </div>
      </FadeIn>

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
                ['Salary Range', ts.salary_min && ts.salary_max ? `${ts.salary_min} – ${ts.salary_max}` : ''],
                ['Timeline', ts.timeline],
              ] as [string, string][]).filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-stone-400 flex-shrink-0 font-light">{k}</dt>
                  <dd className="font-medium text-[#1C1917] text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </FadeIn>

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
            {ns.salary_context && (
              <div className="bg-white border border-stone-100 rounded-xl p-5 shadow-sm">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">Salary context</p>
                <p className="text-sm text-stone-600 leading-relaxed font-light">{ns.salary_context}</p>
                {ts.salary_aspirational && (
                  <div className="mt-3 bg-stone-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-stone-500 font-light">Your aspirational: {ts.salary_aspirational}</p>
                  </div>
                )}
              </div>
            )}
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
