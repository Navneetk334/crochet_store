"use client";

import React, { useState, useMemo } from "react";
import {
    Search,
    Filter,
    ArrowUpDown,
    Archive,
    Trash2,
    Package
} from "lucide-react";
import ProductRow from "./ProductRow";

interface ProductCatalogProps {
    products: any[];
    categories: any[];
    onDelete: (id: string) => Promise<void>;
    onUpdateStock: (id: string, newStock: number) => Promise<void>;
}

export default function ProductCatalog({ products, categories, onDelete, onUpdateStock }: ProductCatalogProps) {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sort, setSort] = useState("newest");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search
        if (search) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.id.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Category
        if (categoryFilter !== "all") {
            result = result.filter(p => p.categoryId === categoryFilter);
        }

        // Sort
        result.sort((a, b) => {
            if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sort === "price-low") return a.price - b.price;
            if (sort === "price-high") return b.price - a.price;
            if (sort === "stock-low") return a.stock - b.stock;
            return 0;
        });

        return result;
    }, [products, search, categoryFilter, sort]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(filteredProducts.map(p => p.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleDeleteSelected = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} pieces?`)) return;

        for (const id of selectedIds) {
            await onDelete(id);
        }
        setSelectedIds([]);
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-pebble overflow-hidden">
            {/* Toolbar */}
            <div className="p-6 border-b border-pebble flex flex-col md:flex-row justify-between items-center gap-4 bg-pebble/10">
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or SKU..."
                        className="w-full bg-white px-5 py-3 rounded-xl border border-pebble focus:border-sage outline-none text-sm transition-all shadow-sm pl-12"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={18} />
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full bg-white px-5 py-3 rounded-xl border border-pebble focus:border-sage outline-none text-xs font-bold uppercase tracking-widest text-charcoal/60 appearance-none pr-10 shadow-sm"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/20 pointer-events-none" size={14} />
                    </div>

                    <div className="relative flex-1 md:flex-none">
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="w-full bg-white px-5 py-3 rounded-xl border border-pebble focus:border-sage outline-none text-xs font-bold uppercase tracking-widest text-charcoal/60 appearance-none pr-10 shadow-sm"
                        >
                            <option value="newest">Sort: Newest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="stock-low">Stock: Low First</option>
                        </select>
                        <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/20 pointer-events-none" size={14} />
                    </div>
                </div>
            </div>

            {/* Selection Actions */}
            {selectedIds.length > 0 && (
                <div className="px-8 py-4 bg-charcoal text-ivory flex items-center justify-between animate-in slide-in-from-top duration-300">
                    <div className="flex items-center space-x-4">
                        <span className="text-xs font-bold tracking-widest uppercase">{selectedIds.length} pieces selected</span>
                        <div className="h-4 w-px bg-white/20" />
                        <button
                            onClick={handleDeleteSelected}
                            className="flex items-center space-x-2 text-terra hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-widest"
                        >
                            <Trash2 size={14} />
                            <span>Delete Pieces</span>
                        </button>
                    </div>
                    <button
                        onClick={() => setSelectedIds([])}
                        className="text-[10px] uppercase tracking-widest font-bold opacity-60 hover:opacity-100 transition-opacity"
                    >
                        Clear Selection
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-pebble/30 border-b border-pebble">
                            <th className="px-8 py-5 w-10">
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                                    className="w-4 h-4 rounded border-pebble text-sage focus:ring-sage accent-sage cursor-pointer"
                                />
                            </th>
                            <th className="px-4 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Product</th>
                            <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Category</th>
                            <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Price</th>
                            <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Stock</th>
                            <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Status</th>
                            <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-pebble">
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-8 py-20 text-center">
                                    <div className="space-y-4 opacity-20">
                                        <Archive size={48} className="mx-auto" />
                                        <p className="font-serif text-2xl">No artisanal pieces found matching your criteria</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((product) => (
                                <ProductRow
                                    key={product.id}
                                    product={product}
                                    onDelete={onDelete}
                                    onUpdateStock={onUpdateStock}
                                    isSelected={selectedIds.includes(product.id)}
                                    onSelect={handleSelectOne}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Placeholder */}
            <div className="p-6 bg-pebble/10 border-t border-pebble flex justify-between items-center">
                <p className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 text-left">
                    Displaying {filteredProducts.length} curated pieces
                </p>
                <div className="flex space-x-2">
                    <button className="px-4 py-2 border border-pebble rounded-lg text-[10px] uppercase font-bold tracking-widest text-charcoal/40 cursor-not-allowed">Previous</button>
                    <button className="px-4 py-2 border border-pebble rounded-lg text-[10px] uppercase font-bold tracking-widest text-charcoal/60 hover:bg-white transition-all">Next</button>
                </div>
            </div>
        </div>
    );
}
