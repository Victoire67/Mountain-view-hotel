import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import {
    Search, Plus, Trash2, Pencil, RefreshCw, X, AlertCircle, CheckCircle2,
    UtensilsCrossed, Wine, Layers, LogOut, ExternalLink, Loader2,
} from 'lucide-react';
import Logo from '../../assets/logo';
import { useAuth } from '../../context/AuthContext';
import { invalidateItemsCache } from '../../lib/menu';

// Mirrors the `items` table returned by /api/items
type Item = {
    id: number;
    name: string;
    name_fr?: string | null;
    price: number | string;
    type: string; // category, e.g. "Buffet" — also names the banner image on the public menu
    description?: string | null;
    isFood: boolean;
};

type KindFilter = 'all' | 'food' | 'drinks';
type SortBy = 'name' | 'price-asc' | 'price-desc' | 'category';
type Toast = { kind: 'success' | 'error'; text: string } | null;

const emptyForm = { name: '', name_fr: '', price: '', type: '', isFood: true, description: '' };

// Empty = same origin (/api on Vercel, or the Vite dev proxy locally)
const API_URL = import.meta.env.VITE_API_URL ?? "";

const fieldCls = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-gold/70 focus:bg-white/[0.07]";
// Same look as fieldCls, but sized to content for toolbar dropdowns
const selectCls = "cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none transition-colors focus:border-gold/70 [&>option]:bg-ink-2";
const labelCls = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50";

const formatPrice = (p: number | string) => Number(p || 0).toLocaleString('en-US');

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    // Search & filters
    const [searchTerm, setSearchTerm] = useState('');
    const [kind, setKind] = useState<KindFilter>('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState<SortBy>('category');

    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Item | null>(null); // null = Add, object = Edit
    const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
    const [formData, setFormData] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');
    const [toast, setToast] = useState<Toast>(null);

    // Fetch with the admin token; an expired/invalid session sends the user back to login
    const authFetch = useCallback(async (path: string, init: RequestInit = {}) => {
        const res = await fetch(`${API_URL}${path}`, {
            ...init,
            headers: {
                ...(init.body ? { 'Content-Type': 'application/json' } : {}),
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                ...init.headers,
            },
        });
        if (res.status === 401) {
            logout();
            navigate('/login', { replace: true, state: { from: '/dashboard' } });
            throw new Error('Your session has expired. Please sign in again.');
        }
        return res;
    }, [logout, navigate]);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        setLoadError('');
        try {
            // Always revalidate with the server so the dashboard never shows a browser-cached list
            const response = await fetch(`${API_URL}/api/items`, { cache: 'no-cache' });
            if (!response.ok) throw new Error(`Server responded with ${response.status}`);
            setItems(await response.json());
        } catch (err) {
            console.error(err);
            setLoadError('Could not load the menu. Check that the server is running and try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    // Auto-hide toasts
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 3500);
        return () => clearTimeout(t);
    }, [toast]);

    // Escape closes whichever dialog is open
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== 'Escape' || saving) return;
            setIsModalOpen(false);
            setDeleteTarget(null);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [saving]);

    // Categories that exist for each kind, used for filters and the form's suggestions
    const categories = useMemo(() => {
        const food = new Set<string>(), drinks = new Set<string>();
        items.forEach(i => (i.isFood ? food : drinks).add(i.type || 'General'));
        const sort = (s: Set<string>) => [...s].sort((a, b) => a.localeCompare(b));
        return { food: sort(food), drinks: sort(drinks) };
    }, [items]);

    const visibleCategories = useMemo(() => (
        kind === 'food' ? categories.food
            : kind === 'drinks' ? categories.drinks
                : [...new Set([...categories.food, ...categories.drinks])].sort((a, b) => a.localeCompare(b))
    ), [kind, categories]);

    // Reset the category filter when it no longer applies to the selected kind
    useEffect(() => {
        if (categoryFilter !== 'all' && !visibleCategories.includes(categoryFilter)) setCategoryFilter('all');
    }, [visibleCategories, categoryFilter]);

    const filteredItems = useMemo(() => {
        const q = searchTerm.toLowerCase().trim();
        return items
            .filter(item => {
                if (kind === 'food' && !item.isFood) return false;
                if (kind === 'drinks' && item.isFood) return false;
                if (categoryFilter !== 'all' && item.type !== categoryFilter) return false;
                if (!q) return true;
                return [item.name, item.name_fr, item.description, item.type, String(item.price)]
                    .some(v => v?.toLowerCase().includes(q));
            })
            .sort((a, b) => {
                if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
                if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
                if (sortBy === 'category') return a.type.localeCompare(b.type) || a.name.localeCompare(b.name);
                return a.name.localeCompare(b.name);
            });
    }, [items, searchTerm, kind, categoryFilter, sortBy]);

    const stats = useMemo(() => ({
        total: items.length,
        food: items.filter(i => i.isFood).length,
        drinks: items.filter(i => !i.isFood).length,
        categories: categories.food.length + categories.drinks.length,
    }), [items, categories]);

    // ---------- Modal & form handlers ----------
    const openAdd = () => {
        setCurrentItem(null);
        setFormData({
            ...emptyForm,
            isFood: kind !== 'drinks',
            type: categoryFilter !== 'all' ? categoryFilter : '',
        });
        setFormError('');
        setIsModalOpen(true);
    };

    const openEdit = (item: Item) => {
        setCurrentItem(item);
        setFormData({
            name: item.name,
            name_fr: item.name_fr ?? '',
            price: String(item.price),
            type: item.type,
            isFood: item.isFood,
            description: item.description ?? '',
        });
        setFormError('');
        setIsModalOpen(true);
    };

    const handleSaveItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        const price = Number(formData.price);
        if (!Number.isFinite(price) || price < 0) {
            setFormError('Please enter a valid price.');
            return;
        }

        const payload = {
            name: formData.name.trim(),
            name_fr: formData.name_fr.trim() || formData.name.trim(),
            price,
            type: formData.type.trim(),
            isFood: formData.isFood,
            description: formData.description.trim(),
        };

        setSaving(true);
        try {
            const res = currentItem
                ? await authFetch(`/api/items/${currentItem.id}`, { method: 'PUT', body: JSON.stringify(payload) })
                : await authFetch('/api/items', { method: 'POST', body: JSON.stringify(payload) });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || data.message || 'Could not save the item.');

            setItems(prev => currentItem
                ? prev.map(i => i.id === currentItem.id ? { ...i, ...data } : i)
                : [...prev, data]);
            invalidateItemsCache();
            setIsModalOpen(false);
            setToast({ kind: 'success', text: currentItem ? `“${payload.name}” updated` : `“${payload.name}” added to the menu` });
        } catch (err) {
            setFormError(err instanceof Error ? err.message : 'Could not save the item.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteItem = async () => {
        if (!deleteTarget) return;
        setSaving(true);
        try {
            const res = await authFetch(`/api/items/${deleteTarget.id}`, { method: 'DELETE' });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Could not delete the item.');
            }
            setItems(prev => prev.filter(i => i.id !== deleteTarget.id));
            invalidateItemsCache();
            setToast({ kind: 'success', text: `“${deleteTarget.name}” deleted` });
        } catch (err) {
            setToast({ kind: 'error', text: err instanceof Error ? err.message : 'Could not delete the item.' });
        } finally {
            setSaving(false);
            setDeleteTarget(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    const suggestions = formData.isFood ? categories.food : categories.drinks;

    return (
        <div className="min-h-screen bg-ink text-white">
            {/* ---------- Top bar ---------- */}
            <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/80 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
                    <Link to="/" className="flex items-center gap-2" aria-label="Back to website">
                        <div className="h-9 [&>svg]:h-full [&>svg]:w-auto"><Logo /></div>
                        <div className="hidden sm:block leading-none">
                            <div className="font-display text-xl font-bold">Mountain View</div>
                            <div className="mt-0.5 text-[10px] uppercase tracking-[0.3em] text-gold">Menu manager</div>
                        </div>
                    </Link>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link to="/food" target="_blank" className="hidden md:inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-gold">
                            View menu <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        {user?.email && <span className="hidden lg:block text-sm text-white/40">{user.email}</span>}
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 transition-colors hover:border-rose-400/50 hover:text-rose-300"
                        >
                            <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Log out</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
                {/* ---------- Title ---------- */}
                <m.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
                >
                    <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-gold">Dashboard</p>
                        <h1 className="mt-2 font-display text-4xl sm:text-5xl font-semibold">Menu Management</h1>
                        <p className="mt-1 text-sm text-white/50">Add, edit and remove food & drinks shown on the website.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchItems}
                            title="Refresh"
                            aria-label="Refresh"
                            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-gold/50 hover:text-gold"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={openAdd}
                            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-ink shadow-[0_10px_40px_-12px_rgba(255,184,43,0.7)] transition-transform hover:-translate-y-0.5"
                        >
                            <Plus className="h-4 w-4" /> Add item
                        </button>
                    </div>
                </m.div>

                {/* ---------- Stats ---------- */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {[
                        { label: 'Total items', value: stats.total, icon: Layers },
                        { label: 'Food', value: stats.food, icon: UtensilsCrossed },
                        { label: 'Drinks', value: stats.drinks, icon: Wine },
                        { label: 'Categories', value: stats.categories, icon: Layers },
                    ].map(({ label, value, icon: Icon }, i) => (
                        <m.div
                            key={label}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 * i, duration: 0.5 }}
                            className="group flex items-center justify-between rounded-2xl border border-white/5 bg-ink-2 p-5 transition-colors hover:border-gold/25"
                        >
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">{label}</p>
                                <p className="mt-1 font-display text-4xl font-semibold text-gold-soft">{loading ? '–' : value}</p>
                            </div>
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold/10 text-gold transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                                <Icon className="h-5 w-5" strokeWidth={1.75} />
                            </div>
                        </m.div>
                    ))}
                </div>

                {/* ---------- Toolbar ---------- */}
                <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-ink-2 p-3 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                        <input
                            type="search"
                            placeholder="Search name, category, price…"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className={`${fieldCls} pl-11`}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex rounded-full border border-white/10 p-1 text-xs">
                            {(['all', 'food', 'drinks'] as const).map(k => (
                                <button
                                    key={k}
                                    onClick={() => setKind(k)}
                                    className={`rounded-full px-4 py-1.5 font-semibold capitalize transition-colors ${kind === k ? 'bg-gold text-ink' : 'text-white/60 hover:text-gold'}`}
                                >
                                    {k}
                                </button>
                            ))}
                        </div>

                        <select
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                            className={selectCls}
                            aria-label="Filter by category"
                        >
                            <option value="all">All categories</option>
                            {visibleCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>

                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as SortBy)}
                            className={selectCls}
                            aria-label="Sort"
                        >
                            <option value="category">Sort by category</option>
                            <option value="name">Sort by name</option>
                            <option value="price-asc">Price: low → high</option>
                            <option value="price-desc">Price: high → low</option>
                        </select>
                    </div>
                </div>

                {/* ---------- Items ---------- */}
                <div className="overflow-hidden rounded-2xl border border-white/5 bg-ink-2">
                    {loading ? (
                        <div className="divide-y divide-white/5">
                            {Array.from({ length: 6 }, (_, i) => (
                                <div key={i} className="flex items-center gap-6 px-6 py-5">
                                    <div className="flex-1 space-y-2"><div className="skeleton h-4 w-1/3" /><div className="skeleton h-3 w-1/2" /></div>
                                    <div className="skeleton h-6 w-24 rounded-full" />
                                    <div className="skeleton h-4 w-20" />
                                </div>
                            ))}
                        </div>
                    ) : loadError ? (
                        <div className="p-12 text-center">
                            <AlertCircle className="mx-auto h-10 w-10 text-rose-400" />
                            <p className="mt-3 text-white/70">{loadError}</p>
                            <button onClick={fetchItems} className="mt-5 rounded-full border border-gold/50 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold hover:bg-gold hover:text-ink transition-colors">
                                Try again
                            </button>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="p-12 text-center text-white/50">
                            {items.length === 0 ? 'The menu is empty — add your first item.' : 'No items match your search or filters.'}
                        </div>
                    ) : (
                        <>
                            {/* Desktop table */}
                            <table className="hidden w-full text-left md:table">
                                <thead>
                                    <tr className="border-b border-white/5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
                                        <th className="px-6 py-4">Item</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4 text-right">Price</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm">
                                    {filteredItems.map(item => (
                                        <tr key={item.id} className="group transition-colors hover:bg-white/[0.03]">
                                            <td className="px-6 py-4">
                                                <p className="font-display text-lg font-semibold text-gold-soft">{item.name}</p>
                                                {item.name_fr && item.name_fr !== item.name && <p className="text-xs italic text-white/40">{item.name_fr}</p>}
                                                {item.description && <p className="mt-0.5 max-w-md truncate text-xs text-white/50">{item.description}</p>}
                                            </td>
                                            <td className="px-6 py-4"><KindBadge item={item} /></td>
                                            <td className="px-6 py-4 text-right font-semibold text-gold whitespace-nowrap">
                                                {formatPrice(item.price)} <span className="text-xs text-white/40">RWF</span>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <RowActions onEdit={() => openEdit(item)} onDelete={() => setDeleteTarget(item)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Mobile cards */}
                            <ul className="divide-y divide-white/5 md:hidden">
                                {filteredItems.map(item => (
                                    <li key={item.id} className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="font-display text-lg font-semibold text-gold-soft">{item.name}</p>
                                                {item.description && <p className="truncate text-xs text-white/50">{item.description}</p>}
                                            </div>
                                            <p className="shrink-0 font-semibold text-gold">{formatPrice(item.price)} <span className="text-xs text-white/40">RWF</span></p>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between">
                                            <KindBadge item={item} />
                                            <RowActions onEdit={() => openEdit(item)} onDelete={() => setDeleteTarget(item)} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
                {!loading && !loadError && (
                    <p className="text-center text-xs text-white/30">Showing {filteredItems.length} of {items.length} items</p>
                )}
            </main>

            {/* ---------- Add / edit modal ---------- */}
            <AnimatePresence>
                {isModalOpen && (
                    <Backdrop onClose={() => !saving && setIsModalOpen(false)}>
                        <m.div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="item-dialog-title"
                            initial={{ opacity: 0, y: 30, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.97 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-lg rounded-3xl border border-white/10 bg-ink-2 p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{currentItem ? 'Edit' : 'New'}</p>
                                    <h2 id="item-dialog-title" className="font-display text-3xl font-semibold">{currentItem ? 'Edit item' : 'Add an item'}</h2>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} disabled={saving} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full text-white/50 transition-colors hover:bg-white/5 hover:text-white">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveItem} className="space-y-4">
                                {formError && (
                                    <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                                        <AlertCircle className="h-4 w-4 shrink-0" /> {formError}
                                    </div>
                                )}

                                <div>
                                    <span className={labelCls}>Type</span>
                                    <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 p-1">
                                        {[{ v: true, label: 'Food', icon: UtensilsCrossed }, { v: false, label: 'Drink', icon: Wine }].map(({ v, label, icon: Icon }) => (
                                            <button
                                                key={label}
                                                type="button"
                                                onClick={() => setFormData(f => ({ ...f, isFood: v }))}
                                                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-colors ${formData.isFood === v ? 'bg-gold text-ink' : 'text-white/60 hover:text-gold'}`}
                                            >
                                                <Icon className="h-4 w-4" /> {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="f-name" className={labelCls}>Name</label>
                                        <input id="f-name" required autoFocus value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Grilled tilapia" className={fieldCls} />
                                    </div>
                                    <div>
                                        <label htmlFor="f-name-fr" className={labelCls}>French name</label>
                                        <input id="f-name-fr" value={formData.name_fr} onChange={e => setFormData(f => ({ ...f, name_fr: e.target.value }))} placeholder="e.g. Tilapia grillé" className={fieldCls} />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="f-type" className={labelCls}>Category</label>
                                        <input id="f-type" required list="category-suggestions" value={formData.type} onChange={e => setFormData(f => ({ ...f, type: e.target.value }))} placeholder={formData.isFood ? 'e.g. Fish Dishes' : 'e.g. Cocktail'} className={fieldCls} />
                                        <datalist id="category-suggestions">
                                            {suggestions.map(c => <option key={c} value={c} />)}
                                        </datalist>
                                    </div>
                                    <div>
                                        <label htmlFor="f-price" className={labelCls}>Price (RWF)</label>
                                        <input id="f-price" type="number" min="0" step="1" required inputMode="numeric" value={formData.price} onChange={e => setFormData(f => ({ ...f, price: e.target.value }))} placeholder="0" className={fieldCls} />
                                    </div>
                                </div>
                                {formData.type && !suggestions.includes(formData.type.trim()) && (
                                    <p className="-mt-2 text-xs text-gold/70">“{formData.type.trim()}” is a new category — it will get its own page section.</p>
                                )}

                                <div>
                                    <label htmlFor="f-desc" className={labelCls}>Description</label>
                                    <textarea id="f-desc" rows={3} value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} placeholder="Short description shown on the menu…" className={`${fieldCls} resize-none`} />
                                </div>

                                <div className="flex gap-3 border-t border-white/5 pt-5">
                                    <button type="button" onClick={() => setIsModalOpen(false)} disabled={saving} className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-semibold text-white/70 transition-colors hover:bg-white/5">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={saving} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold py-3 text-sm font-bold uppercase tracking-[0.15em] text-ink transition-shadow hover:shadow-[0_10px_30px_-10px_rgba(255,184,43,0.8)] disabled:cursor-wait disabled:opacity-70">
                                        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                                        {saving ? 'Saving…' : 'Save item'}
                                    </button>
                                </div>
                            </form>
                        </m.div>
                    </Backdrop>
                )}
            </AnimatePresence>

            {/* ---------- Delete confirmation ---------- */}
            <AnimatePresence>
                {deleteTarget && (
                    <Backdrop onClose={() => !saving && setDeleteTarget(null)}>
                        <m.div
                            role="alertdialog"
                            aria-modal="true"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-sm rounded-3xl border border-white/10 bg-ink-2 p-7 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
                        >
                            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose-500/10 text-rose-400">
                                <Trash2 className="h-6 w-6" />
                            </div>
                            <h3 className="mt-4 font-display text-2xl font-semibold">Delete this item?</h3>
                            <p className="mt-2 text-sm text-white/55">
                                “{deleteTarget.name}” will be removed from the menu. This cannot be undone.
                            </p>
                            <div className="mt-6 flex gap-3">
                                <button onClick={() => setDeleteTarget(null)} disabled={saving} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/5">
                                    Cancel
                                </button>
                                <button onClick={handleDeleteItem} disabled={saving} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-500 disabled:opacity-70">
                                    {saving && <Loader2 className="h-4 w-4 animate-spin" />} Delete
                                </button>
                            </div>
                        </m.div>
                    </Backdrop>
                )}
            </AnimatePresence>

            {/* ---------- Toast ---------- */}
            <AnimatePresence>
                {toast && (
                    <m.div
                        role="status"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 24 }}
                        className={`fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full border px-5 py-3 text-sm shadow-2xl backdrop-blur-xl ${toast.kind === 'success'
                            ? 'border-emerald-400/30 bg-emerald-950/80 text-emerald-200'
                            : 'border-rose-400/30 bg-rose-950/80 text-rose-200'}`}
                    >
                        {toast.kind === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        {toast.text}
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function KindBadge({ item }: { item: Item }) {
    const Icon = item.isFood ? UtensilsCrossed : Wine;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${item.isFood
            ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300'
            : 'border-gold/25 bg-gold/10 text-gold'}`}
        >
            <Icon className="h-3 w-3" /> {item.type || 'General'}
        </span>
    );
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
    return (
        <div className="inline-flex gap-1">
            <button onClick={onEdit} title="Edit" aria-label="Edit" className="grid h-9 w-9 place-items-center rounded-full text-white/50 transition-colors hover:bg-gold/10 hover:text-gold">
                <Pencil className="h-4 w-4" />
            </button>
            <button onClick={onDelete} title="Delete" aria-label="Delete" className="grid h-9 w-9 place-items-center rounded-full text-white/50 transition-colors hover:bg-rose-500/10 hover:text-rose-400">
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
}

function Backdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
        >
            {children}
        </m.div>
    );
}
