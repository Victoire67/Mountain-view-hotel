import { m } from "framer-motion"
import { Link } from "react-router-dom"

type MenuExplorerCardTp = {
    img: string,
    type: string,
    description: string,
    to: string,
    index?: number,
    onHover?: () => void,
}

export default function MenuExploreCard({ img, type, description, to, index = 0, onHover }: MenuExplorerCardTp) {
    return <m.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
        <Link
            to={to}
            onMouseEnter={onHover}
            onFocus={onHover}
            className="group relative block h-80 sm:h-96 overflow-hidden rounded-2xl ring-1 ring-white/10 bg-ink-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] transition-shadow duration-500 hover:ring-gold/40 hover:shadow-[0_30px_80px_-20px_rgba(255,184,43,0.25)]"
        >
            <img
                src={img}
                alt={type}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-black/5 transition-opacity duration-500 group-hover:opacity-90" />

            <div className="relative h-full flex items-end p-7 sm:p-8">
                <div className="flex items-end justify-between w-full gap-4">
                    <section>
                        <span className="block h-px w-10 bg-gold mb-4 transition-all duration-500 group-hover:w-20" />
                        <h3 className="font-display text-4xl sm:text-5xl font-semibold text-white">{type}</h3>
                        <p className="text-gold-soft/90 text-sm sm:text-base mt-2">{description}</p>
                    </section>
                    <span
                        aria-hidden
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/50 text-gold text-xl transition-all duration-500 group-hover:bg-gold group-hover:text-ink group-hover:translate-x-1"
                    >
                        &rarr;
                    </span>
                </div>
            </div>
        </Link>
    </m.div>
}
