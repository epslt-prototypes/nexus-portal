import Topbar from '../../components/Topbar.jsx'
import Sidebar from '../../components/Sidebar.jsx'
import { Outlet } from 'react-router-dom'
import { Users, Upload, ShieldCheck, FileSpreadsheet } from 'lucide-react'

const deskGroups = [
  {
    title: 'Partner Management',
    items: [
      { label: 'Partners', to: '/desk/app/partners', icon: Users },
      { label: 'Partner Services', to: '/desk/app/partner-services', icon: Upload },
      { label: 'Assignments', to: '/desk/app/assignments', icon: ShieldCheck },
    ],
  },
  {
    title: 'Operations & Reporting',
    items: [
      { label: 'Operations', to: '/desk/app/operations', icon: FileSpreadsheet },
    ],
  },
]

export default function DeskLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="flex w-full max-w-none items-stretch pr-4">
        <Sidebar groups={deskGroups} />
        <main className="flex-1 p-0 h-[calc(100vh-3.5rem-1px)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}


