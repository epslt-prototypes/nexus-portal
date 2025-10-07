export default function Card({ children, className = '', onClick }) {
  return (
    <div
      className={`rounded-xl bg-surface shadow-card ring-1 ring-black/5 transition-shadow hover:shadow-md ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e) } } : undefined}
    >
      {children}
    </div>
  )
}



