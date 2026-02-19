"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Link as LinkIcon, Plus, Trash2, Image as ImageIcon, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductImageManagerProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
}

export default function ProductImageManager({ images = [], onImagesChange }: ProductImageManagerProps) {
    const [urlInput, setUrlInput] = useState("");
    const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddUrl = () => {
        if (!urlInput.trim()) return;
        const newImages = [...images, urlInput.trim()];
        onImagesChange(newImages);
        setUrlInput("");
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                onImagesChange([...images, base64String]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    const handleImageError = (url: string) => {
        setBrokenImages(prev => ({ ...prev, [url]: true }));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
                {/* URL Input */}
                <div className="flex-1 relative">
                    <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="Paste image URL here..."
                        className="w-full px-6 py-4 bg-pebble/30 border border-transparent rounded-2xl focus:bg-white focus:border-sage outline-none text-sm transition-all shadow-inner pl-12"
                    />
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={18} />
                    <button
                        type="button"
                        onClick={handleAddUrl}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-sage text-white rounded-xl hover:bg-sage/80 transition-colors shadow-lg"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                {/* File Upload Trigger */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center space-x-3 px-8 py-4 bg-charcoal text-white rounded-2xl hover:bg-charcoal/90 transition-all shadow-xl group"
                >
                    <Upload size={18} className="group-hover:-translate-y-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Local Upload</span>
                </button>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                />
            </div>

            {/* Gallery Preview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <AnimatePresence>
                    {images.map((img, index) => (
                        <motion.div
                            key={`${img}-${index}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="aspect-[3/4] rounded-2xl overflow-hidden bg-pebble relative group"
                        >
                            {brokenImages[img] ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-terra/5 text-terra p-4 text-center">
                                    <AlertCircle size={24} className="mb-2" />
                                    <span className="text-[10px] font-bold uppercase tracking-tighter leading-tight">Broken Link</span>
                                </div>
                            ) : (
                                <img
                                    src={img}
                                    alt="Preview"
                                    onError={() => handleImageError(img)}
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-2xl"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    {images.length === 0 && (
                        <div className="col-span-full aspect-[4/2] rounded-3xl border-2 border-dashed border-pebble flex flex-col items-center justify-center space-y-3 text-charcoal/20">
                            <ImageIcon size={48} strokeWidth={1} />
                            <p className="text-xs uppercase tracking-[0.2em] font-bold">No visuals added yet</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <input type="hidden" name="imageArray" value={JSON.stringify(images)} />
        </div>
    );
}
