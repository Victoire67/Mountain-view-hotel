import { Link } from "react-router-dom"
import Logo from "../assets/logo"
import { Lock, LayoutDashboard } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export default function Footer() {
  const { user } = useAuth()

  return (
    <footer className="relative bg-ink-2 text-sm text-white/70" id="footer">
      <div className="h-px w-full bg-linear-to-r from-transparent via-gold/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1fr_1.4fr]">
        <div>
          <div className="[&>svg]:h-12 [&>svg]:w-auto"><Logo /></div>
          <div className="font-display text-2xl text-white mt-3">Mountain View</div>
          <p className="mt-2 leading-relaxed">Hotel, apartments, restaurant, bar & pool bar in the heart of Kigali.</p>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Explore</h3>
          <ul className="space-y-2">
            <li><Link className="hover:text-gold transition-colors" to="/food">Food menu</Link></li>
            <li><Link className="hover:text-gold transition-colors" to="/drinks">Drinks menu</Link></li>
            <li><Link className="hover:text-gold transition-colors" to="/guest-services">Guest services</Link></li>
            <li><Link className="hover:text-gold transition-colors" to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Visit</h3>
          <address className="not-italic leading-relaxed">KG 14 792 Ave St 5<br />Kigali, Rwanda</address>
          <div className="mt-3 inline-flex items-center gap-2 text-white">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Open 24/7
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Contact</h3>
          <ul className="space-y-2 break-words">
            <li><a className="hover:text-gold transition-colors" href="tel:+250788912646">+250 788 912 646</a></li>
            <li><a className="hover:text-gold transition-colors" href="mailto:mountainviewapartmentsrw@gmail.com">mountainviewapartmentsrw@gmail.com</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-4 px-6 py-6 text-xs text-white/40 sm:flex-row">
          <span>© {new Date().getFullYear()} Mountain View Hotel — All rights reserved.</span>
          {/* /dashboard is protected: visitors who aren't signed in are sent to /login first */}
          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-semibold uppercase tracking-[0.2em] text-white/60 transition-all duration-300 hover:border-gold/50 hover:text-gold"
          >
            {user
              ? <LayoutDashboard className="h-3.5 w-3.5" />
              : <Lock className="h-3.5 w-3.5 transition-transform group-hover:-rotate-12" />}
            {user ? "Dashboard" : "Staff login"}
          </Link>
        </div>
      </div>
    </footer>
  )
}
