"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function StorySection() {
    return (
        <section className="py-24 bg-white border-b border-pebble overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                {/* Visual Narrative Layer */}
                <div className="relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl artisanal-border"
                    >
                        <img
                            src="https://res.cloudinary.com/dvk5zbu5p/image/upload/v1771480033/artisans_rmezjq.jpg"
                            alt="The Artisan at Work"
                            className="w-full h-full object-cover transition-all duration-1000"
                        />
                    </motion.div>

                    {/* Floating Detail */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="absolute -bottom-10 -right-10 w-1/2 aspect-square rounded-2xl overflow-hidden shadow-2xl border-8 border-white hidden md:block"
                    >
                        <img
                            src="https://res.cloudinary.com/dvk5zbu5p/image/upload/v1771480158/closeup_ha5oxi.jpg"
                            alt="Crochet Detail Close-up"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>

                {/* The Written Archive */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="space-y-10"
                >
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="font-script text-3xl text-sage lowercase">from our home to yours</p>
                            <h2 className="text-5xl md:text-6xl font-serif text-charcoal leading-tight">
                                Woven with Love, <br />
                                <span className="text-terra italic">Handed with Care.</span>
                            </h2>
                        </div>

                        <div className="space-y-6 text-charcoal/70 text-base md:text-lg font-light leading-relaxed">
                            <p>
                                Magic happens in the quiet moments between stitches. At Caught Craft Handed, we celebrate the slow craft—where every yarn choice and every loop is a deliberate act of creation.
                            </p>
                            <p>
                                What started as a personal passion for the tactile beauty of crochet has grown into a collective dedicated to preserving traditional techniques for a modern world.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 py-8 border-y border-pebble">
                        <div className="space-y-1">
                            <h4 className="font-serif text-4xl text-sage">5k+</h4>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Unique Loops</p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-serif text-4xl text-sage">12</h4>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Master Artisans</p>
                        </div>
                    </div>

                    <button className="btn-secondary group flex items-center space-x-3">
                        <span>Our Manifesto</span>
                        <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            →
                        </motion.span>
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
