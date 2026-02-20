"use client";

import { Bell, Search, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { memo } from "react";

function AdminHeader() {
  const { data: session } = useSession();

  const optimizedAvatar =
    session?.user?.image?.replace(
      "/upload/",
      "/upload/f_auto,q_auto,w_200/"
    ) || null;

  return (
    <header className="h-20 bg-white border-b border-pebble flex items-center justify-between px-8 sticky top-0 z-40">
      {/* LEFT */}
      <div className="flex items-center space-x-8 flex-1">
        <h2 className="text-xl font-serif text-charcoal hidden md:block">
          Overview
        </h2>

        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Search orders, products, customers..."
            className="w-full bg-pebble px-5 py-2.5 rounded-xl border border-transparent focus:bg-white focus:border-sage outline-none text-sm transition-all"
          />
          <Search
            className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/20"
            size={16}
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center space-x-6">
        <button
          type="button"
          className="relative p-2.5 text-charcoal/40 hover:text-sage hover:bg-pebble rounded-full transition-all"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-terra rounded-full border-2 border-white" />
        </button>

        <Link
          href="/admin/settings"
          className="flex items-center space-x-3 border-l border-pebble pl-6 group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-charcoal tracking-tight group-hover:text-sage transition-colors">
              {session?.user?.name || "Admin Craft"}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-earth-brown/40">
              {session?.user?.role === "ADMIN"
                ? "Super Admin"
                : "Curator"}
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-pebble flex items-center justify-center text-charcoal/20 shadow-sm overflow-hidden relative">
            {optimizedAvatar ? (
              <Image
                src={optimizedAvatar}
                alt="Admin Avatar"
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <User size={20} />
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}

export default memo(AdminHeader);