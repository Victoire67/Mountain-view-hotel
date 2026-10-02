import { m } from "framer-motion"

type ItemProps = {
    name: string
    price: number | string
    frenchTr: string
    description: string
    index?: number
}

export default function Item({ name, price, frenchTr, description, index = 0 }: ItemProps) {
    const formatted = Number(price).toLocaleString("en-US")

    return <m.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        // Small stagger for the first row, so cards cascade in without long waits further down
        transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.05, ease: "easeOut" }}
        className="group relative rounded-xl border border-white/5 bg-ink-2/80 p-5 transition-colors duration-300 hover:border-gold/30 hover:bg-ink-3"
    >
        <div className="flex items-baseline gap-3">
            <h3 className="font-display text-2xl font-semibold text-gold-soft group-hover:text-white transition-colors">{name}</h3>
            <span aria-hidden className="flex-1 -translate-y-1 border-b border-dotted border-white/20" />
            <span className="shrink-0 font-semibold text-gold whitespace-nowrap">
                {formatted} <span className="text-xs text-white/50">RWF</span>
            </span>
        </div>
        {frenchTr && frenchTr !== name && <p className="text-sm italic text-white/50 mt-1">{frenchTr}</p>}
        {description && <p className="text-sm text-white/70 mt-3 leading-relaxed">{description}</p>}
    </m.article>
}
