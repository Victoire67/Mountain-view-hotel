import MenuExploreCard from "../components/MenuExploreCard"
import food from "../../public/foods/Breakfast/PetitDéjeuner.jpg"
import drink from "../../public/drinkss/corona.jpg"
import hero from "../assets/bgMountainview.jpeg"
import pool from "../assets/swimmingPool.jpeg"
import { m, type Variants } from "framer-motion"
import { Link } from "react-router-dom"
import { useEffect } from "react"
import { Utensils, Wine, Waves, Clock } from "lucide-react"
import { prefetchItems } from "../lib/menu"
import SectionTitle from "../components/SectionTitle"

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
}
const rise: Variants = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
}

const highlights = [
    { icon: Utensils, title: "Restaurant", text: "Local & international cuisine" },
    { icon: Wine, title: "Bar", text: "Cocktails, wines & spirits" },
    { icon: Waves, title: "Pool bar", text: "Unwind by the water" },
    { icon: Clock, title: "24/7", text: "Always open for you" },
]

export default function LandingPage() {
    // Warm the menu cache while the visitor reads the hero, so /food and /drinks open instantly
    useEffect(() => {
        const w = window as Window & { requestIdleCallback?: (cb: () => void) => number }
        if (w.requestIdleCallback) w.requestIdleCallback(prefetchItems)
        else setTimeout(prefetchItems, 1500)
    }, [])

    return <div>
        {/* ---------- Hero ---------- */}
        <section className="relative h-svh min-h-[560px] w-full overflow-hidden">
            <img
                src={hero}
                alt=""
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover animate-kenburns"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-ink" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />

            <m.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
            >
                <m.p variants={rise} className="text-xs sm:text-sm uppercase tracking-[0.5em] text-gold">
                    Kigali · Rwanda
                </m.p>
                <m.h1 variants={rise} className="mt-5 font-display text-5xl sm:text-7xl lg:text-8xl font-semibold leading-[0.95]">
                    Mountain View
                    <span className="block text-gold-gradient italic font-medium">Hotel & Apartments</span>
                </m.h1>
                <m.p variants={rise} className="mt-6 max-w-2xl text-base sm:text-lg text-white/80 leading-relaxed">
                    Delicious local and international cuisine, refreshing cocktails and a relaxing
                    atmosphere at our Restaurant, Bar & Pool Bar — the perfect setting for every occasion.
                </m.p>
                <m.div variants={rise} className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                    <a
                        href="#explore"
                        className="group relative overflow-hidden rounded-full bg-gold px-9 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-ink shadow-[0_10px_40px_-10px_rgba(255,184,43,0.7)] transition-transform duration-300 hover:-translate-y-0.5"
                    >
                        <span className="relative z-10">View menu</span>
                        <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    </a>
                    <Link
                        to="/guest-services"
                        className="rounded-full border border-white/40 px-9 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all duration-300 hover:border-gold hover:text-gold hover:-translate-y-0.5"
                    >
                        Guest services
                    </Link>
                </m.div>
            </m.div>

            <a href="#explore" aria-label="Scroll down" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex h-11 w-7 justify-center rounded-full border border-white/40 pt-2">
                <span className="h-2 w-1 rounded-full bg-gold animate-scroll-cue" />
            </a>
        </section>

        {/* ---------- Highlights ---------- */}
        <section className="relative z-10 -mt-12 px-4">
            <div className="mx-auto grid max-w-5xl grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md">
                {highlights.map(({ icon: Icon, title, text }, i) => (
                    <m.div
                        key={title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                        className="group bg-ink-2/90 p-6 text-center transition-colors hover:bg-ink-3"
                    >
                        <Icon className="mx-auto h-6 w-6 text-gold transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-6" strokeWidth={1.5} />
                        <div className="mt-3 font-display text-xl">{title}</div>
                        <div className="mt-1 text-xs text-white/60">{text}</div>
                    </m.div>
                ))}
            </div>
        </section>

        {/* ---------- Explore the menu ---------- */}
        <section id="explore" className="scroll-mt-16 mx-auto max-w-6xl px-4 py-24">
            <SectionTitle eyebrow="Taste" title="Explore our Menu" />
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
                <MenuExploreCard to="/food" img={food} type="Food" description="Explore the best food in Rwanda" onHover={prefetchItems} />
                <MenuExploreCard to="/drinks" img={drink} type="Drinks" description="Explore the best drinks" index={1} onHover={prefetchItems} />
            </div>
        </section>

        {/* ---------- Stay with us ---------- */}
        <section className="relative overflow-hidden">
            <img src={pool} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/85 to-ink/30" />
            <m.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="relative mx-auto max-w-6xl px-6 py-28"
            >
                <p className="text-xs uppercase tracking-[0.4em] text-gold">Stay with us</p>
                <h2 className="mt-4 max-w-xl font-display text-4xl sm:text-6xl font-semibold leading-tight">
                    Pool, gym & comfortable apartments
                </h2>
                <p className="mt-5 max-w-md text-white/75 leading-relaxed">
                    Swim, train, rest. Everything you need for a short visit or a long stay in Kigali.
                </p>
                <Link
                    to="/guest-services"
                    className="mt-8 inline-flex items-center gap-3 rounded-full border border-gold/60 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold transition-all duration-300 hover:bg-gold hover:text-ink"
                >
                    Discover <span aria-hidden>&rarr;</span>
                </Link>
            </m.div>
        </section>
    </div>
}

