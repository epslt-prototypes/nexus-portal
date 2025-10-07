import React from 'react'

export default function Tabs({
  value,
  onChange,
  tabs,
  className = '',
  size = 'md',
  fullWidth = true,
}) {
  const containerClasses = `flex bg-gray-100 p-1 rounded-lg w-full md:w-fit mx-auto`

  const sizeClasses = size === 'md'
    ? 'py-2 px-3 text-sm'
    : size === 'sm'
    ? 'py-1.5 px-2.5 text-xs'
    : 'py-2.5 px-4 text-base'

  return (
    <div className={[containerClasses, className].filter(Boolean).join(' ')}>
      {tabs.map((tab) => {
        const isActive = value === tab.value
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={[
              'transition-colors font-medium rounded-md',
              sizeClasses,
              fullWidth ? 'flex-1 md:flex-none' : '',
              'md:w-[140px]',
              isActive
                ? 'bg-white text-brand-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900',
            ].filter(Boolean).join(' ')}
          >
            <span className="inline-flex items-center gap-1">
              {tab.label}
              {typeof tab.count === 'number' && (
                <span className={[
                  'inline-flex items-center justify-center rounded-full text-[11px] leading-none',
                  isActive ? 'text-brand-primary' : 'text-gray-500',
                ].join(' ')}>
                  ({tab.count})
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}


