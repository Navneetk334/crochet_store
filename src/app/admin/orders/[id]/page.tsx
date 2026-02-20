import { prisma } from "@/lib/prisma";
import Image from "next/image";
import {
  ChevronLeft,
  Package,
  Truck,
  MapPin,
  CheckCircle,
  Printer,
  ExternalLink,
  ShieldCheck,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Cache page instead of forcing dynamic render
export const revalidate = 30;

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: { include: { product: true } },
      address: true,
      user: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-4">
          <Link
            href="/admin/orders"
            className="flex items-center text-[10px] uppercase tracking-widest font-bold text-charcoal/40 hover:text-sage transition-colors group"
          >
            <ChevronLeft
              size={14}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            Back to Orders
          </Link>

          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-serif text-charcoal italic">
              Order #{order.orderNumber.toUpperCase()}
            </h1>
            <span className="px-4 py-1.5 bg-sage text-ivory text-[10px] font-bold rounded-full uppercase tracking-widest">
              {order.status}
            </span>
          </div>

          <p className="text-xs text-earth-brown/40 uppercase tracking-widest font-bold">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString()} at{" "}
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-3 bg-white border border-pebble rounded-xl text-charcoal/40 hover:text-sage transition-colors">
            <Printer size={20} />
          </button>
          <button className="btn-primary py-4 px-8 rounded-2xl flex items-center space-x-3 text-sm tracking-widest uppercase group">
            <Truck size={18} />
            <span>Ship Order</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <section className="bg-white rounded-3xl border border-pebble shadow-sm overflow-hidden">
            <div className="p-8 border-b border-pebble bg-pebble/10 flex justify-between">
              <h3 className="font-serif text-xl text-charcoal">
                Artisanal Contents
              </h3>
              <span className="text-[10px] uppercase font-bold text-charcoal/40 tracking-widest">
                {order.items.length} Items
              </span>
            </div>

            <div className="divide-y divide-pebble p-8">
              {order.items.map((item: any) => {
                const optimizedImage =
                  item.product.images?.[0]?.replace(
                    "/upload/",
                    "/upload/f_auto,q_auto,w_400/"
                  ) || "";

                return (
                  <div
                    key={item.id}
                    className="py-6 flex items-center gap-8"
                  >
                    <div className="w-20 h-24 rounded-2xl overflow-hidden bg-pebble flex-shrink-0 relative">
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

                    <div className="flex-1 space-y-1">
                      <h4 className="font-serif text-lg text-charcoal">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-charcoal/40 uppercase tracking-widest font-bold">
                        {item.product.category?.name || "Handcrafted"}
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <p className="text-sm font-bold text-charcoal">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[10px] text-charcoal/30">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Timeline */}
          <section className="bg-white p-8 rounded-3xl border border-pebble shadow-sm space-y-8">
            <div className="flex items-center space-x-3 text-sage">
              <Clock size={20} />
              <h3 className="font-serif text-xl text-charcoal">
                Timeline
              </h3>
            </div>

            <div className="space-y-8 pl-4">
              {[
                {
                  label: "Payment Captured",
                  date: order.createdAt,
                  done: true,
                },
                {
                  label: "Order Confirmed",
                  date: order.createdAt,
                  done: true,
                },
                {
                  label: "Processing at Studio",
                  date: "Pending",
                  done: false,
                },
                {
                  label: "Handed over to Shiprocket",
                  date: "Awaiting fulfillment",
                  done: false,
                },
              ].map((step, i) => (
                <div key={i} className="flex items-center space-x-6">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      step.done
                        ? "bg-sage border-sage"
                        : "bg-white border-pebble"
                    } flex items-center justify-center`}
                  >
                    {step.done && (
                      <CheckCircle size={10} className="text-white" />
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-bold ${
                        step.done
                          ? "text-charcoal"
                          : "text-charcoal/30"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-[10px] text-earth-brown/40 uppercase tracking-widest">
                      {step.date.toString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT SIDE */}
        <aside className="space-y-8">
          <section className="bg-white p-8 rounded-3xl border border-pebble shadow-sm">
            <h3 className="font-serif text-lg text-charcoal border-b border-pebble pb-4">
              Customer Journey
            </h3>
            <div className="flex items-center space-x-4 mt-6">
              <div className="w-12 h-12 rounded-xl bg-pebble flex items-center justify-center text-charcoal/20">
                <Package size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-charcoal">
                  {order.user?.name || "Guest Patron"}
                </p>
                <p className="text-[10px] text-charcoal/40">
                  {order.user?.email || "No email provided"}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-pebble shadow-sm">
            <h3 className="font-serif text-lg text-charcoal border-b border-pebble pb-4">
              Shipping Sanctuary
            </h3>

            <div className="p-4 bg-pebble/30 rounded-2xl mt-6 flex gap-3">
              <MapPin size={16} className="text-terra mt-1" />
              <p className="text-sm text-charcoal/80 leading-relaxed">
                {order.address?.street}, <br />
                {order.address?.city}, {order.address?.state} -{" "}
                {order.address?.pincode}
              </p>
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-pebble shadow-sm">
            <h3 className="font-serif text-lg text-charcoal border-b border-pebble pb-4">
              Payment Vault
            </h3>

            <div className="space-y-4 mt-6">
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-charcoal/40">
                <span>Protocol</span>
                <div className="flex items-center space-x-2">
                  <ShieldCheck size={14} className="text-sage" />
                  <span>RAZORPAY SECURE</span>
                </div>
              </div>

              <div className="flex justify-between text-[10px] font-mono text-charcoal/60">
                <span>Transaction ID</span>
                <span>{order.razorpayId || "N/A"}</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}