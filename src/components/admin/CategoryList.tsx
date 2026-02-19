"use client";

import React, { useState } from "react";
import {
    Plus,
    Tag,
    Trash2,
    Edit,
    ChevronRight,
    Layers,
    X,
    Save
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryListProps {
    categories: any[];
    onCreate: (name: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export default function CategoryList({ categories, onCreate, onDelete }: CategoryListProps) {
    const [isAddMode, setIsAddMode] = useState(false);
    const [newName, setNewName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        setIsSubmitting(true);
        try {
            await onCreate(newName.trim());
            setNewName("");
            setIsAddMode(false);
        } catch (error) {
            console.error("Create failed", error);
            alert("Failed to create category.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string, productCount: number) => {
        if (productCount > 0) {
            alert(`Cannot delete "${name}" because it still contains ${productCount} artisanal pieces. Please reassign or delete the products first.`);
            return;
        }

        if (!confirm(`Are you sure you want to remove the "${name}" category?`)) return;

        setDeletingId(id);
        try {
            await onDelete(id);
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete category.");
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.3em] font-bold text-sage">Catalog Structure</p>
                    <h1 className="text-4xl font-serif text-charcoal">Categories</h1>
                </div>
                <button
                    onClick={() => setIsAddMode(true)}
                    className="btn-primary py-4 px-8 rounded-2xl flex items-center space-x-3 text-sm tracking-widest uppercase shadow-xl group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                    <span>New Category</span>
                </button>
            </div>

            <AnimatePresence>
                {isAddMode && (
                    <motion.form
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        onSubmit={handleCreate}
                        className="bg-charcoal p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-6"
                    >
                        <div className="flex-1 space-y-1 w-full">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-sage ml-1">New Category Name</label>
                            <input
                                required
                                autoFocus
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="e.g. Dreamy Cardigans"
                                className="w-full px-6 py-4 bg-white/5 border border-transparent rounded-2xl focus:bg-white/10 focus:border-sage outline-none text-white text-sm transition-all"
                            />
                        </div>
                        <div className="flex items-center space-x-3 w-full md:w-auto pt-5">
                            <button
                                type="button"
                                onClick={() => setIsAddMode(false)}
                                className="px-6 py-4 rounded-2xl bg-white/5 text-ivory/60 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest"
                            >
                                <X size={18} />
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 md:flex-none btn-secondary py-4 px-8 rounded-2xl flex items-center justify-center space-x-3 text-sm tracking-widest uppercase shadow-xl disabled:opacity-50"
                            >
                                <Save size={18} />
                                <span>{isSubmitting ? "Creating..." : "Save Category"}</span>
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.length === 0 ? (
                    <div className="col-span-full py-24 text-center space-y-4 opacity-20">
                        <Layers size={48} className="mx-auto" />
                        <p className="font-serif text-2xl">Establish the layers of your collection...</p>
                    </div>
                ) : (
                    categories.map((cat: any) => (
                        <motion.div
                            layout
                            key={cat.id}
                            className={`bg-white p-8 rounded-3xl border border-pebble shadow-sm hover:shadow-xl transition-all group relative overflow-hidden ${deletingId === cat.id ? "opacity-30 grayscale" : ""}`}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleDelete(cat.id, cat.name, cat._count.products)}
                                        disabled={deletingId === cat.id}
                                        className="p-2 bg-pebble rounded-lg text-charcoal/40 hover:text-terra transition-all disabled:opacity-50"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="w-12 h-12 bg-pebble rounded-xl flex items-center justify-center text-sage group-hover:bg-sage group-hover:text-ivory transition-all shadow-sm">
                                    <Tag size={24} />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-serif text-2xl text-charcoal group-hover:text-terra transition-colors">{cat.name}</h3>
                                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-charcoal/40">
                                        <span>{cat._count.products} Artisanal Pieces</span>
                                        <span className="text-sage">Active Catalog</span>
                                    </div>
                                </div>

                                <Link
                                    href={`/admin/products?category=${cat.id}`}
                                    className="flex items-center justify-between p-4 bg-pebble/30 rounded-2xl text-[10px] uppercase font-bold tracking-widest text-charcoal/60 hover:bg-sage/10 hover:text-sage transition-all"
                                >
                                    <span>View Products</span>
                                    <ChevronRight size={14} />
                                </Link>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
