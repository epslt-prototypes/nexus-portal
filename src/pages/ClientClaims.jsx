import { useState, useEffect, useContext, useMemo } from 'react'
import clientDataJson from '../mock/client_data.json'
import ClientTopNav from '../components/ClientTopNav'
import { useLocation } from 'react-router-dom'
import { ThemeContext } from '../theme/ThemeProvider'
import Card from '../components/Card'
import InsurerLogoButton from '../components/InsurerLogoButton'
import ClientBottomNav from '../components/ClientBottomNav'
import Tabs from '../components/Tabs'
import PageHeader from '../components/PageHeader'
import ClaimCard from '../components/ClaimCard'
import Modal from '../components/Modal'

export default function ClientClaims() {
  const [clientData, setClientData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const { theme, setTheme } = useContext(ThemeContext)
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNewClaimOpen, setIsNewClaimOpen] = useState(false)
  const [newClaim, setNewClaim] = useState({
    category: '',
    date: '',
    amount: '',
    description: '',
    receiptNumber: '',
  })
  const [attachments, setAttachments] = useState([])
  const [errors, setErrors] = useState({})

  const cycleTheme = () => {
    const order = ['BTA', 'LD', 'ERGO', 'COMPENSA']
    const idx = order.indexOf(theme)
    const next = order[(idx + 1) % order.length]
    setTheme(next)
  }

  useEffect(() => {
    // Load mock data bundled at build time
    setClientData(clientDataJson)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your claims...</p>
        </div>
      </div>
    )
  }

  if (!clientData) {
    return (
      <div className="min-h-screen bg-surface-muted flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Unable to load your claims. Please try again later.</p>
        </div>
      </div>
    )
  }

  const { client, reimbursements, pendingClaims } = clientData

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('lt-LT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('lt-LT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600 bg-emerald-50'
      case 'processing':
        return 'text-amber-600 bg-amber-50'
      case 'pending':
        return 'text-blue-600 bg-blue-50'
      case 'rejected':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'processing':
        return 'Processing'
      case 'pending':
        return 'Pending'
      case 'rejected':
        return 'Rejected'
      default:
        return status
    }
  }

  const allClaims = useMemo(() => [
    ...pendingClaims.map(claim => ({ ...claim, type: 'pending' })),
    ...reimbursements.map(reimb => ({ ...reimb, type: 'completed' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)), [pendingClaims, reimbursements])

  const pendingClaimsList = allClaims.filter(claim => claim.status === 'processing' || claim.status === 'pending')
  const completedClaimsList = allClaims.filter(claim => claim.status === 'completed')

  return (
    <div className="min-h-screen bg-surface-muted">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 md:hidden">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <InsurerLogoButton theme={theme} onClick={cycleTheme} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Policy</p>
              <p className="text-sm font-medium text-gray-900">{client.policyNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <ClientTopNav theme={theme} onLogoClick={cycleTheme} />

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pb-4 md:pb-8 pb-24 md:pb-12 space-y-3 md:space-y-6">
          <PageHeader
          title="Claims"
          subtitle="Manage your claims and view payouts"
          rightContent={(
            <button onClick={() => setIsNewClaimOpen(true)} className="hidden md:inline-flex md:px-6 py-3 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary-dark transition-colors">
              Submit New Claim
            </button>
          )}
        />

        {/* Navigation Tabs */}
        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          tabs={[
            { label: 'Pending', value: 'pending', count: pendingClaimsList.length, minWidth: '160px' },
            { label: 'Completed', value: 'completed', count: completedClaimsList.length, minWidth: '160px' },
          ]}
          className="md:space-x-2"
        />

        {/* Tab Content */}
        {activeTab === 'pending' && (
          <div className="space-y-3 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
            {pendingClaimsList.length === 0 ? (
              <Card className="p-6 md:p-8 text-center">
                <div className="text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-900 mb-1">No pending claims</p>
                  <p className="text-sm">All your claims have been processed</p>
                </div>
              </Card>
            ) : (
              pendingClaimsList.map((claim) => (
                <Card key={claim.id} onClick={() => { setSelectedClaim(claim); setIsModalOpen(true) }}>
                  <ClaimCard
                    title={claim.description}
                    subtitle={claim.category}
                    amount={formatCurrency(claim.amount)}
                    statusText={getStatusText(claim.status)}
                    statusClass={getStatusColor(claim.status)}
                    detailsLeftKey="Date"
                    detailsLeftValue={formatDate(claim.date)}
                    detailsRightKey={claim.submittedDate ? 'Submitted' : undefined}
                    detailsRightValue={claim.submittedDate ? formatDate(claim.submittedDate) : undefined}
                    receipt={claim.receiptNumber ? <span>Receipt: {claim.receiptNumber}</span> : null}
                  />
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="space-y-3 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
            {completedClaimsList.length === 0 ? (
              <Card className="p-6 md:p-8 text-center">
                <div className="text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-lg font-medium text-gray-900 mb-1">No completed claims</p>
                  <p className="text-sm">Your completed payouts will appear here</p>
                </div>
              </Card>
            ) : (
              completedClaimsList.map((claim) => (
                <Card key={claim.id} onClick={() => { setSelectedClaim(claim); setIsModalOpen(true) }}>
                  <ClaimCard
                    title={claim.description}
                    subtitle={claim.category}
                    amount={<span className="text-emerald-600">{formatCurrency(claim.amount)}</span>}
                    statusText={getStatusText(claim.status)}
                    statusClass={getStatusColor(claim.status)}
                    detailsLeftKey="Date"
                    detailsLeftValue={formatDate(claim.date)}
                    detailsRightKey={claim.receiptNumber ? 'Receipt' : undefined}
                    detailsRightValue={claim.receiptNumber ? claim.receiptNumber : undefined}
                  />
                </Card>
              ))
            )}
          </div>
        )}

        {/* Submit New Claim Button (mobile only) */}
        <Card className="p-4 md:p-6 md:hidden">
          <button onClick={() => setIsNewClaimOpen(true)} className="w-full py-3 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary-dark transition-colors">
            Submit New Claim
          </button>
        </Card>
      </div>

      {/* Bottom Nav hidden on desktop */}
      <div className="md:hidden">
        <ClientBottomNav />
      </div>

      {/* Claim details modal */}
      <Modal
        open={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedClaim(null) }}
        title={selectedClaim ? (selectedClaim.description || 'Claim details') : ''}
        size="lg"
      >
        {selectedClaim && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-500">Category</div>
                <div className="text-gray-900">{selectedClaim.category || '—'}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Amount</div>
                <div className="text-gray-900">{formatCurrency(selectedClaim.amount)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-500">Date</div>
                <div className="text-gray-900">{formatDate(selectedClaim.date)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Status</div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedClaim.status)}`}>
                  {getStatusText(selectedClaim.status)}
                </span>
              </div>
            </div>

            {selectedClaim.submittedDate && (
              <div>
                <div className="text-xs text-gray-500">Submitted</div>
                <div className="text-gray-900">{formatDate(selectedClaim.submittedDate)}</div>
              </div>
            )}

            {selectedClaim.receiptNumber && (
              <div>
                <div className="text-xs text-gray-500">Receipt</div>
                <div className="text-gray-900 break-words">{selectedClaim.receiptNumber}</div>
              </div>
            )}

            {selectedClaim.description && (
              <div>
                <div className="text-xs text-gray-500">Description</div>
                <div className="text-gray-900 whitespace-pre-wrap break-words">{selectedClaim.description}</div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* New Claim modal */}
      <Modal
        open={isNewClaimOpen}
        onClose={() => { setIsNewClaimOpen(false); setErrors({}); setAttachments([]) }}
        title="Submit New Claim"
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const nextErrors = {}
            if (!newClaim.category) nextErrors.category = 'Select a category'
            if (!newClaim.date) nextErrors.date = 'Select the incident date'
            if (!newClaim.amount || Number(newClaim.amount) <= 0) nextErrors.amount = 'Enter a valid amount'
            if (!newClaim.description || newClaim.description.trim().length < 10) nextErrors.description = 'Provide a brief description (min 10 chars)'
            if (!attachments || attachments.length === 0) nextErrors.attachments = 'Attach at least one document or photo'

            // File checks: type and size (up to 10MB each)
            const allowed = ['image/jpeg','image/png','image/webp','application/pdf']
            const tooLarge = (attachments || []).find(f => f.size > 10 * 1024 * 1024)
            const badType = (attachments || []).find(f => !allowed.includes(f.type))
            if (tooLarge) nextErrors.attachments = 'Each file must be under 10MB'
            if (badType) nextErrors.attachments = 'Allowed types: PDF, JPG, PNG, WEBP'

            setErrors(nextErrors)
            if (Object.keys(nextErrors).length > 0) return

            const tempId = 'clm_' + Math.random().toString(36).slice(2)
            const created = {
              id: tempId,
              description: newClaim.description,
              category: newClaim.category,
              amount: Number(newClaim.amount),
              status: 'pending',
              date: newClaim.date,
              submittedDate: new Date().toISOString(),
              receiptNumber: newClaim.receiptNumber || undefined,
              attachments: attachments.map(f => ({ name: f.name, type: f.type, size: f.size })),
            }

            // Update local state immutably
            setClientData(prev => {
              if (!prev) return prev
              return {
                ...prev,
                pendingClaims: [created, ...prev.pendingClaims]
              }
            })

            // Reset and close
            setNewClaim({ category: '', date: '', amount: '', description: '', receiptNumber: '' })
            setAttachments([])
            setErrors({})
            setIsNewClaimOpen(false)
          }}
          className="space-y-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
              <select
                value={newClaim.category}
                onChange={(e) => setNewClaim(v => ({ ...v, category: e.target.value }))}
                className={`w-full h-10 rounded-lg border px-3 text-sm ${errors.category ? 'border-red-300 ring-1 ring-red-200' : 'border-gray-300'}`}
              >
                <option value="">Select...</option>
                <option value="Medical">Medical</option>
                <option value="Travel">Travel</option>
                <option value="Property">Property</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <span className="mt-1 block text-xs text-red-600">{errors.category}</span>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Incident date</label>
              <input
                type="date"
                value={newClaim.date}
                onChange={(e) => setNewClaim(v => ({ ...v, date: e.target.value }))}
                className={`w-full h-10 rounded-lg border px-3 text-sm ${errors.date ? 'border-red-300 ring-1 ring-red-200' : 'border-gray-300'}`}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.date && <span className="mt-1 block text-xs text-red-600">{errors.date}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Amount (EUR)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newClaim.amount}
                onChange={(e) => setNewClaim(v => ({ ...v, amount: e.target.value }))}
                className={`w-full h-10 rounded-lg border px-3 text-sm ${errors.amount ? 'border-red-300 ring-1 ring-red-200' : 'border-gray-300'}`}
                placeholder="0.00"
              />
              {errors.amount && <span className="mt-1 block text-xs text-red-600">{errors.amount}</span>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Receipt number (optional)</label>
              <input
                type="text"
                value={newClaim.receiptNumber}
                onChange={(e) => setNewClaim(v => ({ ...v, receiptNumber: e.target.value }))}
                className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm"
                placeholder="e.g. INV-12345"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={4}
              value={newClaim.description}
              onChange={(e) => setNewClaim(v => ({ ...v, description: e.target.value }))}
              className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.description ? 'border-red-300 ring-1 ring-red-200' : 'border-gray-300'}`}
              placeholder="Briefly describe what happened and what you are claiming for"
            />
            {errors.description && <span className="mt-1 block text-xs text-red-600">{errors.description}</span>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Attachments</label>
            <input
              type="file"
              multiple
              accept=".pdf,image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                setAttachments(files)
              }}
              className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.attachments ? 'border-red-300 ring-1 ring-red-200' : 'border-gray-300'}`}
            />
            <p className="mt-1 text-xs text-gray-500">Accepted: PDF, JPG, PNG, WEBP. Max 10MB each.</p>
            {attachments && attachments.length > 0 && (
              <ul className="mt-2 text-xs text-gray-700 list-disc ml-5">
                {attachments.map((f, i) => (
                  <li key={i}>{f.name}</li>
                ))}
              </ul>
            )}
            {errors.attachments && <span className="mt-1 block text-xs text-red-600">{errors.attachments}</span>}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => { setIsNewClaimOpen(false); setErrors({}); }} className="px-4 h-10 rounded-lg border border-gray-300 text-sm">
              Cancel
            </button>
            <button type="submit" className="px-4 h-10 rounded-lg bg-brand-primary text-white text-sm hover:bg-brand-primary-dark">
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
