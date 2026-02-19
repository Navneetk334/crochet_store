"use client";

import { useState, useEffect } from "react";
import { Plus, Minus, ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/store/useCart";

export default function ProductActions({ product }: { product: any }) {
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCart();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkWishlist = async () => {
            try {
                const res = await fetch("/api/wishlist");
                const data = await res.json();
                if (data.items && data.items.includes(product.id)) {
                    setIsWishlisted(true);
                }
            } catch (error) {
                console.error(error);
            }
        };
        checkWishlist();
    }, [product.id]);

    const toggleWishlist = async () => {
        if (isLoading) return;
        setIsLoading(true);
        const prev = isWishlisted;
        setIsWishlisted(!prev);

        try {
            const res = await fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id }),
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setIsWishlisted(data.active);
        } catch (error) {
            setIsWishlisted(prev);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <div className="flex items-center border border-pebble rounded-xl bg-ivory overflow-hidden">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-5 py-3 hover:bg-pebble transition-colors text-charcoal font-bold"
                    >
                        <Minus size={16} />
                    </button>
                    <span className="px-5 py-3 text-sm font-bold border-x border-pebble w-12 text-center">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-5 py-3 hover:bg-pebble transition-colors text-charcoal font-bold"
                    >
                        <Plus size={16} />
                    </button>
                </div>
                <button
                    onClick={() => addItem({ ...product, quantity })}
                    className="flex-1 btn-primary py-4 flex items-center justify-center space-x-3 text-sm tracking-widest uppercase"
                >
                    <ShoppingBag size={18} />
                    <span>Add to Bag</span>
                </button>
            </div>
            <button
                onClick={toggleWishlist}
                disabled={isLoading}
                className={`w-full border py-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center space-x-2 ${isWishlisted
                        ? "bg-terra border-terra text-white"
                        : "border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory"
                    }`}
            >
                <Heart size={14} className={isWishlisted ? "fill-white" : ""} />
                <span>{isWishlisted ? "In Wishlist" : "Add to Wishlist"}</span>
            </button>
        </div>
    );
}
