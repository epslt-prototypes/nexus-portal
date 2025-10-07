import { Fragment } from 'react'
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@headlessui/react'
import { useContext } from 'react'
import { ThemeContext } from '../theme/ThemeProvider'
import { Umbrella, Bell, User, ChevronDown } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import NotificationDropdown from './NotificationDropdown'
import InsurerLogoButton from './InsurerLogoButton'

export default function Topbar() {
  const { theme, setTheme } = useContext(ThemeContext)
  const clinicName = 'UAB "SVEIKATA"'

  const cycleTheme = () => {
    const order = ['BTA', 'LD', 'ERGO', 'COMPENSA']
    const idx = order.indexOf(theme)
    const next = order[(idx + 1) % order.length]
    setTheme(next)
  }
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid h-14 items-center grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center gap-3 justify-self-start">
            <InsurerLogoButton theme={theme} onClick={cycleTheme} />
          </div>
          <div className="text-sm leading-tight justify-self-center text-center">
              <div className="font-semibold">{clinicName}</div>
              <div className="text-xs text-gray-500">Vilniaus g. 10, Vilnius</div>
            </div>
          <div className="flex items-center gap-2 justify-self-end">
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton aria-label="Pranešimai" className="focus-ring relative inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-gray-600 hover:bg-gray-50" title="Pranešimai">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white shadow ring-2 ring-white">2</span>
              </MenuButton>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems>
                  <NotificationDropdown />
                </MenuItems>
              </Transition>
            </Menu>
            <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="focus-ring inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-3 text-sm text-gray-700 hover:bg-gray-50">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">sveikata1</span>
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </MenuButton>
              <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg border bg-white p-1 shadow-lg focus:outline-none">
                  <MenuItem>
                    {({ active }) => (
                      <NavLink to="/settings" className={`block rounded-md px-3 py-2 text-sm ${active ? 'bg-gray-50' : ''}`}>
                        Nustatymai
                      </NavLink>
                    )}
                  </MenuItem>
                  <div className="my-1 h-px bg-gray-100" />
                  <MenuItem>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={() => { try { localStorage.clear(); sessionStorage.clear(); } catch {} window.location.href = '/' }}
                        className={`w-full text-left block rounded-md px-3 py-2 text-sm text-red-600 ${active ? 'bg-red-50' : ''}`}
                      >
                        Baigti darbą
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  )
}


