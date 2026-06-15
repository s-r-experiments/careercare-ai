'use client'
import { useState, useEffect } from 'react'

const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1920&q=80',
    pos: 'center 30%',
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1920&q=80',
    pos: 'center 20%',
  },
  {
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80',
    pos: 'center',
  },
  {
    url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1920&q=80',
    pos: 'center',
  },
  {
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1920&q=80',
    pos: 'center 25%',
  },
]

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(i => (i + 1) % SLIDES.length), 5500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover transition-opacity duration-[2000ms] ease-in-out"
          style={{
            backgroundImage: `url(${slide.url})`,
            backgroundPosition: slide.pos,
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}
      {/* Left-heavy dark gradient so text is always readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F35]/95 via-[#0A1F35]/75 to-[#0A1F35]/40" />
      {/* Slight overall darkening */}
      <div className="absolute inset-0 bg-[#0A1F35]/25" />
    </div>
  )
}
