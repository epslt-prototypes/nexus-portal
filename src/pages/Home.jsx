import React from 'react'
import { Link } from 'react-router-dom'
import epsLtWhite from '../img/EPS_LT_white.svg'
import nexusBg from '../img/nexusbg.avif'

export default function Home() {
  return (
    <div className="min-h-screen text-gray-100 flex items-center justify-center px-4" style={{ backgroundImage: `url(${nexusBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="w-full max-w-3xl flex flex-col items-center text-center">
        <img src={epsLtWhite} alt="EPS LT" className="mb-3 opacity-90 h-24 md:h-28 lg:h-32" />
        <div className="inline-block pl-12 text-gray-200 text-3xl md:text-4xl font-semibold tracking-[1.5em]">NEXUS</div>
        <h1 className="text-3xl font-bold mt-20">Choose a prototype</h1>
        <p className="mt-2 text-gray-400">Select which interface to explore.</p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 w-full">
          <div className="rounded-xl border border-gray-400/40 bg-gray-600/20 p-6 shadow-lg">
            <h2 className="text-xl font-semibold">Portal</h2>
            <p className="mt-2 text-gray-400">Services entry and back-office prototype.</p>
            <div className="mt-5">
              <Link
                to="/portal/services-entry"
                className="inline-flex items-center justify-center rounded-lg bg-white/10 px-4 py-2 font-medium text-gray-100 hover:bg-white/20 transition"
              >
                Go to Portal
              </Link>
                </div>
          </div>

          <div className="rounded-xl border border-gray-400/40 bg-gray-600/20 p-6 shadow-lg">
            <h2 className="text-xl font-semibold">Client</h2>
            <p className="mt-2 text-gray-400">Client-facing policy and claims overview.</p>
            <div className="mt-5">
              <Link
                to="/client"
                className="inline-flex items-center justify-center rounded-lg bg-white/10 px-4 py-2 font-medium text-gray-100 hover:bg-white/20 transition"
              >
                Go to Client
              </Link>
                  </div>
                </div>
                </div>
          </div>
    </div>
  )
}



