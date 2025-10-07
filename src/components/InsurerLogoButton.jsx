import { useEffect, useState } from 'react'
import BtaLogo from './BtaLogo'

export default function InsurerLogoButton({ theme, onClick }) {
  const [ldLogoUrl, setLdLogoUrl] = useState(null)
  const [ergoLogoUrl, setErgoLogoUrl] = useState(null)
  const [compensaLogoUrl, setCompensaLogoUrl] = useState(null)

  useEffect(() => {
    let cancelled = false
    if (theme === 'LD') {
      import('../img/ld.png')
        .then((mod) => { if (!cancelled) setLdLogoUrl(mod.default || mod) })
        .catch(() => { if (!cancelled) setLdLogoUrl(null) })
    } else {
      setLdLogoUrl(null)
    }
    if (theme === 'ERGO') {
      import('../img/ergo.svg')
        .then((mod) => { if (!cancelled) setErgoLogoUrl(mod.default || mod) })
        .catch(() => { if (!cancelled) setErgoLogoUrl(null) })
    } else {
      setErgoLogoUrl(null)
    }
    if (theme === 'COMPENSA') {
      import('../img/compensa.png')
        .then((mod) => { if (!cancelled) setCompensaLogoUrl(mod.default || mod) })
        .catch(() => { if (!cancelled) setCompensaLogoUrl(null) })
    } else {
      setCompensaLogoUrl(null)
    }
    return () => { cancelled = true }
  }, [theme])

  return (
    <button
      type="button"
      onClick={onClick}
      title="Toggle theme"
      aria-label="Toggle theme"
      className="inline-flex items-center justify-center gap-2 text-center text-sm font-semibold text-gray-800 focus-ring rounded-md hover:opacity-90"
    >
      {theme === 'LD' && (
        ldLogoUrl ? (
          <img src={ldLogoUrl} alt="LD Logo" className="h-10 w-auto cursor-pointer" />
        ) : (
          <div className="h-10 flex items-center px-3 rounded bg-[var(--brand-light)] text-[color:var(--brand-primary)] cursor-pointer">LD</div>
        )
      )}
      {theme === 'BTA' && (
        <BtaLogo className="h-10 w-auto cursor-pointer" />
      )}
      {theme === 'ERGO' && (
        ergoLogoUrl ? (
          <img src={ergoLogoUrl} alt="ERGO Logo" className="h-8 w-auto cursor-pointer" />
        ) : (
          <div className="h-10 flex items-center px-3 rounded bg-[var(--brand-light)] text-[color:var(--brand-primary)] cursor-pointer">ERGO</div>
        )
      )}
      {theme === 'COMPENSA' && (
        compensaLogoUrl ? (
          <img src={compensaLogoUrl} alt="Compensa Life Logo" className="h-8 w-auto cursor-pointer" />
        ) : (
          <div className="h-10 flex items-center px-3 rounded bg-[var(--brand-light)] text-[color:var(--brand-primary)] cursor-pointer">Compensa Life</div>
        )
      )}
    </button>
  )
}


