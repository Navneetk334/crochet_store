import { prisma } from "@/lib/prisma";
//export const dynamic = "force-dynamic";
import {
    Image as ImageIcon,
    Settings,
    Plus,
    Trash2,
    Edit,
    Eye,
    ArrowRight,
    Monitor,
    Smartphone,
    Type
} from "lucide-react";
import Link from "next/link";

export default async function AdminContentPage() {
    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.3em] font-bold text-sage">Experience Control</p>
                    <h1 className="text-4xl font-serif text-charcoal">Digital Canvas</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="px-6 py-3 bg-white border border-pebble rounded-xl text-xs font-bold uppercase tracking-widest text-charcoal/60 hover:text-sage transition-all flex items-center gap-2">
                        <Eye size={16} />
                        <span>Preview Storefront</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content Sections */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Hero Banner Manager */}
                    <section className="bg-white rounded-3xl border border-pebble shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-pebble bg-pebble/10 flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-sage">
                                <Monitor size={20} />
                                <h3 className="font-serif text-xl text-charcoal">Hero Sanctuary</h3>
                            </div>
                            <button className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-sage border border-sage/20 px-3 py-1 rounded-full hover:bg-sage hover:text-ivory transition-all">
                                <Plus size={14} />
                                <span>Add Slide</span>
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            {[
                                { title: "Winter Woolen Wonders", subtitle: "2024 Collection", active: true },
                                { title: "Artisan Living", subtitle: "Sustainable Craft", active: false },
                            ].map((banner, i) => (
                                <div key={i} className={`p-6 rounded-2xl border ${banner.active ? "border-sage bg-sage/5" : "border-pebble bg-white"} flex items-center gap-6 group hover:shadow-md transition-all`}>
                                    <div className="w-24 h-16 rounded-xl bg-pebble flex-shrink-0 flex items-center justify-center text-charcoal/20">
                                        <ImageIcon size={24} />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h4 className="font-serif text-lg text-charcoal leading-tight">{banner.title}</h4>
                                        <p className="text-[10px] text-charcoal/40 uppercase tracking-widest font-bold">{banner.subtitle}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button className="p-2 text-charcoal/40 hover:text-sage transition-colors"><Edit size={16} /></button>
                                        <button className="p-2 text-charcoal/40 hover:text-terra transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* About Section Text */}
                    <section className="bg-white rounded-3xl border border-pebble shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-pebble bg-pebble/10 flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-sage">
                                <Type size={20} />
                                <h3 className="font-serif text-xl text-charcoal">The Narrative</h3>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-charcoal/40 ml-1">Brand Heading</label>
                                    <input type="text" defaultValue="Woven with Love, Handed with Care" className="w-full px-6 py-4 bg-pebble/30 border border-transparent rounded-2xl focus:bg-white focus:border-sage outline-none text-sm transition-all shadow-inner" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-charcoal/40 ml-1">The Storyteller (Body)</label>
                                    <textarea
                                        rows={6}
                                        className="w-full px-6 py-4 bg-pebble/30 border border-transparent rounded-2xl focus:bg-white focus:border-sage outline-none text-sm transition-all shadow-inner resize-none"
                                        defaultValue="Every loops tells a story of patience. At Caught Craft Handed, we believe in the slow transition of yarn into art. Our pieces aren't just accessories; they are woven memories..."
                                    />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button className="btn-primary py-3 px-8 text-xs">Update Story</button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar Settings */}
                <aside className="lg:col-span-4 space-y-8">
                    <section className="bg-charcoal text-ivory p-8 rounded-3xl shadow-2xl space-y-6">
                        <div className="flex items-center space-x-3 text-sage">
                            <Smartphone size={20} />
                            <h4 className="font-serif text-xl">Mobile Display</h4>
                        </div>
                        <p className="text-xs font-light leading-relaxed text-ivory/60 italic">
                            "Customize how your story unfolds on smaller screens. Prioritize clarity and artisan imagery."
                        </p>
                        <div className="space-y-4 pt-4 border-t border-ivory/10">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-ivory/40">Compact About</span>
                                <div className="w-10 h-5 bg-sage rounded-full relative p-1 cursor-pointer">
                                    <div className="w-3 h-3 bg-ivory rounded-full absolute right-1" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-3xl border border-pebble shadow-sm space-y-6">
                        <h4 className="font-serif text-xl border-b border-pebble pb-4 mb-6">Global Styles</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-pebble/30 rounded-xl">
                                <span className="text-[10px] uppercase font-bold text-charcoal/60">Theme Mood</span>
                                <span className="text-[10px] font-bold text-sage">ARTISANAL LIGHT</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-pebble/30 rounded-xl">
                                <span className="text-[10px] uppercase font-bold text-charcoal/60">Primary Font</span>
                                <span className="text-[10px] font-bold text-charcoal">PLAYFAIR DISPLAY</span>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}
