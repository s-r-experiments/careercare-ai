import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.midcourse.co.in'),
  title: {
    default: 'Midcourse | AI Career Reflection & Coaching Tool – Free',
    template: '%s | Midcourse',
  },
  description: 'Not sure what your next career move is? Midcourse uses AI to analyse your CV and guide you through a deep reflection to uncover your strengths, blind spots, and clearest career direction. Free, no account needed.',
  keywords: [
    'AI career coach', 'career reflection tool', 'career planning tool', 'career change help',
    'career assessment online', 'career transition', 'job change help', 'career coaching free',
    'career strengths analysis', 'CV analysis AI', 'career direction', 'career pivot',
    'professional development tool', 'career coaching India', 'what career is right for me',
    'career guidance tool', 'job search help', 'AI career advisor', 'career self assessment',
    'career planning India',
  ],
  authors: [{ name: 'Midcourse', url: 'https://www.midcourse.co.in' }],
  creator: 'Midcourse',
  publisher: 'Midcourse',
  category: 'Career & Professional Development',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    alternateLocale: 'en_US',
    url: 'https://www.midcourse.co.in',
    siteName: 'Midcourse',
    title: 'Midcourse | AI Career Reflection & Coaching Tool – Free',
    description: 'Upload your CV and get a personalised AI career reflection. Discover your strengths, gaps, and the right next career move — in minutes. Free, no account required.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Midcourse – AI Career Reflection & Coaching Tool',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Midcourse | AI Career Reflection & Coaching Tool',
    description: 'Upload your CV. Answer guided questions. Get a deep AI career reflection — strengths, gaps, next steps. Free, no account required.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: 'https://www.midcourse.co.in',
  },
  verification: {
    google: '',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
