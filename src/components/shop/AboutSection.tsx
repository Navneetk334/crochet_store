"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutSection() {
    return (
        <section className="py-24 bg-ivory overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl z-10">
                            <img
                                src="https://res.cloudinary.com/dvk5zbu5p/image/upload/v1771480033/artisans_rmezjq.jpg"
                                alt="Artisan at work"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Decorative background block */}
                        <div className="absolute -bottom-10 -right-10 w-2/3 h-2/3 bg-sage/10 rounded-2xl -z-0" />
                        <div className="absolute top-10 -left-10 w-1/4 h-1/4 border-2 border-terra/20 rounded-full -z-0" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <span className="text-terra font-bold tracking-[0.2em] uppercase text-xs">Our Story</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-charcoal leading-tight">
                                Crafted with Intention, <br />
                                <span className="italic text-sage">Sown with Love.</span>
                            </h2>
                        </div>

                        <div className="space-y-6 text-earth-brown/80 leading-relaxed font-light">
                            <p>
                                At Caught Craft Handed, we believe that the beauty of a piece lies in the hands that make it. Every stitch is a deliberate choice, every pattern a story told through yarn and hook.
                            </p>
                            <p>
                                Our journey started with a simple passion for the rhythmic art of crochet. Today, we bring together traditional techniques with modern aesthetics to create premium pieces that transcend seasons.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 py-6 border-t border-pebble">
                            <div className="space-y-2">
                                <h4 className="font-serif text-xl tracking-wide">Purity</h4>
                                <p className="text-xs text-earth-brown/60 uppercase tracking-widest leading-loose">Sustainable & Organic Yarn</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-serif text-xl tracking-wide">Artistry</h4>
                                <p className="text-xs text-earth-brown/60 uppercase tracking-widest leading-loose">100% Unique Handmade</p>
                            </div>
                        </div>

                        <Link href="/about" className="btn-primary inline-flex">
                            Learn More About Us
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
