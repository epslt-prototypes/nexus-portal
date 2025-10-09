import { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { ThemeContext } from '../../theme/ThemeProvider'
import Card from '../../components/Card'
import InsurerLogoButton from '../../components/InsurerLogoButton'
import ClientBottomNav from '../../components/ClientBottomNav'
import ClientTopNav from '../../components/ClientTopNav'
import Tabs from '../../components/Tabs'
import PageHeader from '../../components/PageHeader'
import ClaimCard from '../../components/ClaimCard'
import ProgressBar from '../../components/ProgressBar'
import ClaimDetailsModal from '../../components/ClaimDetailsModal'
// Runtime fetch from public/mock per project policy (no src/mock imports)

export default function ClientPortal() {
  const [clientData, setClientData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const { theme, setTheme } = useContext(ThemeContext)
  const location = useLocation()
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const cycleTheme = () => {
    const order = ['BTA', 'LD', 'ERGO', 'COMPENSA']
    const idx = order.indexOf(theme)
    const next = order[(idx + 1) % order.length]
    setTheme(next)
  }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/mock/client_data.json')
        const data = await res.json()
        setClientData(data)
      } catch (e) {
        console.error('Failed to load client mock:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your information...</p>
        </div>
      </div>
    )
  }

  if (!clientData) {
    return (
      <div className="min-h-screen bg-surface-muted flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Unable to load your information. Please try again later.</p>
        </div>
      </div>
    )
  }

  const { client, insuranceBalance, reimbursements, pendingClaims, coverageDetails } = clientData

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('lt-LT', {
      style: 'currency',
      currency: insuranceBalance.currency
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
      default:
        return status
    }
  }

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
          <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pb-24 md:pb-12 space-y-3 md:space-y-6">
            <PageHeader
              title={`Welcome back, ${client.name}`}
              subtitle="Your insurance overview"
              rightContent={(
                <>
                  <p className="text-xs text-gray-500">Policy</p>
                  <p className="text-sm font-medium text-gray-900">{client.policyNumber}</p>
                </>
              )}
            />

            {/* Insurance Balance Card */}
            <Card className="p-6 md:p-8">
              <div className="text-center">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Insurance Balance</h2>
                <div className="mb-4">
                  <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-1">
                    {formatCurrency(insuranceBalance.remainingAmount)}
                  </div>
                  <p className="text-sm text-gray-600">remaining of {formatCurrency(insuranceBalance.totalLimit)}</p>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <ProgressBar 
                    total={insuranceBalance.totalLimit}
                    confirmed={insuranceBalance.confirmedAmount}
                    pending={insuranceBalance.pendingAmount}
                    height="h-3"
                  />
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="text-[var(--brand-primary)]">Confirmed: {formatCurrency(insuranceBalance.confirmedAmount)}</span>
                  <span>Renewal: {formatDate(insuranceBalance.renewalDate)}</span>
                </div>
                {insuranceBalance.pendingAmount > 0 && (
                  <div className="mt-2 text-sm" style={{ color: 'rgba(var(--brand-primary-rgb), 0.5)' }}>
                    Pending: {formatCurrency(insuranceBalance.pendingAmount)}
                  </div>
                )}
              </div>
            </Card>

            {/* Navigation Tabs */}
            <Tabs
              value={activeTab}
              onChange={setActiveTab}
              tabs={[
                { label: 'Overview', value: 'overview', minWidth: '140px' },
                { label: 'Payouts', value: 'reimbursements', minWidth: '140px' },
                { label: 'Coverage', value: 'coverage', minWidth: '140px' },
              ]}
            />

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                {/* Recent Payouts */}
                <Card className="p-6 md:p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payouts</h3>
                  <div className="space-y-3">
                    {reimbursements.slice(0, 3).map((reimbursement) => (
                      <div key={reimbursement.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{reimbursement.description}</p>
                          <p className="text-sm text-gray-600">{formatDate(reimbursement.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-emerald-600">{formatCurrency(reimbursement.amount)}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reimbursement.status)}`}>
                            {getStatusText(reimbursement.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setActiveTab('reimbursements')}
                    className="w-full mt-4 py-2 text-brand-primary font-medium hover:bg-brand-light rounded-lg transition-colors"
                  >
                    View All Payouts
                  </button>
                </Card>

                {/* Pending Claims */}
                {pendingClaims.length > 0 && (
                  <Card className="p-6 md:p-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Claims</h3>
                    <div className="space-y-4">
                      {pendingClaims.map((claim) => (
                        <div 
                          key={claim.id} 
                          className="py-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
                          onClick={() => { setSelectedClaim(claim); setIsModalOpen(true) }}
                        >
                          {/* Top grid: title and amount */}
                          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1">
                            <h4 className="font-medium text-gray-900 truncate">{claim.description}</h4>
                            <div className="text-right ml-4 min-w-0">
                              <p className="font-semibold text-gray-900">{formatCurrency(claim.amount)}</p>
                            </div>

                            {claim.category && (
                              <p className="text-sm text-gray-600 truncate">{claim.category}</p>
                            )}
                            <div className="text-right min-w-0">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                                {getStatusText(claim.status)}
                              </span>
                            </div>
                          </div>

                          {/* Bottom grid: details */}
                          <div className="mt-2 grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-4 gap-y-1 text-xs text-gray-500">
                            {/* Date */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1 flex-wrap">
                                <span className="whitespace-normal break-words">Date:</span>
                                <span className="whitespace-normal break-words">{formatDate(claim.date)}</span>
                              </div>
                            </div>

                            {/* Spacer */}
                            <div className="min-w-0"></div>

                            {/* Submitted date or receipt */}
                            <div className="text-right min-w-0">
                              {claim.submittedDate ? (
                                <div className="flex items-center gap-1 flex-wrap justify-end">
                                  <span className="whitespace-normal break-words">Submitted:</span>
                                  <span className="whitespace-normal break-words">{formatDate(claim.submittedDate)}</span>
                                </div>
                              ) : claim.receiptNumber ? (
                                <div className="flex items-center gap-1 flex-wrap justify-end">
                                  <span className="whitespace-normal break-words">Receipt:</span>
                                  <span className="whitespace-normal break-words">{claim.receiptNumber}</span>
                                </div>
                              ) : null}
                            </div>

                            {/* Receipt number on separate line if submitted date exists */}
                            {claim.submittedDate && claim.receiptNumber && (
                              <div className="col-span-3">
                                <span>Receipt: {claim.receiptNumber}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'reimbursements' && (
              <Card className="p-6 md:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">All Payouts</h3>
                <div className="space-y-3">
                  {reimbursements.map((reimbursement) => (
                    <div key={reimbursement.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{reimbursement.description}</p>
                        <p className="text-sm text-gray-600">{reimbursement.category}</p>
                        <p className="text-sm text-gray-500">{formatDate(reimbursement.date)} • {reimbursement.receiptNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-600">{formatCurrency(reimbursement.amount)}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reimbursement.status)}`}>
                          {getStatusText(reimbursement.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'coverage' && (
              <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                {Object.entries(coverageDetails).map(([category, details]) => (
                  <Card key={category} className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <span className="text-sm text-gray-600">
                        {formatCurrency(details.remaining)} remaining
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <ProgressBar 
                        total={details.limit}
                        confirmed={details.confirmed}
                        pending={details.pending}
                        height="h-2"
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="text-[var(--brand-primary)]">Confirmed: {formatCurrency(details.confirmed)}</span>
                      <span>Limit: {formatCurrency(details.limit)}</span>
                    </div>
                    {details.pending > 0 && (
                      <div className="mt-1 text-sm" style={{ color: 'rgba(var(--brand-primary-rgb), 0.5)' }}>
                        Pending: {formatCurrency(details.pending)}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Nav hidden on desktop */}
          <div className="md:hidden">
            <ClientBottomNav />
          </div>

          {/* Claim details modal */}
          <ClaimDetailsModal
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); setSelectedClaim(null) }}
            claim={selectedClaim}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />
        </div>
  )
}
