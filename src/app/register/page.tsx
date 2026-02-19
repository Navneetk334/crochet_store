"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, ArrowRight, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }

            setIsSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-ivory py-32 px-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-pebble"
            >
                <div className="text-center space-y-4 mb-10">
                    <Link href="/" className="inline-flex flex-col items-center">
                        <span className="font-serif text-3xl text-charcoal tracking-tighter">
                            CAUGHT CRAFT HANDED
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-sage font-sans font-bold">
                            Join the Collective
                        </span>
                    </Link>
                    <h2 className="text-2xl font-serif text-charcoal pt-4 border-t border-pebble mt-6">Create Account</h2>
                    <p className="text-earth-brown/60 text-sm font-light">
                        Become part of our artisanal community.
                    </p>
                </div>

                {isSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6 py-8"
                    >
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 size={40} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-serif text-charcoal">Welcome Aboard!</h3>
                            <p className="text-sm text-charcoal/60">Registry successful. Redirecting to login...</p>
                        </div>
                    </motion.div>
                ) : (
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
                                <label className="text-xs uppercase tracking-widest font-bold text-charcoal/60 ml-1">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Artisan Soul"
                                        className="w-full px-5 py-4 bg-pebble/30 border border-transparent rounded-xl focus:bg-white focus:border-sage focus:ring-0 transition-all outline-none text-sm"
                                    />
                                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={18} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-widest font-bold text-charcoal/60 ml-1">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="hello@example.com"
                                        className="w-full px-5 py-4 bg-pebble/30 border border-transparent rounded-xl focus:bg-white focus:border-sage focus:ring-0 transition-all outline-none text-sm"
                                    />
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={18} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-widest font-bold text-charcoal/60 ml-1">Password</label>
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
                                className="w-full btn-primary flex items-center justify-center space-x-2 group disabled:opacity-50"
                            >
                                <span>{isLoading ? "Creating Account..." : "Join Collective"}</span>
                                {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>

                        <div className="pt-6 border-t border-pebble text-center">
                            <p className="text-xs text-earth-brown/60">
                                Already a member? <Link href="/login" className="text-sage font-bold hover:underline">Sign In</Link>
                            </p>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
