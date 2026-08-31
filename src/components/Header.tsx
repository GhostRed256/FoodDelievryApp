"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { Utensils, User as UserIcon, LogOut, ChevronDown, Menu, X, MapPin, ChefHat, Truck, Shield, Home, Sparkles, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Header() {
    const { user, profile, signOut } = useAuth();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
    }, [pathname]);

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

    const [cartCount, setCartCount] = useState(0);

    // Sync cart count from localStorage globally across the app
    useEffect(() => {
        const updateCartCount = () => {
            const savedCart = localStorage.getItem("foodnjoy_cart");
            if (savedCart) {
                try {
                    const parsed = JSON.parse(savedCart);
                    const count = parsed.reduce((a: number, b: any) => a + (b.quantity || 0), 0);
                    setCartCount(count);
                } catch (e) {
                    setCartCount(0);
                }
            } else {
                setCartCount(0);
            }
        };

        updateCartCount(); 
        window.addEventListener("cartUpdated", updateCartCount);
        window.addEventListener("storage", updateCartCount); // Handles cross-tab cart updates
        
        return () => {
            window.removeEventListener("cartUpdated", updateCartCount);
            window.removeEventListener("storage", updateCartCount);
        };
    }, []);

    return (
        <header 
            className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-[#070a07]/95 backdrop-blur-md shadow-lg shadow-black/60 relative"
            style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23fbbf24\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' 
            }}
        >
            <div className="container mx-auto flex h-18 items-center justify-between px-4 md:px-6 relative z-10">
                {/* Brand Logo & Name */}
                <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform group">
                    <div className="relative h-11 w-11 rounded-full overflow-hidden border border-amber-500/40 shadow-md shadow-amber-500/10 group-hover:border-amber-400 transition-colors">
                        <img
                            src="/logo.jpg"
                            alt="FoodNJoy Logo"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tight text-white flex items-center">
                            Food<span className="text-gold-gradient">N</span>Joy
                        </span>
                        <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-emerald-400 -mt-1 flex items-center gap-1">
                            Taste • Hygiene • Value
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-bold transition-all py-1 relative tracking-wide",
                                    isActive
                                        ? "text-amber-400"
                                        : "text-zinc-300 hover:text-amber-300"
                                )}
                            >
                                {link.label}
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full preserve-colors" />
                                )}
                            </Link>
                        );
                    })}

                    {/* Role-Specific Badges */}
                    {profile?.role === "admin" && (
                        <Link href="/admin" className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                            <Shield className="h-3.5 w-3.5 text-amber-400" />
                            Admin
                        </Link>
                    )}
                    {profile?.role === "cook" && (
                        <Link href="/cook" className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                            <ChefHat className="h-3.5 w-3.5 text-emerald-400" />
                            Kitchen
                        </Link>
                    )}
                    {profile?.role === "delivery" && (
                        <Link href="/delivery" className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                            <Truck className="h-3.5 w-3.5 text-amber-400" />
                            Delivery
                        </Link>
                    )}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    
                    {/* Global Cart Button */}
                    <Link href="/menu" className="relative p-2 rounded-full bg-zinc-900/80 border border-amber-500/30 hover:bg-zinc-800 transition-all active:scale-95 group">
                        <ShoppingCart className="h-5 w-5 text-amber-400 group-hover:text-amber-300 transition-colors" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-black shadow-sm ring-2 ring-[#070a07]">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1.5 rounded-full border border-amber-500/30 bg-zinc-900/80 hover:bg-zinc-800 transition-all active:scale-95"
                                aria-label="User Account Menu"
                            >
                                <div className="h-8 w-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center overflow-hidden text-amber-400">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt={user.displayName || "User"} className="h-full w-full object-cover" />
                                    ) : (
                                        <UserIcon className="h-4 w-4" />
                                    )}
                                </div>
                                <span className="hidden sm:inline text-xs font-bold text-zinc-200 pr-1 max-w-[100px] truncate">
                                    {profile?.displayName || user.displayName || "Account"}
                                </span>
                                <ChevronDown className={cn("h-3.5 w-3.5 text-amber-400 transition-transform", isProfileOpen && "rotate-180")} />
                            </button>

                            {/* Dropdown for Desktop */}
                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-56 bg-[#0d120d] border border-amber-500/30 rounded-2xl shadow-2xl shadow-black z-50 p-2 animate-in fade-in zoom-in-95">
                                        <div className="px-3 py-2.5 border-b border-amber-500/20 mb-1">
                                            <p className="text-xs font-bold text-white truncate">
                                                {profile?.displayName || user.displayName || "Valued Customer"}
                                            </p>
                                            <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                                            {profile?.role && profile.role !== "customer" && (
                                                <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                                    {profile.role}
                                                </span>
                                            )}
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-zinc-200 hover:bg-amber-500/10 hover:text-amber-300 rounded-xl transition-all"
                                        >
                                            <UserIcon className="h-4 w-4 text-amber-400" />
                                            Profile & Addresses
                                        </Link>
                                        {profile?.role === "admin" && (
                                            <Link
                                                href="/admin"
                                                className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-zinc-200 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-xl transition-all"
                                            >
                                                <Shield className="h-4 w-4 text-emerald-400" />
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-red-400 hover:bg-red-950/30 rounded-xl transition-all"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="hidden sm:flex items-center gap-2">
                            <Link
                                href="/login"
                                className="px-3.5 py-2 text-xs sm:text-sm font-bold text-zinc-300 hover:text-amber-400 transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="h-9 sm:h-10 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-4 sm:px-5 text-xs sm:text-sm font-extrabold text-black shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}

                    {/* Mobile Hamburger Button */}
                    <button
                        className="md:hidden p-2 text-amber-400 hover:bg-zinc-900 rounded-xl transition-colors active:scale-95 border border-amber-500/20"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle Navigation Menu"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 top-18 z-40 bg-black/80 backdrop-blur-sm md:hidden animate-in fade-in"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="fixed top-18 right-0 left-0 bottom-0 z-50 bg-[#0a0e0a] border-t border-amber-500/20 md:hidden flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-top-4 duration-300">
                        <div className="space-y-3">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/80 px-3 mb-2 flex items-center gap-1.5">
                                <Sparkles className="h-3 w-3 text-emerald-400" />
                                Taste • Hygiene • Value
                            </div>
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-base font-bold transition-all border",
                                            isActive
                                                ? "bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-lg shadow-amber-500/10"
                                                : "text-zinc-200 border-transparent hover:bg-zinc-900 hover:text-amber-300"
                                        )}
                                    >
                                        <Icon className="h-5 w-5 text-amber-400" />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}

                            {/* Staff Role Section */}
                            {profile?.role && profile.role !== "customer" && (
                                <div className="pt-4 border-t border-amber-500/20 mt-4 space-y-2">
                                    <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400 px-3 mb-2">
                                        Staff Portal ({profile.role})
                                    </div>
                                    {profile.role === "admin" && (
                                        <Link
                                            href="/admin"
                                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                        >
                                            <Shield className="h-4 w-4" />
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    {profile.role === "cook" && (
                                        <Link
                                            href="/cook"
                                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                        >
                                            <ChefHat className="h-4 w-4" />
                                            Kitchen Dashboard
                                        </Link>
                                    )}
                                    {profile.role === "delivery" && (
                                        <Link
                                            href="/delivery"
                                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                        >
                                            <Truck className="h-4 w-4" />
                                            Delivery Dashboard
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bottom Auth Actions */}
                        <div className="pt-6 border-t border-amber-500/20 space-y-3">
                            {user ? (
                                <>
                                    <Link
                                        href="/profile"
                                        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-amber-500/30 font-bold text-sm text-zinc-200 bg-zinc-900/60"
                                    >
                                        <UserIcon className="h-4 w-4 text-amber-400" />
                                        My Profile
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-red-950/40 text-red-400 border border-red-900/50 font-bold text-sm"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Log Out
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/login"
                                        className="flex items-center justify-center py-3.5 rounded-2xl border border-amber-500/30 font-bold text-sm text-zinc-200 bg-zinc-900/60"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="flex items-center justify-center py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-sm shadow-lg shadow-amber-500/20"
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
