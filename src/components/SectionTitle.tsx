import { m } from "framer-motion"
export default function SectionTitle({ eyebrow, title }: { eyebrow: string, title: string }) {
    return <m.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center"
    >
        <p className="text-xs uppercase tracking-[0.4em] text-gold">{eyebrow}</p>
        <h2 className="mt-3 font-display text-4xl sm:text-6xl font-semibold">{title}</h2>
        <div className="mx-auto mt-5 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gold/50" />
            <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
            <span className="h-px w-12 bg-gold/50" />
        </div>
    </m.div>
}
