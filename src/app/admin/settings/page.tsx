import {
    Settings,
    Shield,
    Bell,
    Globe,
    CreditCard,
    Truck,
    Database,
    Lock,
    ChevronRight,
    Info
} from "lucide-react";

export default function AdminSettingsPage() {
    const sections = [
        { label: "General", icon: Settings, desc: "Brand identity, timezone, and storefront visibility." },
        { label: "Security", icon: Lock, desc: "Admin permissions, 2FA, and audit logs." },
        { label: "Payments", icon: CreditCard, desc: "Razorpay API keys, currency, and payout settings." },
        { label: "Shipping", icon: Truck, desc: "Shiprocket integration, weight units, and origins." },
        { label: "Notifications", icon: Bell, desc: "Order alerts, stock warnings, and email templates." },
        { label: "Data & SEO", icon: Globe, desc: "Meta tags, sitemap, and analytics integration." },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] font-bold text-sage">Infrastructure</p>
                <h1 className="text-4xl font-serif text-charcoal">Studio Settings</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section) => (
                    <div key={section.label} className="bg-white p-8 rounded-3xl border border-pebble shadow-sm hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden">
                        <div className="space-y-6">
                            <div className="w-12 h-12 bg-pebble rounded-xl flex items-center justify-center text-sage group-hover:bg-sage group-hover:text-ivory transition-all shadow-sm">
                                <section.icon size={24} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-serif text-xl text-charcoal group-hover:text-terra transition-colors">{section.label}</h3>
                                <p className="text-xs text-earth-brown/60 leading-relaxed font-light">{section.desc}</p>
                            </div>
                            <div className="flex items-center text-[10px] uppercase tracking-widest font-bold text-sage group-hover:translate-x-2 transition-transform">
                                <span>Configure Area</span>
                                <ChevronRight size={14} className="ml-2" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-charcoal text-ivory p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center space-x-3 text-sage">
                        <Database size={24} />
                        <h4 className="font-serif text-2xl">Core Integrity</h4>
                    </div>
                    <p className="text-sm font-light leading-relaxed text-ivory/60 max-w-xl">
                        "Every setting here influences how your craft is delivered to the world. Handle with the same care you give your yarn."
                    </p>
                    <div className="flex space-x-4 pt-4 border-t border-ivory/10">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] uppercase tracking-widest font-bold text-ivory/40">DB Connection Stable</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Shield size={14} className="text-sage" />
                            <span className="text-[10px] uppercase tracking-widest font-bold text-ivory/40">SSL SECURED</span>
                        </div>
                    </div>
                </div>
                <div className="absolute -right-20 -bottom-20 opacity-5 grayscale">
                    <Settings size={300} />
                </div>
            </div>
        </div>
    );
}
