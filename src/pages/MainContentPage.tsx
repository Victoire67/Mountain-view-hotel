import Item from "../components/Item";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import ScrollToTop from "../components/ScrollToTop";

const API_URL = import.meta.env.VITE_API_URL;
type MenuType = "food" | "drinks";

type MainContentPageProps = {
    type: MenuType;
};

type ApiItem = {
    name: string;
    price: string | number;
    name_fr?: string | null;
    type: string;
    description?: string | null;
    isFood: boolean;
};

type CategoryGroup = {
    categoryName: string;
    items: ApiItem[];
};

// --- Module-level cache ---
// Lives outside the component, so it persists across mounts/unmounts
// (e.g. navigating between /food and /drinks) without a full page reload.
let itemsCache: ApiItem[] | null = null;
let itemsCacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes — adjust as needed

async function fetchItemsWithCache(): Promise<ApiItem[]> {
    const isCacheFresh = itemsCache !== null && Date.now() - itemsCacheTimestamp < CACHE_TTL_MS;

    if (isCacheFresh) {
        return itemsCache!;
    }

    const response = await fetch(`${API_URL}/api/items`);
    if (!response.ok) throw new Error("Failed to fetch items");
    const data = await response.json();

    itemsCache = data;
    itemsCacheTimestamp = Date.now();
    return data;
}

export default function MainContentPage({ type }: MainContentPageProps) {
    const [items, setItems] = useState<ApiItem[]>(itemsCache ?? []);
    const [loading, setLoading] = useState(itemsCache === null);
    const [dataOnView, setDataOnView] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function getData() {
            try {
                const data = await fetchItemsWithCache();
                if (!cancelled) setItems(data);
            } catch (err) {
                console.error("Error fetching items:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        getData();

        return () => {
            cancelled = true;
        };
    }, []);

    // ... rest of the component stays exactly the same ...

    const categories: CategoryGroup[] = useMemo(() => {
        const isFoodTarget = type === "food";
        const filtered = items.filter(item => item.isFood === isFoodTarget);
        const groups: Record<string, CategoryGroup> = {};

        filtered.forEach(item => {
            const catName = item.type || "General";
            if (!groups[catName]) {
                groups[catName] = { categoryName: catName, items: [] };
            }
            groups[catName].items.push(item);
        });

        return Object.values(groups);
    }, [items, type]);

    useEffect(() => {
        setDataOnView(0);
    }, [type]);

    function nextDataOnView() {
        if (categories.length === 0) return;
        setDataOnView(prev => (prev + 1 >= categories.length ? 0 : prev + 1));
        window.scrollTo(0, 0);
    }

    function prevDataOnView() {
        if (categories.length === 0) return;
        setDataOnView(prev => (prev === 0 ? categories.length - 1 : prev - 1));
        window.scrollTo(0, 0);
    }

    if (loading) {
        return <div className="text-white text-center py-20 bg-black min-h-screen">Loading menu...</div>;
    }

    if (categories.length === 0) {
        return <div className="text-white text-center py-20 bg-black min-h-screen">No items available.</div>;
    }

    const currentCategory = categories[dataOnView] || categories[0];

    const imageName = currentCategory.categoryName.replace(/\s+/g, "");


    return (
        <div>
            <div
                className="bg-black/70 sm:pt-[20%] pt-[50%] animation-appear text-center h-screen/2 pb-4 bg-cover bg-center bg-blend-multiply bg-linear-to-t from-black/90 to-transparent"
                style={{ backgroundImage: `url(../../public/${type}s/${[...currentCategory.categoryName].filter(x => x != " ").join("")}.jpg)` }}

            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={dataOnView}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl font-bold text-white uppercase">{currentCategory.categoryName}</h1>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="grid sm:grid-cols-2 bg-black px-2 w-full">
                {currentCategory.items.map(item => (
                    <Item
                        key={item.name}
                        name={item.name}
                        price={item.price as number}
                        frenchTr={item.name_fr ?? item.name}
                        description={item.description ?? ""}
                    />
                ))}
            </div>

            {categories.length > 1 && (
                <div className="bg-black py-8 flex items-center place-content-center gap-8">
                    <button
                        className="px-8 py-2 bg-[#FFB82B] text-black border-amber-200 border hover:text-[#FFB82B] hover:bg-transparent cursor-pointer transform transition-colors font-bold"
                        onClick={prevDataOnView}
                    >
                        PREV
                    </button>
                    <button
                        className="px-8 py-2 bg-[#FFB82B] text-black border-amber-200 border hover:text-[#FFB82B] hover:bg-transparent cursor-pointer transform transition-colors font-bold"
                        onClick={nextDataOnView}
                    >
                        NEXT
                    </button>
                </div>
            )}

            <ScrollToTop />
        </div>
    );
}