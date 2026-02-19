"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    UserPlus,
    Shield,
    ShieldCheck,
    ShieldAlert,
    Trash2,
    Plus,
    X,
    AlertCircle,
    CheckCircle2,
    Lock
} from "lucide-react";
import { useState, useEffect } from "react";

interface AdminUser {
    id: string;
    username: string;
    email: string;
    role: string;
    isActive: boolean;
    lastLogin: string | null;
    createdAt: string;
}

export default function AdminManagementPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form state for new admin
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "STAFF"
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (!res.ok) throw new Error("Failed to fetch curators");
            const data = await res.json();
            setUsers(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            console.log("Submitting form data:", formData);
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("API Error:", data);
                throw new Error(data.message || "Failed to create curator");
            }

            setSuccess("Curator added to the collective");
            setIsModalOpen(false);
            setFormData({ username: "", email: "", password: "", role: "STAFF" });
            fetchUsers();
        } catch (err: any) {
            console.error("Submission error:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this curator?")) return;

        try {
            const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete curator");
            setSuccess("Curator removed from collective");
            fetchUsers();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "SUPER_ADMIN": return <ShieldCheck className="text-terra" size={16} />;
            case "ADMIN": return <Shield className="text-sage" size={16} />;
            default: return <ShieldAlert className="text-charcoal/40" size={16} />;
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="font-serif text-3xl text-charcoal flex items-center gap-3">
                        <Users className="text-sage" size={32} />
                        Administrative Collective
                    </h1>
                    <p className="text-earth-brown/60 text-sm font-light">
                        Manage the curators and stewards of the boutique.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center justify-center space-x-2 px-6"
                >
                    <UserPlus size={18} />
                    <span>Invite New Curator</span>
                </button>
            </div>

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

            {success && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-xs font-medium"
                >
                    <CheckCircle2 size={16} />
                    <span>{success}</span>
                </motion.div>
            )}

            {/* Curators Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-pebble overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-pebble/30 border-b border-pebble">
                            <tr>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Curator</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Role</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Status</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Last Presence</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-charcoal/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pebble">
                            {isLoading ? (
                                [1, 2, 3].map((i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-8 h-16 bg-white"></td>
                                    </tr>
                                ))
                            ) : users.map((user) => (
                                <tr key={user.id} className="hover:bg-pebble/10 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-charcoal text-sm">{user.username}</span>
                                            <span className="text-xs text-charcoal/40">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 py-1 px-3 bg-white border border-pebble rounded-full w-fit">
                                            {getRoleIcon(user.role)}
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/60">
                                                {user.role}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase ${user.isActive ? "bg-green-100 text-green-700" : "bg-terra/10 text-terra"
                                            }`}>
                                            {user.isActive ? "Active" : "Locked"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-charcoal/40 font-light italic">
                                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never active"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 text-charcoal/20 hover:text-terra transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-charcoal/60 backdrop-blur-sm px-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 space-y-6 overflow-hidden relative"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-pebble rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="space-y-1">
                                <h3 className="font-serif text-2xl text-charcoal">Invite Curator</h3>
                                <p className="text-xs text-earth-brown/60 uppercase tracking-widest font-bold">New Security Credential</p>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-4 pt-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 ml-1">Username</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full px-5 py-4 bg-pebble/30 border border-transparent rounded-xl focus:bg-white focus:border-sage focus:ring-0 transition-all outline-none text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 ml-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-5 py-4 bg-pebble/30 border border-transparent rounded-xl focus:bg-white focus:border-sage focus:ring-0 transition-all outline-none text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 ml-1">Temporary Key</label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-5 py-4 bg-pebble/30 border border-transparent rounded-xl focus:bg-white focus:border-sage focus:ring-0 transition-all outline-none text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 ml-1">Collective Rank</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-5 py-4 bg-pebble/30 border border-transparent rounded-xl focus:bg-white focus:border-sage focus:ring-0 transition-all outline-none text-sm"
                                    >
                                        <option value="STAFF">Staff (Operations)</option>
                                        <option value="ADMIN">Admin (Management)</option>
                                        <option value="SUPER_ADMIN">Super Admin (Governancy)</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full btn-primary py-4 mt-4 flex items-center justify-center space-x-2 group"
                                >
                                    <Lock size={16} />
                                    <span>{isLoading ? "Provisioning..." : "Finalize Credential"}</span>
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
