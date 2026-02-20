"use client";

import { useState, memo } from "react";
import Image from "next/image";
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

function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const finalPrice = product.discount
    ? product.price - product.discount
    : product.price;

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlistLoading) return;

    setIsWishlistLoading(true);
    const previous = isWishlisted;
    setIsWishlisted(!previous);

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setIsWishlisted(data.active);
    } catch {
      setIsWishlisted(previous);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <div className="group bg-paper rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <Link
          href={`/products/${product.id}`}
          className="block h-full w-full relative"
        >
          <Image
            src={
              product.images[0]
                ? product.images[0].replace(
                    "/upload/",
                    "/upload/f_auto,q_auto,w_600/"
                  )
                : "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600"
            }
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {product.discount && (
          <div className="absolute top-4 left-4 bg-charcoal text-paper text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
            Selection
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={toggleWishlist}
          disabled={isWishlistLoading}
          className={`absolute top-4 right-4 p-2 bg-white rounded-full transition-colors shadow-sm ${
            isWishlisted ? "text-terra" : "text-charcoal/40 hover:text-terra"
          }`}
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            className={isWishlisted ? "fill-terra" : ""}
          />
        </button>

        {/* Add to Cart */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product);
            }}
            className="w-full bg-charcoal text-paper py-3 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-sage transition-colors"
          >
            <ShoppingBag size={14} />
            <span>Add to Studio</span>
          </button>
        </div>

        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[9px] uppercase tracking-widest text-sage font-bold">
            {product.category?.name || "Artisan Piece"}
          </span>

          <div className="flex items-center space-x-1 opacity-40">
            <Star size={10} className="fill-charcoal" />
            <span className="text-[9px] font-bold">Hand-Finished</span>
          </div>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="font-serif text-lg text-charcoal hover:text-sage transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline space-x-3 pt-2 border-t border-charcoal/5">
          <p className="font-serif text-xl">
            ₹{finalPrice.toLocaleString("en-IN")}
          </p>

          {product.discount && (
            <p className="text-charcoal/30 text-xs line-through">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);