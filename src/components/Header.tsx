import Logo from "../assets/logo"
import { NavLink, Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { AnimatePresence, m } from "framer-motion"
import { prefetchItems } from "../lib/menu"

const links = [
  { to: "/food", label: "Food", prefetch: true },
  { to: "/drinks", label: "Drinks", prefetch: true },
  { to: "/guest-services", label: "Guest services" },
  { to: "/contact", label: "Contact" },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    // Only re-render when crossing the threshold, not on every scroll event
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const solid = scrolled || open

  return <header
    className={`fixed top-0 inset-x-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${solid ? "bg-ink/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,184,43,0.15)]" : "bg-linear-to-b from-black/60 to-transparent"
      }`}
  >
    <div className={`mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 transition-[height] duration-500 ${scrolled ? "h-16" : "h-20"}`}>
      <Link to="/" className="flex items-center gap-1 group" aria-label="Mountain View Hotel — home">
        <div className={`[&>svg]:h-full [&>svg]:w-auto transition-[height,transform] duration-500 group-hover:-rotate-3 ${scrolled ? "h-10" : "h-12"}`}>
          <Logo />
        </div>
        <div className="hidden sm:block leading-none">
          <div className="font-display font-bold text-2xl tracking-wide text-white group-hover:text-gold-soft transition-colors">MOUNTAIN VIEW</div>
          <div className="text-[10px] uppercase tracking-[0.35em] text-gold mt-1">Hotel & Apartments</div>
        </div>
      </Link>

      <nav className="hidden md:block" aria-label="Main">
        <ul className="flex items-center gap-8 text-sm font-medium tracking-wide">
          {links.slice(0, 3).map(l => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                onMouseEnter={l.prefetch ? prefetchItems : undefined}
                className={({ isActive }) => `relative py-2 transition-colors hover:text-gold after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:bg-gold after:origin-left after:transition-transform after:duration-300 ${isActive ? "text-gold after:scale-x-100" : "text-white/85 after:scale-x-0 hover:after:scale-x-100"}`}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <Link
        to="/contact"
        className="hidden md:inline-flex items-center rounded-full border border-gold/60 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold transition-all duration-300 hover:bg-gold hover:text-ink hover:shadow-[0_0_24px_rgba(255,184,43,0.45)]"
      >
        Contact
      </Link>

      {/* Mobile menu toggle */}
      <button
        className="md:hidden relative h-10 w-10 grid place-items-center"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <span className={`absolute h-0.5 w-6 bg-white transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-2"}`} />
        <span className={`absolute h-0.5 w-6 bg-white transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
        <span className={`absolute h-0.5 w-6 bg-white transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-2"}`} />
      </button>
    </div>

    <AnimatePresence>
      {open && (
        <m.nav
          key="mobile-nav"
          aria-label="Mobile"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="md:hidden overflow-hidden border-t border-white/10"
        >
          <ul className="px-6 py-4 space-y-1">
            {links.map((l, i) => (
              <m.li
                key={l.to}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i + 0.1 }}
              >
                <NavLink
                  to={l.to}
                  onTouchStart={l.prefetch ? prefetchItems : undefined}
                  className={({ isActive }) => `block py-3 font-display text-2xl border-b border-white/5 ${isActive ? "text-gold" : "text-white"}`}
                >
                  {l.label}
                </NavLink>
              </m.li>
            ))}
          </ul>
        </m.nav>
      )}
    </AnimatePresence>
  </header>
}
