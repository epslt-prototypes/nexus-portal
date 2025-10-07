import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, FolderOpen, Settings, ChevronLeft, ChevronRight, ListChecks, Receipt, FileSpreadsheet, ClipboardList, LogOut } from 'lucide-react'

const navGroups = [
  {
    title: 'Paslaugos',
    items: [
      { to: '/services-entry', label: 'Įvesti naują', icon: ClipboardList },
      { to: '/services', label: 'Katalogas', icon: FolderOpen },
      { to: '/status', label: 'Būsena', icon: ListChecks },
      { to: '/receipts', label: 'Kvitai', icon: Receipt },
    ]
  },
  {
    title: 'Aktai',
    items: [
      { to: '/acts', label: 'Apmokėjimo aktai', icon: FileSpreadsheet },
    ]
  }
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <aside className={`hidden md:block ${collapsed ? 'w-16' : 'w-64'} transition-all duration-200 shrink-0 self-start border-x border-b rounded-b-xl overflow-hidden bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60`}>
      <div className="sticky top-14 px-2 py-2">
        <nav>
          {navGroups.map((group, index) => {
            const { title, items } = group
            const isFirst = index === 0
            return (
              <div key={title} className="mb-4">
                {!collapsed && (
                  <div className={`px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 ${isFirst ? 'flex items-center' : ''}`}>
                    <span className="truncate">{title}</span>
                    {isFirst && (
                      <button
                        aria-label={collapsed ? 'Išskleisti navigaciją' : 'Sutraukti navigaciją'}
                        className="focus-ring ml-auto inline-flex items-center justify-center rounded-md border bg-white p-1.5 text-gray-600 hover:bg-gray-50"
                        onClick={() => setCollapsed((v) => !v)}
                      >
                        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                )}
                {collapsed && isFirst && (
                  <div className="px-2 pb-1">
                    <button
                      aria-label={collapsed ? 'Išskleisti navigaciją' : 'Sutraukti navigaciją'}
                      className="focus-ring ml-auto inline-flex items-center justify-center rounded-md border bg-white p-1.5 text-gray-600 hover:bg-gray-50"
                      onClick={() => setCollapsed((v) => !v)}
                      title={collapsed ? 'Išskleisti navigaciją' : 'Sutraukti navigaciją'}
                    >
                      {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </button>
                  </div>
                )}
              <ul className="space-y-1">
                {items.map(({ to, onClick, label, icon: Icon }) => (
                  <li key={to || label}>
                    {to ? (
                      <NavLink
                        to={to}
                        className={({ isActive }) =>
                          `focus-ring group flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                            isActive
                              ? 'bg-gradient-to-r from-[var(--brand-light)] to-transparent text-[color:var(--brand-primary)]'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        title={collapsed ? label : undefined}
                      >
                        <Icon className={`h-5 w-5 opacity-90 ${collapsed ? 'mx-auto' : ''}`} />
                        {!collapsed && <span className="font-medium">{label}</span>}
                      </NavLink>
                    ) : (
                      <button
                        type="button"
                        onClick={onClick}
                        className="focus-ring group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-600 ring-inset hover:bg-gray-50 hover:text-gray-900"
                        title={collapsed ? label : undefined}
                      >
                        <Icon className={`h-5 w-5 opacity-90 ${collapsed ? 'mx-auto' : ''}`} />
                        {!collapsed && <span className="font-medium">{label}</span>}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              </div>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}


