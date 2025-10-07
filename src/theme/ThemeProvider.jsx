import { createContext, useEffect, useMemo, useState } from 'react'

export const ThemeContext = createContext({ theme: 'BTA', setTheme: () => {} })

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('app.theme')
      return saved === 'LD' ? 'LD' : 'BTA'
    } catch {
      return 'BTA'
    }
  })

  useEffect(() => {
    try { localStorage.setItem('app.theme', theme) } catch {}
    const root = document.documentElement
    root.classList.remove('theme-bta', 'theme-ld', 'theme-ergo', 'theme-compensa')
    const map = { BTA: 'theme-bta', LD: 'theme-ld', ERGO: 'theme-ergo', COMPENSA: 'theme-compensa' }
    root.classList.add(map[theme] || 'theme-bta')
  }, [theme])

  const value = useMemo(() => ({ theme, setTheme }), [theme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}


