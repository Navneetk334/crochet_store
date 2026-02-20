import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Image from "next/image";
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
  params: { id: string };
}) {
  const { id } = params;

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

      {/* Customer */}
      <section className="bg-white p-8 rounded-2xl border space-y-4">
        <h3 className="font-serif text-lg">Customer</h3>
        <p>{order.user?.name || "Guest"}</p>
        <p className="text-sm text-charcoal/50">
          {order.user?.email}
        </p>
      </section>

      {/* Shipping */}
      <section className="bg-white p-8 rounded-2xl border">
        <h3 className="font-serif text-lg mb-4">Shipping Address</h3>
        <p>
          {order.address?.street}, {order.address?.city},{" "}
          {order.address?.state} - {order.address?.pincode}
        </p>
      </section>

      {/* Total */}
      <section className="bg-white p-8 rounded-2xl border">
        <h3 className="font-serif text-lg mb-4">Total</h3>
        <p className="text-2xl font-bold">
          ₹{order.totalAmount.toLocaleString("en-IN")}
        </p>
      </section>
    </div>
  );
}