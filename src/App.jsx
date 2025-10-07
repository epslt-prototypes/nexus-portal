import { Routes, Route, useLocation } from 'react-router-dom'
import Topbar from './components/Topbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Settings from './pages/Settings.jsx'
import ServicesList from './pages/ServicesList.jsx'
import Status from './pages/Status.jsx'
import Acts from './pages/Acts.jsx'
import Receipts from './pages/Receipts.jsx'
import Troubleshoot from './pages/Troubleshoot.jsx'
import ClientPortal from './pages/ClientPortal.jsx'
import ClientClaims from './pages/ClientClaims.jsx'
import ClientHelp from './pages/ClientHelp.jsx'
import ServicesEntry from './pages/ServicesEntry.jsx'
import { Navigate } from 'react-router-dom'

export default function App() {
  const location = useLocation()
  const isStandalone = location.pathname.startsWith('/troubleshoot')
  const isLanding = location.pathname === '/'
  const isClientPortal = location.pathname.startsWith('/client')
  const isPortal = location.pathname.startsWith('/portal')

  if (isStandalone) {
    return (
      <div className="min-h-screen bg-surface-muted">
        <main className="mx-auto max-w-3xl px-4 py-6">
          <Routes>
            <Route path="/troubleshoot" element={<Troubleshoot />} />
            {/* keep other routes reachable if someone navigates away programmatically */}
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    )
  }

  if (isLanding) {
    return (
      <div className="min-h-screen bg-gray-900">
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    )
  }

  if (isClientPortal) {
    return (
      <div className="min-h-screen bg-surface-muted">
        <Routes>
          <Route path="/client" element={<ClientPortal />} />
          <Route path="/client/claims" element={<ClientClaims />} />
          <Route path="/client/help" element={<ClientHelp />} />
          <Route path="/client/*" element={<ClientPortal />} />
        </Routes>
      </div>
    )
  }

  if (isPortal) {
    return (
      <div className="min-h-screen bg-surface-muted">
        <Topbar />
        <div className="mx-auto flex max-w-6xl gap-6 px-4">
          <Sidebar />
          <main className="flex-1 py-6">
            <Routes>
              <Route path="/portal" element={<Navigate to="/portal/services-entry" replace />} />
              <Route path="/portal/services-entry" element={<ServicesEntry />} />
              <Route path="/portal/services" element={<ServicesList />} />
              <Route path="/portal/status" element={<Status />} />
              <Route path="/portal/acts" element={<Acts />} />
              <Route path="/portal/receipts" element={<Receipts />} />
            </Routes>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <Topbar />
      <div className="mx-auto flex max-w-6xl gap-6 px-4">
        <Sidebar />
        <main className="flex-1 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/services-entry" element={<Navigate to="/portal/services-entry" replace />} />
            <Route path="/services" element={<Navigate to="/portal/services" replace />} />
            <Route path="/status" element={<Navigate to="/portal/status" replace />} />
            <Route path="/acts" element={<Navigate to="/portal/acts" replace />} />
            <Route path="/receipts" element={<Navigate to="/portal/receipts" replace />} />
            <Route path="/troubleshoot" element={<Troubleshoot />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}



