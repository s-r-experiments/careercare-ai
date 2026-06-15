'use client'
import { useState, useEffect } from 'react'

const SLIDES = [
  {
    // Forest path — journey, direction
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=80',
    pos: 'center',
  },
  {
    // Mountain valley — perspective, stillness
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80',
    pos: 'center',
  },
  {
    // Open road — possibility, navigation
    url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=1920&q=80',
    pos: 'center',
  },
  {
    // Mountain reflection — introspection
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
    pos: 'center 40%',
  },
  {
    // Misty lake — calm, reflection
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80',
    pos: 'center',
  },
]

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(i => (i + 1) % SLIDES.length), 6000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
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
      {/* Warm charcoal gradient — heavy left for text, opens right */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/95 via-[#1C1917]/75 to-[#1C1917]/35" />
      <div className="absolute inset-0 bg-[#1C1917]/20" />
    </div>
  )
}
