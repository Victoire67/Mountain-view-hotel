import Item from "../components/Item";
import { m, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import fallbackImg from "../assets/bgMountainview.jpeg";
import {
    categoryImageUrl,
    fetchItemsWithCache,
    getCachedItems,
    type ApiItem,
    type MenuType,
} from "../lib/menu";

type MainContentPageProps = {
    type: MenuType;
};

type CategoryGroup = {
    categoryName: string;
    items: ApiItem[];
};

export default function MainContentPage({ type }: MainContentPageProps) {
    const [items, setItems] = useState<ApiItem[]>(() => getCachedItems() ?? []);
    const [loading, setLoading] = useState(() => getCachedItems() === null);
    const [error, setError] = useState(false);
    const [dataOnView, setDataOnView] = useState(0);
    const bannerRef = useRef<HTMLDivElement>(null);
    const chipsRef = useRef<HTMLDivElement>(null);

    const load = useCallback(() => {
        let cancelled = false;
        setError(false);

        fetchItemsWithCache()
            .then(data => { if (!cancelled) setItems(data); })
            .catch(err => {
                console.error("Error fetching items:", err);
                if (!cancelled) setError(true);
            })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, []);

    useEffect(load, [load]);

    const categories: CategoryGroup[] = useMemo(() => {
        const isFoodTarget = type === "food";
        const groups: Record<string, CategoryGroup> = {};

        items.forEach(item => {
            if (item.isFood !== isFoodTarget) return;
            const catName = item.type || "General";
            (groups[catName] ??= { categoryName: catName, items: [] }).items.push(item);
        });

        return Object.values(groups);
    }, [items, type]);

    // Preload neighbouring banners so switching category feels instant
    useEffect(() => {
        if (categories.length < 2) return;
        const n = categories.length;
        [dataOnView + 1, dataOnView - 1 + n].forEach(i => {
            const img = new Image();
            img.src = categoryImageUrl(type, categories[i % n].categoryName);
        });
    }, [categories, dataOnView, type]);

    // Keep the active chip visible in the horizontal scroller
    useEffect(() => {
        // Scroll only the chip row (scrollIntoView could also scroll the page vertically)
        const row = chipsRef.current;
        const chip = row?.querySelector<HTMLElement>(`[data-index="${dataOnView}"]`);
        if (row && chip) {
            row.scrollTo({ left: chip.offsetLeft - row.clientWidth / 2 + chip.offsetWidth / 2, behavior: "smooth" });
        }
    }, [dataOnView]);

    function goTo(index: number) {
        if (categories.length === 0) return;
        const n = categories.length;
        setDataOnView(((index % n) + n) % n);

        // Bring the list back into view without jumping all the way to the top
        const bannerBottom = (bannerRef.current?.offsetHeight ?? 0) - 64;
        if (window.scrollY > bannerBottom) window.scrollTo({ top: bannerBottom, behavior: "smooth" });
    }

    if (loading) return <MenuSkeleton />;

    if (error && categories.length === 0) {
        return (
            <div className="min-h-screen grid place-items-center px-6 text-center">
                <div>
                    <p className="font-display text-3xl">We couldn't load the menu.</p>
                    <p className="mt-2 text-white/60">Please check your connection and try again.</p>
                    <button
                        onClick={() => { setLoading(true); load(); }}
                        className="mt-6 rounded-full bg-gold px-8 py-3 text-sm font-bold uppercase tracking-[0.2em] text-ink transition-transform hover:-translate-y-0.5"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (categories.length === 0) {
        return <div className="min-h-screen grid place-items-center text-white/70">No items available.</div>;
    }

    const current = categories[dataOnView] ?? categories[0];
    const prev = categories[(dataOnView - 1 + categories.length) % categories.length];
    const next = categories[(dataOnView + 1) % categories.length];

    return (
        <div>
            {/* ---------- Banner ---------- */}
            <div ref={bannerRef} className="relative h-[52vh] min-h-85 overflow-hidden">
                <AnimatePresence initial={false}>
                    <m.img
                        key={current.categoryName}
                        src={categoryImageUrl(type, current.categoryName)}
                        onError={e => { e.currentTarget.src = fallbackImg; }}
                        alt=""
                        decoding="async"
                        initial={{ opacity: 0, scale: 1.08 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-ink" />

                <div className="relative z-10 flex h-full flex-col items-center justify-end pb-14 px-4 text-center">
                    <p className="text-xs uppercase tracking-[0.5em] text-gold">
                        {type === "food" ? "Our kitchen" : "Our bar"}
                    </p>
                    <AnimatePresence mode="wait">
                        <m.h1
                            key={current.categoryName}
                            initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="mt-3 font-display text-5xl sm:text-7xl font-semibold capitalize"
                        >
                            {current.categoryName}
                        </m.h1>
                    </AnimatePresence>
                    <p className="mt-3 text-sm text-white/60">
                        {current.items.length} {current.items.length === 1 ? "item" : "items"}
                    </p>
                </div>
            </div>

            {/* ---------- Category chips ---------- */}
            <div className="sticky top-16 z-30 border-y border-white/5 bg-ink/85 backdrop-blur-xl">
                <div ref={chipsRef} className="no-scrollbar relative mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3">
                    {categories.map((c, i) => (
                        <button
                            key={c.categoryName}
                            data-index={i}
                            onClick={() => goTo(i)}
                            className={`shrink-0 rounded-full px-4 py-1.5 text-sm capitalize transition-all duration-300 ${i === dataOnView
                                ? "bg-gold text-ink font-semibold shadow-[0_4px_20px_-4px_rgba(255,184,43,0.6)]"
                                : "border border-white/10 text-white/70 hover:border-gold/50 hover:text-gold"
                                }`}
                        >
                            {c.categoryName}
                        </button>
                    ))}
                </div>
            </div>

            {/* ---------- Items ---------- */}
            <AnimatePresence mode="wait">
                <m.div
                    key={current.categoryName}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-2"
                >
                    {current.items.map((item, i) => (
                        <Item
                            key={item.name}
                            index={i}
                            name={item.name}
                            price={item.price}
                            frenchTr={item.name_fr ?? ""}
                            description={item.description ?? ""}
                        />
                    ))}
                </m.div>
            </AnimatePresence>

            {/* ---------- Prev / next ---------- */}
            {categories.length > 1 && (
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 pb-16">
                    <button
                        onClick={() => goTo(dataOnView - 1)}
                        className="group flex items-center gap-3 rounded-2xl border border-white/10 p-5 text-left transition-colors hover:border-gold/50 hover:bg-ink-2"
                    >
                        <ChevronLeft className="h-6 w-6 shrink-0 text-gold transition-transform group-hover:-translate-x-1" />
                        <span className="min-w-0">
                            <span className="block text-xs uppercase tracking-[0.25em] text-white/50">Previous</span>
                            <span className="block truncate font-display text-xl sm:text-2xl capitalize">{prev.categoryName}</span>
                        </span>
                    </button>
                    <button
                        onClick={() => goTo(dataOnView + 1)}
                        className="group flex items-center justify-end gap-3 rounded-2xl border border-white/10 p-5 text-right transition-colors hover:border-gold/50 hover:bg-ink-2"
                    >
                        <span className="min-w-0">
                            <span className="block text-xs uppercase tracking-[0.25em] text-white/50">Next</span>
                            <span className="block truncate font-display text-xl sm:text-2xl capitalize">{next.categoryName}</span>
                        </span>
                        <ChevronRight className="h-6 w-6 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            )}
        </div>
    );
}

function MenuSkeleton() {
    return (
        <div aria-busy="true" aria-label="Loading menu">
            <div className="h-[52vh] min-h-85 flex flex-col items-center justify-end pb-14 gap-4 bg-linear-to-b from-ink-2 to-ink">
                <div className="skeleton h-3 w-28" />
                <div className="skeleton h-14 w-72" />
            </div>
            <div className="mx-auto flex max-w-7xl gap-2 px-4 py-3">
                {Array.from({ length: 5 }, (_, i) => <div key={i} className="skeleton h-8 w-24 rounded-full" />)}
            </div>
            <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-2">
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="rounded-xl border border-white/5 p-5 space-y-3">
                        <div className="flex justify-between"><div className="skeleton h-6 w-1/2" /><div className="skeleton h-6 w-20" /></div>
                        <div className="skeleton h-3 w-full" />
                        <div className="skeleton h-3 w-2/3" />
                    </div>
                ))}
            </div>
        </div>
    );
}
