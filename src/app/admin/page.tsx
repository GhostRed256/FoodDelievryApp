"use client";

import { LayoutDashboard, Users, ShoppingBag, Utensils, TrendingUp, CheckCircle, Clock, Truck, ChevronRight, Sparkles, ShieldCheck } from "lucide-react";
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
            <main className="flex min-h-screen flex-col bg-[#070a07] text-zinc-100 font-sans pb-16 selection:bg-amber-500 selection:text-black">
                <Header />
                <div className="container mx-auto py-8 px-4 md:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-amber-500/20">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                                <Sparkles className="h-3 w-3 text-emerald-400" />
                                Admin Management Suite
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                                <LayoutDashboard className="h-7 w-7 text-amber-400" />
                                Operations <span className="text-gold-metallic">Dashboard</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-4 py-2 rounded-full text-emerald-400 text-xs font-black uppercase tracking-wider self-start sm:self-auto shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            Live Tinsukia Feed
                        </div>
                    </div>

                    {/* Stats Metric Cards */}
                    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        <StatsCard title="Total Orders" value={orders.length.toString()} icon={<ShoppingBag className="rotate-3 text-amber-400" />} trend="Live" color="bg-amber-500/10 border-amber-500/30" />
                        <StatsCard title="In Kitchen" value={orders.filter(o => o.status === "preparing").length.toString()} icon={<Clock className="text-emerald-400" />} trend="Active" color="bg-emerald-500/10 border-emerald-500/30" />
                        <StatsCard title="Out for Delivery" value={orders.filter(o => o.status === "picked_up").length.toString()} icon={<Truck className="text-amber-400" />} trend="On Road" color="bg-amber-500/10 border-amber-500/30" />
                        <StatsCard title="Revenue (Gross)" value={`₹${orders.reduce((sum, o) => sum + o.total, 0)}`} icon={<TrendingUp className="text-emerald-400" />} trend="+100%" color="bg-emerald-500/10 border-emerald-500/30" />
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 bg-[#0c120c] p-6 rounded-3xl border border-amber-500/20 shadow-xl">
                            <h2 className="text-lg sm:text-xl font-black mb-6 text-white flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-amber-400" />
                                Real-Time Order Stream
                            </h2>
                            <div className="space-y-3.5">
                                {orders.length === 0 ? (
                                    <div className="text-center py-16 text-zinc-500 font-bold">No active orders found in the pipeline.</div>
                                ) : (
                                    orders.map((order) => (
                                        <div key={order.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#080c08] border border-amber-500/20 transition-all hover:border-amber-400/50 shadow-md">
                                            <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                                <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-black flex items-center justify-center font-black shadow-md shrink-0">
                                                    #{order.id.slice(-4).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-white">{order.customerName}</p>
                                                    <p className="text-xs text-zinc-400">
                                                        {order.items.length} items • <span className="text-amber-400 font-bold">₹{order.total}</span> • {order.createdAt ? format(order.createdAt.toDate(), "HH:mm") : "Just now"}
                                                    </p>
                                                    <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1">
                                                        📍 {order.customerLocation?.address || "Tinsukia Local"}
                                                        {order.customerLocation?.lat && (
                                                            <a
                                                                href={`https://www.google.com/maps/search/?api=1&query=${order.customerLocation.lat},${order.customerLocation.lng}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-amber-400 hover:underline font-bold ml-1 text-[10px]"
                                                            >
                                                                (View Map)
                                                            </a>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                                                    order.status === "pending" && "bg-amber-500/15 text-amber-400 border-amber-500/30",
                                                    order.status === "confirmed" && "bg-blue-950/60 text-blue-400 border-blue-500/30",
                                                    order.status === "preparing" && "bg-orange-950/60 text-orange-400 border-orange-500/30 animate-pulse",
                                                    order.status === "ready" && "bg-emerald-950/60 text-emerald-400 border-emerald-500/30",
                                                    order.status === "picked_up" && "bg-purple-950/60 text-purple-400 border-purple-500/30",
                                                    order.status === "delivered" && "bg-zinc-900 text-zinc-400 border-zinc-700"
                                                )}>
                                                    {order.status.replace("_", " ")}
                                                </span>

                                                {order.status === "pending" && (
                                                    <button
                                                        onClick={() => updateStatus(order.id, "confirmed")}
                                                        className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black px-4 py-1.5 rounded-full text-xs font-black transition-all shadow-md active:scale-95"
                                                    >
                                                        Accept
                                                    </button>
                                                )}
                                                <ChevronRight className="h-4 w-4 text-zinc-600" />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Side Widgets */}
                        <div className="space-y-6">
                            <div className="bg-[#0c120c] p-6 rounded-3xl border border-amber-500/20 shadow-xl">
                                <h2 className="text-base sm:text-lg font-black mb-4 text-white flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-amber-400" />
                                    Kitchen Workload
                                </h2>
                                <div className="p-4 rounded-2xl bg-[#080c08] border border-amber-500/20">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-zinc-400">Preparation Load</span>
                                        <span className="text-xs font-black text-amber-400">
                                            {orders.filter(o => o.status === "preparing").length} active batches
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-amber-500/20">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min(100, Math.max(10, orders.filter(o => o.status === "preparing").length * 25))}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#0c120c] p-6 rounded-3xl border border-emerald-500/20 shadow-xl">
                                <h2 className="text-base sm:text-lg font-black mb-4 text-white flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-emerald-400" />
                                    Delivery Fleet
                                </h2>
                                <div className="p-4 rounded-2xl bg-[#080c08] border border-emerald-500/20 flex justify-between items-center">
                                    <span className="text-xs font-bold text-zinc-400">Active On Route</span>
                                    <span className="text-lg font-black text-emerald-400">
                                        {orders.filter(o => o.status === "picked_up").length}
                                    </span>
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
        <div className={cn("p-5 sm:p-6 rounded-3xl border shadow-lg flex items-center gap-4 bg-[#0c120c]", color)}>
            <div className="h-12 w-12 rounded-2xl bg-black/40 border border-amber-500/20 flex items-center justify-center text-xl shadow-md">
                {icon}
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">{title}</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                    <h3 className="text-xl sm:text-2xl font-black text-white">{value}</h3>
                    <span className="text-[10px] font-black text-emerald-400">{trend}</span>
                </div>
            </div>
        </div>
    );
}
