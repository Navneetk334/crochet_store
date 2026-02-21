"use client";

import React, { useState, useTransition } from "react";
import { CheckCircle, Clock, Truck, XCircle, AlertCircle } from "lucide-react";

interface OrderUpdateFormProps {
    orderId: string;
    currentStatus: string;
    updateStatusAction: (formData: FormData) => Promise<void>;
}

const statusOptions = [
    { value: "PROCESSING", label: "Processing", icon: Clock, color: "text-sage bg-sage/10 border-sage/20" },
    { value: "SHIPPED", label: "Shipped", icon: Truck, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { value: "DELIVERED", label: "Delivered", icon: CheckCircle, color: "text-green-600 bg-green-50 border-green-100" },
    { value: "CANCELLED", label: "Cancelled", icon: XCircle, color: "text-terra bg-terra/10 border-terra/20" },
];

export default function OrderUpdateForm({ orderId, currentStatus, updateStatusAction }: OrderUpdateFormProps) {
    const [isPending, startTransition] = useTransition();
    const [selectedStatus, setSelectedStatus] = useState(currentStatus.toUpperCase());
    const [error, setError] = useState<string | null>(null);

    const activeOption = statusOptions.find(opt => opt.value === selectedStatus) || statusOptions[0];
    const Icon = activeOption.icon;

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setSelectedStatus(newStatus);
        setError(null);

        const formData = new FormData();
        formData.append("status", newStatus);

        startTransition(async () => {
            try {
                await updateStatusAction(formData);
            } catch (err) {
                setError("Failed to update status. Please try again.");
                setSelectedStatus(currentStatus.toUpperCase());
            }
        });
    };

    return (
        <div className="bg-white p-8 rounded-2xl border space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="font-serif text-xl text-charcoal">Fulfillment Status</h3>
                <span className={`px-4 py-1.5 border rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${activeOption.color}`}>
                    <Icon size={12} />
                    {selectedStatus}
                </span>
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-charcoal/40 mb-2">Update Order Progress</label>
                    <select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        disabled={isPending}
                        className="w-full bg-pebble/30 px-5 py-4 rounded-xl border border-pebble focus:border-sage outline-none text-xs font-bold uppercase tracking-widest text-charcoal/60 appearance-none cursor-pointer disabled:opacity-50 transition-all"
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value} className="bg-white">
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 bottom-5 pointer-events-none opacity-40">
                        {isPending ? (
                            <div className="w-4 h-4 border-2 border-sage border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <span className="text-xs">▼</span>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-terra text-[10px] font-bold uppercase tracking-wider bg-terra/5 p-3 rounded-lg border border-terra/10">
                        <AlertCircle size={14} />
                        {error}
                    </div>
                )}

                <p className="text-[10px] text-charcoal/40 font-medium leading-relaxed">
                    Updating the status will notify the systems and record the change in the audit log. Please ensure the actual shipping progress matches the selected status.
                </p>
            </div>
        </div>
    );
}
