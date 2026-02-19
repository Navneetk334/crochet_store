"use client";

import React, { useState } from "react";
import { Save, Info, Plus, ChevronLeft } from "lucide-react";
import Link from "next/link";
import ProductImageManager from "./ProductImageManager";
import { useRouter } from "next/navigation";

interface Category {
    id: string;
    name: string;
}

interface ProductFormProps {
    initialData?: any;
    categories: Category[];
    action: (formData: FormData) => Promise<void>;
    mode: "create" | "edit";
}

export default function ProductForm({ initialData, categories, action, mode }: ProductFormProps) {
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        // Ensure the images are appended as a single JSON string for simplicity 
        // handle in the server action
        formData.set("imagesJson", JSON.stringify(images));

        try {
            await action(formData);
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            <div className="flex items-center justify-between">
                <Link href="/admin/products" className="flex items-center text-[10px] uppercase tracking-widest font-bold text-charcoal/40 hover:text-sage transition-colors group">
                    <ChevronLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Catalog
                </Link>
                <div className="flex items-center space-x-4">
                    <button
                        type="submit"
                        form="product-form"
                        disabled={isSubmitting}
                        className="btn-primary py-3 px-8 rounded-xl flex items-center space-x-3 text-xs tracking-widest uppercase shadow-xl disabled:opacity-50"
                    >
                        <Save size={16} />
                        <span>{isSubmitting ? "Saving..." : mode === "create" ? "Publish Piece" : "Update Piece"}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <form id="product-form" onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">
                    {/* General Information */}
                    <section className="bg-white p-10 rounded-3xl border border-pebble shadow-sm space-y-8">
                        <h3 className="font-serif text-2xl text-charcoal">{mode === "create" ? "Piece Identity" : "Edit Identity"}</h3>

                        <div className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-charcoal/40 ml-1">Product Name</label>
                                <input required name="name" defaultValue={initialData?.name} type="text" placeholder="e.g. Sage Whisper Cardigan" className="w-full px-6 py-4 bg-pebble/30 border border-transparent rounded-2xl focus:bg-white focus:border-sage outline-none text-sm transition-all shadow-inner" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-charcoal/40 ml-1">Price (INR)</label>
                                    <input required name="price" defaultValue={initialData?.price} type="number" placeholder="2400" className="w-full px-6 py-4 bg-pebble/30 border border-transparent rounded-2xl focus:bg-white focus:border-sage outline-none text-sm transition-all shadow-inner" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-charcoal/40 ml-1">Opening Stock</label>
                                    <input required name="stock" defaultValue={initialData?.stock} type="number" placeholder="12" className="w-full px-6 py-4 bg-pebble/30 border border-transparent rounded-2xl focus:bg-white focus:border-sage outline-none text-sm transition-all shadow-inner" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-charcoal/40 ml-1">Category</label>
                                <select required name="categoryId" defaultValue={initialData?.categoryId || ""} className="w-full px-6 py-4 bg-pebble/30 border border-transparent rounded-2xl focus:bg-white focus:border-sage outline-none text-sm transition-all shadow-inner appearance-none cursor-pointer">
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-charcoal/40 ml-1">Artisan Story (Description)</label>
                                <textarea required name="description" defaultValue={initialData?.description} rows={5} placeholder="Describe the handcrafting process and inspiration..." className="w-full px-6 py-4 bg-pebble/30 border border-transparent rounded-2xl focus:bg-white focus:border-sage outline-none text-sm transition-all shadow-inner resize-none"></textarea>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-charcoal/40 ml-1">Care & Longevity</label>
                                <textarea required name="care" defaultValue={initialData?.care} rows={3} placeholder="Hand wash only. Dry flat..." className="w-full px-6 py-4 bg-pebble/30 border border-transparent rounded-2xl focus:bg-white focus:border-sage outline-none text-sm transition-all shadow-inner resize-none"></textarea>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-charcoal/40 ml-1">Size Chart (Table Format)</label>
                                <textarea name="sizeChart" defaultValue={initialData?.sizeChart} rows={6} placeholder="Size | Chest | Length&#10;S | 36 | 24&#10;M | 38 | 25" className="w-full px-6 py-4 bg-pebble/30 border border-transparent rounded-2xl focus:bg-white focus:border-sage outline-none text-sm transition-all shadow-inner resize-none font-mono"></textarea>
                                <p className="text-[10px] text-earth-brown/40 mt-1 italic">Use standard characters (Size | Chest | Length) separated by "|" to create a clean shop table.</p>
                            </div>
                        </div>
                    </section>

                    {/* Media Section */}
                    <section className="bg-white p-10 rounded-3xl border border-pebble shadow-sm space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="font-serif text-2xl text-charcoal">Visual Gallery</h3>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-sage bg-sage/5 px-3 py-1 rounded-full">Artisan Studio Uploads</span>
                        </div>

                        <ProductImageManager
                            images={images}
                            onImagesChange={(newImages) => setImages(newImages)}
                        />
                    </section>
                </form>

                <aside className="lg:col-span-4 space-y-8">
                    <div className="bg-charcoal text-ivory p-8 rounded-3xl shadow-2xl space-y-6">
                        <div className="flex items-center space-x-3 text-sage">
                            <Info size={20} />
                            <h4 className="font-serif text-xl">Curator's Note</h4>
                        </div>
                        <p className="text-xs font-light leading-relaxed text-ivory/60 italic">
                            "When listing a new piece, focus on the 'hands that made it'. Our customers value the slow-fashion journey over mere product specs."
                        </p>
                        {mode === "edit" && (
                            <div className="space-y-4 pt-4 border-t border-ivory/10 text-[10px] uppercase tracking-widest font-bold text-ivory/40">
                                <div className="flex justify-between">
                                    <span>ID</span>
                                    <span className="text-white font-mono">{initialData?.id?.slice(-8).toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Last Updated</span>
                                    <span className="text-white" suppressHydrationWarning>{new Date(initialData?.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-pebble shadow-sm space-y-6">
                        <h4 className="font-serif text-xl border-b border-pebble pb-4 mb-6">Inventory Safety</h4>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-charcoal/40">Low Stock Alert</label>
                            <input type="number" defaultValue={5} className="w-full px-5 py-3 bg-pebble/30 border border-transparent rounded-xl focus:bg-white focus:border-sage outline-none text-sm transition-all" />
                            <p className="text-[10px] text-earth-brown/40 mt-1 italic">We'll notify you when stock hits this number.</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
