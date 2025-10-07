import React from 'react'

export default function PageHeader({ title, subtitle, rightContent = null }) {
  return (
    <>
      {/* Mobile */}
      <div className="text-center md:hidden">
        <h1 className="text-base font-semibold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-600">{subtitle}</p>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {rightContent && (
          <div className="text-right">
            {rightContent}
          </div>
        )}
      </div>
    </>
  )
}


