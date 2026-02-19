"use client";

import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id");

    return (
        <div className="max-w-xl w-full bg-white p-12 rounded-3xl shadow-2xl border border-pebble text-center space-y-10">
            <div className="flex justify-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                    className="w-24 h-24 bg-sage rounded-full flex items-center justify-center text-ivory shadow-xl"
                >
                    <CheckCircle size={48} />
                </motion.div>
            </div>

            <div className="space-y-4">
                <h1 className="text-4xl font-serif text-charcoal">Order Confirmed!</h1>
                <p className="text-earth-brown/60 text-sm font-light leading-relaxed">
                    Thank you for choosing Caught Craft Handed. Your artisanal pieces are being prepared with love and care.
                </p>
            </div>

            <div className="p-8 bg-pebble/30 rounded-2xl space-y-3">
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-charcoal/40">
                    <span>Order Reference</span>
                    <span className="text-charcoal">#{orderId?.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-charcoal/40">
                    <span>Status</span>
                    <span className="text-sage">Processing</span>
                </div>
            </div>

            <div className="space-y-4 pt-6">
                <Link
                    href="/dashboard"
                    className="w-full btn-primary py-4 flex items-center justify-center space-x-3 text-sm tracking-widest uppercase shadow-xl group"
                >
                    <span>Track Order</span>
                    <Package size={18} />
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                    href="/products"
                    className="w-full text-center text-[10px] uppercase tracking-widest font-bold text-sage py-2 hover:opacity-70 transition-opacity"
                >
                    Continue Shopping
                </Link>
            </div>

            <p className="text-[10px] text-earth-brown/40 uppercase tracking-[0.2em] pt-6 border-t border-pebble">
                A confirmation email has been sent to your inbox.
            </p>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <div className="bg-ivory min-h-screen flex items-center justify-center py-32 px-6">
            <Suspense fallback={<div className="text-sage animate-pulse font-serif">Confirming your craft...</div>}>
                <ConfirmationContent />
            </Suspense>
        </div>
    );
}
