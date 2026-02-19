import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { revalidatePath } from "next/cache";
import OrderCatalog from "@/components/admin/OrderCatalog";

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        include: { items: { include: { product: true } }, user: true },
        orderBy: { createdAt: "desc" },
    });

    const pendingCount = await prisma.order.count({
        where: { status: "PROCESSING" }
    });

    async function seedDemoOrders() {
        "use server";

        // 1. Get some products
        const products = await prisma.product.findMany({ take: 5 });
        if (products.length === 0) throw new Error("No products found to create demo orders.");

        // 2. Ensure we have a user
        let user = await prisma.user.findFirst({ where: { role: "CUSTOMER" } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: "Demo Customer",
                    email: `demo-${Date.now()}@example.com`,
                    role: "CUSTOMER"
                }
            });
        }

        // 3. Create a random address if none exists
        let address = await prisma.address.findFirst();
        if (!address) {
            address = await prisma.address.create({
                data: {
                    street: "123 Artisan Lane",
                    city: "Craftsville",
                    state: "Himachal Pradesh",
                    pincode: "171001",
                    country: "India"
                }
            });
        }

        const statuses = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

        // 4. Create a few orders
        for (let i = 0; i < 5; i++) {
            const status = statuses[i % statuses.length];
            const orderNumber = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

            await prisma.order.create({
                data: {
                    orderNumber,
                    status,
                    paymentStatus: status === "CANCELLED" ? "failed" : "paid",
                    paymentMethod: "Razorpay",
                    totalAmount: products[0].price * (i + 1),
                    userId: user.id,
                    addressId: address.id,
                    items: {
                        create: [
                            {
                                productId: products[i % products.length].id,
                                quantity: 1,
                                price: products[i % products.length].price
                            }
                        ]
                    }
                }
            });
        }

        revalidatePath("/admin/orders");
        revalidatePath("/admin");
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.3em] font-bold text-sage">Operations Hub</p>
                    <h1 className="text-4xl font-serif text-charcoal">Fulfillment</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="px-6 py-3 bg-white border border-pebble rounded-xl text-xs font-bold uppercase tracking-widest text-charcoal/60 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-terra animate-pulse" />
                        <span>{pendingCount} Pending Orders</span>
                    </div>
                </div>
            </div>

            <OrderCatalog orders={orders} onSeedDemo={seedDemoOrders} />
        </div>
    );
}
