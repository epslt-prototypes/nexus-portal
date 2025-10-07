import React from 'react'

export default function ClaimCard({
  title,
  subtitle,
  amount,
  statusText,
  statusClass,
  detailsLeft,
  detailsRight,
  detailsLeftKey,
  detailsLeftValue,
  detailsRightKey,
  detailsRightValue,
  receipt,
  className = '',
}) {
  return (
    <div className={["p-4 md:p-6", className].filter(Boolean).join(' ')}>
      {/* Top grid: rows 1-2 share the same two columns */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1">
        <h3 className="font-medium text-gray-900 truncate">{title}</h3>
        <div className="text-right ml-4 min-w-0">
          <p className="font-semibold text-gray-900">{amount}</p>
        </div>

        {subtitle && (
          <p className="text-sm text-gray-600 truncate">{subtitle}</p>
        )}
        <div className="text-right min-w-0">
          <span className={[
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
            statusClass,
          ].join(' ')}>
            {statusText}
          </span>
        </div>
      </div>

      {/* Bottom grid: independent widths for key/value pairs */}
      {(detailsLeft !== undefined || detailsRight !== undefined || detailsLeftKey || detailsLeftValue || detailsRightKey || detailsRightValue || receipt) && (
        <div className="mt-2 grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-4 gap-y-1 text-xs text-gray-500">
          {/* Left key+value (col 1) */}
          <div className="min-w-0">
            {detailsLeft !== undefined ? (
              detailsLeft
            ) : (
              <div className="flex items-center gap-1 flex-wrap">
                {detailsLeftKey && <span className="whitespace-normal break-words">{detailsLeftKey}:</span>}
                {detailsLeftValue && <span className="whitespace-normal break-words">{detailsLeftValue}</span>}
              </div>
            )}
          </div>

          {/* Spacer (col 2) */}
          <div className="min-w-0"></div>

          {/* Right key+value (col 3) */}
          <div className="text-right min-w-0">
            {detailsRight !== undefined ? (
              detailsRight
            ) : (
              <div className="flex items-center gap-1 flex-wrap justify-end">
                {detailsRightKey && <span className="whitespace-normal break-words">{detailsRightKey}:</span>}
                {detailsRightValue && <span className="whitespace-normal break-words">{detailsRightValue}</span>}
              </div>
            )}
          </div>

          {receipt && (
            <div className="col-span-3">{receipt}</div>
          )}
        </div>
      )}
    </div>
  )
}


