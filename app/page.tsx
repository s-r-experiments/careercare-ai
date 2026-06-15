import Link from 'next/link'
import { ArrowRight, Check, ChevronRight } from 'lucide-react'
import Logo from './components/Logo'
import HeroSlideshow from './components/HeroSlideshow'

const RECOGNITION_MOMENTS = [
  {
    quote: "I've been moving forward — but I'm not sure I've been moving in the right direction.",
    persona: 'Engineering Manager, 34',
    initial: 'A',
  },
  {
    quote: "I know what I'm good at. I'm just not sure it's what I want to be known for.",
    persona: 'Senior Consultant, 31',
    initial: 'K',
  },
  {
    quote: "There's a version of my career I haven't said out loud to anyone yet.",
    persona: 'Product Leader, 37',
    initial: 'R',
  },
]

const SAMPLE_CONVERSATIONS = [
  {
    anchor: "We noticed you've spent the last 4 years at [Company] — your longest stretch by far.",
    question: "What made you stay that long — and what's quietly been pulling you toward something different?",
    hint: "There's often no single answer here. Whatever comes to mind first is worth sitting with.",
  },
  {
    anchor: "Your career shows a recurring pattern — you consistently move toward ownership, not just execution.",
    question: "What kind of work feels natural to you, almost effortless — while others around you seem to find it hard?",
    hint: "The things that feel obvious to you are often the things others value most in you.",
  },
  {
    anchor: "Looking at your arc, you've made several lateral moves alongside the upward ones.",
    question: "If the next chapter was less about the next title and more about the kind of work — what would it look like?",
    hint: "You don't need a clear answer yet. What pulls at you is enough to start.",
  },
]

const FREE_FEATURES = [
  'A career narrative that captures who you are professionally',
  'Your personal patterns — the strengths you may not fully see in yourself',
  'Growth edges — the areas worth developing, with a plan to get there',
  'Possible directions that emerge naturally from your story',
  'Market context: which environments are likely to fit you and why',
  'A full reflection document to download and keep',
]

const PAID_FEATURES = [
  'Specific companies aligned to your story and goals — updated weekly',
  'Open roles matched to your background',
  'A referral tracker with warm contact templates',
  'Salary context and negotiation guidance',
  'LinkedIn messages and outreach scripts',
  'Ongoing check-ins as your path evolves',
]

export default function Home() {
  return (
    <div className="bg-white text-[#1C1917] overflow-x-hidden">

      {/* ── Nav ───────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#1C1917]/96 backdrop-blur-md px-6 py-4 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo light />
          <Link
            href="/tool"
            className="bg-white hover:bg-stone-100 text-[#1C1917] text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Begin your reflection →
          </Link>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center px-6 py-28 overflow-hidden bg-[#1C1917]">
        <HeroSlideshow />
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-green-950 rounded-full blur-[180px] opacity-15 pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full relative">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/8 text-white/60 text-xs font-medium px-3.5 py-1.5 rounded-full mb-10 border border-white/8 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                Free · No account required
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.06] tracking-tight mb-3">
                Reflect on your career.
              </h1>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white/40 leading-[1.06] tracking-tight mb-10">
                Navigate what&apos;s next.
              </h2>

              <p className="text-lg text-white/55 leading-relaxed mb-12 max-w-lg font-light">
                A guided career reflection that helps you uncover patterns, strengths, and possible directions for the next chapter of your professional life.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/tool"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-100 text-[#1C1917] text-base font-semibold px-8 py-4 rounded-xl transition-all active:scale-95"
                >
                  Begin your reflection
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#the-reflection"
                  className="inline-flex items-center justify-center gap-2 text-white/50 hover:text-white/80 text-base font-light px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 transition-all"
                >
                  See how it works
                </a>
              </div>

              <p className="text-white/25 text-sm mt-6 font-light">Takes about 10 minutes. Completely free.</p>
            </div>

            {/* Right: Sample output — editorial card */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-green-950 blur-[80px] opacity-30 rounded-3xl" />
                <div className="relative bg-white/[0.05] backdrop-blur border border-white/8 rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center gap-1.5 mb-6">
                    <div className="w-2 h-2 rounded-full bg-white/15" />
                    <div className="w-2 h-2 rounded-full bg-white/15" />
                    <div className="w-2 h-2 rounded-full bg-white/15" />
                    <span className="ml-2 text-white/25 text-xs font-mono tracking-wide">career-reflection.pdf</span>
                  </div>

                  <p className="text-white/30 text-[11px] font-semibold uppercase tracking-[0.18em] mb-3">Career Narrative</p>
                  <p className="text-white/85 text-base leading-relaxed italic mb-7 font-light">
                    &ldquo;Priya is a product leader who has built and scaled fintech experiences across South Asia.
                    She&apos;s naturally drawn to moments of ambiguity — where there&apos;s no playbook yet —
                    and is ready for a role where she shapes the product arc, not just executes it.&rdquo;
                  </p>

                  <div className="border-t border-white/8 pt-6 space-y-3.5">
                    {[
                      { label: 'Personal patterns identified', value: '5 with context' },
                      { label: 'Growth edges', value: '4 with actions' },
                      { label: 'Possible directions', value: '3 paths explored' },
                      { label: 'Reflection document', value: 'Ready to download' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-white/35 text-xs font-light">{label}</span>
                        <span className="text-white/65 text-xs font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Philosophy statement ────────────────────────────── */}
      <section className="py-28 px-6 bg-[#FAF8F5]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#A8A29E] text-sm font-medium uppercase tracking-[0.2em] mb-10">Why Midcourse exists</p>
          <blockquote className="text-3xl sm:text-4xl font-light text-[#1C1917] leading-[1.4] tracking-tight mb-10">
            People service their cars. Review their finances. Track their fitness.
            Schedule their health checkups.
          </blockquote>
          <blockquote className="text-3xl sm:text-4xl font-light text-[#78716C] leading-[1.4] tracking-tight mb-12">
            But most careers run on autopilot — years passing without a moment of genuine reflection.
          </blockquote>
          <div className="w-8 h-px bg-[#1C1917]/20 mx-auto mb-10" />
          <p className="text-xl font-light text-[#1C1917] tracking-tight">
            Midcourse is that pause.
          </p>
        </div>
      </section>

      {/* ── Recognition moments ──────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#A8A29E] font-medium text-sm uppercase tracking-[0.2em] mb-3">You might recognise this</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {RECOGNITION_MOMENTS.map(({ quote, persona, initial }, i) => (
              <div key={i} className="bg-[#FAF8F5] rounded-2xl p-7 border border-[#E7E5E4]">
                <div className="w-9 h-9 rounded-full bg-[#E7E5E4] text-[#78716C] font-semibold text-sm flex items-center justify-center mb-5">
                  {initial}
                </div>
                <p className="text-[#1C1917] text-base leading-relaxed font-light mb-4">&ldquo;{quote}&rdquo;</p>
                <p className="text-[#A8A29E] text-xs font-medium tracking-wide">{persona}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[#A8A29E] text-sm mt-10 max-w-xl mx-auto font-light leading-relaxed">
            Career uncertainty is not a personal failure. It&apos;s what happens when there&apos;s no space to stop and genuinely reflect.
          </p>
        </div>
      </section>

      {/* ── What Midcourse is ──────────────────────────────── */}
      <section className="py-24 px-6 bg-[#1C1917]">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <p className="text-[#D97706] font-medium text-sm uppercase tracking-[0.2em] mb-6">A different kind of experience</p>
              <h2 className="text-3xl sm:text-4xl font-light text-white mb-8 leading-tight">
                Most tools treat your career<br />as a problem to solve.
              </h2>
              <p className="text-white/55 leading-relaxed mb-6 font-light text-lg">
                We think of it as a story to understand.
              </p>
              <p className="text-white/40 leading-relaxed mb-8 font-light">
                There&apos;s a difference between knowing which job to apply for and knowing <em className="text-white/60 not-italic">why</em> you&apos;re applying for it.
                Midcourse helps you get to the second one — through a guided conversation built around your specific history, not a generic template.
              </p>
              <Link
                href="/tool"
                className="inline-flex items-center gap-2 bg-white hover:bg-stone-100 text-[#1C1917] font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm"
              >
                Begin your reflection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { not: 'An AI career coach or advisor', is: 'A reflective guide built around your story' },
                { not: 'A job board or hiring platform', is: 'A space for understanding before action' },
                { not: 'A resume optimizer or keyword tool', is: 'A way to find the language for who you are' },
                { not: '"What are your strengths?" surveys', is: 'Questions anchored in your actual career history' },
                { not: 'A quick fix or shortcut', is: 'A durable perspective on your professional life' },
              ].map(({ not: notText, is: isText }, i) => (
                <div key={i} className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 flex gap-4">
                  <div className="flex-1">
                    <p className="text-white/25 text-xs line-through leading-relaxed font-light">{notText}</p>
                  </div>
                  <div className="w-px bg-white/8 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-white/75 text-xs leading-relaxed font-light">{isText}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── The Guided Conversation ─────────────────────────── */}
      <section id="the-reflection" className="py-28 px-6 bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-18">
            <p className="text-[#A8A29E] font-medium text-sm uppercase tracking-[0.2em] mb-4">The guided conversation</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1C1917] mb-5 tracking-tight">
              Questions built around<br />your actual story
            </h2>
            <p className="text-[#78716C] max-w-xl mx-auto text-base font-light leading-relaxed">
              We read your CV carefully before we say a word. What you&apos;ll find below is what the conversation actually looks like.
            </p>
          </div>

          <div className="space-y-10 mt-16">
            {SAMPLE_CONVERSATIONS.map((item, i) => (
              <div key={i} className="flex items-start gap-5">
                <div className="w-9 h-9 rounded-full bg-[#1C1917] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
                  <svg width="14" height="14" viewBox="0 0 34 14" fill="none">
                    <line x1="0" y1="7" x2="11" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="17" cy="7" r="4.5" stroke="white" strokeWidth="1.5"/>
                    <circle cx="17" cy="7" r="1.5" fill="white"/>
                    <line x1="23" y1="7" x2="34" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#A8A29E] italic leading-relaxed border-l-2 border-[#D97706]/50 pl-3 mb-2.5 font-light">
                    {item.anchor}
                  </p>
                  <div className="bg-[#1C1917] text-white rounded-2xl rounded-tl-none px-7 py-5 shadow-lg mb-2.5">
                    <p className="text-sm leading-relaxed text-white/85 font-light">{item.question}</p>
                  </div>
                  <p className="text-xs text-[#A8A29E] italic pl-1 font-light">💡 {item.hint}</p>
                </div>
              </div>
            ))}
            <div className="ml-[56px]">
              <p className="text-[#A8A29E] text-sm italic font-light">Every question is generated from your specific career history — no two reflections are the same.</p>
            </div>
          </div>

          {/* Three steps */}
          <div className="mt-24 grid sm:grid-cols-3 gap-10">
            {[
              {
                step: '01',
                heading: 'Reflect',
                body: 'Share your career history. We read it carefully — every role, every move, every transition — so our questions are grounded in your actual story.',
              },
              {
                step: '02',
                heading: 'Understand',
                body: 'A guided conversation surfaces the patterns, strengths, and themes that have run through your career — many of which you may not have named before.',
              },
              {
                step: '03',
                heading: 'Navigate',
                body: 'Possible directions emerge from your story naturally. Not recommendations. Not rankings. Directions that feel like they were always there, waiting to be seen.',
              },
            ].map(({ step, heading, body }, i) => (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden sm:block absolute top-6 left-full w-full h-px border-t border-dashed border-[#E7E5E4] -translate-x-6" />
                )}
                <p className="text-[#A8A29E] text-xs font-semibold uppercase tracking-[0.2em] mb-4">{step}</p>
                <h3 className="font-semibold text-[#1C1917] text-xl mb-3 tracking-tight">{heading}</h3>
                <p className="text-[#78716C] text-sm leading-relaxed font-light">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What you walk away with ─────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#A8A29E] font-medium text-sm uppercase tracking-[0.2em] mb-3">What you walk away with</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1C1917] tracking-tight">
              Not a list. A reflection.
            </h2>
            <p className="text-[#78716C] mt-4 max-w-lg mx-auto font-light text-base">
              Everything below is free. No credit card. No account.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {FREE_FEATURES.map((feat, i) => (
              <div key={i} className="bg-[#FAF8F5] rounded-xl p-5 border border-[#E7E5E4] flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#1C1917] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                </div>
                <p className="text-sm text-[#44403C] leading-relaxed font-light">{feat}</p>
              </div>
            ))}
          </div>

          {/* Paid tier teaser */}
          <div className="bg-[#1C1917] rounded-2xl p-8 flex flex-col sm:flex-row gap-8 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 bg-[#D97706]/20 text-[#D97706] text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-[#D97706]/20 tracking-wide">
                Coming Soon · Full Reflection
              </div>
              <h3 className="text-white font-semibold text-xl mb-2 tracking-tight">Ready to go deeper?</h3>
              <p className="text-white/50 text-sm leading-relaxed font-light">
                Specific companies aligned with your story, open roles, a referral tracker, salary context, and ongoing guidance as your path evolves.
              </p>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <ul className="space-y-2 mb-5">
                {PAID_FEATURES.slice(0, 3).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/50 text-xs font-light">
                    <ChevronRight className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
                <li className="text-white/25 text-xs pl-5 font-light">+ {PAID_FEATURES.length - 3} more</li>
              </ul>
              <Link href="/tool" className="block text-center bg-white hover:bg-stone-100 text-[#1C1917] font-semibold text-sm px-6 py-3 rounded-xl transition-colors">
                Start free — deepen when ready →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────── */}
      <section className="py-36 px-6 bg-[#FAF8F5] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #1C1917 1px, transparent 0)',
          backgroundSize: '36px 36px'
        }} />
        <div className="max-w-3xl mx-auto text-center relative">
          <p className="text-[#A8A29E] font-medium text-sm uppercase tracking-[0.2em] mb-8">Begin</p>
          <h2 className="text-4xl sm:text-5xl font-light text-[#1C1917] mb-8 leading-[1.2] tracking-tight">
            Ten minutes.<br />A lifetime of context.
          </h2>
          <p className="text-[#78716C] text-lg mb-12 max-w-xl mx-auto font-light leading-relaxed">
            Take the reflection most people keep putting off.
          </p>
          <Link
            href="/tool"
            className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-white text-base font-semibold px-10 py-5 rounded-2xl transition-all active:scale-95"
          >
            Begin your reflection
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-[#A8A29E] text-sm mt-5 font-light">No account. No credit card. Free.</p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-[#1C1917] px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo light />
          <p className="text-white/20 text-sm font-light">© {new Date().getFullYear()} Midcourse. A space for reflection.</p>
        </div>
      </footer>

    </div>
  )
}
