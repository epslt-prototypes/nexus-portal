import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, FolderOpen, Settings, ChevronLeft, ChevronRight, ListChecks, Receipt, FileSpreadsheet, ClipboardList, LogOut } from 'lucide-react'
import { useI18n } from '../theme/LanguageProvider'

function useNavGroups() {
  const { t } = useI18n()
  return [
    {
      title: t('services'),
      items: [
        { to: '/portal/services-entry', label: t('servicesNew'), icon: ClipboardList },
        { to: '/portal/services', label: t('servicesCatalog'), icon: FolderOpen },
        { to: '/portal/status', label: t('servicesStatus'), icon: ListChecks },
        { to: '/portal/receipts', label: t('servicesReceipts'), icon: Receipt },
      ]
    },
    {
      title: t('acts'),
      items: [
        { to: '/portal/acts', label: t('actsPayments'), icon: FileSpreadsheet },
      ]
    }
  ]
}

export default function Sidebar({ groups, offsetTopbar = true }) {
  const { t } = useI18n()
  const [collapsed, setCollapsed] = useState(false)
  const navGroups = groups && groups.length ? groups : useNavGroups()
  const clinicName = 'UAB "SVEIKATA"'
  const clinicAddress = 'Vilniaus g. 10, Vilnius'
  return (
    <aside className={`hidden md:block ${collapsed ? 'w-16' : 'w-64'} transition-all duration-200 shrink-0 border-r bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky ${offsetTopbar ? 'top-16 h-[calc(100vh-4rem)]' : 'top-0 h-screen'} overflow-y-auto`}>
      <div >
        <div className="px-3 py-4">
          <div className={`h-12 w-full flex items-center ${collapsed ? 'justify-center' : ''}`}>
            {collapsed ? (
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-500 text-white font-semibold">S</div>
            ) : (
              <div className="w-full flex items-center gap-3 rounded-xl border bg-white px-3 py-2 shadow-sm">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-500 text-white font-semibold">S</div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{clinicName}</div>
                  <div className="text-xs text-gray-500 truncate">{clinicAddress}</div>
                </div>
              </div>
            )}
          </div>
        </div>
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
                        aria-label={collapsed ? t('navigationExpand') : t('navigationCollapse')}
                        className="focus-ring ml-auto inline-flex items-center justify-center rounded-md border bg-white p-1.5 text-gray-600 hover:bg-gray-50"
                        onClick={() => setCollapsed((v) => !v)}
                      >
                        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                )}
                {collapsed && isFirst && (
                  <div className="px-4 pb-1">
                    <button
                      aria-label={collapsed ? t('navigationExpand') : t('navigationCollapse')}
                      className="focus-ring ml-auto inline-flex items-center justify-center rounded-md border bg-white p-1.5 text-gray-600 hover:bg-gray-50"
                      onClick={() => setCollapsed((v) => !v)}
                      title={collapsed ? t('navigationExpand') : t('navigationCollapse')}
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


