import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Midcourse – AI Career Reflection & Coaching Tool'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1C1917',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        {/* Waypoint mark */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '36px' }}>
          <div style={{ width: '44px', height: '3px', background: 'white', borderRadius: '2px', display: 'flex' }} />
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'white', display: 'flex' }} />
          </div>
          <div style={{ width: '44px', height: '3px', background: 'white', borderRadius: '2px', display: 'flex' }} />
        </div>

        {/* Brand name */}
        <div style={{ color: 'white', fontSize: '88px', fontWeight: '600', letterSpacing: '-3px', marginBottom: '28px', display: 'flex' }}>
          Midcourse
        </div>

        {/* Tagline */}
        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '30px', fontWeight: '300', display: 'flex' }}>
          AI Career Reflection &amp; Coaching Tool
        </div>

        {/* Badge */}
        <div style={{ marginTop: '28px', color: 'rgba(255,255,255,0.3)', fontSize: '20px', fontWeight: '300', display: 'flex' }}>
          Free · No account required
        </div>
      </div>
    ),
    { ...size },
  )
}
