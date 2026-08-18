import { useState, useEffect, useMemo } from 'react';
import {
    Search, Plus, Trash2, Edit2, RefreshCw,
    Utensils, Coffee, X, AlertCircle
} from 'lucide-react';

type Item = {
    id: number;
    name: string;
    category: string;
    price: number;
    isAvailable: boolean;
    description?: string;
    isFood?: boolean;
};

const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    // Search & Filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'food', 'drink'
    const [sortBy, setSortBy] = useState('name'); // 'name', 'price-asc', 'price-desc'

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Item | null>(null); // null = Add, object = Edit
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category: 'food',
        price: '',
        isAvailable: true,
        description: ''
    });

    // 1. Fetch Items from /items API
    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/items`);
            if (!response.ok) throw new Error('Failed to fetch items from server');
            const data = await response.json();
            setItems(data);
        } catch (err) {
            console.error(err instanceof Error ? err.message : 'Something went wrong');
            // Fallback mockup data for preview/testing purposes
            setItems([
                { id: 1, name: 'Grilled Mountain Trout', category: 'food', price: 18.5, isAvailable: true, description: 'Fresh trout with herb butter' },
                { id: 2, name: 'Fresh Mango Juice', category: 'drink', price: 4.0, isAvailable: true, description: 'Chilled natural fresh juice' },
                { id: 3, name: 'Beef Burger & Fries', category: 'food', price: 12.0, isAvailable: false, description: 'Classic beef patty with cheddar cheese' },
                { id: 4, name: 'Espresso Coffee', category: 'drink', price: 3.5, isAvailable: true, description: 'Double shot espresso' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // 2. Filter & Sort Logic (Derived purely from `items` without mutating state)
    const filteredItems = useMemo(() => {
        return items
            .filter((item: Item) => {
                const matchesSearch =
                    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.price?.toString().includes(searchTerm);

                const itemCategory = item.category
                    ? item.category.toLowerCase().trim()
                    : (item.isFood ? 'food' : 'drink');

                const selectedCategory = categoryFilter.toLowerCase().trim();

                const matchesCategory =
                    selectedCategory === 'all' || itemCategory === selectedCategory;

                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => {
                if (sortBy === 'price-asc') return a.price - b.price;
                if (sortBy === 'price-desc') return b.price - a.price;
                return a.name.localeCompare(b.name);
            });
    }, [items, searchTerm, categoryFilter, sortBy]);

    // Quick stats computed from core state
    const stats = useMemo(() => {
        const foodCount = items.filter(i => i.category === 'food' || i.isFood === true).length;
        const drinkCount = items.filter(i => i.category === 'drink' || (i.isFood === false && i.category !== 'food')).length;
        const availableCount = items.filter(i => i.isAvailable).length;
        return { total: items.length, food: foodCount, drink: drinkCount, available: availableCount };
    }, [items]);

    // 3. Modal & Form Handlers
    const handleOpenAddModal = () => {
        setCurrentItem(null);
        setFormData({ name: '', category: 'food', price: '', isAvailable: true, description: '' });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: Item) => {
        setCurrentItem(item);
        setFormData({
            name: item.name,
            category: item.category || (item.isFood ? 'food' : 'drink'),
            price: String(item.price),
            isAvailable: item.isAvailable,
            description: item.description || ''
        });
        setIsModalOpen(true);
    };

    const handleSaveItem = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const payload = {
            name: formData.name,
            name_fr: formData.name,
            price: parseFloat(formData.price),
            type: formData.category,
            isFood: formData.category === 'food',
            description: formData.description,
            isAvailable: formData.isAvailable,
        };

        try {
            if (currentItem) {
                const res = await fetch(`${API_URL}/api/items/${currentItem.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    const updated = await res.json();
                    setItems(prev => prev.map(i => i.id === currentItem.id ? { ...i, ...updated } : i));
                } else {
                    console.error('Update failed:', await res.text());
                }
            } else {
                const res = await fetch('${API_URL}/api/items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    const newItem = await res.json();
                    setItems(prev => [...prev, newItem]);
                } else {
                    console.error('Create failed:', await res.text());
                }
            }
        } catch (err) {
            console.error('Failed to save item:', err);
        } finally {
            setIsModalOpen(false);
        }
    };

    // 4. Delete Handler
    const handleDeleteItem = async (id: number) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/api/items/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setItems(prev => prev.filter(item => item.id !== id));
            } else {
                console.error('Delete failed:', await res.text());
            }
        } catch (err) {
            console.error('Failed to delete item:', err);
        } finally {
            setDeleteConfirmId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* --- Top Header Bar --- */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
                        <p className="text-sm text-gray-500">Manage food, drinks, prices, and item availability</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchItems}
                            className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition cursor-pointer"
                            title="Refresh Data"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={handleOpenAddModal}
                            className="flex items-center gap-2 bg-[#FFB82B] hover:bg-amber-600 text-white font-semibold px-4 py-2.5 rounded-lg shadow-sm transition active:scale-[0.98] cursor-pointer"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add New Item</span>
                        </button>
                    </div>
                </div>

                {/* --- Key Metrics Overview Cards --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Total Items</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                            <Utensils className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Food Items</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.food}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Utensils className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Drink Items</p>
                            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.drink}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <Coffee className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* --- Search, Filter & Controls Panel --- */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search food, drinks, price..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full text-black pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg p-1 text-xs">
                            <button
                                type="button"
                                onClick={() => setCategoryFilter('all')}
                                className={`px-3 py-1.5 rounded-md transition font-medium cursor-pointer ${categoryFilter === 'all' ? 'bg-white shadow-xs text-gray-800 font-bold' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                All
                            </button>
                            <button
                                type="button"
                                onClick={() => setCategoryFilter('food')}
                                className={`px-3 py-1.5 rounded-md transition font-medium cursor-pointer ${categoryFilter === 'food' ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                Food
                            </button>
                            <button
                                type="button"
                                onClick={() => setCategoryFilter('drink')}
                                className={`px-3 py-1.5 rounded-md transition font-medium cursor-pointer ${categoryFilter === 'drink' ? 'bg-white shadow-xs text-amber-700 font-bold' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                Drinks
                            </button>
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* --- Main Items Table --- */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-400">Loading items...</div>
                    ) : filteredItems.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            No items match your query. Try clearing filters or search term.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                                        <th className="py-3.5 px-6">Item Name & Description</th>
                                        <th className="py-3.5 px-6">Category</th>
                                        <th className="py-3.5 px-6">Price</th>
                                        <th className="py-3.5 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {filteredItems.map((item: Item) => {
                                        const cat = item.category || (item.isFood ? 'food' : 'drink');
                                        return (
                                            <tr key={item.id} className="hover:bg-gray-50/60 transition">
                                                <td className="py-4 px-6">
                                                    <p className="font-semibold text-gray-800">{item.name}</p>
                                                    {item.description && (
                                                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{item.description}</p>
                                                    )}
                                                </td>

                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${cat === 'food'
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        }`}>
                                                        {cat === 'food' ? <Utensils className="w-3 h-3" /> : <Coffee className="w-3 h-3" />}
                                                        {cat}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-6 font-semibold text-gray-700">
                                                    RWF {Number(item.price || 0).toLocaleString()}
                                                </td>

                                                <td className="py-4 px-6 text-right space-x-2">
                                                    <button
                                                        onClick={() => handleOpenEditModal(item)}
                                                        className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                                                        title="Edit Item"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirmId(item.id)}
                                                        className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                                        title="Delete Item"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>

            {/* --- ADD / EDIT MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-gray-100 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                            <h2 className="text-lg font-bold text-gray-800">
                                {currentItem ? 'Edit Item' : 'Add New Item'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveItem} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Item Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Steak      Pepper Sauce"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                                    >
                                        <option value="food">Food</option>
                                        <option value="drink">Drink</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Description</label>
                                <textarea
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Short description..."
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="availability"
                                    checked={formData.isAvailable}
                                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                />
                                <label htmlFor="availability" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    Available for ordering
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition cursor-pointer"
                                >
                                    Save Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- DELETE CONFIRMATION DIALOG --- */}
            {deleteConfirmId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 text-center">
                        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-gray-800">Confirm Delete</h3>
                        <p className="text-xs text-gray-500 mt-1">
                            Are you sure you want to remove this item? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteItem(deleteConfirmId)}
                                className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-sm transition cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}