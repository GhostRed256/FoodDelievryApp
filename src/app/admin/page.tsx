"use client";

import { LayoutDashboard, Users, ShoppingBag, Utensils, TrendingUp, CheckCircle, Clock, Truck, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { orderService, Order } from "@/lib/orderService";
import RoleGuard from "@/components/RoleGuard";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = orderService.subscribeToOrders({ role: "admin" }, (updatedOrders) => {
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

    return (
        <RoleGuard allowedRoles={["admin"]}>
            <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-zinc-950 font-sans">
                <Header />
                <div className="container mx-auto py-8 px-4 md:px-6">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <LayoutDashboard className="h-8 w-8 text-orange-500" />
                            Admin Dashboard
                        </h1>
                        <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-full text-orange-600 dark:text-orange-400 text-sm font-bold">
                            Live Monitoring
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        <StatsCard title="Total Orders" value="128" icon={<ShoppingBag className="rotate-3" />} trend="+12%" color="bg-blue-500" />
                        <StatsCard title="Active Users" value="842" icon={<Users />} trend="+5%" color="bg-purple-500" />
                        <StatsCard title="Menu Items" value="48" icon={<Utensils />} trend="0%" color="bg-orange-500" />
                        <StatsCard title="Revenue" value="$4,250" icon={<TrendingUp />} trend="+18%" color="bg-green-500" />
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                            <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-orange-500" />
                                Active Orders
                            </h2>
                            <div className="space-y-4">
                                {orders.length === 0 ? (
                                    <div className="text-center py-12 text-slate-500">No active orders found.</div>
                                ) : (
                                    orders.map((order) => (
                                        <div key={order.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 transition-all hover:border-orange-500/30">
                                            <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                                <div className="h-12 w-12 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-lg shadow-orange-500/20">
                                                    #{order.id.slice(-4).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">{order.customerName}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {order.items.length} items • ${order.total.toFixed(2)} • {order.createdAt ? format(order.createdAt.toDate(), "HH:mm") : "Just now"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
                                                    order.status === "pending" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                                                    order.status === "confirmed" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                                                    order.status === "preparing" && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                                                    order.status === "ready" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                                                    order.status === "picked_up" && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                                                    order.status === "delivered" && "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-slate-400"
                                                )}>
                                                    {order.status}
                                                </span>

                                                {order.status === "pending" && (
                                                    <button
                                                        onClick={() => updateStatus(order.id, "confirmed")}
                                                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg shadow-orange-500/20"
                                                    >
                                                        Confirm
                                                    </button>
                                                )}
                                                <ChevronRight className="h-4 w-4 text-slate-300 dark:text-zinc-700" />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                                <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-blue-500" />
                                    Kitchen Health
                                </h2>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Preparation Load</span>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                {orders.filter(o => o.status === "preparing").length} active
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-full">
                                            <div
                                                className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                                                style={{ width: `${Math.min(100, orders.filter(o => o.status === "preparing").length * 20)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                                <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-green-500" />
                                    Delivery Fleet
                                </h2>
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">On Route</span>
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                                            {orders.filter(o => o.status === "picked_up").length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </RoleGuard>
    );
}

function StatsCard({ title, value, icon, trend, color }: any) {
    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
                    <span className="text-xs font-bold text-green-500">{trend}</span>
                </div>
            </div>
        </div>
    );
}
