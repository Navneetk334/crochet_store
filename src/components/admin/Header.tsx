"use client";

import { Bell, Search, User } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AdminHeader() {
    const { data: session } = useSession();

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-pebble flex items-center justify-between px-8 sticky top-8 z-40">
            <div className="flex items-center space-x-8 flex-1">
                <h2 className="text-xl font-serif text-charcoal hidden md:block">Overview</h2>
                <div className="relative max-w-md w-full">
                    <input
                        type="text"
                        placeholder="Search orders, products, customers..."
                        className="w-full bg-pebble px-5 py-2.5 rounded-xl border border-transparent focus:bg-white focus:border-sage outline-none text-sm transition-all"
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={16} />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <button
                    onClick={() => alert("Notifications coming soon!")}
                    className="relative p-2.5 text-charcoal/40 hover:text-sage hover:bg-pebble rounded-full transition-all group"
                >
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-terra rounded-full border-2 border-white group-hover:scale-125 transition-transform" />
                </button>

                <Link
                    href="/admin/settings"
                    className="flex items-center space-x-3 border-l border-pebble pl-6 cursor-pointer group"
                >
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-charcoal tracking-tight group-hover:text-sage transition-colors">
                            {session?.user?.name || "Admin Craft"}
                        </p>
                        <p className="text-[10px] uppercase tracking-widest text-earth-brown/40">
                            {session?.user?.role === "ADMIN" ? "Super Admin" : "Curator"}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-pebble flex items-center justify-center text-charcoal/20 group-hover:bg-sage group-hover:text-ivory transition-all shadow-sm overflow-hidden">
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <User size={20} />
                        )}
                    </div>
                </Link>
            </div>
        </header>
    );
}
