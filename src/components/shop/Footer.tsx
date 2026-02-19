import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t-4 border-sage/10 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Brand Tier (Centered) */}
                <div className="flex flex-col items-center mb-20 text-center">
                    <Link href="/" className="group">
                        <h3 className="font-serif text-4xl text-charcoal tracking-tighter transition-transform duration-500 group-hover:scale-105">
                            CAUGHT CRAFT
                        </h3>
                        <div className="flex items-center justify-center space-x-3 -mt-2">
                            <span className="h-px w-6 bg-sage/20" />
                            <span className="font-script text-2xl text-sage lowercase">Handed</span>
                            <span className="h-px w-6 bg-sage/20" />
                        </div>
                    </Link>
                    <p className="mt-8 text-charcoal/50 text-sm max-w-sm leading-relaxed font-light italic">
                        "Preserving the quiet art of the hook and yarn, one stitch at a time."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 border-t border-pebble pt-20">
                    {/* The Shop */}
                    <div>
                        <h4 className="font-serif text-xl text-charcoal mb-8">Shop Archives</h4>
                        <ul className="space-y-4 text-sm text-charcoal/50 font-bold uppercase tracking-widest text-[10px]">
                            <li><Link href="/products" className="hover:text-sage transition-colors">Everything</Link></li>
                            <li><Link href="/best-sellers" className="hover:text-sage transition-colors">Selected Pieces</Link></li>
                            <li><Link href="/custom-orders" className="hover:text-sage transition-colors">Custom Orders</Link></li>
                            <li><Link href="/new-arrivals" className="hover:text-sage transition-colors">Fresh Loops</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-serif text-xl text-charcoal mb-8">Studio Notes</h4>
                        <ul className="space-y-4 text-sm text-charcoal/50 font-bold uppercase tracking-widest text-[10px]">
                            <li><Link href="/shipping" className="hover:text-sage transition-colors">Shipping Archive</Link></li>
                            <li><Link href="/refunds" className="hover:text-sage transition-colors">Refund Protocol</Link></li>
                            <li><Link href="/terms" className="hover:text-sage transition-colors">Terms of Care</Link></li>
                            <li><Link href="/privacy" className="hover:text-sage transition-colors">Data Privacy</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-serif text-xl text-charcoal mb-8">Get In Touch</h4>
                        <div className="space-y-6 text-sm text-charcoal/60 font-light leading-loose">
                            <div className="flex items-start space-x-3">
                                <MapPin size={18} strokeWidth={1} className="text-sage mt-1" />
                                <span>Atelier India, <br />Global Delivery.</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail size={18} strokeWidth={1} className="text-sage" />
                                <span>hello@caughtcraft.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Community */}
                    <div className="space-y-8">
                        <h4 className="font-serif text-xl text-charcoal mb-8">Follow Our Story</h4>
                        <div className="flex space-x-6">
                            <a href="#" className="w-10 h-10 rounded-full bg-pebble flex items-center justify-center text-charcoal hover:bg-sage hover:text-white transition-all duration-500 shadow-sm"><Instagram size={18} strokeWidth={1.5} /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-pebble flex items-center justify-center text-charcoal hover:bg-sage hover:text-white transition-all duration-500 shadow-sm"><Facebook size={18} strokeWidth={1.5} /></a>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-10 border-t border-pebble flex flex-col md:flex-row justify-between items-center text-[9px] uppercase tracking-[0.3em] font-bold text-charcoal/20 space-y-4 md:space-y-0 text-center md:text-left">
                    <p>&copy; 2024 Caught Craft. All Rights Reserved.</p>
                    <div className="flex space-x-10">
                        <span>Antigravity Studio</span>
                        <span>Razorpay & Shiprocket Secure</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
