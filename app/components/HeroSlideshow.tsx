'use client'
import { useState, useEffect } from 'react'

const SLIDES = [
  {
    // Team in modern office — collaboration, people
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80',
    pos: 'center',
  },
  {
    // Two colleagues reviewing work on laptop
    url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1920&q=80',
    pos: 'center 40%',
  },
  {
    // Person working on laptop at a bright cafe / outdoor setup
    url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1920&q=80',
    pos: 'center 30%',
  },
  {
    // Open plan modern office, people working
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
    pos: 'center',
  },
  {
    // Person with laptop, relaxed outdoor/lifestyle — work-life balance
    url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1920&q=80',
    pos: 'center 50%',
  },
]

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(i => (i + 1) % SLIDES.length), 6000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover transition-opacity duration-[2500ms] ease-in-out"
          style={{
            backgroundImage: `url(${slide.url})`,
            backgroundPosition: slide.pos,
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}
      {/* Warm charcoal gradient — heavy left for text legibility, opens right */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/95 via-[#1C1917]/80 to-[#1C1917]/50" />
      <div className="absolute inset-0 bg-[#1C1917]/15" />
    </div>
  )
}
