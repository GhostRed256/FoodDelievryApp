"use client";

import Header from "@/components/Header";
import RoleGuard from "@/components/RoleGuard";
import { Search, MapPin, Package, Clock, CheckCircle, Navigation, ShieldCheck, Loader2, ChefHat } from "lucide-react";
import { useState, useEffect } from "react";
import { orderService, Order } from "@/lib/orderService";
import DeliveryMap from "@/components/DeliveryMap";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function TrackingPage() {
    const [searchId, setSearchId] = useState("");
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!order?.id) return;

        // Subscribe to real-time updates for THIS specific order
        const unsubscribe = orderService.subscribeToOrders({ role: "admin" }, (orders) => {
            const updated = orders.find(o => o.id === order.id);
            if (updated) setOrder(updated);
        });

        return () => unsubscribe();
    }, [order?.id]);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchId) return;

        setLoading(true);
        setError(null);
        try {
            // In a real app, we'd have a specific getOrderById method
            // For now, we'll use a temporary listener to find it
            const unsubscribe = orderService.subscribeToOrders({ role: "admin" }, (orders) => {
                const found = orders.find(o => o.id.toLowerCase().includes(searchId.toLowerCase()));
                if (found) {
                    setOrder(found);
                } else {
                    setError("Order not found. Please check the ID and try again.");
                }
                setLoading(false);
                unsubscribe();
            });
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-zinc-950 font-sans">
            <Header />

            <div className="container mx-auto py-12 px-4 md:px-6 flex-1">
                {!order ? (
                    <div className="max-w-2xl mx-auto text-center py-20 animate-in fade-in zoom-in duration-500">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 mb-8 shadow-xl shadow-orange-500/10">
                            <Package className="h-10 w-10" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Track Your Delivery</h1>
                        <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg">Enter your order ID to see real-time updates and live map tracking.</p>

                        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Order ID (e.g. #1024)"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm text-slate-900 dark:text-white font-mono"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-orange-500/30 transition-all active:scale-[0.98] disabled:opacity-50 min-w-[140px] flex items-center justify-center"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Track Now"}
                            </button>
                        </form>
                        {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <button onClick={() => setOrder(null)} className="text-sm font-bold text-orange-600 mb-2 hover:underline flex items-center gap-1">
                                    ← Back to search
                                </button>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase">Order #{order.id.slice(-6)}</h1>
                                    <span className={cn(
                                        "px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                                        order.status === "delivered" ? "bg-green-100 text-green-600" : "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 animate-pulse"
                                    )}>
                                        {order.status.replace("_", " ")}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Est. Delivery</p>
                                    <p className="font-black text-slate-900 dark:text-white">12 minutes</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8 aspect-video md:aspect-auto md:h-[600px] bg-white dark:bg-zinc-900 rounded-[40px] border border-slate-100 dark:border-zinc-800 shadow-xl overflow-hidden relative">
                            {order.status === "picked_up" ? (
                                <DeliveryMap
                                    origin={{ lat: 26.1445, lng: 91.7362 }} // Mock Kitchen
                                    destination={order.customerLocation}
                                    currentLocation={order.deliveryLocation}
                                />
                            ) : (
                                <div className="absolute inset-0 bg-slate-100 dark:bg-zinc-950 flex flex-col items-center justify-center text-slate-400">
                                    <div className="relative mb-6">
                                        <div className="absolute -inset-8 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
                                        <div className="w-20 h-20 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center relative shadow-2xl">
                                            <Package className="h-10 w-10 text-orange-500" />
                                        </div>
                                    </div>
                                    <p className="text-xl font-black text-slate-900 dark:text-white mb-2">
                                        {order.status === "preparing" ? "Chef is Preparing Your Food" : "Order Confirmed"}
                                    </p>
                                    <p className="max-w-xs text-center text-sm">We'll show you the live map once our delivery partner picks up your order.</p>
                                </div>
                            )}

                            {/* Driver Overlay */}
                            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-white/90 dark:bg-black/90 backdrop-blur-xl p-6 rounded-[32px] border border-white dark:border-zinc-800 shadow-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Your Delivery Agent</p>
                                        <h4 className="text-lg font-black text-slate-900 dark:text-white">Michael Smith</h4>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                                            <span className="text-xs font-medium text-slate-500">Verified Professional</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="h-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center px-6 font-black text-slate-900 dark:text-white shadow-sm border border-slate-100 dark:border-zinc-800 hover:bg-slate-50 transition-all">
                                    Call Michael
                                </button>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 p-8 rounded-[40px] border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8">Order Timeline</h3>
                            <div className="flex-1 space-y-10">
                                <TimelineItem icon={<CheckCircle className="h-4 w-4" />} title="Order Confirmed" time={order.createdAt ? format(order.createdAt.toDate(), "hh:mm a") : "--"} active={["confirmed", "preparing", "ready", "picked_up", "delivered"].includes(order.status)} />
                                <TimelineItem icon={<ChefHat className="h-4 w-4" />} title="In the Kitchen" time="Processing" active={["preparing", "ready", "picked_up", "delivered"].includes(order.status)} pulse={order.status === "preparing"} />
                                <TimelineItem icon={<Navigation className="h-4 w-4" />} title="Out for Delivery" time="Live" active={["picked_up", "delivered"].includes(order.status)} pulse={order.status === "picked_up"} />
                                <TimelineItem icon={<MapPin className="h-4 w-4" />} title="Arrived at Location" time="Soon" active={order.status === "delivered"} />
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-zinc-800">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-bold text-slate-500">{order.items.length} Items • StayNJoy Kitchen</span>
                                    <span className="text-sm font-black text-slate-900 dark:text-white">${order.total.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-slate-400">Please have your ID ready if the order includes age-restricted items.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

function TimelineItem({ icon, title, time, active = false, pulse = false }: any) {
    return (
        <div className="flex gap-6 items-start relative group">
            <div className={cn(
                "h-8 w-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all",
                active ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-white dark:bg-black border-slate-100 dark:border-zinc-800 text-slate-300",
                pulse && "animate-pulse ring-4 ring-orange-500/20"
            )}>
                {icon}
            </div>
            {/* Line connecting items */}
            <div className="absolute left-[15px] top-8 bottom-[-40px] w-[2px] bg-slate-100 dark:bg-zinc-800 group-last:hidden"></div>
            <div>
                <h4 className={cn("font-bold text-sm", active ? "text-slate-900 dark:text-white" : "text-slate-300")}>{title}</h4>
                <p className="text-xs text-orange-500/70 font-bold mt-0.5">{time}</p>
            </div>
        </div>
    );
}
