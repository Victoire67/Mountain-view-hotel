// Empty = same origin (/api on Vercel, or the Vite dev proxy locally)
const API_URL = import.meta.env.VITE_API_URL ?? "";

export type MenuType = "food" | "drinks";

export type ApiItem = {
    name: string;
    price: string | number;
    name_fr?: string | null;
    type: string;
    description?: string | null;
    isFood: boolean;
};

// --- Module-level cache ---
// Lives outside components, so it persists across navigations without a reload.
// The in-flight promise is shared too, so a prefetch and a page mount never
// trigger two requests.
let itemsCache: ApiItem[] | null = null;
let itemsCacheTimestamp = 0;
let inflight: Promise<ApiItem[]> | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

export function getCachedItems(): ApiItem[] | null {
    return itemsCache;
}

export function fetchItemsWithCache(): Promise<ApiItem[]> {
    const isCacheFresh = itemsCache !== null && Date.now() - itemsCacheTimestamp < CACHE_TTL_MS;
    if (isCacheFresh) return Promise.resolve(itemsCache!);
    if (inflight) return inflight;

    inflight = fetch(`${API_URL}/api/items`)
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch items");
            return response.json();
        })
        .then((data: ApiItem[]) => {
            itemsCache = data;
            itemsCacheTimestamp = Date.now();
            return data;
        })
        .finally(() => {
            inflight = null;
        });

    return inflight;
}

/** Fire-and-forget warm-up, e.g. on link hover or when the browser is idle. */
export function prefetchItems() {
    fetchItemsWithCache().catch(() => {});
}

/** Public folder holding category banner images (folders are `foods/` and `drinkss/`). */
export function categoryImageUrl(type: MenuType, categoryName: string) {
    return `/${type}s/${categoryName.replace(/\s+/g, "")}.jpg`;
}

/** Drop the in-memory copy after an admin write so public pages refetch. */
export function invalidateItemsCache() {
    itemsCache = null;
    itemsCacheTimestamp = 0;
}
