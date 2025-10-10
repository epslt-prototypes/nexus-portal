import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DeskLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    // Accept any credentials and navigate to Desk app
    try {
      sessionStorage.setItem('deskUser', JSON.stringify({ email }))
    } catch {}
    navigate('/desk/app')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Insurer Desk</h1>
          <p className="mt-1 text-sm text-gray-600">Administrator sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-gray-500"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-gray-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-black transition"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-500">
          <p>Prototype only. No real authentication implemented.</p>
        </div>
      </div>
    </div>
  )
}


