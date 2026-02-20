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
    category?: { name: string };
  };
}

function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const finalPrice =
    product.discount && product.discount > 0
      ? product.price - product.discount
      : product.price;

  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!res.ok) return;

      const data = await res.json();
      setIsWishlisted(data.active);
    } catch {}
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-pebble shadow-sm hover:shadow-md transition-shadow duration-300">
      
      {/* Image */}
      <Link href={`/products/${product.id}`} className="block relative aspect-[4/5]">
        <Image
          src={
            product.images?.[0]
              ? product.images[0]
              : "/placeholder.png"
          }
          alt={product.name}
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Wishlist */}
        <button
          onClick={toggleWishlist}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow z-10"
        >
          <Heart
            size={16}
            className={isWishlisted ? "fill-red-500 text-red-500" : ""}
          />
        </button>
      </Link>

      {/* Content */}
      <div className="p-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase text-sage font-bold">
            {product.category?.name || "Artisan Piece"}
          </span>
          <div className="flex items-center space-x-1 text-charcoal/50 text-xs">
            <Star size={12} />
            <span>Hand-Finished</span>
          </div>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="font-serif text-lg hover:text-sage transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between pt-3 border-t border-pebble">
          <p className="font-serif text-lg">
            ₹{finalPrice.toLocaleString("en-IN")}
          </p>

          <button
            onClick={() => addItem(product)}
            className="bg-charcoal text-white px-4 py-2 text-xs uppercase tracking-widest rounded-full hover:bg-sage transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);