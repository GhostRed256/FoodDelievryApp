"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Failed to sign in. Please verify credentials.");
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Google sign in failed.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#070a07] text-zinc-100 p-4 py-8 selection:bg-amber-500 selection:text-black">
            <div className="w-full max-w-[420px] space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center text-center">
                    <Link href="/" className="flex flex-col items-center gap-2 mb-4 active:scale-95 transition-transform group">
                        <div className="h-16 w-16 rounded-full overflow-hidden border border-amber-500/50 shadow-xl shadow-amber-500/15">
                            <img src="/logo.jpg" alt="FoodNJoy Logo" className="h-full w-full object-cover" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-white">
                            Food<span className="text-gold-metallic">NJoy</span>
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-emerald-400 -mt-1 flex items-center gap-1">
                            <Sparkles className="h-2.5 w-2.5 text-amber-400" /> Taste • Hygiene • Value
                        </span>
                    </Link>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Welcome back</h2>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                        Sign in to track orders and save your delivery details
                    </p>
                </div>

                <div className="bg-[#0c120c] p-6 sm:p-8 rounded-3xl shadow-2xl border border-amber-500/30">
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-300 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    autoCapitalize="none"
                                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-amber-500/30 bg-[#070a07] focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-base text-white placeholder:text-zinc-500"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-bold text-zinc-300">Password</label>
                                <Link href="#" className="text-xs text-amber-400 hover:underline">Forgot?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
                                <input
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-amber-500/30 bg-[#070a07] focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-base text-white placeholder:text-zinc-500"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && <p className="text-xs text-red-400 text-center font-bold bg-red-950/40 border border-red-900/50 p-2.5 rounded-xl">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-black py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 text-sm min-h-[48px] mt-2"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin text-black" /> : "Sign In"}
                            {!loading && <ArrowRight className="h-4 w-4 text-black" />}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-amber-500/20" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase">
                            <span className="bg-[#0c120c] px-3 text-zinc-500 font-bold tracking-wider">Or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full border border-amber-500/30 hover:bg-zinc-900 text-zinc-200 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] text-sm min-h-[48px] bg-black/40"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </button>
                </div>

                <p className="text-center text-xs sm:text-sm text-zinc-400">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-amber-400 font-bold hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
