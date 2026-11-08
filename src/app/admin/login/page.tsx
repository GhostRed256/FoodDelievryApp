"use client";

import { useState, useEffect, Suspense } from "react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, ArrowRight, Loader2, ChefHat, Truck, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

function AdminLoginContent() {
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get("returnUrl") || "/admin";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // If already logged in as admin, redirect immediately to admin dashboard
    useEffect(() => {
        if (!authLoading && user && profile) {
            if (profile.role === "admin") {
                router.push(returnUrl);
            } else if (profile.role === "cook") {
                router.push("/cook");
            } else if (profile.role === "delivery") {
                router.push("/delivery");
            }
        }
    }, [user, profile, authLoading, router, returnUrl]);

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
            const loggedInUser = userCredential.user;

            const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "foodnjoy26@gmail.com").toLowerCase();
            const isSystemAdmin = loggedInUser.email && loggedInUser.email.toLowerCase() === adminEmail;

            // Check or update profile in Firestore
            const userDocRef = doc(db, "users", loggedInUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (isSystemAdmin) {
                // Ensure role is explicitly admin in Firestore
                await setDoc(userDocRef, {
                    uid: loggedInUser.uid,
                    email: loggedInUser.email,
                    displayName: loggedInUser.displayName || "Admin",
                    role: "admin",
                    photoURL: loggedInUser.photoURL || null
                }, { merge: true });
                router.push(returnUrl);
                return;
            }

            if (userDoc.exists()) {
                const data = userDoc.data();
                if (data.role === "admin" || data.role === "cook" || data.role === "delivery") {
                    router.push(data.role === "admin" ? returnUrl : `/${data.role}`);
                } else {
                    setError("This account does not have staff or admin privileges. Please sign in with registered admin credentials.");
                }
            } else {
                setError("No staff account found for this email.");
            }
        } catch (err: any) {
            if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
                setError("Invalid staff email or password. Please verify your credentials.");
            } else if (err.code === "auth/user-not-found") {
                setError("Staff account not found with this email.");
            } else {
                setError(err.message || "Failed to sign in to Admin Portal.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f7fbf8] dark:bg-[#040905] text-zinc-900 dark:text-zinc-100 p-4 py-8 selection:bg-amber-500 selection:text-black transition-colors duration-300">
            <div className="w-full max-w-[440px] space-y-6 animate-in fade-in zoom-in duration-300">
                
                {/* Header Branding */}
                <div className="flex flex-col items-center text-center">
                    <Link href="/" className="flex flex-col items-center gap-2 mb-4 active:scale-95 transition-transform group">
                        <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-emerald-500/50 shadow-xl shadow-emerald-500/15 bg-black">
                            <img src="/logo.jpg" alt="FoodNJoy Logo" className="h-full w-full object-cover scale-105" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white brand-name-text">
                            Food<span className="text-gold-metallic">N</span>Joy
                        </span>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <Shield className="h-3 w-3 text-amber-500" />
                            Official Staff & Admin Portal
                        </div>
                    </Link>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center justify-center gap-2">
                        Admin Login
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                        Sign in to access order management, live kitchen feeds, and analytics
                    </p>
                </div>

                {/* Login Form Card */}
                <div className="bg-white dark:bg-[#0c180e] p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-500/25 dark:border-amber-500/30">
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 ml-1">Admin Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500 dark:text-amber-400" />
                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-emerald-500/30 dark:border-amber-500/30 bg-zinc-50 dark:bg-[#070a07] focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                                    placeholder="foodnjoy26@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500 dark:text-amber-400" />
                                <input
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-emerald-500/30 dark:border-amber-500/30 bg-zinc-50 dark:bg-[#070a07] focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-xs text-center font-bold p-3 rounded-xl text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-900/50">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-black py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 text-sm min-h-[48px] mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin text-black" />
                                    Authenticating Admin...
                                </>
                            ) : (
                                <>
                                    <Shield className="h-4 w-4 text-black" />
                                    Sign In to Admin Dashboard
                                    <ArrowRight className="h-4 w-4 text-black" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Role Shortcuts */}
                    <div className="mt-6 pt-6 border-t border-emerald-500/20 dark:border-amber-500/20 space-y-3">
                        <p className="text-[11px] font-bold text-center text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                            Staff Dashboards
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                            <Link
                                href="/cook"
                                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-emerald-500/25 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors"
                            >
                                <ChefHat className="h-3.5 w-3.5" /> Kitchen
                            </Link>
                            <Link
                                href="/delivery"
                                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-amber-500/25 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors"
                            >
                                <Truck className="h-3.5 w-3.5" /> Delivery
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Return Link */}
                <div className="text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-amber-500 transition-colors"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" /> Return to Customer Website
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-[#f7fbf8] dark:bg-[#040905]">
                <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
            </div>
        }>
            <AdminLoginContent />
        </Suspense>
    );
}
