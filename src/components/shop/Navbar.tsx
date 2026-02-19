"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, User, Search, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CartDrawer from "./CartDrawer";
import { useCart } from "@/store/useCart";
import { useSession, signOut } from "next-auth/react";
import DemoBanner from "../DemoBanner";

export default function Navbar() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { items } = useCart();
    const menuRef = useRef<HTMLDivElement>(null);
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchFocused(false);
        }
    };

    const leftLinks = [
        { name: "Yarns", href: "/yarns" },
        { name: "Collections", href: "/products" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
    };

    return (
        <header className="w-full fixed top-0 z-50 transition-all duration-500">
            <DemoBanner />
            {/* Top Bar for Messaging */}
            <div className="bg-sage py-2 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white flex items-center justify-center space-x-2">
                    <span>✨ Hand-stitched in India</span>
                    <span className="opacity-40">•</span>
                    <span>Shipping Worldwide</span>
                    <span className="opacity-40">•</span>
                    <span>Free Shipping on Orders above ₹2,999</span>
                </p>
            </div>

            {/* Main Navigation Tier */}
            <nav className={`transition-all duration-700 ${isScrolled ? "glass-nav py-3" : "bg-white py-6"}`}>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 items-center">

                    {/* Left: Nav Links (4 items) */}
                    <div className="hidden lg:flex items-center space-x-8 justify-start">
                        {leftLinks.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-[11px] uppercase tracking-widest font-bold text-charcoal/60 hover:text-sage transition-all duration-300 relative group"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sage transition-all duration-500 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Center: Brand Identity */}
                    <Link href="/" className="flex flex-col items-center group">
                        <span className="font-serif text-3xl md:text-4xl text-charcoal tracking-tighter transition-transform duration-500 group-hover:scale-105">
                            CAUGHT CRAFT
                        </span>
                        <div className="flex items-center space-x-2 -mt-2">
                            <span className="h-px w-4 bg-sage/40" />
                            <span className="font-script text-xl text-sage lowercase opacity-80">Handed</span>
                            <span className="h-px w-4 bg-sage/40" />
                        </div>
                    </Link>

                    {/* Right: Balanced Actions (Search Bar + 3 Icons = 4 items weight) */}
                    <div className="flex items-center space-x-5 justify-end">
                        {/* Search Bar */}
                        <div className={`relative hidden sm:flex items-center transition-all duration-500 ${isSearchFocused ? "w-64" : "w-48"}`}>
                            <input
                                type="text"
                                placeholder="Search the studio..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className="w-full bg-pebble px-4 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-charcoal outline-none border border-transparent focus:border-sage/30 focus:bg-white transition-all placeholder:text-charcoal/20"
                            />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={14} />
                        </div>

                        {/* Icons */}
                        <div className="flex items-center space-x-5">
                            <Link href="/dashboard?tab=wishlist" className="text-charcoal/40 hover:text-sage transition-colors focus:outline-none hidden md:block">
                                <Heart size={20} strokeWidth={1.5} />
                            </Link>

                            {/* User Menu / Profile */}
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => session ? setIsUserMenuOpen(!isUserMenuOpen) : router.push("/login")}
                                    className="text-charcoal/40 hover:text-sage transition-colors focus:outline-none flex items-center"
                                >
                                    {session?.user?.image ? (
                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-pebble">
                                            <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <User size={20} strokeWidth={1.5} />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {isUserMenuOpen && session && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl border border-pebble py-3 px-2 z-50 origin-top-right"
                                        >
                                            <div className="px-3 py-2 mb-2 border-b border-pebble">
                                                <p className="text-xs font-bold text-charcoal truncate">{session.user.name || "Artisan Guest"}</p>
                                                <p className="text-[10px] text-charcoal/40 truncate">{session.user.email}</p>
                                            </div>
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-pebble text-charcoal/60 hover:text-sage transition-all text-xs font-medium group"
                                            >
                                                <LayoutDashboard size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                                <span>My Studio</span>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-terra/5 text-charcoal/60 hover:text-terra transition-all text-xs font-medium group"
                                            >
                                                <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                                <span>Sign Out</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="bg-pebble p-2.5 rounded-full text-charcoal/60 hover:text-sage transition-all relative focus:outline-none hover:shadow-md"
                            >
                                <ShoppingBag size={20} strokeWidth={1.5} />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-terra text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                                        {itemCount}
                                    </span>
                                )}
                            </button>
                            <button className="lg:hidden text-charcoal focus:outline-none">
                                <Menu size={24} strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </header>
    );
}
