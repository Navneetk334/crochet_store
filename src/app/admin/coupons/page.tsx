import { prisma } from "@/lib/prisma";
//export const dynamic = "force-dynamic";
import {
    Plus,
    Ticket,
    Trash2,
    Edit,
    Calendar,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    IndianRupee,
    Percent
} from "lucide-react";
import Link from "next/link";

export default async function AdminCouponsPage() {
    const coupons = await prisma.coupon.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.3em] font-bold text-sage">Marketing Strategy</p>
                    <h1 className="text-4xl font-serif text-charcoal">Gift Vouchers</h1>
                </div>
                <button className="btn-primary py-4 px-8 rounded-2xl flex items-center space-x-3 text-sm tracking-widest uppercase shadow-xl group">
                    <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                    <span>Create Coupon</span>
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-pebble overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-pebble/30 border-b border-pebble">
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Coupon Details</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Discount</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Validity</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Usage</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Status</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-charcoal/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pebble">
                            {coupons.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="space-y-4 opacity-20">
                                            <Ticket size={48} className="mx-auto" />
                                            <p className="font-serif text-2xl">Generate your first token of appreciation...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                coupons.map((coupon: any) => {
                                    const isActive = new Date(coupon.expiry) > new Date();
                                    return (
                                        <tr key={coupon.id} className="group hover:bg-pebble/20 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-3 rounded-xl ${isActive ? "bg-sage/10 text-sage" : "bg-pebble text-charcoal/20"}`}>
                                                        <Ticket size={24} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-bold text-charcoal tracking-widest uppercase">{coupon.code}</p>
                                                        <p className="text-[10px] text-charcoal/40 font-medium">Internal Reference: #{coupon.id.slice(-6)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-2 text-charcoal">
                                                    {coupon.type === "percentage" ? <Percent size={14} className="text-sage" /> : <IndianRupee size={14} className="text-terra" />}
                                                    <p className="text-sm font-bold">{coupon.value}{coupon.type === "percentage" ? "%" : " OFF"}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-2 text-charcoal/60">
                                                    <Calendar size={14} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(coupon.expiry).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-2 text-charcoal/60">
                                                    <Users size={14} />
                                                    <span className="text-xs font-medium">124 used</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-widest ${isActive ? "bg-sage/10 text-sage border-sage/20" : "bg-terra/10 text-terra border-terra/20"}`}>
                                                    {isActive ? "ACTIVE" : "EXPIRED"}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button className="p-2 text-charcoal/40 hover:text-sage transition-colors"><Edit size={18} /></button>
                                                    <button className="p-2 text-charcoal/40 hover:text-terra transition-colors"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
