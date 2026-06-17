'use client'
import { useState, useEffect } from 'react'

const SLIDES = [
  {
    // Professional writing in a notebook — the act of reflection
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1920&q=80',
    pos: 'center 40%',
  },
  {
    // Woman at a window in quiet thought — a pause, a midcourse moment
    url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1920&q=80',
    pos: 'center 25%',
  },
  {
    // Man in a quiet, contemplative moment — where do I go next?
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1920&q=80',
    pos: 'center 20%',
  },
  {
    // Professional woman — clarity, direction, readiness
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1920&q=80',
    pos: 'center 30%',
  },
  {
    // Someone working through ideas — the reflection process in action
    url: 'https://images.unsplash.com/photo-1530099486328-e021101a494a?auto=format&fit=crop&w=1920&q=80',
    pos: 'center 35%',
  },
]

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(i => (i + 1) % SLIDES.length), 7000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover transition-opacity duration-[3000ms] ease-in-out"
          style={{
            backgroundImage: `url(${slide.url})`,
            backgroundPosition: slide.pos,
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}
      {/* Heavy on the left so text stays legible; opens up on the right so photos breathe */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/95 via-[#1C1917]/75 to-[#1C1917]/30" />
    </div>
  )
}
