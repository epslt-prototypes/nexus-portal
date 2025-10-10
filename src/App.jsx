import { Routes, Route, useLocation } from 'react-router-dom'
import Topbar from './components/Topbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Portal/Dashboard.jsx'
import DeskLogin from './pages/Desk/Login.jsx'
import DeskLayout from './pages/Desk/Layout.jsx'
import Partners from './pages/Desk/Partners.jsx'
import PartnerServices from './pages/Desk/PartnerServices.jsx'
import Assignments from './pages/Desk/Assignments.jsx'
import Operations from './pages/Desk/Operations.jsx'
import Settings from './pages/Portal/Settings.jsx'
import ServicesList from './pages/Portal/ServicesList.jsx'
import Status from './pages/Portal/Status.jsx'
import Acts from './pages/Portal/Acts.jsx'
import Receipts from './pages/Portal/Receipts.jsx'
import Troubleshoot from './pages/Portal/Troubleshoot.jsx'
import ClientPortal from './pages/Direct/ClientPortal.jsx'
import ClientClaims from './pages/Direct/ClientClaims.jsx'
import ClientHelp from './pages/Direct/ClientHelp.jsx'
import ServicesEntry from './pages/Portal/ServicesEntry.jsx'
import PortalLayout from './pages/Portal/PortalLayout.jsx'
import { PageTitleProvider } from './theme/PageTitleProvider.jsx'
import { Navigate } from 'react-router-dom'

export default function App() {
  const location = useLocation()
  const isStandalone = location.pathname.startsWith('/troubleshoot')
  const isLanding = location.pathname === '/'
  const isClientPortal = location.pathname.startsWith('/client')
  const isDesk = location.pathname.startsWith('/desk')
  const isPortal = location.pathname.startsWith('/portal')

  if (isStandalone) {
    return (
      <div className="min-h-screen bg-surface-muted">
        <main className="mx-auto max-w-3xl px-4 py-6">
          <Routes>
            <Route path="/troubleshoot" element={<Troubleshoot />} />
            {/* keep other routes reachable if someone navigates away programmatically */}
            <Route path="/" element={<Home />} />
            <Route path="/desk" element={<DeskLogin />} />
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
            <Route path="/desk" element={<DeskLogin />} />
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

  if (isDesk) {
    return (
      <div className="min-h-screen bg-surface-muted">
        <Routes>
          <Route path="/desk" element={<DeskLogin />} />
          <Route path="/desk/app" element={<DeskLayout />}>
            <Route path="/desk/app" element={<Navigate to="/desk/app/partners" replace />} />
            <Route path="/desk/app/partners" element={<Partners />} />
            <Route path="/desk/app/partner-services" element={<PartnerServices />} />
            <Route path="/desk/app/assignments" element={<Assignments />} />
            <Route path="/desk/app/operations" element={<Operations />} />
          </Route>
        </Routes>
      </div>
    )
  }

  if (isPortal) {
    return (
      <PageTitleProvider>
        <div className="h-screen overflow-hidden bg-surface-muted">
          <div className="grid grid-rows-[4rem_1fr] grid-cols-[auto_1fr] h-full w-full max-w-none">
            <Sidebar offsetTopbar={false} />
            <div className="col-start-2 row-start-1">
              <Topbar />
            </div>
            <main className="col-start-2 row-start-2 h-full p-0 overflow-hidden">
              <Routes>
                <Route path="/portal" element={<Navigate to="/portal/services-entry" replace />} />
                <Route path="/portal" element={<PortalLayout />}>
                  <Route path="/portal/services-entry" element={<ServicesEntry />} />
                  <Route path="/portal/services" element={<ServicesList />} />
                  <Route path="/portal/status" element={<Status />} />
                  <Route path="/portal/acts" element={<Acts />} />
                  <Route path="/portal/receipts" element={<Receipts />} />
                </Route>
              </Routes>
            </main>
          </div>
        </div>
      </PageTitleProvider>
    )
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <Topbar />
      <div className="flex w-full max-w-none items-stretch pr-4">
        <Sidebar />
        <main className="flex-1 h-[calc(100vh-3.5rem-1px)] p-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/desk" element={<DeskLogin />} />
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



