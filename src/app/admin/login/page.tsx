"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Lock, User as UserIcon, AlertCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const callbackUrl = searchParams.get("callbackUrl") || "/admin";

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Authentication failed. Please check your credentials.");
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (err) {
            setError("Something went wrong. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-pebble/30 py-32 px-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border border-pebble"
            >
                <div className="text-center space-y-4 mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-sage/10 rounded-2xl mb-4">
                        <Lock className="text-sage" size={32} />
                    </div>
                    <h1 className="font-serif text-3xl text-charcoal">Curator Portal</h1>
                    <p className="text-earth-brown/60 text-sm font-light uppercase tracking-widest">
                        Administrative Access Only
                    </p>
                </div>

                <div className="space-y-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center space-x-2 p-4 bg-terra/5 border border-terra/20 rounded-xl text-terra text-xs font-medium"
                        >
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-widest font-bold text-charcoal/60 ml-1">Username or Email</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="curator_username"
                                    className="w-full px-5 py-4 bg-pebble/30 border border-transparent rounded-xl focus:bg-white focus:border-sage focus:ring-0 transition-all outline-none text-sm"
                                />
                                <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={18} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-widest font-bold text-charcoal/60 ml-1">Secret Key</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-5 py-4 bg-pebble/30 border border-transparent rounded-xl focus:bg-white focus:border-sage focus:ring-0 transition-all outline-none text-sm"
                                />
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={18} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-charcoal text-white py-4 rounded-xl shadow-lg hover:bg-charcoal/90 transition-all duration-300 group disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            <span className="text-sm font-bold uppercase tracking-widest leading-none">
                                {isLoading ? "Authenticating..." : "Enter Operations Hub"}
                            </span>
                            {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-pebble"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                            <span className="bg-white px-4 text-charcoal/20">Secure JWT Access</span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-pebble text-center">
                    <Link href="/" className="text-xs text-charcoal/40 hover:text-sage transition-colors uppercase tracking-widest font-bold">
                        ← Back to Boutique
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
