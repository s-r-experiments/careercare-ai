import Link from 'next/link'
import { ArrowRight, Check, ChevronRight } from 'lucide-react'
import Logo from './components/Logo'
import HeroSlideshow from './components/HeroSlideshow'

const PAIN_QUOTES = [
  {
    quote: "I've been in the same role for 3 years. I know I want more — I just don't know what that actually looks like.",
    persona: 'Product Manager, 31',
    initial: 'P',
    color: 'bg-violet-100 text-violet-700',
  },
  {
    quote: "I keep applying for roles and getting no response. My CV looks fine to me. I have no idea what I'm doing wrong.",
    persona: 'Senior Engineer, 28',
    initial: 'S',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    quote: "My manager says I'm performing well. But I can't see a future here — and I'm not even sure if I want one.",
    persona: 'Marketing Lead, 34',
    initial: 'M',
    color: 'bg-emerald-100 text-emerald-700',
  },
]

const SAMPLE_QUESTIONS = [
  {
    anchor: "We noticed you've spent the last 4 years at [Company] — your longest stretch by far.",
    question: "What made you stay that long — and what's finally made you ready for something new?",
    hint: "Think about what you were hoping to find there, versus what you actually found.",
  },
  {
    anchor: "Your career shows a consistent pattern — you've moved from execution roles into ownership roles, each time.",
    question: "What's the work that feels effortless to you, where others around you seem to visibly struggle?",
    hint: "The answer is often something so natural to you that you haven't thought to mention it.",
  },
  {
    anchor: "Looking at your last two roles, you've taken on scope that wasn't officially yours. We noticed that.",
    question: "If you redesigned your next role from scratch — what would you cut entirely, and what would you double down on?",
    hint: "You don't have to have a clear picture yet. What feels true right now is enough.",
  },
]

const FREE_FEATURES = [
  'A positioning statement that actually captures who you are',
  'Your top 5 strengths — with real interview stories attached',
  '4 gaps that are silently holding you back — and how to close them',
  'A 90-day plan broken into weekly actions you can actually do',
  'Industry context: which company types fit you and why',
  'A full career workbook to download and keep',
]

const PAID_FEATURES = [
  'Specific companies hiring for your target role — updated weekly',
  'Open roles matched to your background and goals',
  'A referral tracker with warm contact templates',
  'Salary negotiation scripts for your exact target',
  'LinkedIn messages and cold outreach templates',
  'Ongoing career check-ins as your search evolves',
]

export default function Home() {
  return (
    <div className="bg-white text-gray-900 overflow-x-hidden">

      {/* ── Nav ───────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#0A1F35]/95 backdrop-blur-md px-6 py-4 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo light />
          <Link
            href="/tool"
            className="bg-amber-400 hover:bg-amber-300 text-gray-900 text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
          >
            Start Free →
          </Link>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center px-6 py-24 overflow-hidden bg-[#0A1F35]">
        {/* Cycling background images */}
        <HeroSlideshow />
        {/* Ambient glow accents — sit above the photos */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#1F4E79] rounded-full blur-[140px] opacity-20 pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Free career session · No sign-up required
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6">
                Most people don&apos;t have a<br />
                <span className="text-amber-400">career problem.</span><br />
                They have a<br />
                clarity problem.
              </h1>

              <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-lg">
                Most people spend years knowing something&apos;s off — but never quite finding the right words for it.
                CareerCare sits down with you, reads your CV, asks the questions no one else has thought to ask —
                and gives you a portrait of yourself as a professional that you can actually work from.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/tool"
                  className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 text-base font-bold px-8 py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-amber-500/20"
                >
                  Start your free session
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 text-white/70 hover:text-white text-base font-medium px-8 py-4 rounded-xl border border-white/15 hover:border-white/30 transition-all"
                >
                  See how it works
                </a>
              </div>

              <p className="text-white/30 text-sm mt-5">Takes about 10 minutes. Completely free. Nothing to install.</p>
            </div>

            {/* Right: Sample output card */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Glow behind card */}
                <div className="absolute inset-0 bg-[#1F4E79] blur-[60px] opacity-40 rounded-3xl" />

                <div className="relative bg-white/[0.06] backdrop-blur border border-white/10 rounded-2xl p-7 shadow-2xl">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <span className="ml-2 text-white/30 text-xs font-mono">career-portrait.xlsx</span>
                  </div>

                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">Your positioning statement</p>
                  <p className="text-white/90 text-base leading-relaxed italic mb-6">
                    &ldquo;Meera is a product leader who has scaled fintech products to 5M users across South Asia.
                    She&apos;s ready for a founding PM role at a Series B company where she can own the
                    full product arc — from zero to one.&rdquo;
                  </p>

                  <div className="border-t border-white/10 pt-5 space-y-3">
                    {[
                      { label: 'Top strengths identified', value: '5 with interview stories' },
                      { label: 'Gaps with action plan', value: '4 with timelines' },
                      { label: 'Company types to target', value: '4 specific categories' },
                      { label: '90-day roadmap', value: '16 actions across 4 phases' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-white/40 text-xs">{label}</span>
                        <span className="text-white/80 text-xs font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <p className="text-amber-300 text-xs font-medium">Workbook ready to download</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Pain: Sound familiar? ───────────────────────────── */}
      <section className="py-24 px-6 bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-500 font-bold text-sm uppercase tracking-widest mb-3">You&apos;re not alone</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Sound familiar?</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {PAIN_QUOTES.map(({ quote, persona, initial, color }, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full ${color} font-bold text-sm flex items-center justify-center flex-shrink-0`}>
                    {initial}
                  </div>
                  <p className="text-xs text-gray-400 font-medium">{persona}</p>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">&ldquo;{quote}&rdquo;</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm mt-10 max-w-xl mx-auto">
            Career uncertainty is not a personal failure. It&apos;s what happens when no one takes the time to actually understand your story — and help you tell it better.
          </p>
        </div>
      </section>

      {/* ── The difference (dark) ───────────────────────────── */}
      <section className="py-24 px-6 bg-[#0D1B2A]">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-amber-400 font-bold text-sm uppercase tracking-widest mb-4">What makes us different</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
                We don&apos;t match keywords.<br />We understand people.
              </h2>
              <p className="text-white/60 leading-relaxed mb-8">
                Most career tools treat you like a document — they scan your CV and throw job listings at you.
                CareerCare does something different: it <em className="text-white/90">interviews</em> you.
              </p>
              <p className="text-white/60 leading-relaxed mb-10">
                A short set of questions crafted specifically from your own career history, designed to surface
                the patterns, motivations, and strengths you&apos;ve never seen clearly yourself.
                Then we turn those answers into a sharp, honest, actionable career portrait.
              </p>
              <Link
                href="/tool"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-7 py-3.5 rounded-xl transition-colors"
              >
                Try it free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Not / But this */}
            <div className="space-y-3">
              {[
                { not: 'Another job board with infinite listings', but: 'A focused path to the right 3–5 opportunities' },
                { not: 'Keyword matching against job descriptions', but: 'Deep understanding of who you are and what you want' },
                { not: 'Generic advice anyone could get from Google', but: 'Insights grounded in your specific story' },
                { not: '"What are your strengths?" surveys', but: 'Questions that reference your actual companies and roles' },
                { not: 'A prettier CV', but: 'The clarity to know which door to knock on — and what to say' },
              ].map(({ not: notText, but: butText }, i) => (
                <div key={i} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4 flex gap-4">
                  <div className="flex-1">
                    <p className="text-white/30 text-xs line-through leading-relaxed">{notText}</p>
                  </div>
                  <div className="w-px bg-white/10 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-white/80 text-xs leading-relaxed">{butText}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Example questions ──────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-500 font-bold text-sm uppercase tracking-widest mb-3">A glimpse of the conversation</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Questions built around<br />your actual story
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-base">
              We read your CV first — every company, every role, every transition. Then we ask the things that actually matter.
            </p>
          </div>

          <div className="space-y-8">
            {SAMPLE_QUESTIONS.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#0F2742] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-[#0F2742]/20">
                  <svg width="16" height="16" viewBox="0 0 30 30" fill="none">
                    <path d="M9 21 L21 9 M21 9 H15.5 M21 9 V14.5" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1">
                  {/* CV anchor — what we noticed */}
                  <p className="text-xs text-gray-400 italic leading-relaxed border-l-2 border-amber-300 pl-3 mb-2">
                    {item.anchor}
                  </p>
                  {/* Question bubble */}
                  <div className="bg-[#0F2742] text-white rounded-2xl rounded-tl-none px-6 py-4 shadow-lg shadow-[#0F2742]/10 mb-2">
                    <p className="text-sm leading-relaxed text-white/90">{item.question}</p>
                  </div>
                  {/* Hint */}
                  <p className="text-xs text-gray-400 italic pl-1">💡 {item.hint}</p>
                </div>
              </div>
            ))}
            <div className="ml-[52px]">
              <p className="text-gray-400 text-sm italic">Every question is generated from your specific CV — no two conversations are the same.</p>
            </div>
          </div>

          {/* Journey steps */}
          <div className="mt-20 grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                heading: 'We read your story',
                body: 'Upload your CV. We study it — every company, every move, every gap between jobs. So when we ask you something, it lands.',
              },
              {
                step: '02',
                heading: 'You have a real conversation',
                body: 'Four chapters. Questions anchored in your specific history. Ten minutes of honest reflection that most people have never had about their career.',
              },
              {
                step: '03',
                heading: 'You leave knowing yourself',
                body: 'A positioning statement you could say out loud. Strengths you can prove. Gaps you know how to close. A plan for the next 90 days.',
              },
            ].map(({ step, heading, body }, i) => (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden sm:block absolute top-5 left-full w-full h-px border-t border-dashed border-gray-200 -translate-x-4" />
                )}
                <div className="text-5xl font-black text-gray-100 mb-4 leading-none">{step}</div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{heading}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What you get ───────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-500 font-bold text-sm uppercase tracking-widest mb-3">What you walk away with</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Not a list. A portrait.
            </h2>
            <p className="text-gray-500 mt-4 max-w-lg mx-auto">
              Everything in the free tier. No credit card. No catch.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {FREE_FEATURES.map((feat, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{feat}</p>
              </div>
            ))}
          </div>

          {/* Paid tier teaser */}
          <div className="bg-[#0F2742] rounded-2xl p-8 flex flex-col sm:flex-row gap-8 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-amber-400/20">
                Coming Soon · Premium
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Ready to go further?</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Specific companies hiring for your exact role, open positions matched to your profile, a referral tracker, salary negotiation scripts, and ongoing coaching as your search evolves.
              </p>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <ul className="space-y-2 mb-5">
                {PAID_FEATURES.slice(0, 3).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/60 text-xs">
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
                <li className="text-white/30 text-xs pl-5">+ {PAID_FEATURES.length - 3} more</li>
              </ul>
              <Link href="/tool" className="block text-center bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold text-sm px-6 py-3 rounded-xl transition-colors">
                Start free — upgrade when ready →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────── */}
      <section className="py-32 px-6 bg-gradient-to-br from-[#0A1F35] to-[#1A3F6B] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#1F4E79] rounded-full blur-[100px] opacity-40 pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
            Ready to stop guessing<br />and start moving?
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            Ten minutes. A few honest questions. One clear plan.
            That&apos;s all it takes to go from stuck to certain.
          </p>
          <Link
            href="/tool"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 text-lg font-extrabold px-10 py-5 rounded-2xl transition-all active:scale-95 shadow-xl shadow-amber-500/20"
          >
            Start your free session
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-white/25 text-sm mt-5">No account. No credit card. Free forever.</p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-[#07121E] px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo light />
          <p className="text-white/25 text-sm">© {new Date().getFullYear()} CareerCare. Built for people who want more.</p>
        </div>
      </footer>

    </div>
  )
}
