import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1C1917',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Waypoint mark: — ○ — */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '7px', height: '2px', background: 'white', borderRadius: '1px', display: 'flex' }} />
          <div style={{ width: '2px', display: 'flex' }} />
          <div style={{
            width: '10px', height: '10px', borderRadius: '50%',
            border: '1.5px solid white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'white', display: 'flex' }} />
          </div>
          <div style={{ width: '2px', display: 'flex' }} />
          <div style={{ width: '7px', height: '2px', background: 'white', borderRadius: '1px', display: 'flex' }} />
        </div>
      </div>
    ),
    { ...size },
  )
}
