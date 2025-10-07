import { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { Eye, EyeOff } from 'lucide-react'

export default function Settings() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [open, setOpen] = useState(false)
  const [focusedField, setFocusedField] = useState(null) // 'old' | 'new' | 'repeat' | null
  const [visible, setVisible] = useState({ old: false, new: false, repeat: false })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!oldPassword || !newPassword || !repeatPassword) return
    if (newPassword !== repeatPassword) return
    alert('Slaptažodis pakeistas (demo)')
    setOpen(false)
    setOldPassword('')
    setNewPassword('')
    setRepeatPassword('')
  }

  return (
    <div>
      <section className="py-6">
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800">Nustatymai</h2>
            <div className="mt-6 border-t border-dashed" />

            <div className="mt-4">
              <Button onClick={() => setOpen(true)}>Keisti slaptažodį</Button>
              <div className="mt-2 text-sm text-gray-600">Slaptažodis galioja iki: 2025.11.25 09:48:40</div>
            </div>
          </Card>
        </div>
      </section>

      <Modal open={open} onClose={() => setOpen(false)} title="Keisti slaptažodį" size="sm">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Senas slaptažodis</span>
            <div className="relative">
              <input
                type={visible.old ? 'text' : 'password'}
                className="focus-ring block w-full rounded-lg border bg-white px-3 pr-10 h-10 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition border-gray-300 focus-visible:ring-[var(--brand-secondary)]"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                onFocus={() => setFocusedField('old')}
                onBlur={() => setFocusedField(null)}
                autoComplete="current-password"
                required
              />
              {(focusedField === 'old' || visible.old) && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={visible.old ? 'Slėpti slaptažodį' : 'Rodyti slaptažodį'}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setVisible((v) => ({ ...v, old: !v.old }))}
                >
                  {visible.old ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              )}
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Naujas slaptažodis</span>
            <div className="relative">
              <input
                type={visible.new ? 'text' : 'password'}
                className="focus-ring block w-full rounded-lg border bg-white px-3 pr-10 h-10 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition border-gray-300 focus-visible:ring-[var(--brand-secondary)]"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setFocusedField('new')}
                onBlur={() => setFocusedField(null)}
                autoComplete="new-password"
                required
              />
              {(focusedField === 'new' || visible.new) && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={visible.new ? 'Slėpti slaptažodį' : 'Rodyti slaptažodį'}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setVisible((v) => ({ ...v, new: !v.new }))}
                >
                  {visible.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              )}
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Pakartokite naują slaptažodį</span>
            <div className="relative">
              <input
                type={visible.repeat ? 'text' : 'password'}
                className="focus-ring block w-full rounded-lg border bg-white px-3 pr-10 h-10 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition border-gray-300 focus-visible:ring-[var(--brand-secondary)]"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                onFocus={() => setFocusedField('repeat')}
                onBlur={() => setFocusedField(null)}
                autoComplete="new-password"
                required
              />
              {(focusedField === 'repeat' || visible.repeat) && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={visible.repeat ? 'Slėpti slaptažodį' : 'Rodyti slaptažodį'}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setVisible((v) => ({ ...v, repeat: !v.repeat }))}
                >
                  {visible.repeat ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              )}
            </div>
          </label>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Atšaukti</Button>
            <Button type="submit">Pakeisti slaptažodį</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}



