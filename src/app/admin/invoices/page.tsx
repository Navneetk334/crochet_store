import { prisma } from "@/lib/prisma";
//export const dynamic = "force-dynamic";
import {
    FileText,
    Download,
    Printer,
    Search,
    Filter,
    CheckCircle,
    Clock,
    IndianRupee,
    ChevronRight,
    ExternalLink
} from "lucide-react";
import Link from "next/link";

export default async function AdminInvoicesPage() {
    const orders = await prisma.order.findMany({
        where: { paymentStatus: "paid" },
        include: { user: true },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.3em] font-bold text-sage">Financial Archive</p>
                    <h1 className="text-4xl font-serif text-charcoal">Tax Invoices</h1>
                </div>
                <button className="px-6 py-3 bg-white border border-pebble rounded-xl text-xs font-bold uppercase tracking-widest text-charcoal/60 hover:text-sage transition-all flex items-center gap-2">
                    <Download size={16} />
                    <span>Export Monthly Report</span>
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-pebble overflow-hidden">
                <div className="p-6 border-b border-pebble flex flex-col md:flex-row justify-between items-center gap-4 bg-pebble/10">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Filter by invoice # or customer..."
                            className="w-full bg-white px-5 py-3 rounded-xl border border-pebble focus:border-sage outline-none text-sm transition-all shadow-sm"
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={18} />
                    </div>
                    <div className="flex items-center space-x-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-5 py-3 bg-white border border-pebble rounded-xl text-xs font-bold uppercase tracking-widest text-charcoal/60 hover:text-sage transition-all shadow-sm">
                            <Clock size={16} />
                            <span>Current Month</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-pebble/30 border-b border-pebble">
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Invoice #</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Patron</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Amount</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Payment Date</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pebble">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="space-y-4 opacity-20">
                                            <FileText size={48} className="mx-auto" />
                                            <p className="font-serif text-2xl">Financial loom waiting for orders...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order: any) => (
                                    <tr key={order.id} className="group hover:bg-pebble/20 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-3">
                                                <FileText size={18} className="text-sage" />
                                                <span className="text-sm font-bold text-charcoal tracking-widest">INV-{order.orderNumber.toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-charcoal">{order.user?.name || "Guest Patron"}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-charcoal">₹{order.totalAmount.toLocaleString("en-IN")}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">{new Date(order.updatedAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end space-x-3">
                                                <button className="p-2 text-charcoal/40 hover:text-sage transition-all"><Printer size={18} /></button>
                                                <button className="p-2 text-charcoal/40 hover:text-terra transition-all"><Download size={18} /></button>
                                            </div>
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
