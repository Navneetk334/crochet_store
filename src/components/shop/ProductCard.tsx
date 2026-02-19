"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/store/useCart";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        price: number;
        discount?: number | null;
        images: string[];
        category: { name: string };
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const finalPrice = product.discount ? product.price - product.discount : product.price;

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);

    useEffect(() => {
        const checkWishlist = async () => {
            try {
                const res = await fetch("/api/wishlist");
                const data = await res.json();
                if (data.items && data.items.includes(product.id)) {
                    setIsWishlisted(true);
                }
            } catch (error) {
                console.error("Failed to check wishlist status", error);
            }
        };
        checkWishlist();
    }, [product.id]);

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isWishlistLoading) return;

        setIsWishlistLoading(true);
        const previousState = isWishlisted;
        setIsWishlisted(!previousState);

        try {
            const res = await fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id }),
            });

            if (res.status === 401) {
                // Show a more friendly message or redirect
                console.warn("Please sign in to save items to your wishlist.");
                setIsWishlisted(previousState);
                return;
            }

            if (!res.ok) throw new Error("Wishlist update failed");

            const data = await res.json();
            setIsWishlisted(data.active);
        } catch (error) {
            console.error(error);
            setIsWishlisted(previousState);
        } finally {
            setIsWishlistLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="group bg-paper rounded-[2rem] overflow-hidden shadow-artisan hover:shadow-artisan-hover transition-all duration-700"
        >
            <div className="relative aspect-[4/5] overflow-hidden">
                <Link href={`/products/${product.id}`} className="block h-full w-full relative z-10" data-cursor="view">
                    <img
                        src={product.images[0] || "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1000"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                </Link>

                {product.discount && (
                    <div className="absolute top-6 left-6 bg-charcoal text-paper text-[8px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest z-20 shadow-xl">
                        Selection
                    </div>
                )}

                <button
                    onClick={toggleWishlist}
                    disabled={isWishlistLoading}
                    className={`absolute top-6 right-6 p-3 bg-paper/90 backdrop-blur-md rounded-full transition-all duration-500 z-30 shadow-md ${isWishlistLoading ? "opacity-50 cursor-not-allowed" : ""} ${isWishlisted ? "text-terra" : "text-charcoal/30 hover:text-terra"}`}
                >
                    <Heart size={16} strokeWidth={1.5} className={isWishlisted ? "fill-terra" : ""} />
                </button>

                {/* Interaction Layer - Improved for Perfect Visibility and Hiding */}
                <div className="absolute inset-x-0 bottom-0 p-6 z-20 translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-out flex justify-center">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItem(product);
                        }}
                        className="w-full bg-charcoal text-paper py-4 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-sage transition-all shadow-2xl active:scale-95"
                    >
                        <ShoppingBag size={14} className="text-white" />
                        <span className="text-white whitespace-nowrap">Add to Studio</span>
                    </button>
                </div>

                {/* Subtle Overlay on Hover */}
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-500" />
            </div>

            <div className="p-8 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase tracking-boutique text-sage font-bold">
                        {product.category?.name || "Artisan Piece"}
                    </span>
                    <div className="flex items-center space-x-1 opacity-40">
                        <Star size={10} className="text-charcoal fill-charcoal" />
                        <span className="text-[9px] font-bold text-charcoal">Hand-Finished</span>
                    </div>
                </div>

                <Link href={`/products/${product.id}`}>
                    <h3 className="font-serif text-xl text-charcoal hover:text-sage transition-colors line-clamp-2 leading-[1.1] tracking-tight">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-baseline space-x-3 pt-2 border-t border-charcoal/5">
                    <p className="text-charcoal/80 font-serif text-2xl">
                        ₹{finalPrice.toLocaleString("en-IN")}
                    </p>
                    {product.discount && (
                        <p className="text-charcoal/20 text-xs line-through font-light">
                            ₹{product.price.toLocaleString("en-IN")}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
