export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      {/* Arrow mark: amber square + dark upper-right arrow */}
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="30" rx="8" fill="#F59E0B" />
        <path
          d="M9 21 L21 9 M21 9 H15.5 M21 9 V14.5"
          stroke="#0A1F35"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={`font-extrabold text-xl tracking-tight ${light ? 'text-white' : 'text-[#0A1F35]'}`}>
        CareerCare
      </span>
    </div>
  )
}
