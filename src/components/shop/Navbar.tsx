"use client";

import { useState, useEffect, useRef, memo } from "react";
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CartDrawer from "./CartDrawer";
import { useCart } from "@/store/useCart";
import { useSession, signOut } from "next-auth/react";
import DemoBanner from "../DemoBanner";

function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { items } = useCart();
  const menuRef = useRef<HTMLDivElement>(null);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const leftLinks = [
    { name: "Yarns", href: "/yarns" },
    { name: "Collections", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
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
    <header className="w-full fixed top-0 z-50">
      <DemoBanner />

      {/* Top Bar */}
      <div className="bg-sage py-2 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white">
          ✨ Hand-stitched in India • Shipping Worldwide • Free Shipping above ₹2,999
        </p>
      </div>

      {/* Main Nav */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled ? "glass-nav py-3" : "bg-white py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 items-center">
          {/* Left Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {leftLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[11px] uppercase tracking-widest font-bold text-charcoal/60 hover:text-sage transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Brand */}
          <Link href="/" className="flex flex-col items-center">
            <span className="font-serif text-3xl md:text-4xl text-charcoal tracking-tighter">
              CAUGHT CRAFT
            </span>
            <div className="flex items-center space-x-2 -mt-2">
              <span className="h-px w-4 bg-sage/40" />
              <span className="font-script text-xl text-sage lowercase opacity-80">
                Handed
              </span>
              <span className="h-px w-4 bg-sage/40" />
            </div>
          </Link>

          {/* Right Section */}
          <div className="flex items-center space-x-5 justify-end">
            {/* Search */}
            <div className="relative hidden sm:block w-48">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-pebble px-4 py-2 rounded-full text-xs outline-none focus:bg-white focus:border-sage/30 border border-transparent transition-all"
              />
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/20"
                size={14}
              />
            </div>

            {/* Wishlist */}
            <Link
              href="/dashboard?tab=wishlist"
              className="text-charcoal/40 hover:text-sage hidden md:block"
            >
              <Heart size={20} strokeWidth={1.5} />
            </Link>

            {/* User Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() =>
                  session
                    ? setIsUserMenuOpen(!isUserMenuOpen)
                    : router.push("/login")
                }
                className="text-charcoal/40 hover:text-sage"
              >
                {session?.user?.image ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-pebble relative">
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <User size={20} strokeWidth={1.5} />
                )}
              </button>

              {isUserMenuOpen && session && (
                <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-xl border border-pebble py-3 px-2 z-50">
                  <div className="px-3 py-2 mb-2 border-b border-pebble">
                    <p className="text-xs font-bold truncate">
                      {session.user.name || "Artisan Guest"}
                    </p>
                    <p className="text-[10px] text-charcoal/40 truncate">
                      {session.user.email}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-pebble text-xs"
                  >
                    <LayoutDashboard size={16} />
                    <span>My Studio</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-terra/5 text-xs"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-pebble p-2 rounded-full relative hover:shadow-sm"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terra text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu */}
            <button className="lg:hidden">
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}

export default memo(Navbar);