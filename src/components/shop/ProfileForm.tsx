"use client";

import { useState } from "react";
import { User, Camera, Check, AlertCircle, X, Upload, HardDrive, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileFormProps {
    user: any;
    sessionUser: any;
    updateAction: (formData: FormData) => Promise<void>;
}

export default function ProfileForm({ user, sessionUser, updateAction }: ProfileFormProps) {
    const [imageUrl, setImageUrl] = useState(user?.image || sessionUser?.image || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 10) {
            setPhone(value);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
                setIsModalOpen(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditImage = () => {
        setIsModalOpen(true);
    };

    async function handleSubmit(formData: FormData) {
        setIsSaving(true);
        try {
            // Re-append the phone and image because they might be in state
            formData.set("phone", phone);
            formData.set("image", imageUrl);
            await updateAction(formData);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <>
            <form action={handleSubmit} className="bg-white rounded-[3rem] p-10 border border-pebble shadow-sm space-y-8">
                <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 border-b border-pebble pb-10">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-pebble flex items-center justify-center text-charcoal/20 border-4 border-ivory shadow-inner overflow-hidden transition-transform duration-500 group-hover:scale-105">
                            {imageUrl ? (
                                <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={50} strokeWidth={1} />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleEditImage}
                            className="absolute inset-0 bg-charcoal/40 backdrop-blur-[2px] rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white"
                        >
                            <Camera size={24} className="mb-1" />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Edit</span>
                        </button>
                        <input type="hidden" name="image" value={imageUrl} />
                    </div>

                    <div className="text-center md:text-left space-y-1">
                        <h4 className="font-serif text-3xl text-charcoal">{user?.name || sessionUser?.name || "Artisan Guest"}</h4>
                        <p className="text-earth-brown/60 text-sm italic font-light">"Capturing the essence of your creative journey."</p>
                        <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-2">
                            <span className="px-3 py-1 bg-sage/10 text-sage text-[9px] uppercase tracking-widest font-bold rounded-full">Collector</span>
                            <span className="px-3 py-1 bg-terra/10 text-terra text-[9px] uppercase tracking-widest font-bold rounded-full">Artisan Member</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 ml-1">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            defaultValue={user?.name || sessionUser?.name || ""}
                            className="w-full px-6 py-4 bg-pebble/30 border border-transparent rounded-2xl focus:bg-white focus:border-sage outline-none text-sm transition-all shadow-inner hover:bg-pebble/50"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 ml-1">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            defaultValue={user?.email || sessionUser?.email || ""}
                            className="w-full px-6 py-4 bg-pebble/30 border border-transparent rounded-2xl focus:bg-white focus:border-sage outline-none text-sm transition-all shadow-inner hover:bg-pebble/50"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 ml-1">Mobile Number</label>
                        <div className="flex space-x-2">
                            <div className="relative">
                                <select className="appearance-none bg-pebble/30 border border-transparent rounded-2xl pl-4 pr-10 py-4 text-sm font-bold text-charcoal/60 outline-none focus:bg-white focus:border-sage transition-all shadow-inner cursor-pointer h-full">
                                    <option value="+91">+91 (IN)</option>
                                    <option value="+1">+1 (US)</option>
                                    <option value="+44">+44 (UK)</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal/40">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            <div className="relative flex-1">
                                <input
                                    name="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="00000 00000"
                                    className={`w-full px-6 py-4 bg-pebble/30 border border-transparent rounded-2xl focus:bg-white focus:border-sage outline-none text-sm transition-all shadow-inner hover:bg-pebble/50 tracking-[0.1em] font-medium ${phone.length > 0 && phone.length < 10 ? 'border-terra/30' : ''}`}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                                    <span className={`text-[10px] font-bold ${phone.length === 10 ? 'text-sage' : 'text-charcoal/20'}`}>
                                        {phone.length}/10
                                    </span>
                                </div>
                            </div>
                        </div>
                        {phone.length > 0 && phone.length < 10 && (
                            <p className="text-[10px] text-terra font-medium ml-2 flex items-center gap-1">
                                <AlertCircle size={10} /> Precisely 10 digits required for our artisan records
                            </p>
                        )}
                    </div>
                    <div className="space-y-2 opacity-50 cursor-not-allowed">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 ml-1">Artisan Tier</label>
                        <div className="w-full px-6 py-4 bg-pebble/20 border border-transparent rounded-2xl text-sm italic text-charcoal/40 flex justify-between items-center">
                            <span>Golden Thread Membership</span>
                            <Check size={14} className="text-sage" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-pebble gap-6">
                    <p className="text-[10px] text-earth-brown/40 uppercase tracking-widest font-medium max-w-sm text-center md:text-left">
                        Your details are handled with the same care we give to every stitch. Updates are secured within our studio vault.
                    </p>
                    <button
                        type="submit"
                        disabled={isSaving || (phone.length > 0 && phone.length < 10)}
                        className={`btn-primary py-4 px-12 rounded-2xl text-[11px] tracking-[0.2em] font-bold uppercase shadow-2xl transition-all relative overflow-hidden group ${isSaving || (phone.length > 0 && phone.length < 10) ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105 active:scale-95'}`}
                    >
                        <span className={isSaving ? "opacity-0" : "opacity-100"}>
                            Save Refinements
                        </span>
                        {isSaving && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                />
                            </div>
                        )}
                    </button>
                </div>
            </form>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-charcoal/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-ivory rounded-[3rem] overflow-hidden shadow-2xl border border-white/20"
                        >
                            {/* Modal Header */}
                            <div className="bg-sage p-8 text-white relative">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute right-6 top-6 text-white/60 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                                <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-70">Studio Vault</span>
                                <h2 className="text-3xl font-serif mt-2">Select Your Portrait</h2>
                            </div>

                            {/* Modal Content */}
                            <div className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Local Device Option */}
                                    <label className="group relative bg-white border border-pebble rounded-3xl p-8 flex flex-col items-center justify-center space-y-4 cursor-pointer hover:border-sage hover:shadow-lg transition-all transform hover:-translate-y-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        <div className="w-16 h-16 bg-pebble rounded-2xl flex items-center justify-center text-charcoal/40 group-hover:bg-sage/10 group-hover:text-sage transition-colors">
                                            <Upload size={32} />
                                        </div>
                                        <div className="text-center">
                                            <h4 className="font-bold text-sm text-charcoal tracking-widest uppercase">Local Studio</h4>
                                            <p className="text-[10px] text-earth-brown/60 mt-1 uppercase tracking-tighter">Device Gallery</p>
                                        </div>
                                    </label>

                                    {/* Google Drive Option (Mock) */}
                                    <button
                                        type="button"
                                        onClick={() => alert("Connecting to Artisan Cloud (Google Drive)... This feature is part of our upcoming 'Loom & Link' update!")}
                                        className="group relative bg-white border border-pebble rounded-3xl p-8 flex flex-col items-center justify-center space-y-4 cursor-pointer hover:border-sage hover:shadow-lg transition-all transform hover:-translate-y-1"
                                    >
                                        <div className="w-16 h-16 bg-pebble rounded-2xl flex items-center justify-center text-charcoal/40 group-hover:bg-sage/10 group-hover:text-sage transition-colors">
                                            <HardDrive size={32} />
                                        </div>
                                        <div className="text-center">
                                            <h4 className="font-bold text-sm text-charcoal tracking-widest uppercase">Artisan Cloud</h4>
                                            <p className="text-[10px] text-earth-brown/60 mt-1 uppercase tracking-tighter">Google Drive</p>
                                        </div>
                                        <div className="absolute -top-2 -right-2 bg-terra text-white text-[8px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-md">
                                            Soon
                                        </div>
                                    </button>
                                </div>

                                <div className="pt-6 border-t border-pebble flex justify-between items-center bg-pebble/30 -mx-10 -mb-10 p-8">
                                    <p className="text-[9px] text-earth-brown/40 uppercase tracking-widest leading-relaxed max-w-[200px]">
                                        We recommend a square crop for the most artistic presentation.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-[10px] font-bold text-charcoal/40 hover:text-charcoal uppercase tracking-[0.2em] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
