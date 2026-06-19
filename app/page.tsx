import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, ChevronRight } from 'lucide-react'
import Logo, { LogoMark } from './components/Logo'
import HeroSlideshow from './components/HeroSlideshow'

export const metadata: Metadata = {
  title: 'Midcourse | Free AI Career Reflection & Coaching Tool',
  description: 'Not sure what your next career move is? Upload your CV and get a personalised AI career reflection — strengths, gaps, blindspots, and a 90-day action plan. Free, no account required.',
  alternates: { canonical: 'https://www.midcourse.co.in' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://www.midcourse.co.in/#app',
      name: 'Midcourse',
      url: 'https://www.midcourse.co.in',
      description: 'An AI-powered career reflection tool that helps professionals discover their strengths, identify gaps, and navigate their next career move.',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Requires JavaScript',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
      featureList: [
        'AI-powered CV analysis',
        'Personalised career reflection questions',
        'Strengths and gaps analysis',
        'Energy map and signal moments',
        '90-day career action plan',
        'Downloadable career snapshot (Excel)',
      ],
      creator: { '@type': 'Organization', name: 'Midcourse', url: 'https://www.midcourse.co.in' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.midcourse.co.in/#org',
      name: 'Midcourse',
      url: 'https://www.midcourse.co.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.midcourse.co.in/logo.svg',
        width: 400,
        height: 120,
      },
      description: 'AI-powered career reflection and coaching for professionals navigating their next move.',
      foundingDate: '2024',
      areaServed: ['IN', 'US', 'GB', 'SG', 'AE'],
      knowsAbout: ['Career coaching', 'Career planning', 'Professional development', 'Career change', 'Job transition'],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://www.midcourse.co.in/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Midcourse?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Midcourse is a free AI-powered career reflection tool. You upload your CV, answer guided questions about your career story, and receive a deep personalised analysis — including your top strengths with evidence, key gaps, energy map, signal moments, and a 90-day action plan for your next career move.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I figure out my next career move?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Midcourse guides you through a structured career reflection across four pillars: your career story, what matters most to you, your personal patterns, and possible directions. By uploading your CV and answering a series of reflective questions, the AI generates a personalised career analysis that surfaces your strengths, tensions, and clearest paths forward.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Midcourse free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Midcourse is completely free to use with no account required. Upload your CV, complete the reflection, and download your personalised career snapshot — at no cost.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is Midcourse different from a career coach?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A traditional career coach charges ₹5,000–₹50,000 per session and takes weeks to understand your story. Midcourse reads your CV in seconds, asks the same deep questions a great coach would ask, and delivers a personalised career reflection in minutes — for free. It gives you a strong foundation before investing in human coaching.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can Midcourse help me change careers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Midcourse is specifically designed for professionals considering a career change or transition. It identifies transferable strengths, surfaces the tensions holding you back, and maps out realistic next directions based on your actual career history — not generic advice.',
          },
        },
        {
          '@type': 'Question',
          name: 'What happens after I upload my CV?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Midcourse reads your CV and generates personalised reflection questions across four career pillars. You answer at your own pace — the more you share, the sharper your results. At the end, you receive a detailed career snapshot: positioning statement, top strengths with evidence, key gaps, energy map, signal moments, and a 90-day action plan.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I know what career is right for me?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Knowing the right career requires understanding your strengths, values, energy, and patterns — not just your job title. Midcourse\'s AI-guided reflection helps you uncover exactly these through a structured conversation built around your specific career history, surfacing what energises you, what drains you, and where your career arc is pointing.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Midcourse work for professionals in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Midcourse is built with Indian professionals in mind, with salary benchmarking data for India and career guidance tailored to the Indian job market across technology, finance, sales, consulting, and other sectors.',
          },
        },
      ],
    },
  ],
}

const RESEARCH_STATS = [
  {
    stat: '23%',
    body: 'better performance on subsequent tasks after structured reflection on your work',
    source: 'Harvard Business School, 2014',
  },
  {
    stat: '6×',
    body: 'more likely to be engaged at work when you use your strengths every day',
    source: 'Gallup, State of the American Workplace',
  },
  {
    stat: '15%',
    body: 'less likely to leave a role that genuinely fits your strengths',
    source: 'Gallup Workplace Research',
  },
]

const RECOGNITION_MOMENTS = [
  {
    quote: "I've been moving forward — but I'm not sure I've been moving in the right direction.",
    persona: 'Engineering Manager, 34',
    initial: 'A',
    bg: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=64&h=64&q=80',
  },
  {
    quote: "I know what I'm good at. I'm just not sure it's what I want to be known for.",
    persona: 'Senior Consultant, 31',
    initial: 'K',
    bg: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=64&h=64&q=80',
  },
  {
    quote: "There's a version of my career I haven't said out loud to anyone yet.",
    persona: 'Product Leader, 37',
    initial: 'R',
    bg: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=64&h=64&q=80',
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

// Professionals who use Midcourse — visual anchoring
const PEOPLE_STRIP = [
  {
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=80&h=80&q=80',
    name: 'Ananya',
    title: 'Engineering Manager',
  },
  {
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&h=80&q=80',
    name: 'Karan',
    title: 'Senior Consultant',
  },
  {
    photo: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=80&h=80&q=80',
    name: 'Ritu',
    title: 'Product Leader',
  },
  {
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
    name: 'Mihir',
    title: 'Director, Strategy',
  },
  {
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=80&h=80&q=80',
    name: 'Nisha',
    title: 'VP Sales',
  },
]

export default function Home() {
  return (
    <div className="bg-white text-[#1C1917] overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Nav — logo centered, sticky ─────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white px-6 py-4 border-b border-stone-100 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <Logo />
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center px-6 py-12 overflow-hidden bg-[#1C1917]">
        <HeroSlideshow />

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* Left: Copy — text-shadow ensures legibility across all slideshow frames */}
            <div style={{ textShadow: '0 1px 12px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.7)' }}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.06] tracking-tight mb-3">
                Your career has a story.
              </h1>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white/60 leading-[1.06] tracking-tight mb-8">
                Let&apos;s finally read it.
              </h2>

              {/* Concrete mechanism — what actually happens */}
              <div className="flex items-center gap-3 mb-8 flex-wrap">
                {['Upload your CV', 'Answer 12 guided questions', 'Get your personalised report'].map((s, i) => (
                  <span key={s} className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <span className="text-white/50 text-xs font-medium">{i + 1}</span>
                      <span className="text-sm text-white/70 font-light">{s}</span>
                    </span>
                    {i < 2 && <ArrowRight className="w-3 h-3 text-white/30 shrink-0" />}
                  </span>
                ))}
              </div>

              <p className="text-lg text-white/75 leading-relaxed mb-10 max-w-lg font-light">
                Most professionals spend years building careers without stopping to understand them. Midcourse asks the questions a great coach asks — and returns a report showing your patterns, blind spots, and clearest next chapter.
              </p>

              <div className="flex flex-col sm:flex-row gap-4" style={{ textShadow: 'none' }}>
                <Link
                  href="/tool"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-100 text-[#1C1917] text-base font-semibold px-8 py-4 rounded-xl transition-all active:scale-95"
                >
                  Begin your reflection
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#the-reflection"
                  className="inline-flex items-center justify-center gap-2 text-white/60 hover:text-white/90 text-base font-light px-8 py-4 rounded-xl border border-white/15 hover:border-white/30 transition-all"
                >
                  See how it works
                </a>
              </div>

              <p className="text-white/40 text-sm mt-5 font-light">Takes about 15 minutes. Completely free.</p>
            </div>

            {/* Right: Sample report output — concrete strength patterns */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-950 blur-[80px] opacity-20 rounded-3xl" />
                <div className="relative bg-white/[0.05] backdrop-blur border border-white/8 rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-white/30 text-[10px] font-semibold uppercase tracking-[0.2em]">Midcourse Report · Priya M.</p>
                    <span className="text-white/20 text-[10px] font-light">Sample output</span>
                  </div>

                  <p className="text-white/40 text-[10px] font-semibold uppercase tracking-[0.18em] mb-4">Strength Patterns</p>

                  <div className="space-y-4 mb-6">
                    {[
                      { n: '01', title: 'Builder', desc: 'You create structure from ambiguity. Your best work comes when there\'s no playbook yet.' },
                      { n: '02', title: 'Translator', desc: 'You bridge strategy and execution. Most energised turning direction into something real.' },
                      { n: '03', title: 'Explorer', desc: 'You gravitate toward new domains. Each move has quietly expanded your professional range.' },
                    ].map(({ n, title, desc }) => (
                      <div key={n} className="flex gap-3">
                        <span className="text-white/20 text-xs font-mono mt-0.5 shrink-0">{n}</span>
                        <div>
                          <p className="text-white/80 text-sm font-medium mb-0.5">{title}</p>
                          <p className="text-white/40 text-xs leading-relaxed font-light">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/8 pt-4 flex flex-wrap gap-x-4 gap-y-1">
                    {['Growth edges', 'Blind spots', 'Possible directions', 'Action plan'].map(l => (
                      <span key={l} className="text-white/25 text-[11px] font-light">+ {l}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Philosophy statement ────────────────────────────── */}
      <section className="py-16 px-6 bg-[#FAF8F5]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#A8A29E] text-sm font-medium uppercase tracking-[0.2em] mb-8">Why Midcourse exists</p>
          <blockquote className="text-3xl sm:text-4xl font-light text-[#1C1917] leading-[1.4] tracking-tight mb-6">
            People service their cars. Review their finances. Track their fitness.
            Schedule their health checkups.
          </blockquote>
          <blockquote className="text-3xl sm:text-4xl font-light text-[#78716C] leading-[1.4] tracking-tight mb-8">
            But most careers run on autopilot — years passing without a moment of genuine reflection.
          </blockquote>
          <div className="flex justify-center mb-8">
            <LogoMark className="opacity-30" size={2} />
          </div>
          <p className="text-xl font-light text-[#1C1917] tracking-tight mb-10">
            Midcourse is that pause.
          </p>

          {/* Research-backed case for reflection */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {RESEARCH_STATS.map(({ stat, body, source }, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-[#E7E5E4] text-left">
                <p className="text-3xl font-semibold text-[#1C1917] tracking-tight mb-1">{stat}</p>
                <p className="text-sm text-[#78716C] font-light leading-snug">{body}</p>
                <p className="text-[11px] text-[#A8A29E] mt-2 font-light">{source}</p>
              </div>
            ))}
          </div>

          {/* People strip — faces that ground this in real humans */}
          <div className="flex items-center justify-center gap-0 mt-2">
            {PEOPLE_STRIP.map((person, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 border-[#FAF8F5] overflow-hidden bg-stone-200 flex-shrink-0"
                style={{ marginLeft: i === 0 ? 0 : '-8px', zIndex: PEOPLE_STRIP.length - i }}
              >
                <img
                  src={person.photo}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <p className="ml-4 text-sm text-[#78716C] font-light">
              For professionals in the middle of their story
            </p>
          </div>
        </div>
      </section>

      {/* ── Recognition moments ──────────────────────────── */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#A8A29E] font-medium text-sm uppercase tracking-[0.2em]">You might recognise this</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {RECOGNITION_MOMENTS.map(({ quote, persona, initial, bg }, i) => (
              <div key={i} className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#E7E5E4]">
                <div className="w-10 h-10 rounded-full bg-stone-200 mb-4 overflow-hidden flex-shrink-0">
                  <img
                    src={bg}
                    alt={initial}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[#1C1917] text-base leading-relaxed font-light mb-3">&ldquo;{quote}&rdquo;</p>
                <p className="text-[#A8A29E] text-xs font-medium tracking-wide">{persona}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[#A8A29E] text-sm mt-8 max-w-xl mx-auto font-light leading-relaxed">
            Career uncertainty is not a personal failure. It&apos;s what happens when there&apos;s no space to stop and genuinely reflect.
          </p>
        </div>
      </section>

      {/* ── Visual break — people at work ─────────────────── */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-stone-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-[#1C1917]/70" />
        <div className="relative h-full flex items-center justify-center px-6">
          <p className="text-white/80 text-xl sm:text-2xl font-light tracking-tight text-center max-w-2xl">
            Most careers run on instinct. Midcourse is the first time many people stop to look at the whole picture.
          </p>
        </div>
      </div>

      {/* ── What Midcourse is ──────────────────────────────── */}
      <section className="py-14 px-6 bg-[#1C1917]">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[#D97706] font-medium text-sm uppercase tracking-[0.2em] mb-5">A different kind of experience</p>
              <h2 className="text-3xl sm:text-4xl font-light text-white mb-6 leading-tight">
                Most tools treat your career<br />as a problem to solve.
              </h2>
              <p className="text-white/55 leading-relaxed mb-5 font-light text-lg">
                We think of it as a story to understand.
              </p>
              <p className="text-white/40 leading-relaxed mb-7 font-light">
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

            <div className="space-y-2.5">
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
      <section id="the-reflection" className="py-16 px-6 bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <LogoMark className="opacity-25" size={2} />
            </div>
            <p className="text-[#A8A29E] font-medium text-sm uppercase tracking-[0.2em] mb-4">The guided conversation</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1C1917] mb-4 tracking-tight">
              Questions built around<br />your actual story
            </h2>
            <p className="text-[#78716C] max-w-xl mx-auto text-base font-light leading-relaxed">
              We read your CV carefully before we say a word. What you&apos;ll find below is what the conversation actually looks like.
            </p>
          </div>

          <div className="space-y-8">
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
                  <p className="text-xs text-[#A8A29E] italic leading-relaxed border-l-2 border-[#D97706]/50 pl-3 mb-2 font-light">
                    {item.anchor}
                  </p>
                  <div className="bg-[#1C1917] text-white rounded-2xl rounded-tl-none px-7 py-5 shadow-lg mb-2">
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
          <div className="mt-14 grid sm:grid-cols-3 gap-8">
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
                <p className="text-[#A8A29E] text-xs font-semibold uppercase tracking-[0.2em] mb-3">{step}</p>
                <h3 className="font-semibold text-[#1C1917] text-xl mb-2 tracking-tight">{heading}</h3>
                <p className="text-[#78716C] text-sm leading-relaxed font-light">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visual break — work life balance ──────────────── */}
      <div className="grid grid-cols-3 h-40 sm:h-52 overflow-hidden">
        {[
          'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=640&q=70',
          'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=640&q=70',
          'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=640&q=70',
        ].map((url, i) => (
          <div key={i} className="relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center scale-105 hover:scale-100 transition-transform duration-700"
              style={{ backgroundImage: `url('${url}')` }}
            />
            <div className="absolute inset-0 bg-[#1C1917]/30" />
          </div>
        ))}
      </div>

      {/* ── What you walk away with ─────────────────────────── */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#A8A29E] font-medium text-sm uppercase tracking-[0.2em] mb-3">Your report</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1C1917] tracking-tight">
              Here&apos;s what you&apos;ll receive
            </h2>
            <p className="text-[#78716C] mt-3 max-w-lg mx-auto font-light text-base">
              A personalised reflection document built entirely from your story. Free, no account required.
            </p>
          </div>

          {/* Sample report preview */}
          <div className="grid lg:grid-cols-5 gap-8 mb-12 items-start">

            {/* Left: Mock report card */}
            <div className="lg:col-span-3 bg-white border border-[#E7E5E4] rounded-2xl overflow-hidden shadow-sm">
              {/* Report header */}
              <div className="bg-[#1C1917] px-6 py-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-400 text-xs font-semibold">AM</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Arjun M. · Senior Data Engineer</p>
                    <p className="text-white/35 text-xs font-light">Midcourse Career Reflection · Sample</p>
                  </div>
                </div>
                <p className="text-white/65 text-sm font-light italic leading-relaxed border-l-2 border-amber-500/40 pl-3">
                  &ldquo;A builder who finds clarity in complexity — most alive when a system I&apos;ve designed starts solving a problem I care about.&rdquo;
                </p>
              </div>

              {/* Signal Moments */}
              <div className="px-6 py-4 border-b border-[#F0EDEA]">
                <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest mb-3">Signal Moments</p>
                <div className="bg-[#FAF8F5] rounded-xl px-4 py-3 border border-[#E7E5E4]">
                  <p className="text-xs text-[#78716C] italic mb-1.5 font-light">&ldquo;I spent three weeks prototyping before I even told my manager&rdquo;</p>
                  <p className="text-xs text-[#57534E] font-light leading-relaxed">This is how you do your best work — deep, quiet, self-directed. A leadership role that demands constant visibility will slowly erode you.</p>
                </div>
              </div>

              {/* Energy Map */}
              <div className="px-6 py-4 border-b border-[#F0EDEA]">
                <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest mb-3">Career Energy Map</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-[#A8A29E] font-medium uppercase tracking-wider mb-2">Energises</p>
                    {['Building real-time systems', 'Seeing direct user impact', 'Mentoring junior engineers'].map((e, i) => (
                      <div key={i} className="flex items-start gap-1.5 mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 flex-shrink-0" />
                        <p className="text-xs text-[#57534E] font-light">{e}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] text-[#A8A29E] font-medium uppercase tracking-wider mb-2">Drains</p>
                    {['Unclear project ownership', 'Work with no visible impact', 'Meetings without outcomes'].map((d, i) => (
                      <div key={i} className="flex items-start gap-1.5 mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-300 mt-1 flex-shrink-0" />
                        <p className="text-xs text-[#57534E] font-light">{d}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Plan */}
              <div className="px-6 py-4">
                <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest mb-3">90-Day Action Plan</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Days 1–15: Foundation', 'Days 16–30: Network + Prep', 'Days 31–45: Active Search', 'Days 46–90: Offers'].map((p, i) => (
                    <span key={i} className="text-[10px] bg-[#FAF8F5] text-[#78716C] px-2.5 py-1 rounded-full border border-[#E7E5E4]">{p}</span>
                  ))}
                </div>
                <p className="text-xs text-[#A8A29E] font-light mt-2">12 specific, dated actions — built around your timeline.</p>
              </div>
            </div>

            {/* Right: What's included checklist */}
            <div className="lg:col-span-2 space-y-3 pt-2">
              <p className="text-xs font-semibold text-[#A8A29E] uppercase tracking-[0.15em] mb-4">Your report includes</p>
              {FREE_FEATURES.map((feat, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#1C1917] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                  </div>
                  <p className="text-sm text-[#44403C] leading-relaxed font-light">{feat}</p>
                </div>
              ))}
              <div className="pt-4">
                <Link
                  href="/tool"
                  className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  Get your report <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Paid tier teaser */}
          <div className="bg-[#1C1917] rounded-2xl p-7 flex flex-col sm:flex-row gap-8 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 bg-[#D97706]/20 text-[#D97706] text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-[#D97706]/20 tracking-wide">
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

      {/* ── Who It's For ───────────────────────────────────── */}
      <section className="py-14 px-6 bg-[#FAF8F5]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#A8A29E] font-medium text-sm uppercase tracking-[0.2em] mb-3">Built for</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1C1917] tracking-tight">
              Professionals at an inflection point
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { role: 'Consultants', hook: 'Stepping off the project treadmill — and wondering what you actually want to build next.' },
              { role: 'Product Managers', hook: 'Between roles, or sensing your next move should feel different. Not just a bigger title.' },
              { role: 'Founders & Operators', hook: 'Post-exit or at an inflection point. Unclear what chapter comes after this one.' },
              { role: 'Data & AI Professionals', hook: 'Strong technically. Less certain where your career story is pointing — and why.' },
              { role: 'Mid-career Leaders', hook: 'Successful on paper. Something still feels misaligned. You want to name what it is.' },
              { role: 'Career Pivoters', hook: 'You know what you\'re moving away from. Less sure what you\'re moving toward.' },
            ].map(({ role, hook }, i) => (
              <div key={i} className="bg-white border border-[#E7E5E4] rounded-xl p-5">
                <p className="font-semibold text-[#1C1917] text-sm mb-2">{role}</p>
                <p className="text-[#78716C] text-sm font-light leading-relaxed">{hook}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Credibility ─────────────────────────────────────── */}
      <section className="py-14 px-6 bg-[#1C1917]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-white/30 font-medium text-sm uppercase tracking-[0.2em] mb-6">Why Midcourse</p>
          <h2 className="text-3xl sm:text-4xl font-light text-white leading-snug mb-5 tracking-tight">
            The questions a great coach asks<br className="hidden sm:block" /> after six sessions.
          </h2>
          <p className="text-white/45 text-lg font-light leading-relaxed max-w-xl mx-auto mb-8">
            Executive coaching costs ₹25,000 or more per hour. Most professionals never get access to it.
            Midcourse distils the same reflective process into 15 minutes — free, for every professional.
          </p>
          <div className="flex items-center justify-center gap-8 pt-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-2xl font-semibold text-white mb-1">12</p>
              <p className="text-white/35 text-xs font-light uppercase tracking-wider">Personalised questions</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-semibold text-white mb-1">15 min</p>
              <p className="text-white/35 text-xs font-light uppercase tracking-wider">Average reflection time</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-semibold text-white mb-1">Free</p>
              <p className="text-white/35 text-xs font-light uppercase tracking-wider">No account needed</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────── */}
      <section className="py-16 px-6 bg-[#FAF8F5] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #1C1917 1px, transparent 0)',
          backgroundSize: '36px 36px'
        }} />
        <div className="max-w-3xl mx-auto text-center relative">
          {/* Overlapping faces */}
          <div className="flex items-center justify-center mb-6">
            {PEOPLE_STRIP.slice(0, 4).map((person, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full border-[3px] border-[#FAF8F5] overflow-hidden bg-stone-200 flex-shrink-0"
                style={{ marginLeft: i === 0 ? 0 : '-10px', zIndex: 10 - i }}
              >
                <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="flex justify-center mb-5">
            <LogoMark className="opacity-25" />
          </div>
          <p className="text-[#A8A29E] font-medium text-sm uppercase tracking-[0.2em] mb-5">Begin</p>
          <h2 className="text-4xl sm:text-5xl font-light text-[#1C1917] mb-6 leading-[1.2] tracking-tight">
            Ten minutes.<br />A lifetime of context.
          </h2>
          <p className="text-[#78716C] text-lg mb-10 max-w-xl mx-auto font-light leading-relaxed">
            Take the reflection most people keep putting off.
          </p>
          <Link
            href="/tool"
            className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-white text-base font-semibold px-10 py-5 rounded-2xl transition-all active:scale-95"
          >
            Begin your reflection
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-[#A8A29E] text-sm mt-4 font-light">No account. No credit card. Free.</p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-[#1C1917] px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo light={true} />
          <p className="text-white/20 text-sm font-light">© {new Date().getFullYear()} Midcourse. A space for reflection.</p>
        </div>
      </footer>

    </div>
  )
}
