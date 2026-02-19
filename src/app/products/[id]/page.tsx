import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ChevronRight, Star, Truck, ShieldCheck, RefreshCcw, ShoppingBag, Search, Plus, Minus } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import ProductActions from "./ProductActions";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            category: {
                select: { name: true, slug: true }
            }
        }
    });

    if (!product) {
        notFound();
    }

    const relatedProducts = await prisma.product.findMany({
        where: {
            categoryId: product.categoryId,
            NOT: { id: product.id }
        },
        include: {
            category: {
                select: { name: true }
            }
        },
        take: 4
    });

    const finalPrice = product.price; // Discount logic can be added later if needed

    return (
        <div className="bg-ivory min-h-screen pt-44 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-charcoal/40 mb-12">
                    <Link href="/" className="hover:text-sage transition-colors">Home</Link>
                    <ChevronRight size={10} />
                    <Link href="/products" className="hover:text-sage transition-colors">Collection</Link>
                    <ChevronRight size={10} />
                    <span className="text-charcoal/80">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
                    {/* Image Gallery */}
                    <div className="space-y-6">
                        <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-pebble shadow-lg relative group">
                            <img
                                src={product.images[0] || "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop"}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img: string, i: number) => (
                                    <div key={i} className="aspect-square rounded-xl overflow-hidden bg-pebble cursor-pointer hover:ring-2 hover:ring-sage transition-all opacity-60 hover:opacity-100">
                                        <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details - Using a Client Component for interactivity */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <span className="text-[10px] uppercase tracking-widest text-sage font-bold px-3 py-1 bg-sage/5 rounded-full">
                                    {product.category.name}
                                </span>
                                <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < 4 ? "text-terra fill-terra" : "text-pebble fill-pebble"} />
                                    ))}
                                    <span className="ml-2 text-xs text-charcoal/40">(Verified Artisan Piece)</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-serif text-charcoal leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-3xl font-bold text-charcoal">₹{finalPrice.toLocaleString("en-IN")}</p>
                        </div>

                        <div className="space-y-6 text-earth-brown/80 leading-relaxed font-light">
                            <p>{product.description}</p>

                            {product.sizeChart && (
                                <div className="py-8 border-y border-pebble group/guide cursor-pointer">
                                    <details className="outline-none">
                                        <summary className="flex items-center justify-between font-serif text-lg text-charcoal cursor-pointer list-none">
                                            <span>Size Guide</span>
                                            <span className="text-sage group-hover/guide:translate-x-1 transition-transform">→</span>
                                        </summary>
                                        <div className="mt-6 overflow-hidden">
                                            <div className="bg-pebble/30 rounded-2xl border border-pebble overflow-x-auto">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="bg-pebble/50 border-b border-pebble">
                                                            {product.sizeChart.split('\n')[0].split('|').map((header: string, i: number) => (
                                                                <th key={i} className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-charcoal/60">
                                                                    {header.trim()}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-pebble">
                                                        {product.sizeChart.split('\n').slice(1).map((row: string, Ri: number) => (
                                                            <tr key={Ri} className="hover:bg-white/50 transition-colors">
                                                                {row.split('|').map((cell: string, Ci: number) => (
                                                                    <td key={Ci} className="px-6 py-4 text-[11px] text-charcoal/80 font-medium">
                                                                        {cell.trim()}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <div className="p-4 bg-white/30 text-[9px] uppercase tracking-widest text-charcoal/40 font-bold border-t border-pebble text-center">
                                                    * Measurements are in inches unless specified.
                                                </div>
                                            </div>
                                        </div>
                                    </details>
                                </div>
                            )}

                            {product.care && (
                                <div className="p-6 bg-pebble/30 rounded-2xl border border-pebble">
                                    <h4 className="font-serif text-lg mb-2 text-charcoal">Care Instructions</h4>
                                    <p className="text-xs italic">{product.care}</p>
                                </div>
                            )}
                        </div>

                        {/* Interactive Client Component for Qty and Add to Cart */}
                        <ProductActions product={product} />

                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-pebble">
                            <div className="flex items-center space-x-3">
                                <Truck size={20} className="text-sage" />
                                <span className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">Free Shipping</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <ShieldCheck size={20} className="text-sage" />
                                <span className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">Secure Checkout</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <RefreshCcw size={20} className="text-sage" />
                                <span className="text-[10px] uppercase tracking-widest font-bold text-charcoal/60">Artisan Quality</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="space-y-12">
                        <div className="flex justify-between items-end">
                            <div className="space-y-3">
                                <span className="text-terra font-bold tracking-[0.2em] uppercase text-xs">Curated Selection</span>
                                <h2 className="text-3xl font-serif text-charcoal">Related Pieces</h2>
                            </div>
                            <Link href="/products" className="text-xs uppercase tracking-widest font-bold text-sage underline underline-offset-8">View Collection</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((p: any) => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
