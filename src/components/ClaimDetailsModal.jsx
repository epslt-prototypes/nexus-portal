import React from 'react'
import Modal from './Modal'

export default function ClaimDetailsModal({
  isOpen,
  onClose,
  claim,
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusText
}) {
  if (!claim) return null

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Claim Details"
      size="lg"
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-gray-500">Category</div>
            <div className="text-gray-900">{claim.category || '—'}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Amount</div>
            <div className="text-gray-900">{formatCurrency(claim.amount)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-gray-500">Date</div>
            <div className="text-gray-900">{formatDate(claim.date)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Status</div>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
              {getStatusText(claim.status)}
            </span>
          </div>
        </div>

        {(claim.submittedDate || claim.receiptNumber) && (
          <div className="grid grid-cols-2 gap-3">
            {claim.submittedDate && (
              <div>
                <div className="text-xs text-gray-500">Submitted</div>
                <div className="text-gray-900">{formatDate(claim.submittedDate)}</div>
              </div>
            )}
            {claim.receiptNumber && (
              <div className={claim.submittedDate ? "text-right" : ""}>
                <div className="text-xs text-gray-500">Receipt</div>
                <div className={`text-gray-900 break-words ${claim.submittedDate ? "text-right" : ""}`}>{claim.receiptNumber}</div>
              </div>
            )}
          </div>
        )}

        {claim.description && (
          <div>
            <div className="text-xs text-gray-500">Description</div>
            <div className="text-gray-900 whitespace-pre-wrap break-words">{claim.description}</div>
          </div>
        )}

        {claim.attachments && claim.attachments.length > 0 && (
          <div>
            <div className="text-xs text-gray-500 mb-2">Attachments</div>
            <div className="space-y-2">
              {claim.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                      {attachment.type === 'application/pdf' ? (
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{attachment.name}</div>
                      <div className="text-xs text-gray-500">
                        {attachment.type === 'application/pdf' ? 'PDF' : 'Image'} • {(attachment.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
