import { NavLink } from 'react-router-dom'
import InsurerLogoButton from './InsurerLogoButton'
import { clientNavItems } from './ClientNavItems'

export default function ClientTopNav({ theme, onLogoClick, rightContent }) {
  return (
    <div className="hidden md:block bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <InsurerLogoButton theme={theme} onClick={onLogoClick} />
          </div>
          <div className="hidden md:flex items-center gap-2">
            {clientNavItems.map(({ key, to, label, icon: Icon }) => (
              <NavLink
                key={key}
                to={to}
                end={to === '/client'}
                className={({ isActive }) => `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium border ${isActive ? 'text-[color:var(--brand-primary)] bg-[var(--brand-light)] border-transparent' : 'text-gray-600 hover:text-gray-900 border-gray-200 hover:bg-gray-50'}`}
              >
                <Icon className="h-4 w-4" /> {label}
              </NavLink>
            ))}
            {rightContent}
          </div>
        </div>
      </div>
    </div>
  )
}


