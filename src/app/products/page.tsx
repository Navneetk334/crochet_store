import { getProducts, getCategories } from "@/lib/data";
export const dynamic = "force-dynamic";
import ProductCard from "@/components/shop/ProductCard";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

export default async function ProductsPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string; category?: string }>;
}) {
    const { q, category } = await searchParams;
    const products = await getProducts({ search: q, categoryId: category });
    const categories = await getCategories();

    return (
        <div className="bg-ivory min-h-screen pt-44 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
                    <div className="space-y-4">
                        <span className="text-terra font-bold tracking-[0.3em] uppercase text-xs">Our Collection</span>
                        <h1 className="text-5xl md:text-6xl font-serif text-charcoal">
                            {q ? `Search: ${q}` : "The Shop"}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4 w-full md:w-auto">
                        <form action="/products" method="GET" className="relative flex-1 md:w-64">
                            <input
                                name="q"
                                type="text"
                                defaultValue={q}
                                placeholder="Search pieces..."
                                className="w-full bg-pebble px-5 py-3 rounded-xl border border-transparent focus:bg-white focus:border-sage outline-none text-sm transition-all shadow-inner"
                            />
                            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/20 hover:text-sage transition-colors">
                                <Search size={18} />
                            </button>
                        </form>
                        <button className="p-3 bg-pebble rounded-xl text-charcoal/60 hover:text-sage transition-all">
                            <SlidersHorizontal size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    <aside className="w-full lg:w-64 space-y-12">
                        <div>
                            <h4 className="font-serif text-xl border-b border-pebble pb-4 mb-6">Categories</h4>
                            <ul className="space-y-4">
                                <li>
                                    <Link
                                        href="/products"
                                        className={`flex items-center justify-between group cursor-pointer ${!category ? "text-sage underline underline-offset-8 decoration-2" : "text-charcoal/60 hover:text-sage transition-colors"}`}
                                    >
                                        <span className="text-sm font-bold">All Products</span>
                                        <span className={`text-[10px] font-bold ${!category ? "text-sage/40" : "text-charcoal/40"}`}>({products.length})</span>
                                    </Link>
                                </li>
                                {categories.map((cat: any) => (
                                    <li key={cat.id}>
                                        <Link
                                            href={`/products?category=${cat.id}`}
                                            className={`flex items-center justify-between group cursor-pointer transition-colors ${category === cat.id ? "text-sage underline underline-offset-8 decoration-2" : "text-charcoal/60 hover:text-sage"}`}
                                        >
                                            <span className="text-sm hover:translate-x-1 transition-transform">{cat.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-serif text-xl border-b border-pebble pb-4 mb-6">Sort By</h4>
                            <select className="w-full bg-pebble px-4 py-3 rounded-xl text-sm text-charcoal/60 outline-none border border-transparent focus:border-sage transition-all appearance-none cursor-pointer">
                                <option>Newest Arrivals</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Most Popular</option>
                            </select>
                        </div>
                    </aside>

                    <main className="flex-1">
                        {products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 space-y-6">
                                <div className="w-20 h-20 bg-pebble rounded-full flex items-center justify-center text-charcoal/20">
                                    <Search size={32} />
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="font-serif text-2xl text-charcoal">No pieces found</h3>
                                    <p className="text-earth-brown/60 text-sm font-light">Try adjusting your filters or checking back later for new arrivals.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map((product: any) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
