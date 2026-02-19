"use client";

import React, { useState, useMemo } from "react";
import {
    Search,
    Filter,
    Eye,
    ShoppingBag,
    CheckCircle,
    ArrowUpDown,
    Clock,
    Truck,
    XCircle
} from "lucide-react";
import Link from "next/link";

interface OrderCatalogProps {
    orders: any[];
    onSeedDemo: () => Promise<void>;
}

export default function OrderCatalog({ orders, onSeedDemo }: OrderCatalogProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isSeeding, setIsSeeding] = useState(false);

    const filteredOrders = useMemo(() => {
        let result = [...orders];

        if (search) {
            result = result.filter(o =>
                o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
                o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
                o.user?.email?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            result = result.filter(o => o.status.toUpperCase() === statusFilter.toUpperCase());
        }

        return result;
    }, [orders, search, statusFilter]);

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case "PROCESSING": return "bg-sage/10 text-sage border-sage/20";
            case "SHIPPED": return "bg-blue-50 text-blue-600 border-blue-100";
            case "DELIVERED": return "bg-green-50 text-green-600 border-green-100";
            case "CANCELLED": return "bg-terra/10 text-terra border-terra/20";
            default: return "bg-pebble text-charcoal/40 border-pebble";
        }
    };

    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            await onSeedDemo();
            alert("Demo orders generated successfully!");
        } catch (error) {
            console.error("Seed failed", error);
            alert("Failed to seed demo orders.");
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by Order #, Customer..."
                        className="w-full bg-white px-5 py-3 rounded-xl border border-pebble focus:border-sage outline-none text-sm transition-all shadow-sm pl-12"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={18} />
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full bg-white px-5 py-3 rounded-xl border border-pebble focus:border-sage outline-none text-xs font-bold uppercase tracking-widest text-charcoal/60 appearance-none pr-10 shadow-sm"
                        >
                            <option value="all">All Statuses</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                        <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/20 pointer-events-none" size={14} />
                    </div>

                    <button
                        onClick={handleSeed}
                        disabled={isSeeding}
                        className="px-5 py-3 bg-charcoal text-ivory rounded-xl text-[10px] uppercase font-bold tracking-widest hover:bg-charcoal/90 transition-all shadow-lg disabled:opacity-50"
                    >
                        {isSeeding ? "Weaving Orders..." : "Seed Demo Orders"}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-pebble overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-pebble/30 border-b border-pebble">
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Order Details</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Customer</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Total</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Status</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pebble">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="space-y-4 opacity-20">
                                            <ShoppingBag size={48} className="mx-auto" />
                                            <p className="font-serif text-2xl">No orders found weaving through the records...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-pebble/20 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <Link href={`/admin/orders/${order.id}`} className="text-sm font-bold text-charcoal hover:text-sage transition-colors underline underline-offset-4 decoration-pebble hover:decoration-sage">
                                                    #{order.orderNumber.toUpperCase()}
                                                </Link>
                                                <p className="text-[10px] font-medium text-charcoal/30">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-charcoal">{order.user?.name || "Guest"}</p>
                                                <p className="text-[10px] text-charcoal/40 lowercase">{order.user?.email || ""}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-charcoal">₹{order.totalAmount.toLocaleString("en-IN")}</p>
                                            <p className="text-[10px] text-charcoal/30 uppercase tracking-tighter">{order.items.length} items</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="inline-flex items-center space-x-2 px-4 py-2 bg-pebble rounded-xl text-[10px] uppercase font-bold tracking-widest text-charcoal/60 hover:bg-sage hover:text-ivory transition-all shadow-sm"
                                            >
                                                <Eye size={12} />
                                                <span>Details</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
