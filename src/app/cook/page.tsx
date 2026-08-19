"use client";

import RoleGuard from "@/components/RoleGuard";
import Header from "@/components/Header";
import { ChefHat, Clock, CheckCircle, AlertCircle, ShoppingBag, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { orderService, Order } from "@/lib/orderService";
import { formatDistanceToNow } from "date-fns";

export default function CookDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = orderService.subscribeToOrders({ role: "cook" }, (updatedOrders) => {
            setOrders(updatedOrders);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const updateStatus = async (orderId: string, status: any) => {
        try {
            await orderService.updateOrderStatus(orderId, status);
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const newOrders = orders.filter(o => o.status === "confirmed");
    const preparingOrders = orders.filter(o => o.status === "preparing");
    const readyOrders = orders.filter(o => o.status === "ready");

    return (
        <RoleGuard allowedRoles={["admin", "cook"]}>
            <main className="flex min-h-screen flex-col bg-[#070a07] text-zinc-100 font-sans pb-16 selection:bg-amber-500 selection:text-black">
                <Header />
                <div className="container mx-auto py-8 px-4 md:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-amber-500/20">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                                <Sparkles className="h-3 w-3 text-amber-400" />
                                Kitchen Display System (KDS)
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                                <ChefHat className="h-7 w-7 text-emerald-400" />
                                Chef's <span className="text-gold-metallic">Kitchen Board</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-4 py-2 rounded-full text-emerald-400 text-xs font-black uppercase tracking-wider self-start sm:self-auto shadow-sm">
                            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            Live Station
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Column 1: Confirmed Orders (Incoming) */}
                        <div className="space-y-6">
                            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-400" />
                                New Confirmed
                                {newOrders.length > 0 && (
                                    <span className="bg-amber-500 text-black text-[10px] px-2 py-0.5 rounded-full font-black animate-bounce">
                                        {newOrders.length}
                                    </span>
                                )}
                            </h2>
                            <div className="space-y-4">
                                {newOrders.length === 0 ? (
                                    <div className="text-center py-12 text-zinc-500 bg-[#0c120c] rounded-3xl border border-dashed border-zinc-800 font-bold">
                                        No incoming orders.
                                    </div>
                                ) : (
                                    newOrders.map((order) => (
                                        <div key={order.id} className="bg-[#0c120c] p-5 rounded-3xl border-2 border-amber-500/40 shadow-xl animate-in fade-in slide-in-from-left-4">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="font-black text-lg text-white">Order #{order.id.slice(-4).toUpperCase()}</p>
                                                    <p className="text-xs text-zinc-400">
                                                        {order.createdAt ? formatDistanceToNow(order.createdAt.toDate(), { addSuffix: true }) : "Just now"}
                                                    </p>
                                                </div>
                                                <span className="text-amber-400 font-black bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-full text-[10px] uppercase">
                                                    Action Required
                                                </span>
                                            </div>
                                            <div className="space-y-2 border-y border-amber-500/20 py-3 my-3 text-sm">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between font-bold text-zinc-200">
                                                        <span>{item.quantity}x {item.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => updateStatus(order.id, "preparing")}
                                                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-black py-3.5 rounded-2xl transition-all active:scale-[0.98] shadow-md text-sm"
                                            >
                                                Start Cooking
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Column 2: In Preparation */}
                        <div className="space-y-6">
                            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                                <Clock className="h-5 w-5 text-emerald-400" />
                                On Stove / Wok
                            </h2>
                            <div className="space-y-4">
                                {preparingOrders.length === 0 ? (
                                    <div className="text-center py-12 text-zinc-500 bg-[#0c120c] rounded-3xl border border-dashed border-zinc-800 font-bold">
                                        No dishes currently on flame.
                                    </div>
                                ) : (
                                    preparingOrders.map((order) => (
                                        <div key={order.id} className="bg-[#0c120c] p-5 rounded-3xl border border-emerald-500/30 shadow-xl border-l-4 border-l-emerald-400">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="font-black text-lg text-white">Order #{order.id.slice(-4).toUpperCase()}</p>
                                                    <p className="text-xs text-emerald-400 font-bold">Sizzling on Flame</p>
                                                </div>
                                                <div className="h-8 w-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                                            </div>
                                            <div className="space-y-2 border-y border-emerald-500/20 py-3 my-3 text-sm">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between font-bold text-zinc-200">
                                                        <span>{item.quantity}x {item.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => updateStatus(order.id, "ready")}
                                                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black py-3.5 rounded-2xl transition-all active:scale-[0.98] shadow-md text-sm"
                                            >
                                                Mark as Ready
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Column 3: Ready for Rider Pickup */}
                        <div className="space-y-6">
                            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-emerald-400" />
                                Ready for Pickup
                            </h2>
                            <div className="space-y-4">
                                {readyOrders.length === 0 ? (
                                    <div className="text-center py-12 text-zinc-500 bg-[#0c120c] rounded-3xl border border-dashed border-zinc-800 font-bold">
                                        No parcels waiting.
                                    </div>
                                ) : (
                                    readyOrders.map((order) => (
                                        <div key={order.id} className="bg-[#0c120c]/80 p-5 rounded-3xl border border-amber-500/20 shadow-md">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-black text-white">Order #{order.id.slice(-4).toUpperCase()}</p>
                                                    <p className="text-xs text-amber-400 font-bold">Packed & Awaiting Driver</p>
                                                </div>
                                                <ShoppingBag className="h-5 w-5 text-emerald-400" />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </RoleGuard>
    );
}
