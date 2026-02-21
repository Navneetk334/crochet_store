import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import OrderUpdateForm from "@/components/admin/OrderUpdateForm";
import {
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 30;

/* ---------- TYPE SAFE ORDER TYPE ---------- */
type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: {
          include: {
            category: true;
          };
        };
      };
    };
    address: true;
    user: true;
  };
}>;

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order: OrderWithRelations | null =
    await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
        address: true,
        user: true,
      },
    });

  if (!order) notFound();

  async function updateOrderStatus(formData: FormData) {
    "use server";
    const status = formData.get("status") as string;
    await prisma.order.update({
      where: { id },
      data: { status }
    });
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/admin/orders");
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Link
          href="/admin/orders"
          className="flex items-center text-xs font-bold text-charcoal/50 hover:text-sage"
        >
          <ChevronLeft size={16} className="mr-2" />
          Back to Orders
        </Link>

        <h1 className="text-3xl font-serif">
          Order #{order.orderNumber?.toUpperCase()}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Items Section */}
          <section className="bg-white rounded-2xl border p-8 space-y-6">
            <h2 className="font-serif text-xl">Order Items</h2>

            {order.items.map((item) => {
              const optimizedImage =
                item.product.images?.[0]?.replace(
                  "/upload/",
                  "/upload/f_auto,q_auto,w_400/"
                ) || "";

              return (
                <div key={item.id} className="flex items-center gap-6">
                  <div className="w-20 h-24 relative rounded-lg overflow-hidden bg-pebble">
                    {optimizedImage && (
                      <Image
                        src={optimizedImage}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-serif text-lg">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-charcoal/40">
                      {item.product.category?.name || "Handcrafted"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-charcoal/40">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Shipping */}
          <section className="bg-white p-8 rounded-2xl border">
            <h3 className="font-serif text-lg mb-4">Shipping Address</h3>
            <p>
              {order.address?.street}, {order.address?.city},{" "}
              {order.address?.state} - {order.address?.pincode}
            </p>
          </section>
        </div>

        <div className="space-y-10">
          {/* Status Manager */}
          <OrderUpdateForm
            orderId={id}
            currentStatus={order.status}
            updateStatusAction={updateOrderStatus}
          />

          {/* Customer */}
          <section className="bg-white p-8 rounded-2xl border space-y-4">
            <h3 className="font-serif text-lg">Customer</h3>
            <div className="space-y-1">
              <p className="font-medium text-charcoal">{order.user?.name || "Guest"}</p>
              <p className="text-sm text-charcoal/50">
                {order.user?.email}
              </p>
            </div>
          </section>

          {/* Total */}
          <section className="bg-white p-8 rounded-2xl border">
            <h3 className="font-serif text-lg mb-4">Financial Summary</h3>
            <div className="flex justify-between items-end border-t border-pebble pt-4 mt-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Grand Total</span>
              <p className="text-2xl font-bold text-charcoal">
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
