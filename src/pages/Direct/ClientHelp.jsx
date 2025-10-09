import { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { ThemeContext } from '../theme/ThemeProvider'
import Card from '../components/Card'
import InsurerLogoButton from '../components/InsurerLogoButton'
import ClientBottomNav from '../components/ClientBottomNav'
import ClientTopNav from '../components/ClientTopNav'
import Tabs from '../components/Tabs'
import PageHeader from '../components/PageHeader'

export default function ClientHelp() {
  const [activeSection, setActiveSection] = useState('faq')
  const [clientData, setClientData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { theme, setTheme } = useContext(ThemeContext)

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

  const faqData = [
    {
      id: 1,
      question: "How do I submit a new claim?",
      answer: "To submit a new claim, go to the Claims page and tap 'Submit New Claim'. You'll need to upload your receipt and provide details about the medical service or treatment."
    },
    {
      id: 2,
      question: "How long does it take to process a claim?",
      answer: "Most claims are processed within 5-10 business days. You can track the status of your claims in the Claims section."
    },
    {
      id: 3,
      question: "What documents do I need for a claim?",
      answer: "You'll need the original receipt, prescription (if applicable), and any medical certificates. Make sure all documents are clear and legible."
    },
    {
      id: 4,
      question: "How do I check my insurance balance?",
      answer: "Your current insurance balance and remaining coverage are displayed on the main dashboard. You can also view detailed coverage by category in the Coverage tab."
    },
    {
      id: 5,
      question: "What if my claim is rejected?",
      answer: "If your claim is rejected, you'll receive a notification with the reason. You can resubmit with additional documentation or contact our support team for assistance."
    },
    {
      id: 6,
      question: "How do I update my personal information?",
      answer: "To update your personal information, contact our customer service team. You can find contact details in the Contact section."
    }
  ]

  const contactInfo = [
    {
      type: "Phone",
      value: "+370 5 212 3456",
      description: "Monday - Friday, 8:00 - 18:00",
      icon: "📞"
    },
    {
      type: "Email",
      value: "support@insurance.lt",
      description: "We respond within 24 hours",
      icon: "✉️"
    },
    {
      type: "Live Chat",
      value: "Available on website",
      description: "Monday - Friday, 9:00 - 17:00",
      icon: "💬"
    },
    {
      type: "Office",
      value: "Vilniaus g. 10, Vilnius",
      description: "Monday - Friday, 9:00 - 17:00",
      icon: "🏢"
    }
  ]

  const quickActions = [
    {
      title: "Submit Claim",
      description: "Upload receipt and submit new claim",
      icon: "📋",
      action: () => console.log("Navigate to submit claim")
    },
    {
      title: "Download Policy",
      description: "Get your insurance policy document",
      icon: "📄",
      action: () => console.log("Download policy")
    },
    {
      title: "Find Providers",
      description: "Locate network healthcare providers",
      icon: "🏥",
      action: () => console.log("Find providers")
    },
    {
      title: "Emergency Contact",
      description: "24/7 emergency assistance",
      icon: "🚨",
      action: () => console.log("Emergency contact")
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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

  const { client } = clientData

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

      <ClientTopNav theme={theme} onLogoClick={cycleTheme} />

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pb-24 md:pb-12 space-y-3 md:space-y-6">
        <PageHeader
          title="Help"
          subtitle="See your policy and contact support"
        />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="p-4 md:p-6">
              <button 
                onClick={action.action}
                className="w-full text-center focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded-lg"
              >
                <div className="text-2xl md:text-3xl mb-2">{action.icon}</div>
                <h3 className="font-medium text-gray-900 text-sm md:text-base mb-1">{action.title}</h3>
                <p className="text-xs md:text-sm text-gray-600">{action.description}</p>
              </button>
            </Card>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="mx-auto">
          <Tabs
            value={activeSection}
            onChange={setActiveSection}
            tabs={[
              { label: 'FAQ', value: 'faq' },
              { label: 'Contact', value: 'contact' },
            ]}
          />
        </div>

        {/* FAQ Section */}
        {activeSection === 'faq' && (
          <div className="space-y-3 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
            {faqData.map((faq) => (
              <Card key={faq.id} className="p-4 md:p-6">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <h3 className="font-medium text-gray-900 pr-4">{faq.question}</h3>
                    <svg 
                      className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              </Card>
            ))}
          </div>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <div className="space-y-3 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
            {contactInfo.map((contact, index) => (
              <Card key={index} className="p-4 md:p-6">
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">{contact.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{contact.type}</h3>
                    <p className="text-sm text-gray-900 mb-1">{contact.value}</p>
                    <p className="text-xs text-gray-600">{contact.description}</p>
                  </div>
                  {(contact.type === "Phone" || contact.type === "Email") && (
                    <button className="text-brand-primary text-sm font-medium hover:underline">
                      {contact.type === "Phone" ? "Call" : "Email"}
                    </button>
                  )}
                </div>
              </Card>
            ))}

            {/* Emergency Contact */}
            <Card className="p-4 md:p-6 border-l-4 border-red-500">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🚨</div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">Emergency Assistance</h3>
                  <p className="text-sm text-gray-900 mb-1">+370 5 212 9999</p>
                  <p className="text-xs text-gray-600">Available 24/7 for medical emergencies</p>
                </div>
                <button className="text-red-600 text-sm font-medium hover:underline">
                  Call Now
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* Additional Help */}
        <Card className="p-4 md:p-6">
          <div className="text-center">
            <h3 className="font-medium text-gray-900 mb-2">Still need help?</h3>
            <p className="text-sm text-gray-600 mb-3">Our support team is here to assist you</p>
            <button className="w-full md:w-auto md:px-6 py-2 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary-dark transition-colors">
              Contact Support
            </button>
          </div>
        </Card>
      </div>

      {/* Bottom Nav hidden on desktop */}
      <div className="md:hidden">
        <ClientBottomNav />
      </div>
    </div>
  )
}
