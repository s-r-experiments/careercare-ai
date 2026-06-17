export function LogoMark({ light = false, className = '', size = 1 }: { light?: boolean; className?: string; size?: number }) {
  const color = light ? '#ffffff' : '#1C1917'
  return (
    <svg width={34 * size} height={14 * size} viewBox="0 0 34 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <line x1="0" y1="7" x2="11" y2="7" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="17" cy="7" r="4.5" stroke={color} strokeWidth="1.5"/>
      <circle cx="17" cy="7" r="1.5" fill={color}/>
      <line x1="23" y1="7" x2="34" y2="7" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export default function Logo({ light = false }: { light?: boolean }) {
  const color = light ? '#ffffff' : '#1C1917'
  return (
    <div className="flex items-center gap-3">
      {/* Waypoint mark — a pause midway through a course */}
      <LogoMark light={light} />
      <span style={{ color }} className="font-extrabold text-xl tracking-tight">
        Midcourse
      </span>
    </div>
  )
}
