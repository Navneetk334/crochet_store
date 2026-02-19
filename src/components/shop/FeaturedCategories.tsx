"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
    {
        name: "Home Decor",
        image: "https://res.cloudinary.com/dvk5zbu5p/image/upload/v1771479437/home-decor_lzyavs.jpg",
        description: "Handcrafted warmth for your living space.",
        link: "/categories/home-decor",
    },
    {
        name: "Fashion",
        image: "https://res.cloudinary.com/dvk5zbu5p/image/upload/v1771479522/sage_dream_cardigan_now0nr.jpg",
        description: "Wearable art for the modern soul.",
        link: "/categories/fashion",
    },
    {
        name: "Accessories",
        image: "https://res.cloudinary.com/dvk5zbu5p/image/upload/v1771479716/crochet-accessories_io0dvl.jpg",
        description: "Stitched with elegance and care.",
        link: "/categories/accessories",
    },
];

export default function FeaturedCategories() {
    return (
        <section className="py-24 bg-white border-b border-pebble">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 space-y-2">
                    <p className="font-script text-3xl text-sage lowercase">curated with care</p>
                    <h2 className="text-4xl md:text-5xl font-serif text-charcoal">Explore Collections</h2>
                    <div className="w-16 h-1 bg-sage/20 mx-auto mt-4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16 justify-center">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center group"
                        >
                            <Link href={category.link} className="relative block w-full text-center focus:outline-none">
                                <div className="aspect-square rounded-full overflow-hidden border-4 border-pebble group-hover:border-sage transition-all duration-500 shadow-md relative mx-auto max-w-[240px] md:max-w-none">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-charcoal/5 group-hover:bg-transparent transition-colors duration-500" />
                                </div>

                                <div className="mt-6 space-y-1">
                                    <h3 className="font-serif text-xl md:text-2xl text-charcoal group-hover:text-sage transition-colors">{category.name}</h3>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-charcoal/30 group-hover:text-sage transition-colors duration-300">View Collection</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
