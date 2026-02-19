"use client";

import React from "react";
import { Heart, ShoppingBag, Search, Scissors, Circle, MousePointer2 } from "lucide-react";
import Link from "next/link";
import { useBoutique, CursorVariant } from "@/store/useBoutique";

export default function CursorShowcase() {
    const { cursorVariant, setCursorVariant } = useBoutique();

    const variants: { id: CursorVariant; label: string; icon: any; desc: string }[] = [
        { id: "classic", label: "Floating Loop", icon: Circle, desc: "An elastic sage circle following a precision point. Fluid and modern." },
        { id: "needle", label: "Needle Point", icon: Scissors, desc: "A sharp vertical needle tip with a dashed thread trail. Perfect for detail." },
        { id: "yarn", label: "Yarn Ball", icon: Circle, desc: "A textured, rotating loop that mimics a ball of wool being wound." },
        { id: "minimal", label: "Studio Minimal", icon: MousePointer2, desc: "Strictly the precision dot. No distractions from the artistry." },
    ];

    return (
        <div className="bg-ivory min-h-screen pt-44 pb-24">
            <div className="max-w-6xl mx-auto px-6 space-y-32">
                {/* Intro */}
                <div className="space-y-6 text-center max-w-2xl mx-auto">
                    <span className="text-sage font-bold tracking-[0.4em] uppercase text-[10px]">Artisanal UX</span>
                    <h1 className="text-5xl md:text-7xl font-serif text-charcoal">Cursor Boutique</h1>
                    <p className="text-earth-brown/60 text-lg font-light leading-relaxed">
                        Experience our custom interaction system. Choose a style that fits your aesthetic vision.
                    </p>
                </div>

                {/* Style Cabinet */}
                <section className="space-y-12">
                    <div className="flex items-center justify-between border-b border-pebble pb-6">
                        <h2 className="font-serif text-3xl text-charcoal">The Style Cabinet</h2>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-sage">Select to switch site-wide</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {variants.map((v) => (
                            <button
                                key={v.id}
                                onClick={() => setCursorVariant(v.id)}
                                className={`group p-8 rounded-[2.5rem] border-2 transition-all duration-500 text-left space-y-4 ${cursorVariant === v.id
                                        ? "bg-white border-sage shadow-xl -translate-y-2"
                                        : "bg-pebble/30 border-transparent hover:bg-white hover:border-sage/20"
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${cursorVariant === v.id ? "bg-sage text-white" : "bg-white text-charcoal/20 group-hover:text-sage"
                                    }`}>
                                    <v.icon size={20} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-charcoal uppercase tracking-widest text-[11px]">{v.label}</h3>
                                    <p className="text-[11px] text-earth-brown/60 font-medium leading-relaxed">{v.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                    {/* Interaction States */}
                    <div className="space-y-16">
                        <section className="space-y-8">
                            <h3 className="font-serif text-2xl text-charcoal border-b border-pebble pb-4">Interaction Lab</h3>
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/40 font-bold">Standard UI</p>
                                    <div className="flex flex-wrap gap-4">
                                        <button className="btn-primary">Primary Action</button>
                                        <button className="btn-secondary">Secondary Action</button>
                                        <Link href="#" className="text-sage underline underline-offset-8 font-bold text-[11px] uppercase tracking-widest">Text Link</Link>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/40 font-bold">Iconic Boutique</p>
                                    <div className="flex gap-6">
                                        <button className="p-5 bg-white rounded-[1.5rem] shadow-sm border border-pebble text-charcoal/30 hover:text-terra transition-all hover:shadow-md active:scale-95">
                                            <Heart size={24} />
                                        </button>
                                        <button className="p-5 bg-white rounded-[1.5rem] shadow-sm border border-pebble text-charcoal/30 hover:text-sage transition-all hover:shadow-md active:scale-95">
                                            <ShoppingBag size={24} />
                                        </button>
                                        <button className="p-5 bg-white rounded-[1.5rem] shadow-sm border border-pebble text-charcoal/30 hover:text-sage transition-all hover:shadow-md active:scale-95">
                                            <Search size={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Image Hover States */}
                    <div className="space-y-12">
                        <section className="space-y-8">
                            <h3 className="font-serif text-2xl text-charcoal border-b border-pebble pb-4">Visual Contexts</h3>
                            <div className="space-y-8">
                                <div className="aspect-[16/9] bg-white rounded-[3rem] border-2 border-dashed border-pebble flex items-center justify-center group relative overflow-hidden" data-cursor="view">
                                    <div className="text-center space-y-2 z-10 transition-transform duration-700 group-hover:scale-110">
                                        <p className="text-lg font-serif text-charcoal">"View" Canvas</p>
                                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-sage">Hover to Expand Loop</p>
                                    </div>
                                    <div className="absolute inset-0 bg-sage/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                </div>

                                <div className="space-y-3 bg-pebble/20 p-8 rounded-[2rem] border border-pebble/50">
                                    <p className="text-[10px] uppercase tracking-widest text-charcoal/40 font-bold">Text Precision Mode</p>
                                    <p className="text-charcoal/80 font-serif text-lg leading-relaxed italic">
                                        "The finest threads are those that carry the soul of the maker. Hover here to see the cursor soften and step aside for the narrative."
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Aesthetic Palette */}
                <div className="pt-24 border-t border-pebble grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { name: "Studio Sage", color: "bg-sage" },
                        { name: "Artisan Terra", color: "bg-terra" },
                        { name: "Boutique Ivory", color: "bg-ivory", border: true },
                        { name: "Precision Charcoal", color: "bg-charcoal" }
                    ].map((c) => (
                        <div key={c.name} className="space-y-3">
                            <div className={`w-full aspect-video rounded-3xl ${c.color} ${c.border ? "border border-pebble" : ""}`} />
                            <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-charcoal/40 text-center">{c.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
