import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Start Your Career Reflection',
  description: 'Upload your CV and begin your AI-guided career reflection. Discover your strengths, blind spots, and next career move — free.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return children
}
