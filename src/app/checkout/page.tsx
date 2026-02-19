"use client";

import { useCart } from "@/store/useCart";
import { motion } from "framer-motion";
import { ChevronLeft, CreditCard, MapPin, Truck, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { items, getTotal, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const total = getTotal();

    const [formData, setFormData] = useState({
        email: "",
        name: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
    });

    useEffect(() => {
        if (items.length === 0 && !loading) {
            router.push("/products");
        }
    }, [items, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create order on server
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: total, items, customerDetails: formData }),
            });
            const order = await res.json();

            if (!order.id) throw new Error("Order creation failed");

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: "INR",
                name: "Caught Craft Handed",
                description: "Premium Handcrafted Crochet",
                order_id: order.id,
                handler: async function (response: any) {
                    const verifyRes = await fetch("/api/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderData: { ...formData, items, total },
                        }),
                    });

                    const verification = await verifyRes.json();
                    if (verification.success) {
                        clearCart();
                        router.push(`/order-confirmation?id=${verification.orderId}`);
                    } else {
                        alert("Payment verification failed");
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: "#7D8F69", // Sage color
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            alert("Something went wrong with the checkout process.");
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) return null;

    return (
        <div className="bg-ivory min-h-screen pt-44 pb-24">
            {/* Script for Razorpay */}
            <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>

            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-12">
                    <Link href="/products" className="inline-flex items-center text-[10px] uppercase tracking-widest text-charcoal/40 hover:text-sage transition-colors group">
                        <ChevronLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Collection
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-serif text-charcoal mt-6">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Shipping Form */}
                    <div className="lg:col-span-7 space-y-12">
                        <form id="checkout-form" onSubmit={handleCheckout} className="space-y-10">
                            <section className="space-y-6">
                                <div className="flex items-center space-x-3 text-sage">
                                    <MapPin size={20} />
                                    <h3 className="font-serif text-2xl text-charcoal">Shipping Address</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs uppercase tracking-widest font-bold text-charcoal/60 ml-1">Full Name</label>
                                        <input required name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="Navneet Singh" className="w-full px-5 py-4 bg-pebble/30 border border-transparent rounded-xl focus:bg-white focus:border-sage outline-none text-sm transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs uppercase tracking-widest font-bold text-charcoal/60 ml-1">Email</label>
                                        <input required name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="navneet@example.com" className="w-full px-5 py-4 bg-pebble/30 border border-transparent rounded-xl focus:bg-white focus:border-sage outline-none text-sm transition-all" />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-xs uppercase tracking-widest font-bold text-charcoal/60 ml-1">Street Address</label>
                                        <input required name="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="Flat No, Building, Street" className="w-full px-5 py-4 bg-pebble/30 border border-transparent rounded-xl focus:bg-white focus:border-sage outline-none text-sm transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs uppercase tracking-widest font-bold text-charcoal/60 ml-1">City</label>
                                        <input required name="city" value={formData.city} onChange={handleInputChange} type="text" placeholder="Bangalore" className="w-full px-5 py-4 bg-pebble/30 border border-transparent rounded-xl focus:bg-white focus:border-sage outline-none text-sm transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs uppercase tracking-widest font-bold text-charcoal/60 ml-1">State</label>
                                        <input required name="state" value={formData.state} onChange={handleInputChange} type="text" placeholder="Karnataka" className="w-full px-5 py-4 bg-pebble/30 border border-transparent rounded-xl focus:bg-white focus:border-sage outline-none text-sm transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs uppercase tracking-widest font-bold text-charcoal/60 ml-1">Pincode</label>
                                        <input required name="pincode" value={formData.pincode} onChange={handleInputChange} type="text" placeholder="560001" className="w-full px-5 py-4 bg-pebble/30 border border-transparent rounded-xl focus:bg-white focus:border-sage outline-none text-sm transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs uppercase tracking-widest font-bold text-charcoal/60 ml-1">Phone</label>
                                        <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="+91 98765 43210" className="w-full px-5 py-4 bg-pebble/30 border border-transparent rounded-xl focus:bg-white focus:border-sage outline-none text-sm transition-all" />
                                    </div>
                                </div>
                            </section>

                            <div className="p-8 bg-sage/5 rounded-3xl border border-sage/10 flex items-start gap-5">
                                <ShieldCheck className="text-sage flex-shrink-0" size={24} />
                                <div className="space-y-1">
                                    <p className="font-serif text-lg text-charcoal">Secure Artisan Checkout</p>
                                    <p className="text-xs text-earth-brown/60 leading-relaxed">
                                        Your payment information is encrypted and processed securely through Razorpay. We do not store your card details.
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-3xl shadow-xl border border-pebble p-10 sticky top-32 space-y-10">
                            <h3 className="font-serif text-2xl text-charcoal border-b border-pebble pb-6">Order Summary</h3>

                            <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-pebble">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-pebble">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h4 className="text-sm font-serif text-charcoal leading-tight">{item.name}</h4>
                                            <p className="text-[10px] text-charcoal/40">Qty: {item.quantity}</p>
                                            <p className="text-xs font-bold text-charcoal">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-pebble">
                                <div className="flex justify-between text-sm text-charcoal/60">
                                    <span>Subtotal</span>
                                    <span>₹{total.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-sm text-charcoal/60">
                                    <span>Shipping</span>
                                    <span className="text-sage font-bold uppercase tracking-widest text-[10px]">Free</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-charcoal pt-4">
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString("en-IN")}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={loading}
                                className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center space-x-3 text-sm tracking-[0.2em] uppercase shadow-2xl group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-ivory border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Pay Now</span>
                                        <CreditCard size={18} />
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <p className="text-[10px] text-center text-earth-brown/40 uppercase tracking-[0.2em]">
                                Fast shipping via Shiprocket
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
