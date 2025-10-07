import { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { ThemeContext } from '../theme/ThemeProvider'
import Card from '../components/Card'
import InsurerLogoButton from '../components/InsurerLogoButton'
import ClientBottomNav from '../components/ClientBottomNav'
import ClientTopNav from '../components/ClientTopNav'
import Tabs from '../components/Tabs'
import PageHeader from '../components/PageHeader'
import ClaimCard from '../components/ClaimCard'
import clientDataJson from '../mock/client_data.json'

export default function ClientPortal() {
  const [clientData, setClientData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const { theme, setTheme } = useContext(ThemeContext)
  const location = useLocation()

  const cycleTheme = () => {
    const order = ['BTA', 'LD', 'ERGO', 'COMPENSA']
    const idx = order.indexOf(theme)
    const next = order[(idx + 1) % order.length]
    setTheme(next)
  }

  useEffect(() => {
    // Use bundled mock data like Home.jsx
    setClientData(clientDataJson)
    setLoading(false)
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
          <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pb-4 md:pb-4 pb-24 md:pb-12 space-y-3 md:space-y-6">
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
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-brand-primary h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(insuranceBalance.usedAmount / insuranceBalance.totalLimit) * 100}%` 
                    }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Used: {formatCurrency(insuranceBalance.usedAmount)}</span>
                  <span>Renewal: {formatDate(insuranceBalance.renewalDate)}</span>
                </div>
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
                    <div className="space-y-3">
                      {pendingClaims.map((claim) => (
                        <div key={claim.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{claim.description}</p>
                            <p className="text-sm text-gray-600">{formatDate(claim.date)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-amber-600">{formatCurrency(claim.amount)}</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                              {getStatusText(claim.status)}
                            </span>
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
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-brand-primary h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(details.used / details.limit) * 100}%` 
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Used: {formatCurrency(details.used)}</span>
                      <span>Limit: {formatCurrency(details.limit)}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Nav hidden on desktop */}
          <div className="md:hidden">
            <ClientBottomNav />
          </div>
        </div>
  )
}
