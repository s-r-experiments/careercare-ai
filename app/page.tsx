import Link from 'next/link'
import { Upload, MessageSquare, Cpu, Download, Check, X } from 'lucide-react'

export default function Home() {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Your CV',
      desc: 'Drop your PDF or Word document. We extract your career story in seconds.',
    },
    {
      icon: MessageSquare,
      title: 'Answer 7 Questions',
      desc: 'Personalised questions based on your actual experience — no generic surveys.',
    },
    {
      icon: Cpu,
      title: 'AI Analysis',
      desc: 'Our AI synthesises your history, strengths, gaps, and goals into deep insights.',
    },
    {
      icon: Download,
      title: 'Download Workbook',
      desc: 'Get a beautiful Excel workbook with your 90-day action plan, ready to execute.',
    },
  ]

  const freeFeatures = [
    { label: 'CV parsing (PDF & DOCX)', free: true },
    { label: '7 personalised questions', free: true },
    { label: 'Positioning statement', free: true },
    { label: 'Top 5 strengths with stories', free: true },
    { label: 'Key gaps & actions', free: true },
    { label: '90-day action plan Excel', free: true },
    { label: 'LinkedIn headline generator', free: false },
    { label: 'Mock interview Q&A bank', free: false },
    { label: 'Salary negotiation script', free: false },
    { label: 'Weekly AI coaching check-ins', free: false },
    { label: 'ATS-optimised CV rewrite', free: false },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-[#1F4E79] font-bold text-xl tracking-tight">CareerCare AI</span>
          <Link
            href="/tool"
            className="bg-[#1F4E79] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#163a5e] transition-colors"
          >
            Try Free →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#EBF4FF] via-white to-[#F0F7FF] py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#1F4E79]/10 text-[#1F4E79] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#1F4E79] rounded-full animate-pulse" />
            Powered by Llama 3.3 70B
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Know exactly where your career stands —{' '}
            <span className="text-[#1F4E79]">and where it&apos;s going</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Upload your CV and get a personalised 90-day career workbook in minutes. No sign-up required.
          </p>
          <Link
            href="/tool"
            className="inline-flex items-center gap-2 bg-[#1F4E79] text-white text-lg font-semibold px-8 py-4 rounded-xl hover:bg-[#163a5e] transition-colors shadow-lg shadow-[#1F4E79]/20"
          >
            Get My Career Workbook →
          </Link>
          <p className="text-sm text-gray-400 mt-4">Free forever · No credit card · Takes ~5 minutes</p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">How it works</h2>
          <p className="text-center text-gray-500 mb-14">Four steps from CV to career clarity</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-[#1F4E79]/10 rounded-2xl flex items-center justify-center mb-4">
                    <step.icon className="w-7 h-7 text-[#1F4E79]" />
                  </div>
                  <div className="absolute -top-2 -left-2 w-7 h-7 bg-[#1F4E79] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-full w-full h-px bg-[#1F4E79]/20 -translate-x-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Free vs Premium</h2>
          <p className="text-center text-gray-500 mb-12">Start free, upgrade when you&apos;re ready to go deeper</p>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-3 bg-[#1F4E79] text-white text-sm font-semibold px-6 py-4">
              <span>Feature</span>
              <span className="text-center">Free</span>
              <span className="text-center">Premium</span>
            </div>
            {freeFeatures.map((f, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 px-6 py-4 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <span className="text-gray-700">{f.label}</span>
                <span className="text-center">
                  {f.free ? (
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-gray-300 mx-auto" />
                  )}
                </span>
                <span className="text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/tool"
              className="inline-flex items-center gap-2 bg-[#1F4E79] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#163a5e] transition-colors"
            >
              Start For Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F4E79] text-white/70 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-white font-bold text-lg">CareerCare AI</span>
          <p className="text-sm">© {new Date().getFullYear()} CareerCare AI. Built to help you grow.</p>
        </div>
      </footer>
    </div>
  )
}
