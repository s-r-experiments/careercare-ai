'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  Upload, MessageSquare, Cpu, Download, ArrowLeft, ArrowRight,
  CheckCircle, FileText, Loader2, Star, AlertTriangle, Target,
  TrendingUp, Sparkles, ChevronRight,
} from 'lucide-react'

interface Question { text: string; hint: string }
interface Strength { strength: string; evidence: string; interview_story: string; relevance: string }
interface Gap { gap: string; impact: string; action: string; timeline: string }
interface ActionItem { phase: string; action: string; category: string; priority: string; target_date: string; notes: string }
interface Synthesis {
  name: string
  positioning_statement: string
  current_state: { role: string; company: string; experience: string; domain: string; ctc_approx: string; notice_period: string }
  target_state: { roles: string[]; sectors: string[]; location: string; salary_min: string; salary_max: string; salary_aspirational: string; timeline: string }
  top_strengths: Strength[]
  key_gaps: Gap[]
  action_plan: ActionItem[]
}

const PROCESSING_MESSAGES = [
  'Getting to know your career story…',
  'Spotting what makes you stand out…',
  'Identifying the gaps worth closing…',
  'Designing your 90-day game plan…',
  'Crafting your positioning statement…',
  'Putting it all together…',
]

const STEPS = [
  { label: 'Upload CV', icon: Upload },
  { label: 'Your Questions', icon: MessageSquare },
  { label: 'Processing', icon: Cpu },
  { label: 'Your Results', icon: Download },
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
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Rotate processing messages
  useEffect(() => {
    if (step !== 3) return
    const interval = setInterval(() => {
      setProcessingMsgIdx(i => (i + 1) % PROCESSING_MESSAGES.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [step])

  // Focus textarea after question typewriter completes (600ms buffer)
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
      a.download = `CareerCare-${synthesis?.name?.replace(/\s+/g, '-') ?? 'Workbook'}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Download failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-[#1F4E79] font-bold text-xl tracking-tight">CareerCare AI</Link>
          {step === 4 && synthesis && (
            <span className="text-sm text-gray-500">
              Hi, <span className="font-semibold text-[#1F4E79]">{synthesis.name.split(' ')[0]}</span> 👋
            </span>
          )}
        </div>
      </nav>

      {/* Step progress bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center">
            {STEPS.map((s, i) => {
              const stepNum = (i + 1) as 1 | 2 | 3 | 4
              const isActive = step === stepNum
              const isDone = step > stepNum
              return (
                <div key={i} className="flex items-center flex-1">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isDone ? 'bg-green-500 text-white'
                      : isActive ? 'bg-[#1F4E79] text-white ring-4 ring-[#1F4E79]/20'
                      : 'bg-gray-200 text-gray-400'
                    }`}>
                      {isDone ? <CheckCircle className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block transition-colors ${
                      isActive ? 'text-[#1F4E79]' : isDone ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 mx-3 h-0.5 rounded-full overflow-hidden bg-gray-200">
                      <div className={`h-full bg-green-400 transition-all duration-700 ${isDone ? 'w-full' : 'w-0'}`} />
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Let&apos;s start with your CV</h1>
            <p className="text-gray-500 mb-8">
              Upload your CV and we&apos;ll craft 7 questions tailored specifically to <em>your</em> career — no generic surveys.
            </p>

            <div
              className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all duration-200 ${
                dragOver ? 'border-[#1F4E79] bg-[#1F4E79]/5 scale-[1.01]'
                : 'border-gray-300 hover:border-[#1F4E79] hover:bg-[#1F4E79]/3'
              }`}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <Upload className="w-12 h-12 text-[#1F4E79]/40 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-700 mb-1">Drop your CV here</p>
              <p className="text-sm text-gray-400">or click to browse · PDF or DOCX</p>
            </div>

            {file && (
              <div className="mt-4 flex items-center gap-3 bg-green-50 border border-green-200 px-4 py-3 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-800 truncate">{file.name}</p>
                  <p className="text-xs text-green-500">{(file.size / 1024).toFixed(0)} KB · Ready to analyse</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setFile(null) }}
                  className="text-green-400 hover:text-green-600 text-xs"
                >
                  Change
                </button>
              </div>
            )}

            <button
              onClick={handleAnalyse}
              disabled={!file || loading}
              className="mt-6 w-full bg-[#1F4E79] text-white font-semibold py-4 rounded-xl hover:bg-[#163a5e] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base shadow-lg shadow-[#1F4E79]/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Reading your CV…
                </>
              ) : (
                <>
                  Analyse My CV
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
            {loading && (
              <p className="text-center text-sm text-gray-400 mt-3 animate-pulse">
                Extracting your career story and crafting personalised questions…
              </p>
            )}
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
        {step === 3 && (
          <ProcessingStep msg={PROCESSING_MESSAGES[processingMsgIdx]} />
        )}

        {/* ── Step 4: Results ── */}
        {step === 4 && synthesis && (
          <ResultsStep
            synthesis={synthesis}
            loading={loading}
            email={email}
            setEmail={setEmail}
            emailSubmitted={emailSubmitted}
            setEmailSubmitted={setEmailSubmitted}
            onDownload={handleDownload}
          />
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// Step 2 — Question component
// ══════════════════════════════════════════════════════════════════════
function QuestionStep({
  currentQuestion, questions, answers, setAnswers, onNext, onBack, textareaRef, onKeyDown,
}: {
  currentQuestion: number
  questions: Question[]
  answers: string[]
  setAnswers: (a: string[]) => void
  onNext: () => void
  onBack: () => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}) {
  const q = questions[currentQuestion]
  const qText = typeof q === 'string' ? q : (q?.text ?? '')
  const qHint = typeof q === 'string' ? '' : (q?.hint ?? '')
  const { displayed, done } = useTypewriter(qText, 16)
  const isLast = currentQuestion === questions.length - 1
  const progress = Math.round(((currentQuestion + 1) / questions.length) * 100)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-gray-900">
          Question {currentQuestion + 1} <span className="text-gray-400 font-normal">of {questions.length}</span>
        </h1>
        <span className="text-sm font-medium text-[#1F4E79]">{progress}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-[#1F4E79] rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Coach avatar + question bubble */}
      <div className="flex items-start gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-[#1F4E79] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#1F4E79]/30 mt-0.5">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="bg-[#1F4E79] text-white rounded-2xl rounded-tl-none px-6 py-5 shadow-lg shadow-[#1F4E79]/15 flex-1 min-h-[80px]">
          <p className="text-base leading-relaxed">
            {displayed}
            {!done && (
              <span className="inline-block w-0.5 h-4 bg-white/60 animate-pulse ml-0.5 align-middle rounded-full" />
            )}
          </p>
        </div>
      </div>

      {/* Hint — fades in after typewriter completes */}
      <div className={`ml-[52px] mb-5 transition-all duration-500 ${done && qHint ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'}`}>
        <p className="text-xs text-gray-400 italic">💡 {qHint}</p>
      </div>

      {/* Answer textarea — fades in after typewriter */}
      <div className={`transition-all duration-400 ${done ? 'opacity-100' : 'opacity-0'}`}>
        <textarea
          ref={textareaRef}
          value={answers[currentQuestion]}
          onChange={e => {
            const next = [...answers]
            next[currentQuestion] = e.target.value
            setAnswers(next)
          }}
          onKeyDown={onKeyDown}
          placeholder="Share your thoughts here… there are no right or wrong answers"
          rows={5}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#1F4E79]/30 focus:border-[#1F4E79] transition-all bg-white"
        />
        <p className="text-xs text-gray-400 mt-1.5 text-right">⌘+Enter to continue</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-5">
        {currentQuestion > 0 && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!done}
          className="flex-1 bg-[#1F4E79] text-white font-semibold py-3 rounded-xl hover:bg-[#163a5e] transition-all flex items-center justify-center gap-2 disabled:opacity-40 shadow-md shadow-[#1F4E79]/20"
        >
          {isLast ? (
            <><Sparkles className="w-4 h-4" /> Generate My Career Analysis</>
          ) : (
            <>Next question <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// Step 3 — Processing animation
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
        <div className="w-24 h-24 rounded-full bg-[#1F4E79]/10 animate-[ping_2s_ease-in-out_infinite]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-[#1F4E79]/5 flex items-center justify-center">
            <Loader2 className="w-11 h-11 text-[#1F4E79] animate-spin" />
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Building your career portrait</h2>
      <p className="text-[#1F4E79] font-medium text-base min-h-[1.5rem] transition-all duration-700">
        {msg}<span className="opacity-50">{dots}</span>
      </p>
      <p className="text-sm text-gray-400 mt-3">Usually takes 20–30 seconds</p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// Step 4 — Results
// ══════════════════════════════════════════════════════════════════════
function ResultsStep({
  synthesis, loading, email, setEmail, emailSubmitted, setEmailSubmitted, onDownload,
}: {
  synthesis: Synthesis
  loading: boolean
  email: string
  setEmail: (v: string) => void
  emailSubmitted: boolean
  setEmailSubmitted: (v: boolean) => void
  onDownload: () => void
}) {
  const firstName = synthesis.name?.split(' ')[0] || 'there'
  const { displayed: posStatement, done: posDone } = useTypewriter(synthesis.positioning_statement, 11)
  const cs = synthesis.current_state || {}
  const ts = synthesis.target_state || {}

  return (
    <div>
      {/* Hero greeting */}
      <FadeIn delay={0}>
        <div className="flex items-start gap-3 mb-8">
          <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hey {firstName}, your career portrait is ready.
            </h1>
            <p className="text-gray-500 mt-1">
              Here&apos;s what we discovered about you — and where you&apos;re headed.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Positioning Statement — typewriter reveal */}
      <FadeIn delay={150}>
        <div className="bg-white border-l-4 border-[#1F4E79] rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-[#1F4E79]" />
            <h2 className="font-bold text-[#1F4E79] text-xs uppercase tracking-widest">Your Positioning Statement</h2>
          </div>
          <p className="text-gray-800 text-lg leading-relaxed italic">
            &ldquo;{posStatement}
            {!posDone && (
              <span className="inline-block w-0.5 h-5 bg-[#1F4E79]/40 animate-pulse ml-0.5 align-middle rounded-full" />
            )}
            &rdquo;
          </p>
        </div>
      </FadeIn>

      {/* Current vs Target */}
      <FadeIn delay={350}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-500 mb-4 text-xs uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> Where you are now
            </h3>
            <dl className="space-y-2.5 text-sm">
              {([
                ['Role', cs.role],
                ['Company', cs.company],
                ['Experience', cs.experience],
                ['Domain', cs.domain],
                ['Notice Period', cs.notice_period],
              ] as [string, string][]).filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-gray-400 flex-shrink-0">{k}</dt>
                  <dd className="font-semibold text-gray-800 text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-gradient-to-br from-[#1F4E79]/5 to-[#1F4E79]/10 rounded-xl p-5 border border-[#1F4E79]/15">
            <h3 className="font-bold text-[#1F4E79] mb-4 text-xs uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" /> Where you&apos;re going
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
                  <dt className="text-gray-500 flex-shrink-0">{k}</dt>
                  <dd className="font-bold text-[#1F4E79] text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </FadeIn>

      {/* Top Strengths */}
      <FadeIn delay={550}>
        <div className="mb-6">
          <h2 className="font-bold text-gray-900 mb-1 flex items-center gap-2 text-lg">
            <Star className="w-5 h-5 text-yellow-400" />
            Your Top Strengths
          </h2>
          <p className="text-sm text-gray-400 mb-4">Full interview stories are in your workbook — use them word-for-word in interviews.</p>
          <div className="space-y-3">
            {(synthesis.top_strengths || []).slice(0, 3).map((s, i) => (
              <div key={i} className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-emerald-900 mb-1">{s.strength}</p>
                  <p className="text-sm text-emerald-700 leading-relaxed">{s.evidence}</p>
                </div>
              </div>
            ))}
            {(synthesis.top_strengths || []).length > 3 && (
              <p className="text-sm text-gray-400 text-center py-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                +{synthesis.top_strengths.length - 3} more strengths with interview stories in your workbook
              </p>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Key Gaps */}
      <FadeIn delay={750}>
        <div className="mb-8">
          <h2 className="font-bold text-gray-900 mb-1 flex items-center gap-2 text-lg">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Gaps Worth Closing
          </h2>
          <p className="text-sm text-gray-400 mb-4">Each one has a concrete action and timeline in your 90-day plan.</p>
          <div className="space-y-3">
            {(synthesis.key_gaps || []).slice(0, 3).map((g, i) => (
              <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-400 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-amber-900 mb-1">{g.gap}</p>
                  <p className="text-sm text-amber-700 leading-relaxed">{g.action}</p>
                  <p className="text-xs text-amber-500 mt-1.5 font-medium">Timeline: {g.timeline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Download CTA */}
      <FadeIn delay={950}>
        <div className="bg-gradient-to-br from-[#1F4E79] to-[#163a5e] rounded-2xl p-8 text-center text-white mb-6 shadow-xl shadow-[#1F4E79]/25">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your Personalised Workbook is Ready</h2>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-white/60 text-sm mb-6">
            <span>4 sheets</span>
            <span>·</span>
            <span>16-step action plan</span>
            <span>·</span>
            <span>5 strengths with interview stories</span>
            <span>·</span>
            <span>90-day roadmap</span>
          </div>
          <button
            onClick={onDownload}
            disabled={loading}
            className="bg-white text-[#1F4E79] font-bold px-10 py-4 rounded-xl hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2 mx-auto shadow-lg text-base"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            Download My Career Workbook (.xlsx)
          </button>
        </div>
      </FadeIn>

      {/* Email capture / waitlist */}
      <FadeIn delay={1100}>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
          {emailSubmitted ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <p className="font-semibold text-gray-900">You&apos;re on the list, {firstName}!</p>
              <p className="text-sm text-gray-500">We&apos;ll reach out when CareerCare Premium goes live.</p>
            </div>
          ) : (
            <>
              <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-amber-200">
                <Star className="w-3 h-3" />
                Coming Soon: CareerCare Premium
              </div>
              <h3 className="font-bold text-gray-900 mb-1">
                LinkedIn headlines · Interview Q&amp;As · Salary negotiation scripts
              </h3>
              <p className="text-sm text-gray-500 mb-4">Join the waitlist and get early access at 50% off.</p>
              <div className="flex gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && email && setEmailSubmitted(true)}
                  placeholder="your@email.com"
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E79]/30 focus:border-[#1F4E79]"
                />
                <button
                  onClick={() => email && setEmailSubmitted(true)}
                  className="bg-[#1F4E79] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#163a5e] transition-colors whitespace-nowrap"
                >
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
