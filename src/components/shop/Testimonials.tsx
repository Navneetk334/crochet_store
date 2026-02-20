"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { memo } from "react";

const testimonials = [
  {
    name: "Ananya Sharma",
    role: "Lifestyle Blogger",
    content:
      "The quality of the crochet cardigan exceeded all my expectations. It feels so premium and the detail is simply breathtaking. It's my favorite piece this winter!",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=70&w=300",
  },
  {
    name: "Vikram Malhotra",
    role: "Interior Designer",
    content:
      "Caught Craft Handed's wall hangings bring a unique warmth to my clients' homes. The craftsmanship is world-class, and the communication was effortless.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=70&w=300",
  },
  {
    name: "Sneha Kapur",
    role: "Art Collector",
    content:
      "I love supporting local artisans who put their soul into their work. Each piece I've bought feels like a tiny treasure. Truly a work of art.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=70&w=300",
  },
];

function Testimonials() {
  return (
    <section className="py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 space-y-2">
          <p className="font-script text-3xl text-sage lowercase">
            testimonials
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-charcoal leading-tight">
            Voices of the Craft
          </h2>
          <div className="w-16 h-1 bg-terra/20 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="relative bg-white p-10 rounded-2xl shadow-md border border-pebble flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="absolute -top-4 bg-sage text-white p-3 rounded-full shadow-md">
                <Quote size={20} />
              </div>

              <div className="relative w-24 h-24 rounded-full overflow-hidden mb-8 border-4 border-pebble">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>

              <div className="space-y-6">
                <p className="text-charcoal/60 italic leading-relaxed text-base font-light">
                  "{testimonial.content}"
                </p>
                <div>
                  <h4 className="font-serif text-charcoal text-xl">
                    {testimonial.name}
                  </h4>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-sage font-bold mt-1">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Testimonials);