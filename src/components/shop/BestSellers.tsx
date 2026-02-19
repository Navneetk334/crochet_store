"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";

interface BestSellersProps {
    products: any[];
}

export default function BestSellers({ products }: BestSellersProps) {
    return (
        <section className="py-24 bg-ivory">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 space-y-2">
                    <p className="font-script text-3xl text-sage lowercase">exclusive selection</p>
                    <h2 className="text-4xl md:text-5xl font-serif text-charcoal">Best Sellers</h2>
                    <div className="w-16 h-1 bg-terra/20 mx-auto mt-4" />
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-12 text-charcoal/40">
                        No products available at the moment.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                <div className="mt-16 text-center">
                    <Link
                        href="/products"
                        className="btn-secondary inline-flex"
                    >
                        View All Best Sellers
                    </Link>
                </div>
            </div>
        </section>
    );
}
