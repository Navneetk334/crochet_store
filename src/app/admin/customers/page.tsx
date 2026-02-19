import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import {
    Plus,
    Search,
    User,
    Mail,
    ShoppingBag,
    Calendar,
    ChevronRight,
    UserPlus
} from "lucide-react";
import Link from "next/link";

export default async function AdminCustomersPage() {
    const customers = await prisma.user.findMany({
        where: { role: "CUSTOMER" },
        include: { _count: { select: { orders: true } } },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.3em] font-bold text-sage">Community Hub</p>
                    <h1 className="text-4xl font-serif text-charcoal">Patrons</h1>
                </div>
                <div className="px-6 py-3 bg-white border border-pebble rounded-xl text-xs font-bold uppercase tracking-widest text-charcoal/60 flex items-center gap-3">
                    <UserPlus size={16} className="text-sage" />
                    <span>{customers.length} Registered Patrons</span>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-pebble overflow-hidden">
                <div className="p-6 border-b border-pebble flex flex-col md:flex-row justify-between items-center gap-4 bg-pebble/10">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search patrons by name or email..."
                            className="w-full bg-white px-5 py-3 rounded-xl border border-pebble focus:border-sage outline-none text-sm transition-all shadow-sm"
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={18} />
                    </div>
                    <button className="flex items-center space-x-2 px-5 py-3 bg-white border border-pebble rounded-xl text-xs font-bold uppercase tracking-widest text-charcoal/60 hover:text-sage transition-all shadow-sm">
                        <span>Export CSV</span>
                        <ChevronRight size={16} className="rotate-90" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-pebble/30 border-b border-pebble">
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Patron</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Engagement</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Total Spend</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Last Seen</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pebble">
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="space-y-4 opacity-20">
                                            <User size={48} className="mx-auto" />
                                            <p className="font-serif text-2xl">Awaiting the first visitor to the haven...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer: any) => (
                                    <tr key={customer.id} className="group hover:bg-pebble/20 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-xl bg-pebble overflow-hidden flex-shrink-0 border border-pebble">
                                                    {customer.image ? (
                                                        <img src={customer.image} alt={customer.name || ""} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-charcoal/20">
                                                            <User size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-bold text-charcoal">{customer.name || "Anonymous Patron"}</p>
                                                    <div className="flex items-center space-x-2 text-[10px] text-charcoal/40 font-medium">
                                                        <Mail size={12} />
                                                        <span>{customer.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-2 text-charcoal/60">
                                                <ShoppingBag size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{customer._count.orders} Orders</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-charcoal">₹{(customer._count.orders * 1850).toLocaleString("en-IN")}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-2 text-charcoal/60">
                                                <Calendar size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(customer.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="px-4 py-2 bg-pebble rounded-lg text-[10px] uppercase font-bold tracking-widest text-charcoal/60 hover:bg-sage hover:text-ivory transition-all shadow-sm">
                                                View History
                                            </button>
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
