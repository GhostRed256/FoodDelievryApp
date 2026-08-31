"use client";

import { useAuth } from "@/lib/AuthContext";
import Header from "@/components/Header";
import { User, Mail, Shield, LogOut, Camera, MapPin, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
    const { user, profile, loading, signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#070a07]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <main className="flex min-h-screen flex-col bg-[#070a07] text-zinc-100 font-sans pb-16 selection:bg-amber-500 selection:text-black">
            <Header />
            <div className="container mx-auto py-8 sm:py-12 px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 pb-4 border-b border-amber-500/20">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                            <Sparkles className="h-3 w-3 text-emerald-400" />
                            Account Profile
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white">
                            Customer <span className="text-gold-metallic">Settings</span>
                        </h1>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Left Col: Avatar and Basic Info */}
                        <div className="md:col-span-1 space-y-6">
                            <div className="bg-[#0c120c] p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-xl flex flex-col items-center">
                                <div className="relative group">
                                    <div className="h-28 w-28 rounded-full bg-black/80 flex items-center justify-center overflow-hidden border-4 border-amber-500/40 shadow-xl">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt={user.displayName || ""} className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="h-12 w-12 text-amber-400" />
                                        )}
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2 bg-amber-500 rounded-full text-black shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="h-4 w-4" />
                                    </button>
                                </div>
                                <h2 className="mt-4 text-lg font-black text-white text-center">
                                    {profile?.displayName || user.displayName || "Valued Customer"}
                                </h2>
                                <div className="mt-2 inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                    <Shield className="h-3 w-3 text-emerald-400" />
                                    {profile?.role || "Customer"}
                                </div>
                            </div>

                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center justify-center gap-2 bg-red-950/30 hover:bg-red-950/60 p-4 rounded-2xl border border-red-900/40 text-red-400 font-black shadow-md transition-all text-sm active:scale-[0.98]"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out Account
                            </button>
                        </div>

                        {/* Right Col: Detailed Info & Saved Addresses */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-[#0c120c] p-6 sm:p-8 rounded-3xl border border-amber-500/20 shadow-xl">
                                <h3 className="text-base sm:text-lg font-black text-white mb-6">Profile Credentials</h3>
                                <div className="grid gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-zinc-400">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
                                            <input
                                                type="text"
                                                readOnly
                                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#080c08] border border-amber-500/20 text-white font-bold text-sm outline-none cursor-not-allowed"
                                                value={profile?.displayName || user.displayName || ""}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-zinc-400">Registered Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
                                            <input
                                                type="email"
                                                readOnly
                                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#080c08] border border-amber-500/20 text-white font-bold text-sm outline-none cursor-not-allowed"
                                                value={user.email || ""}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#0c120c] p-6 sm:p-8 rounded-3xl border border-amber-500/20 shadow-xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-base sm:text-lg font-black text-white">Saved Delivery Addresses</h3>
                                    <span className="text-xs font-bold text-amber-400">Tinsukia Local</span>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#080c08] border border-amber-500/20">
                                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-black text-white text-sm">Primary Residence</p>
                                        <p className="text-xs text-zinc-400 mt-0.5">Tinsukia Central Market / Residential Hub, Assam</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
