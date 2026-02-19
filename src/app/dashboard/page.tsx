import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, Heart, User, MapPin, ChevronRight, ShoppingBag } from "lucide-react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import ProfileForm from "@/components/shop/ProfileForm";
import ProductCard from "@/components/shop/ProductCard";

export default async function DashboardPage({
    searchParams
}: {
    searchParams: Promise<{ tab?: string }>;
}) {
    const { tab = "orders" } = await searchParams;
    const session = await auth();

    if (!session?.user) {
        // redirect("/login"); // For now, let's allow viewing a skeleton for demo
    }

    const userId = session?.user?.id || "anonymous";

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            wishlist: {
                include: {
                    items: {
                        include: {
                            product: {
                                include: {
                                    category: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    const userOrders = await prisma.order.findMany({
        where: { userId },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" }
    });

    async function updateProfile(formData: FormData) {
        "use server";
        const session = await auth();
        if (!session?.user?.id) return;

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const image = formData.get("image") as string;

        await prisma.user.update({
            where: { id: session.user.id },
            data: { name, email, phone, image }
        });

        revalidatePath("/dashboard");
    }

    const navItems = [
        { label: "Orders", id: "orders", icon: Package },
        { label: "Wishlist", id: "wishlist", icon: Heart },
        { label: "Addresses", id: "addresses", icon: MapPin },
        { label: "Profile", id: "profile", icon: User },
    ];

    return (
        <div className="bg-ivory min-h-screen pt-44 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
                    <div className="space-y-4">
                        <span className="text-terra font-bold tracking-[0.3em] uppercase text-xs">Customer Space</span>
                        <h1 className="text-5xl md:text-6xl font-serif text-charcoal">Your Haven</h1>
                    </div>
                    <p className="text-earth-brown/60 text-sm font-light italic max-w-xs text-right hidden md:block">
                        "Every stitch in your collection tells a story of patience and artistry."
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar Navigation */}
                    <aside className="lg:col-span-3 space-y-2">
                        {navItems.map((nav) => (
                            <Link
                                key={nav.id}
                                href={`/dashboard?tab=${nav.id}`}
                                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${tab === nav.id
                                    ? "bg-sage text-ivory shadow-lg"
                                    : "bg-white text-charcoal/60 hover:bg-pebble border border-pebble"
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <nav.icon size={18} />
                                    <span className="text-sm font-bold tracking-widest uppercase">{nav.label}</span>
                                </div>
                                {tab === nav.id && <ChevronRight size={14} />}
                            </Link>
                        ))}
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-9 space-y-10">
                        {tab === "orders" && (
                            <section className="space-y-6">
                                <h3 className="font-serif text-3xl text-charcoal">Recent Collections</h3>
                                {userOrders.length === 0 ? (
                                    <div className="bg-white rounded-3xl p-16 border border-pebble border-dashed text-center space-y-6">
                                        <div className="w-20 h-20 bg-pebble rounded-full mx-auto flex items-center justify-center text-charcoal/20">
                                            <ShoppingBag size={32} />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="font-serif text-xl">No orders yet</p>
                                            <p className="text-xs text-earth-brown/60 uppercase tracking-widest">Your artisanal journey starts here</p>
                                        </div>
                                        <Link href="/products" className="btn-secondary inline-flex">
                                            Explore Collection
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {userOrders.map((order: any) => (
                                            <div key={order.id} className="bg-white rounded-3xl p-8 border border-pebble shadow-sm hover:shadow-md transition-all space-y-8">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-pebble pb-6">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] uppercase tracking-widest font-bold text-earth-brown/40">Order Number</p>
                                                        <p className="text-sm font-bold text-charcoal">#{order.orderNumber.toUpperCase()}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] uppercase tracking-widest font-bold text-earth-brown/40">Date</p>
                                                        <p className="text-sm text-charcoal">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] uppercase tracking-widest font-bold text-earth-brown/40">Total</p>
                                                        <p className="text-sm font-bold text-charcoal">₹{order.totalAmount.toLocaleString("en-IN")}</p>
                                                    </div>
                                                    <div className="px-4 py-1.5 bg-sage/10 text-sage text-[10px] font-bold rounded-full uppercase tracking-widest">
                                                        {order.status}
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    {order.items.map((item: any) => (
                                                        <div key={item.id} className="flex gap-6 items-center">
                                                            <div className="w-16 h-20 rounded-xl overflow-hidden bg-pebble">
                                                                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="flex-1 space-y-1">
                                                                <h4 className="font-serif text-lg text-charcoal">{item.product.name}</h4>
                                                                <p className="text-xs text-earth-brown/60">Qty: {item.quantity}</p>
                                                            </div>
                                                            <Link href={`/products/${item.product.id}`} className="text-[10px] uppercase tracking-widest font-bold text-sage underline underline-offset-4">
                                                                Review Item
                                                            </Link>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="pt-6 border-t border-pebble flex justify-end">
                                                    <button className="text-xs uppercase tracking-widest font-bold text-charcoal hover:text-sage transition-colors flex items-center gap-2">
                                                        <Package size={14} />
                                                        Track with Shiprocket
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {tab === "wishlist" && (
                            <section className="space-y-6">
                                <h3 className="font-serif text-3xl text-charcoal">Your Heart's Desires</h3>
                                {(!user?.wishlist?.items || user.wishlist.items.length === 0) ? (
                                    <div className="bg-white rounded-[3rem] p-16 border border-pebble text-center space-y-6">
                                        <div className="w-20 h-20 bg-pebble rounded-full mx-auto flex items-center justify-center text-charcoal/20">
                                            <Heart size={32} />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="font-serif text-xl">Empty for now</p>
                                            <p className="text-xs text-earth-brown/60 uppercase tracking-widest">Save pieces you love to see them here</p>
                                        </div>
                                        <Link href="/products" className="btn-primary inline-flex">
                                            Discover Artistry
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {user.wishlist.items.map((item: any) => (
                                            <ProductCard key={item.id} product={item.product} />
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {tab === "addresses" && (
                            <section className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-serif text-3xl text-charcoal">Shipping Sanctuaries</h3>
                                    <button className="text-[10px] uppercase tracking-widest font-bold text-sage hover:text-charcoal transition-colors">
                                        + Add New Address
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-3xl p-8 border-2 border-sage shadow-sm space-y-4">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-sage bg-sage/10 px-3 py-1 rounded-full">Primary Haven</span>
                                            <MapPin size={18} className="text-sage" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-charcoal">Home</p>
                                            <p className="text-xs text-earth-brown/60 leading-relaxed">
                                                123 Artisanal Street, Studio 4B<br />
                                                Craftsville, Rajasthan 302001<br />
                                                India
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-pebble/20 rounded-3xl p-8 border border-pebble border-dashed flex items-center justify-center group cursor-pointer hover:bg-white hover:border-sage transition-all">
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 group-hover:text-sage transition-colors">Add an Alternative Haven</p>
                                    </div>
                                </div>
                            </section>
                        )}

                        {tab === "profile" && (
                            <section className="space-y-6">
                                <h3 className="font-serif text-3xl text-charcoal">Your Artisan Profile</h3>
                                <ProfileForm
                                    user={user}
                                    sessionUser={session?.user}
                                    updateAction={updateProfile}
                                />
                            </section>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
