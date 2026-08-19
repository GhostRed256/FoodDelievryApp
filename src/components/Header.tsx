"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { Utensils, User as UserIcon, LogOut, ChevronDown, Menu, X, MapPin, ChefHat, Truck, Shield, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
    const { user, profile, signOut } = useAuth();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Auto-close mobile drawer on route change
    useEffect(() => {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    const navLinks = [
        { href: "/", label: "Home", icon: Home },
        { href: "/menu", label: "Menu", icon: Utensils },
        { href: "/track", label: "Track Order", icon: MapPin },
    ];

    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-2.5 active:scale-95 transition-transform">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20">
                        <Utensils className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Food<span className="text-orange-500">NJoy</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-7">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-semibold transition-colors py-1 relative",
                                    isActive
                                        ? "text-orange-600 dark:text-orange-400"
                                        : "text-slate-600 hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-400"
                                )}
                            >
                                {link.label}
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
                                )}
                            </Link>
                        );
                    })}

                    {/* Role-Specific Links */}
                    {profile?.role === "admin" && (
                        <Link href="/admin" className="text-sm font-bold text-orange-600 flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40">
                            <Shield className="h-3.5 w-3.5" />
                            Admin
                        </Link>
                    )}
                    {profile?.role === "cook" && (
                        <Link href="/cook" className="text-sm font-bold text-orange-600 flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40">
                            <ChefHat className="h-3.5 w-3.5" />
                            Kitchen
                        </Link>
                    )}
                    {profile?.role === "delivery" && (
                        <Link href="/delivery" className="text-sm font-bold text-orange-600 flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40">
                            <Truck className="h-3.5 w-3.5" />
                            Delivery
                        </Link>
                    )}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1.5 rounded-full border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all active:scale-95"
                                aria-label="User Account Menu"
                            >
                                <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center overflow-hidden text-orange-600 dark:text-orange-400">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt={user.displayName || "User"} className="h-full w-full object-cover" />
                                    ) : (
                                        <UserIcon className="h-4 w-4" />
                                    )}
                                </div>
                                <span className="hidden sm:inline text-xs font-bold text-slate-700 dark:text-slate-300 pr-1 max-w-[100px] truncate">
                                    {profile?.displayName || user.displayName || "Account"}
                                </span>
                                <ChevronDown className={cn("h-3.5 w-3.5 text-slate-400 transition-transform", isProfileOpen && "rotate-180")} />
                            </button>

                            {/* Dropdown for Desktop */}
                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95">
                                        <div className="px-3 py-2 border-b border-slate-100 dark:border-zinc-800 mb-1">
                                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                                {profile?.displayName || user.displayName || "Customer"}
                                            </p>
                                            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                                            {profile?.role && profile.role !== "customer" && (
                                                <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400">
                                                    {profile.role}
                                                </span>
                                            )}
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
                                        >
                                            <UserIcon className="h-4 w-4 text-slate-400" />
                                            Profile & Addresses
                                        </Link>
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-orange-500 transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="h-9 sm:h-10 items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 px-4 sm:px-5 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/25 transition-all active:scale-95 flex"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}

                    {/* Mobile Hamburger Button */}
                    <button
                        className="md:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors active:scale-95"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle Mobile Navigation"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="fixed top-16 right-0 left-0 bottom-0 z-50 bg-white dark:bg-zinc-950 md:hidden flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-top-4 duration-300">
                        <div className="space-y-2">
                            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-3 mb-2">
                                Navigation
                            </div>
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-base font-bold transition-all",
                                            isActive
                                                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                                                : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-900"
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}

                            {/* Staff Dashboard Links */}
                            {profile?.role && profile.role !== "customer" && (
                                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 mt-4 space-y-2">
                                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-3 mb-2">
                                        Staff Portal ({profile.role})
                                    </div>
                                    {profile.role === "admin" && (
                                        <Link
                                            href="/admin"
                                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400"
                                        >
                                            <Shield className="h-4 w-4" />
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    {profile.role === "cook" && (
                                        <Link
                                            href="/cook"
                                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400"
                                        >
                                            <ChefHat className="h-4 w-4" />
                                            Kitchen Dashboard
                                        </Link>
                                    )}
                                    {profile.role === "delivery" && (
                                        <Link
                                            href="/delivery"
                                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400"
                                        >
                                            <Truck className="h-4 w-4" />
                                            Delivery Dashboard
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bottom Actions */}
                        <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 space-y-3">
                            {user ? (
                                <>
                                    <Link
                                        href="/profile"
                                        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 font-bold text-sm text-slate-800 dark:text-white"
                                    >
                                        <UserIcon className="h-4 w-4 text-orange-500" />
                                        My Profile
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-600 font-bold text-sm"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Log Out
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/login"
                                        className="flex items-center justify-center py-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 font-bold text-sm text-slate-800 dark:text-white"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="flex items-center justify-center py-3.5 rounded-2xl bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-500/20"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </header>
    );
}
