import AboutSection from "@/components/shop/AboutSection";
import StorySection from "@/components/shop/StorySection";

export default function AboutPage() {
    return (
        <div className="bg-ivory min-h-screen pt-44">
            {/* Header / Intro */}
            <section className="py-24 bg-white border-b border-pebble">
                <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
                    <span className="text-sage font-bold tracking-[0.4em] uppercase text-[10px]">The Brand Story</span>
                    <h1 className="text-5xl md:text-7xl font-serif text-charcoal leading-tight">
                        Preserving the <br />
                        <span className="italic text-terra">Art of the Slow.</span>
                    </h1>
                    <div className="w-20 h-1 bg-sage/20 mx-auto" />
                </div>
            </section>

            {/* Reuse existing high-quality sections */}
            <AboutSection />
            <StorySection />

            {/* Mission Section */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div className="space-y-4">
                        <h3 className="font-serif text-2xl text-charcoal">Our Mission</h3>
                        <p className="text-charcoal/60 text-sm leading-relaxed">
                            To bring the tactile warmth of handcrafted crochet into modern homes, fostering a deeper connection with the objects we live with.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-serif text-2xl text-charcoal">Artisan First</h3>
                        <p className="text-charcoal/60 text-sm leading-relaxed">
                            Every piece supports a network of skilled artisans who are masters of traditional needlework and organic dyeing.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-serif text-2xl text-charcoal">Pure Materials</h3>
                        <p className="text-charcoal/60 text-sm leading-relaxed">
                            We use only 100% natural fibers, sourced from ethical producers who prioritize the planet as much as the craft.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
