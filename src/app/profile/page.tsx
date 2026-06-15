"use client";

import { useAuth } from "@/lib/AuthContext";
import Header from "@/components/Header";
import { User, Mail, Shield, LogOut, Camera, MapPin } from "lucide-react";
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
            <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-zinc-950 font-sans">
            <Header />
            <div className="container mx-auto py-12 px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Account Settings</h1>

                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Left Col: Avatar and Basic Info */}
                        <div className="md:col-span-1 space-y-6">
                            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col items-center">
                                <div className="relative group">
                                    <div className="h-32 w-32 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center overflow-hidden border-4 border-white dark:border-zinc-800 shadow-lg">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt={user.displayName || ""} className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="h-12 w-12 text-orange-500" />
                                        )}
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2 bg-orange-500 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="h-4 w-4" />
                                    </button>
                                </div>
                                <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{profile?.displayName || user.displayName || "User"}</h2>
                                <div className="mt-2 inline-flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    <Shield className="h-3 w-3" />
                                    {profile?.role}
                                </div>
                            </div>

                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 text-red-600 font-bold shadow-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                            >
                                <LogOut className="h-5 w-5" />
                                Sign Out
                            </button>
                        </div>

                        {/* Right Col: Detailed Form */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Personal Information</h3>
                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-500">Display Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                type="text"
                                                readOnly
                                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 text-slate-900 dark:text-white outline-none cursor-not-allowed"
                                                value={profile?.displayName || user.displayName || ""}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-500">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                type="email"
                                                readOnly
                                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 text-slate-900 dark:text-white outline-none cursor-not-allowed"
                                                value={user.email || ""}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex justify-between items-center">
                                    Saved Addresses
                                    <button className="text-sm text-orange-600 hover:underline">Add New</button>
                                </h3>
                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800">
                                    <div className="p-2 bg-white dark:bg-zinc-900 rounded-lg">
                                        <MapPin className="h-5 w-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">Home</p>
                                        <p className="text-xs text-slate-500 mt-0.5">123 Pinecrest Ave, Apt 4B, Sector 5</p>
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
