import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full bg-transparent px-4 py-4 fixed top-0 left-0 z-40">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-yellow-500 flex items-center justify-center text-black font-bold">MV</div>
          <div className="text-sm font-semibold">Mountain View</div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/menu" className="hover:text-yellow-400">Menu</Link>
          <Link to="/restaurant" className="hover:text-yellow-400">Restaurant</Link>
          <Link to="/bar" className="hover:text-yellow-400">Bar</Link>
          <Link to="/contact" className="hover:text-yellow-400">Contact</Link>
        </nav>

        <button
          className="md:hidden p-2 rounded border border-neutral-800"
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mt-3 bg-black/70 backdrop-blur-sm border border-neutral-800 rounded max-w-4xl mx-auto p-4">
          <nav className="flex flex-col gap-3">
            <Link to="/menu" onClick={() => setOpen(false)}>Menu</Link>
            <Link to="/restaurant" onClick={() => setOpen(false)}>Restaurant</Link>
            <Link to="/bar" onClick={() => setOpen(false)}>Bar</Link>
            <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
          </nav>
        </div>
      )}
    </header>
  )
}
