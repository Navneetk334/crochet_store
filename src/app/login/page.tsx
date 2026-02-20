"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowRight, Lock, AlertCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push(callbackUrl);
      }
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory py-32 px-6">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-pebble shadow-sm">
        <div className="text-center space-y-4 mb-10">
          <Link href="/" className="inline-flex flex-col items-center">
            <span className="font-serif text-3xl text-charcoal tracking-tighter">
              CAUGHT CRAFT HANDED
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-sage font-bold">
              Secure Access
            </span>
          </Link>

          <h2 className="text-2xl font-serif text-charcoal pt-4 border-t border-pebble mt-6">
            Welcome Back
          </h2>

          <p className="text-earth-brown/60 text-sm font-light">
            Sign in to manage your orders, wishlist, and profile.
          </p>
        </div>

        <div className="space-y-4">
          {/* Google Login */}
          <button
            onClick={() => signIn("google", { callbackUrl })}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 bg-white border border-pebble py-4 rounded-xl hover:bg-pebble/30 transition-colors disabled:opacity-50"
          >
            <Image
              src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
              alt="Google"
              width={20}
              height={20}
            />
            <span className="text-sm font-medium text-charcoal">
              Continue with Google
            </span>
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pebble"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-white px-4 text-earth-brown/40">Or</span>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-4 bg-terra/5 border border-terra/20 rounded-xl text-terra text-xs font-medium">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest font-bold text-charcoal/60 ml-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className="w-full px-5 py-4 bg-pebble/30 rounded-xl focus:bg-white focus:border-sage outline-none text-sm transition-colors"
                />
                <Mail
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/20"
                  size={18}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest font-bold text-charcoal/60 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-pebble/30 rounded-xl focus:bg-white focus:border-sage outline-none text-sm transition-colors"
                />
                <Lock
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/20"
                  size={18}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{isLoading ? "Authenticating..." : "Continue"}</span>
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center space-y-4">
          <p className="text-xs text-earth-brown/60">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-sage font-bold hover:underline"
            >
              Join the Collective
            </Link>
          </p>

          <p className="text-xs text-earth-brown/60 leading-relaxed">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-sage">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-sage">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}