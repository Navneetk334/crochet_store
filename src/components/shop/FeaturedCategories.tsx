"use client";

import Link from "next/link";
import Image from "next/image";
import { memo } from "react";

const categories = [
  {
    name: "Home Decor",
    image:
      "https://res.cloudinary.com/dvk5zbu5p/image/upload/f_auto,q_auto,w_600/v1771479437/home-decor_lzyavs.jpg",
    description: "Handcrafted warmth for your living space.",
    link: "/categories/home-decor",
  },
  {
    name: "Fashion",
    image:
      "https://res.cloudinary.com/dvk5zbu5p/image/upload/f_auto,q_auto,w_600/v1771479522/sage_dream_cardigan_now0nr.jpg",
    description: "Wearable art for the modern soul.",
    link: "/categories/fashion",
  },
  {
    name: "Accessories",
    image:
      "https://res.cloudinary.com/dvk5zbu5p/image/upload/f_auto,q_auto,w_600/v1771479716/crochet-accessories_io0dvl.jpg",
    description: "Stitched with elegance and care.",
    link: "/categories/accessories",
  },
];

function FeaturedCategories() {
  return (
    <section className="py-24 bg-white border-b border-pebble">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-2">
          <p className="font-script text-3xl text-sage lowercase">
            curated with care
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-charcoal">
            Explore Collections
          </h2>
          <div className="w-16 h-1 bg-sage/20 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16 justify-center">
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex flex-col items-center group"
            >
              <Link
                href={category.link}
                className="relative block w-full text-center"
              >
                <div className="aspect-square rounded-full overflow-hidden border-4 border-pebble group-hover:border-sage transition-colors duration-300 shadow-sm relative mx-auto max-w-[240px] md:max-w-none">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 240px, 300px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-charcoal/5 group-hover:bg-transparent transition-colors duration-300" />
                </div>

                <div className="mt-6 space-y-1">
                  <h3 className="font-serif text-xl md:text-2xl text-charcoal group-hover:text-sage transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-charcoal/30 group-hover:text-sage transition-colors duration-300">
                    View Collection
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(FeaturedCategories);