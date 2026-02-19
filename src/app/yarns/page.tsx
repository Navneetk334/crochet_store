import { getProducts } from "@/lib/data";
import ProductCard from "@/components/shop/ProductCard";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function YarnsPage() {
    // Filter for the 'Yarns' category
    const allProducts = await getProducts();
    const yarns = allProducts.filter((p: any) => p.category.name === "Yarns");

    return (
        <div className="bg-ivory min-h-screen pt-44 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="space-y-4 mb-16 text-center">
                    <span className="text-terra font-bold tracking-[0.3em] uppercase text-xs">Premium Textures</span>
                    <h1 className="text-5xl md:text-7xl font-serif text-charcoal">Artisanal Yarns</h1>
                    <p className="text-charcoal/60 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                        Pure cotton, organic blends, and hand-dyed fibers for your own masterpieces.
                    </p>
                </div>

                {yarns.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-6">
                        <div className="w-20 h-20 bg-pebble rounded-full flex items-center justify-center text-charcoal/20">
                            <Search size={32} />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="font-serif text-2xl text-charcoal">New textures coming soon</h3>
                            <p className="text-earth-brown/60 text-sm font-light">We're currently resting our spindles. Check back in a few days!</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {yarns.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
