"use client";

import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Tag,
    Image as ImageIcon,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    MessageSquare,
    FileText
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const sidebarLinks = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Tag },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Admins", href: "/admin/users", icon: Users }, // Admin management
    { label: "Coupons", href: "/admin/coupons", icon: Tag },
    { label: "Content", href: "/admin/content", icon: ImageIcon },
    { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
    { label: "Invoices", href: "/admin/invoices", icon: FileText },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = async () => {
        try {
            await fetch("/api/admin/logout", { method: "POST" });
            router.push("/admin/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <motion.aside
            animate={{ width: isCollapsed ? 80 : 280 }}
            className="fixed left-0 top-8 bottom-0 bg-charcoal text-ivory/60 z-50 flex flex-col border-r border-ivory/5 transition-all duration-300"
        >
            {/* Brand Header */}
            <div className="p-6 flex items-center justify-between border-b border-ivory/5 h-20">
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-serif text-lg tracking-tighter text-ivory flex flex-col"
                    >
                        <span>CAUGHT CRAFT</span>
                        <span className="text-[8px] tracking-[0.4em] uppercase font-sans font-bold text-sage">Admin</span>
                    </motion.div>
                )}
                <button
                    onClick={() => {
                        const nextState = !isCollapsed;
                        setIsCollapsed(nextState);
                        document.body.setAttribute('data-admin-collapsed', String(nextState));
                    }}
                    className="p-2 hover:bg-ivory/5 rounded-lg transition-colors text-ivory"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center space-x-4 p-3 rounded-xl transition-all group ${isActive
                                ? "bg-sage text-ivory shadow-lg"
                                : "hover:bg-ivory/5 hover:text-ivory"
                                }`}
                        >
                            <link.icon size={20} className={`${isActive ? "text-ivory" : "group-hover:text-sage"} transition-colors`} />
                            {!isCollapsed && (
                                <span className="text-sm font-medium tracking-wide">
                                    {link.label}
                                </span>
                            )}
                            {isActive && !isCollapsed && (
                                <motion.div
                                    layoutId="active-nav-dot"
                                    className="w-1.5 h-1.5 rounded-full bg-ivory ml-auto"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-ivory/5 space-y-2">
                <Link
                    href="/admin/settings"
                    className="flex items-center space-x-4 p-3 rounded-xl hover:bg-ivory/5 transition-all text-sm group"
                >
                    <Settings size={20} className="group-hover:rotate-45 transition-transform" />
                    {!isCollapsed && <span>Settings</span>}
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-4 p-3 rounded-xl hover:bg-terra/10 hover:text-terra transition-all text-sm"
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </motion.aside>
    );
}
