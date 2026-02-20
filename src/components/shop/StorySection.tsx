"use client";

import Image from "next/image";
import { memo } from "react";

function StorySection() {
  return (
    <section className="py-24 bg-white border-b border-pebble overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Visual Side */}
        <div className="relative">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="https://res.cloudinary.com/dvk5zbu5p/image/upload/f_auto,q_auto,w_900/v1771480033/artisans_rmezjq.jpg"
              alt="The Artisan at Work"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Floating Detail */}
          <div className="absolute -bottom-10 -right-10 w-1/2 aspect-square rounded-2xl overflow-hidden shadow-md border-4 border-white hidden md:block">
            <Image
              src="https://res.cloudinary.com/dvk5zbu5p/image/upload/f_auto,q_auto,w_600/v1771480158/closeup_ha5oxi.jpg"
              alt="Crochet Detail Close-up"
              fill
              sizes="300px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Text Side */}
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="font-script text-3xl text-sage lowercase">
                from our home to yours
              </p>
              <h2 className="text-5xl md:text-6xl font-serif text-charcoal leading-tight">
                Woven with Love, <br />
                <span className="text-terra italic">
                  Handed with Care.
                </span>
              </h2>
            </div>

            <div className="space-y-6 text-charcoal/70 text-base md:text-lg font-light leading-relaxed">
              <p>
                Magic happens in the quiet moments between stitches. At
                Caught Craft Handed, we celebrate slow craft.
              </p>
              <p>
                What started as a passion for crochet has grown into a
                collective preserving traditional techniques for a modern world.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 py-8 border-y border-pebble">
            <div>
              <h4 className="font-serif text-4xl text-sage">5k+</h4>
              <p className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40">
                Unique Loops
              </p>
            </div>
            <div>
              <h4 className="font-serif text-4xl text-sage">12</h4>
              <p className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40">
                Master Artisans
              </p>
            </div>
          </div>

          <button className="btn-secondary flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span>Our Manifesto</span>
            <span className="translate-x-0 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default memo(StorySection);