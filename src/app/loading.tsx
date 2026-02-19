export default function Loading() {
    return (
        <div className="bg-ivory min-h-screen flex items-center justify-center">
            <div className="space-y-8 text-center">
                <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border-4 border-pebble rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-sage rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-4 bg-pebble rounded-full flex items-center justify-center">
                        <span className="text-sage text-2xl font-serif">C</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="font-serif text-2xl text-charcoal italic animate-pulse">Woven memories are loading...</p>
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-earth-brown/40">Caught Craft Handed</p>
                </div>
            </div>
        </div>
    );
}
