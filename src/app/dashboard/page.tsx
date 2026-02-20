import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Heart,
  User,
  MapPin,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { revalidatePath } from "next/cache";
import ProfileForm from "@/components/shop/ProfileForm";
import ProductCard from "@/components/shop/ProductCard";

export const revalidate = 60;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const tab = searchParams?.tab || "orders";
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      wishlist: {
        include: {
          items: {
            include: {
              product: { include: { category: true } },
            },
          },
        },
      },
    },
  });

  const userOrders = await prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
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
      data: { name, email, phone, image },
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
          <div>
            <span className="text-terra font-bold tracking-[0.3em] uppercase text-xs">
              Customer Space
            </span>
            <h1 className="text-5xl md:text-6xl font-serif text-charcoal">
              Your Haven
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-2">
            {navItems.map((nav) => (
              <Link
                key={nav.id}
                href={`/dashboard?tab=${nav.id}`}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                  tab === nav.id
                    ? "bg-sage text-ivory"
                    : "bg-white text-charcoal/60 hover:bg-pebble border border-pebble"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <nav.icon size={18} />
                  <span className="text-sm font-bold tracking-widest uppercase">
                    {nav.label}
                  </span>
                </div>
                {tab === nav.id && <ChevronRight size={14} />}
              </Link>
            ))}
          </aside>

          {/* Main */}
          <main className="lg:col-span-9 space-y-10">
            {tab === "orders" && (
              <section className="space-y-6">
                <h3 className="font-serif text-3xl text-charcoal">
                  Recent Collections
                </h3>

                {userOrders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-16 border border-pebble text-center">
                    <ShoppingBag
                      size={32}
                      className="mx-auto text-charcoal/20"
                    />
                    <p className="mt-4 font-serif text-xl">
                      No orders yet
                    </p>
                  </div>
                ) : (
                  userOrders.map((order: any) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-8 border border-pebble space-y-8"
                    >
                      <div className="flex justify-between border-b border-pebble pb-6">
                        <p className="text-sm font-bold text-charcoal">
                          #{order.orderNumber.toUpperCase()}
                        </p>
                        <p className="text-sm font-bold text-charcoal">
                          ₹{order.totalAmount.toLocaleString("en-IN")}
                        </p>
                      </div>

                      {order.items.map((item: any) => {
                        const optimizedImage =
                          item.product.images?.[0]?.replace(
                            "/upload/",
                            "/upload/f_auto,q_auto,w_300/"
                          ) || "";

                        return (
                          <div
                            key={item.id}
                            className="flex gap-6 items-center"
                          >
                            <div className="w-16 h-20 relative rounded-xl overflow-hidden bg-pebble">
                              {optimizedImage && (
                                <Image
                                  src={optimizedImage}
                                  alt={item.product.name}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                />
                              )}
                            </div>

                            <div className="flex-1">
                              <h4 className="font-serif text-lg text-charcoal">
                                {item.product.name}
                              </h4>
                              <p className="text-xs text-earth-brown/60">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}
              </section>
            )}

            {tab === "wishlist" && (
              <section className="space-y-6">
                <h3 className="font-serif text-3xl text-charcoal">
                  Your Heart's Desires
                </h3>

                {!user?.wishlist?.items?.length ? (
                  <div className="bg-white rounded-3xl p-16 border border-pebble text-center">
                    Empty for now
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {user.wishlist.items.map((item: any) => (
                      <ProductCard
                        key={item.id}
                        product={item.product}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {tab === "profile" && (
              <ProfileForm
                user={user}
                sessionUser={session?.user}
                updateAction={updateProfile}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}