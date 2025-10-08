export default function ProgressBar({ 
  total, 
  confirmed = 0, 
  pending = 0, 
  height = 'h-3',
  className = '' 
}) {
  
  // Calculate percentages
  const confirmedPercent = (confirmed / total) * 100
  const pendingPercent = (pending / total) * 100
  const remainingPercent = 100 - confirmedPercent - pendingPercent
  
  // Use CSS custom property for brand color
  const getBrandColor = () => {
    return 'bg-[var(--brand-primary)]'
  }
  
  return (
    <div className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden ${className}`}>
      <div className="flex w-full h-full">
        {/* Confirmed amount - brand color */}
        {confirmedPercent > 0 && (
          <div 
            className={`${getBrandColor()} transition-all duration-300`}
            style={{ width: `${confirmedPercent}%` }}
          ></div>
        )}
        
        {/* Pending amount - glass effect with brand color */}
        {pendingPercent > 0 && (
          <div 
            className="border border-[var(--brand-primary)] transition-all duration-300"
            style={{ 
              width: `${pendingPercent}%`,
              backgroundColor: 'rgba(var(--brand-primary-rgb), 0.1)'
            }}
          ></div>
        )}
        
        {/* Remaining amount - gray */}
        {remainingPercent > 0 && (
          <div 
            className="bg-gray-200 transition-all duration-300"
            style={{ width: `${remainingPercent}%` }}
          ></div>
        )}
      </div>
    </div>
  )
}
