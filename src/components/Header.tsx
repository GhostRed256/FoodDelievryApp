"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { Utensils, User as UserIcon, LogOut, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Header() {
    const { user, profile, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-100 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-orange-600 text-white shadow-lg">
                            <Utensils className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Food<span className="text-orange-500">NJoy</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8">
                    <Link href="/" className="text-sm font-medium text-slate-600 hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-400 transition-colors">Home</Link>
                    <Link href="/menu" className="text-sm font-medium text-slate-600 hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-400 transition-colors">Menu</Link>
                    <Link href="/track" className="text-sm font-medium text-slate-600 hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-400 transition-colors">Track Order</Link>
                    {profile?.role === "admin" && <Link href="/admin" className="text-sm font-medium text-orange-600">Admin</Link>}
                    {profile?.role === "cook" && <Link href="/cook" className="text-sm font-medium text-orange-600">Kitchen</Link>}
                    {profile?.role === "delivery" && <Link href="/delivery" className="text-sm font-medium text-orange-600">Delivery</Link>}
                </nav>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1 rounded-full border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all"
                            >
                                <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center overflow-hidden">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt={user.displayName || "User"} className="h-full w-full object-cover" />
                                    ) : (
                                        <UserIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                    )}
                                </div>
                                <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300 pr-1">
                                    {profile?.displayName || user.displayName || "Account"}
                                </span>
                                <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", isProfileOpen && "rotate-180")} />
                            </button>

                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in slide-in-from-top-2">
                                        <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl transition-all">
                                            <UserIcon className="h-4 w-4" />
                                            Profile
                                        </Link>
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Log out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors">
                                Log in
                            </Link>
                            <Link href="/signup" className="hidden sm:inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-medium text-white transition-all hover:bg-slate-800 hover:scale-105 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-md">
                                Sign up
                            </Link>
                        </>
                    )}
                    <button className="md:hidden text-slate-600 dark:text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-4 animate-in slide-in-from-top-4">
                    <Link href="/" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Home</Link>
                    <Link href="/menu" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Menu</Link>
                    <Link href="/track" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Track Order</Link>
                    {!user && (
                        <Link href="/signup" className="block w-full text-center h-10 flex items-center justify-center rounded-full bg-orange-500 text-white text-sm font-medium">
                            Sign up
                        </Link>
                    )}
                </div>
            )}
        </header>
    );
}
