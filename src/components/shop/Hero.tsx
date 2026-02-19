"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative min-h-[85vh] flex items-center bg-ivory pt-44 lg:pt-52 overflow-hidden">
            {/* Background Texture/Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-pebble opacity-40 -z-10 hidden lg:block" />

            <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="lg:col-span-6 space-y-8"
                >
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-block"
                        >
                            <p className="font-script text-3xl text-sage lowercase">Crafted with patience,</p>
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-serif text-charcoal leading-[1.05] tracking-tight">
                            Woven Memories <br />
                            <span className="italic text-terra">In Every Loop.</span>
                        </h1>

                        <p className="text-charcoal/60 text-lg md:text-xl max-w-lg leading-relaxed font-light">
                            Discover premium yarns and handcrafted crochet pieces that bring artisanal beauty to your everyday life.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/products" className="btn-primary text-center">
                            Shop Our Yarns
                        </Link>
                        <Link href="/best-sellers" className="btn-secondary text-center">
                            Best Sellers
                        </Link>
                    </div>

                    <div className="flex items-center space-x-8 pt-8 border-t border-charcoal/10">
                        <div className="space-y-1">
                            <p className="text-2xl font-serif text-charcoal">5000+</p>
                            <p className="text-[10px] uppercase tracking-widest text-charcoal/40 font-bold">Designs Created</p>
                        </div>
                        <div className="h-10 w-px bg-charcoal/10" />
                        <div className="space-y-1">
                            <p className="text-2xl font-serif text-charcoal">100%</p>
                            <p className="text-[10px] uppercase tracking-widest text-charcoal/40 font-bold">Pure Handmade</p>
                        </div>
                    </div>
                </motion.div>

                {/* Imagery */}
                <motion.div
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2 }}
                    className="lg:col-span-6 relative"
                >
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl artisanal-border">
                        <img
                            src="https://res.cloudinary.com/dvk5zbu5p/image/upload/v1771479329/hero_usxlpb.jpg"
                            alt="Magic Needles Style Artisan Work"
                            className="w-full h-full object-cover transition-transform duration-1000"
                        />
                        {/* Signature Accent */}
                        <div className="absolute -bottom-4 -left-4 bg-white p-6 shadow-xl rounded-xl hidden md:block border border-pebble">
                            <p className="font-script text-3xl text-sage leading-none">Originals</p>
                            <p className="text-[8px] uppercase tracking-widest font-bold text-charcoal/30 mt-1">Since 2024</p>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-sage/5 rounded-full blur-3xl -z-10" />
                </motion.div>
            </div>
        </section>
    );
}
