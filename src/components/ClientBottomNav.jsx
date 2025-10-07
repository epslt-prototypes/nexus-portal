import { clientNavItems } from './ClientNavItems'
import { useLocation, useNavigate } from 'react-router-dom'

export default function ClientBottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const items = clientNavItems

  const isActive = (to) => {
    if (to === '/client') return location.pathname === '/client'
    return location.pathname.startsWith(to)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around">
        {items.map(({ key, label, to, icon: Icon }) => {
          const active = isActive(to)
          return (
            <button
              key={key}
              onClick={() => navigate(to)}
              className={`${active ? 'text-brand-primary' : 'text-gray-400'} flex flex-col items-center py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded-lg`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
