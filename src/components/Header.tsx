"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { Utensils, User as UserIcon, LogOut, ChevronDown, Menu, X, MapPin, ChefHat, Truck, Shield, Home, Sparkles, ShoppingCart, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Header() {
    const { user, profile, signOut } = useAuth();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
            className="sticky top-0 z-40 w-full border-b border-emerald-500/20 dark:border-amber-500/20 bg-white/95 dark:bg-[#070a07]/95 backdrop-blur-md shadow-sm dark:shadow-lg dark:shadow-black/60 relative header-pattern"
        >
            <div className="container mx-auto flex h-[72px] items-center justify-between px-4 md:px-6 relative z-10">
                {/* Brand Logo & Name */}
                <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform group">
                    <div className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-emerald-500/50 shadow-md shadow-emerald-500/20 group-hover:border-emerald-400 transition-colors bg-black">
                        <img
                            src="/logo.jpg"
                            alt="FoodNJoy Frog Chef Logo"
                            className="h-full w-full object-cover scale-105"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white flex items-center leading-tight brand-name-text">
                            Food<span className="text-gold-gradient font-black">N</span>Joy
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400 -mt-0.5 flex items-center gap-1">
                            The Tinsukia Canteen
                        </span>
                    </div>
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
                                    "text-sm font-bold transition-all py-1 relative tracking-wide",
                                    isActive
                                        ? "text-amber-600 dark:text-amber-400 font-extrabold"
                                        : "text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-300"
                                )}
                            >
                                {link.label}
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full preserve-colors" />
                                )}
                            </Link>
                        );
                    })}

                    {/* Role-Specific Badges or Staff Login Link */}
                    {profile?.role === "admin" ? (
                        <Link href="/admin" className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors">
                            <Shield className="h-3.5 w-3.5 text-amber-500" />
                            Admin Dashboard
                        </Link>
                    ) : profile?.role === "cook" ? (
                        <Link href="/cook" className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors">
                            <ChefHat className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            Kitchen
                        </Link>
                    ) : profile?.role === "delivery" ? (
                        <Link href="/delivery" className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors">
                            <Truck className="h-3.5 w-3.5 text-amber-500" />
                            Delivery
                        </Link>
                    ) : (
                        <Link href="/admin/login" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 px-2.5 py-1 rounded-full border border-zinc-300 dark:border-zinc-800 hover:border-amber-500/40 transition-colors">
                            <Shield className="h-3 w-3 text-amber-500/80" />
                            Admin
                        </Link>
                    )}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    
                    {/* Global Cart Button */}
                    <Link href="/menu" className="relative p-2 rounded-full bg-emerald-50 dark:bg-zinc-900/80 border border-emerald-500/30 dark:border-amber-500/30 hover:bg-emerald-100 dark:hover:bg-zinc-800 transition-all active:scale-95 group">
                        <ShoppingCart className="h-5 w-5 text-amber-500 dark:text-amber-400 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 dark:bg-emerald-500 text-[10px] font-black text-black shadow-sm ring-2 ring-white dark:ring-[#070a07]">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1.5 rounded-full border border-emerald-500/30 dark:border-amber-500/30 bg-emerald-50/60 dark:bg-zinc-900/80 hover:bg-emerald-100 dark:hover:bg-zinc-800 transition-all active:scale-95"
                                aria-label="User Account Menu"
                            >
                                <div className="h-8 w-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center overflow-hidden text-amber-500">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt={user.displayName || "User"} className="h-full w-full object-cover" />
                                    ) : (
                                        <UserIcon className="h-4 w-4" />
                                    )}
                                </div>
                                <span className="hidden sm:inline text-xs font-bold text-zinc-800 dark:text-zinc-200 pr-1 max-w-[100px] truncate">
                                    {profile?.displayName || user.displayName || "Account"}
                                </span>
                                <ChevronDown className={cn("h-3.5 w-3.5 text-amber-500 dark:text-amber-400 transition-transform", isProfileOpen && "rotate-180")} />
                            </button>

                            {/* Dropdown for Desktop */}
                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0d120d] border border-emerald-500/20 dark:border-amber-500/30 rounded-2xl shadow-2xl shadow-emerald-950/10 dark:shadow-black z-50 p-2 animate-in fade-in zoom-in-95">
                                        <div className="px-3 py-2.5 border-b border-emerald-500/20 dark:border-amber-500/20 mb-1">
                                            <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                                                {profile?.displayName || user.displayName || "Valued Customer"}
                                            </p>
                                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
                                            {profile?.role && profile.role !== "customer" && (
                                                <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                                                    {profile.role}
                                                </span>
                                            )}
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-emerald-50 dark:hover:bg-amber-500/10 hover:text-emerald-700 dark:hover:text-amber-300 rounded-xl transition-all"
                                        >
                                            <UserIcon className="h-4 w-4 text-amber-500" />
                                            Profile & Addresses
                                        </Link>
                                        {profile?.role === "admin" ? (
                                            <Link
                                                href="/admin"
                                                className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl transition-all"
                                            >
                                                <Shield className="h-4 w-4 text-emerald-600" />
                                                Admin Dashboard
                                            </Link>
                                        ) : (
                                            <Link
                                                href="/admin/login"
                                                className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-emerald-50 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 rounded-xl transition-all"
                                            >
                                                <Shield className="h-4 w-4 text-amber-500" />
                                                Admin Portal Login
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
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
                                className="px-3.5 py-2 text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="h-9 sm:h-10 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 px-4 sm:px-5 text-xs sm:text-sm font-extrabold text-black shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}

                    {/* Mobile Hamburger Button */}
                    <button
                        className="md:hidden p-2 text-zinc-800 dark:text-amber-400 hover:bg-emerald-50 dark:hover:bg-zinc-900 rounded-xl transition-colors active:scale-95 border border-emerald-500/20 dark:border-amber-500/20"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle Navigation Menu"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer Portaled Directly to Document Body */}
            {mounted && isMenuOpen && createPortal(
                <div className="fixed inset-0 z-[99999] md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Full-Height Sliding Side Drawer with Complete Scrollability */}
                    <div className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white dark:bg-[#070a07] border-l border-emerald-500/30 dark:border-amber-500/30 shadow-2xl overflow-y-auto overscroll-contain animate-in slide-in-from-right duration-300 text-zinc-900 dark:text-white">
                        <div className="flex flex-col min-h-full justify-between p-5 sm:p-6 pb-28 gap-6">
                            <div className="space-y-5">
                                {/* Drawer Header */}
                                <div className="flex items-center justify-between pb-3.5 border-b border-emerald-500/20 dark:border-amber-500/20">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-10 w-10 rounded-full overflow-hidden border border-emerald-500/50 bg-black shrink-0">
                                            <img src="/logo.jpg" alt="Logo" className="h-full w-full object-cover scale-105" />
                                        </div>
                                        <div>
                                            <span className="text-base font-black brand-name-text">
                                                Food<span className="text-gold-gradient font-black">N</span>Joy
                                            </span>
                                            <p className="text-[9px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                                Tinsukia Canteen
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsMenuOpen(false)}
                                        className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                        aria-label="Close menu"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Main Navigation Links */}
                                <div className="space-y-1.5">
                                    {navLinks.map((link) => {
                                        const Icon = link.icon;
                                        const isActive = pathname === link.href;
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all border",
                                                    isActive
                                                        ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border-emerald-500/40 shadow-sm"
                                                        : "text-zinc-800 dark:text-zinc-200 border-transparent hover:bg-emerald-50 dark:hover:bg-zinc-900 hover:text-emerald-700 dark:hover:text-emerald-300"
                                                )}
                                            >
                                                <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                <span>{link.label}</span>
                                            </Link>
                                        );
                                    })}

                                    {/* Cart Quick Shortcut */}
                                    <Link
                                        href="/menu"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-all"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <ShoppingCart className="h-4 w-4 text-amber-500" />
                                            <span>View Cart & Bill</span>
                                        </div>
                                        {cartCount > 0 && (
                                            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-xs font-black">
                                                {cartCount} items
                                            </span>
                                        )}
                                    </Link>
                                </div>

                                {/* Popular Canteen Menu Categories Quick Jump */}
                                <div className="pt-2">
                                    <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 px-1 mb-2 flex items-center justify-between">
                                        <span>Popular Categories</span>
                                        <Link href="/menu" onClick={() => setIsMenuOpen(false)} className="text-amber-500 hover:underline">
                                            All Menu &rarr;
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
                                        {[
                                            "Chicken Specialities",
                                            "Vegetarian Specialities",
                                            "Momos",
                                            "Hakka Noodles",
                                            "Fried Rice",
                                            "Milkshakes"
                                        ].map((catName) => (
                                            <Link
                                                key={catName}
                                                href={`/menu`}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-emerald-500/15 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-amber-400/50 hover:text-amber-600 dark:hover:text-amber-400 truncate text-[11px]"
                                            >
                                                {catName}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Delivery Agent Contact Shortcut */}
                                <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600/15 via-green-600/15 to-emerald-700/15 border border-emerald-500/30 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                            <Phone className="h-4 w-4 fill-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Delivery Agent</p>
                                            <p className="text-xs font-black text-emerald-800 dark:text-emerald-300">+91 91810 42005</p>
                                        </div>
                                    </div>
                                    <a
                                        href="https://api.whatsapp.com/send?phone=919181042005&text=Hello%20FoodNJoy%20Delivery%20Agent"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black transition-all active:scale-95"
                                    >
                                        WhatsApp
                                    </a>
                                </div>

                                {/* Theme Mode */}
                                <div className="pt-2 px-1 flex items-center justify-between border-t border-emerald-500/20 dark:border-amber-500/20">
                                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Theme Mode</span>
                                    <ThemeToggle />
                                </div>

                                {/* Staff & Management Section */}
                                <div className="pt-3 border-t border-emerald-500/20 dark:border-amber-500/20 space-y-2">
                                    <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 px-2 flex items-center gap-1.5">
                                        <Shield className="h-3 w-3 text-amber-500" />
                                        Staff & Management
                                    </div>
                                    {profile?.role === "admin" ? (
                                        <Link
                                            href="/admin"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                                        >
                                            <Shield className="h-4 w-4 text-amber-500" />
                                            Admin Dashboard (Menu & Orders)
                                        </Link>
                                    ) : profile?.role === "cook" ? (
                                        <Link
                                            href="/cook"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                                        >
                                            <ChefHat className="h-4 w-4 text-emerald-500" />
                                            Kitchen Dashboard
                                        </Link>
                                    ) : profile?.role === "delivery" ? (
                                        <Link
                                            href="/delivery"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                                        >
                                            <Truck className="h-4 w-4 text-amber-500" />
                                            Delivery Dashboard
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/admin/login"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 transition-colors"
                                        >
                                            <Shield className="h-4 w-4 text-amber-500" />
                                            Admin Login Portal
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Bottom Auth Actions */}
                            <div className="pt-4 border-t border-emerald-500/20 dark:border-amber-500/20 space-y-3">
                                {user ? (
                                    <>
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-emerald-500/30 dark:border-amber-500/30 font-bold text-sm text-zinc-800 dark:text-zinc-200 bg-emerald-50/50 dark:bg-zinc-900/60"
                                        >
                                            <UserIcon className="h-4 w-4 text-amber-500" />
                                            My Profile
                                        </Link>
                                        <button
                                            onClick={() => { signOut(); setIsMenuOpen(false); }}
                                            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-900/50 font-bold text-sm"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Log Out
                                        </button>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/login"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center justify-center py-3.5 rounded-2xl border border-emerald-500/30 dark:border-amber-500/30 font-bold text-sm text-zinc-800 dark:text-zinc-200 bg-emerald-50/50 dark:bg-zinc-900/60"
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center justify-center py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-sm shadow-lg shadow-amber-500/20"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </header>
    );
}
