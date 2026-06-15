"use client";

import RoleGuard from "@/components/RoleGuard";
import Header from "@/components/Header";
import { ChefHat, Clock, CheckCircle, AlertCircle, ShoppingBag, Loader2 } from "lucide-react";
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
            <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-zinc-950 font-sans">
                <Header />
                <div className="container mx-auto py-8 px-4 md:px-6">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <ChefHat className="h-8 w-8 text-orange-500" />
                            Kitchen Dashboard
                        </h1>
                        <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full text-green-700 dark:text-green-400 text-sm font-bold">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            Kitchen Live
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* New Orders - Urgent */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                                Confirmed Orders
                                {newOrders.length > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-bounce">
                                        {newOrders.length}
                                    </span>
                                )}
                            </h2>
                            <div className="space-y-4">
                                {newOrders.length === 0 ? (
                                    <div className="text-center py-12 text-slate-500 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800">
                                        No new orders to start.
                                    </div>
                                ) : (
                                    newOrders.map((order) => (
                                        <div key={order.id} className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border-2 border-red-100 dark:border-red-900/20 shadow-sm animate-in fade-in slide-in-from-left-4">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="font-bold text-lg text-slate-900 dark:text-white">Order #{order.id.slice(-4).toUpperCase()}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {order.createdAt ? formatDistanceToNow(order.createdAt.toDate(), { addSuffix: true }) : "Just now"}
                                                    </p>
                                                </div>
                                                <span className="text-red-500 font-bold bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full text-[10px] uppercase">Urgent</span>
                                            </div>
                                            <div className="space-y-2 border-y border-slate-50 dark:border-zinc-800 py-3 my-3 text-sm">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between">
                                                        <span className="text-slate-700 dark:text-slate-300">{item.quantity}x {item.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => updateStatus(order.id, "preparing")}
                                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl transition-all active:scale-[0.98]"
                                            >
                                                Start Cooking
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* In Preparation */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Clock className="h-5 w-5 text-orange-500" />
                                Preparing
                            </h2>
                            <div className="space-y-4">
                                {preparingOrders.length === 0 ? (
                                    <div className="text-center py-12 text-slate-500 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800">
                                        Nothing in preparation.
                                    </div>
                                ) : (
                                    preparingOrders.map((order) => (
                                        <div key={order.id} className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm border-l-4 border-l-orange-500">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="font-bold text-lg text-slate-900 dark:text-white">Order #{order.id.slice(-4).toUpperCase()}</p>
                                                    <p className="text-xs text-slate-500">Started recently</p>
                                                </div>
                                                <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div>
                                            </div>
                                            <div className="space-y-2 border-y border-slate-50 dark:border-zinc-800 py-3 my-3 text-sm">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between">
                                                        <span className="text-slate-700 dark:text-slate-300">{item.quantity}x {item.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => updateStatus(order.id, "ready")}
                                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl transition-all active:scale-[0.98]"
                                            >
                                                Mark as Ready
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Ready for Pickup */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Ready
                            </h2>
                            <div className="space-y-4">
                                {readyOrders.length === 0 ? (
                                    <div className="text-center py-12 text-slate-500 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800">
                                        No orders waiting for pickup.
                                    </div>
                                ) : (
                                    readyOrders.map((order) => (
                                        <div key={order.id} className="bg-white/50 dark:bg-zinc-900/50 p-5 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800 opacity-80">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">Order #{order.id.slice(-4).toUpperCase()}</p>
                                                    <p className="text-xs text-slate-500">Waiting for driver</p>
                                                </div>
                                                <ShoppingBag className="h-5 w-5 text-green-500" />
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
