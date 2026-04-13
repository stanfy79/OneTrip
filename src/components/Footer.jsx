import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="w-full bg-[#050813] border-t border-[#6dbb7199] text-[#dce3eb] pb-20 md:pb-0">
      <div className="max-w-[1280px] mx-auto px-6 py-12 flex flex-col gap-10 md:flex-row md:justify-between">
        <div className="max-w-sm space-y-4">
          <div>
            <h2 className="text-3xl font-black audiowide text-[#6dbb71]">Fare AI</h2>
            <p className="text-[#8f98a8] text-sm mt-1">The Fastest Route for smarter transport decisions.</p>
          </div>
          <p className="text-[#9ea6b6] leading-7 text-[15px]">
            Compare fares, submit routes, and explore the best trips across Nigeria with a clean, modern interface built for commuters.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-sm uppercase tracking-[0.25em] text-[#6dbb71]">Quick links</h3>
            <div className="space-y-2 text-sm text-[#b3bac8]">
              <Link to="/" className="block hover:text-[#6dbb71]">Home</Link>
              <Link to="/routes" className="block hover:text-[#6dbb71]">Routes</Link>
              <Link to="/popular-routes" className="block hover:text-[#6dbb71]">Popular Routes</Link>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm uppercase tracking-[0.25em] text-[#6dbb71]">Community</h3>
            <div className="space-y-2 text-sm text-[#b3bac8]">
              <Link to="/submit" className="block hover:text-[#6dbb71]">Submit Route</Link>
              <Link to="/dashboard" className="block hover:text-[#6dbb71]">Dashboard</Link>
              <Link to="/auth" className="block hover:text-[#6dbb71]">Login / Signup</Link>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm uppercase tracking-[0.25em] text-[#6dbb71]">Support</h3>
            <div className="space-y-2 text-sm text-[#b3bac8]">
              <span className="block">help@fareai.ng</span>
              <span className="block">+234 800 123 4567</span>
              <span className="block">Open 24/7 for commuters</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 pb-8 text-[#8f98a8] text-sm flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <p>© {new Date().getFullYear()} Fare AI. All rights reserved.</p>
        <div className="flex flex-wrap gap-4 text-[#b3bac8]">
          <Link to="/" className="hover:text-[#6dbb71]">Privacy</Link>
          <Link to="/" className="hover:text-[#6dbb71]">Terms</Link>
          <Link to="/" className="hover:text-[#6dbb71]">Contact</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
