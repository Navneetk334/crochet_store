import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="bg-ivory min-h-screen pt-44 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">

                    {/* Left: Contact Info */}
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <span className="text-terra font-bold tracking-[0.3em] uppercase text-xs">Get in Touch</span>
                            <h1 className="text-5xl md:text-6xl font-serif text-charcoal">Reach Out to <br />Our Studio</h1>
                            <p className="text-charcoal/60 text-lg font-light leading-relaxed max-w-md">
                                Have a custom request or just want to say hello? We love hearing from fellow craft enthusiasts.
                            </p>
                        </div>

                        <div className="space-y-8 pt-8">
                            <div className="flex items-center space-x-6 group">
                                <div className="p-4 bg-white rounded-2xl shadow-sm border border-pebble group-hover:bg-sage group-hover:text-white transition-all">
                                    <Mail size={24} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Email Us</p>
                                    <p className="text-charcoal font-serif text-xl">hello@caughtcraft.com</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-6 group">
                                <div className="p-4 bg-white rounded-2xl shadow-sm border border-pebble group-hover:bg-sage group-hover:text-white transition-all">
                                    <Phone size={24} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Call Us</p>
                                    <p className="text-charcoal font-serif text-xl">+91 98765 43210</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-6 group">
                                <div className="p-4 bg-white rounded-2xl shadow-sm border border-pebble group-hover:bg-sage group-hover:text-white transition-all">
                                    <MapPin size={24} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40">Studio</p>
                                    <p className="text-charcoal font-serif text-xl">Jaipur, Rajasthan, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Modern Form */}
                    <div className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-pebble relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sage/5 rounded-full blur-3xl -z-10" />

                        <form className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Arjun Sharma"
                                        className="w-full bg-ivory px-6 py-4 rounded-2xl border border-transparent focus:border-sage outline-none transition-all placeholder:text-charcoal/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="arjun@example.com"
                                        className="w-full bg-ivory px-6 py-4 rounded-2xl border border-transparent focus:border-sage outline-none transition-all placeholder:text-charcoal/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 ml-1">Subject</label>
                                <select className="w-full bg-ivory px-6 py-4 rounded-2xl border border-transparent focus:border-sage outline-none transition-all appearance-none cursor-pointer text-charcoal/60">
                                    <option>Custom Commission</option>
                                    <option>Product Inquiry</option>
                                    <option>Wholesale Order</option>
                                    <option>Just saying hello</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 ml-1">Your Message</label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us about your project..."
                                    className="w-full bg-ivory px-6 py-4 rounded-2xl border border-transparent focus:border-sage outline-none transition-all placeholder:text-charcoal/20 resize-none"
                                />
                            </div>

                            <button className="w-full btn-primary py-5 flex items-center justify-center space-x-3 text-sm tracking-widest uppercase shadow-lg hover:shadow-sage/20">
                                <span>Send Message</span>
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
