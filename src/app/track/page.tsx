"use client";

import Header from "@/components/Header";
import { Search, MapPin, Package, Clock, CheckCircle, Navigation, ShieldCheck, Loader2, ChefHat, Phone, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { orderService, Order } from "@/lib/orderService";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const DeliveryMap = dynamic(() => import("@/components/DeliveryMap"), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-slate-100 dark:bg-zinc-950 animate-pulse" />
});

export default function TrackingPage() {
    const [searchId, setSearchId] = useState("");
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!order?.id) return;

        // Real-time updates for tracked order
        const unsubscribe = orderService.subscribeToOrders({ role: "admin" }, (orders) => {
            const updated = orders.find(o => o.id === order.id);
            if (updated) setOrder(updated);
        });

        return () => unsubscribe();
    }, [order?.id]);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchId.trim()) return;

        setLoading(true);
        setError(null);
        try {
            const unsubscribe = orderService.subscribeToOrders({ role: "admin" }, (orders) => {
                const found = orders.find(o => o.id.toLowerCase().includes(searchId.toLowerCase().trim()));
                if (found) {
                    setOrder(found);
                } else {
                    setError("Order not found. Please verify the ID from your receipt.");
                }
                setLoading(false);
                unsubscribe();
            });
        } catch (err) {
            setError("Unable to locate order. Please try again.");
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-zinc-950 font-sans pb-16">
            <Header />

            <div className="container mx-auto py-6 sm:py-10 px-3 sm:px-4 md:px-6 flex-1">
                {!order ? (
                    <div className="max-w-xl mx-auto text-center py-12 sm:py-20 animate-in fade-in zoom-in duration-500">
                        <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 mb-6 shadow-xl shadow-orange-500/10">
                            <Package className="h-8 w-8 sm:h-10 sm:w-10" />
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
                            Track Your Delivery
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 text-xs sm:text-base px-4">
                            Enter your order ID to see live kitchen status and real-time delivery map in Tinsukia.
                        </p>

                        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto px-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Enter Order ID"
                                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm text-sm text-slate-900 dark:text-white font-mono"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 transition-all active:scale-[0.98] disabled:opacity-50 min-h-[48px] flex items-center justify-center text-sm"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track Order"}
                            </button>
                        </form>
                        {error && <p className="text-red-500 text-xs sm:text-sm mt-4 font-semibold">{error}</p>}
                    </div>
                ) : (
                    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
                        {/* Top Bar with ID and Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm">
                            <div>
                                <button
                                    onClick={() => setOrder(null)}
                                    className="text-xs font-bold text-orange-600 mb-1.5 hover:underline flex items-center gap-1 active:scale-95"
                                >
                                    <ArrowLeft className="h-3 w-3" /> Back to Search
                                </button>
                                <div className="flex items-center gap-2.5">
                                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                        Order #{order.id.slice(-6)}
                                    </h1>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider",
                                        order.status === "delivered"
                                            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                            : "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400 animate-pulse"
                                    )}>
                                        {order.status.replace("_", " ")}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 self-start sm:self-auto bg-slate-50 dark:bg-zinc-800/60 px-3.5 py-2 rounded-xl">
                                <Clock className="h-4 w-4 text-orange-500" />
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Estimated Arrival</p>
                                    <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">10 - 20 mins</p>
                                </div>
                            </div>
                        </div>

                        {/* Map & Live Tracking Block */}
                        <div className="h-[340px] sm:h-[450px] md:h-[520px] bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-[32px] border border-slate-200/80 dark:border-zinc-800/80 shadow-lg overflow-hidden relative">
                            {order.status === "picked_up" ? (
                                <DeliveryMap
                                    origin={{ lat: 27.4924, lng: 95.3626 }} // Tinsukia FoodNJoy Kitchen
                                    destination={order.customerLocation || { lat: 27.4924, lng: 95.3626 }}
                                    currentLocation={order.deliveryLocation}
                                />
                            ) : (
                                <div className="absolute inset-0 bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="relative mb-4">
                                        <div className="absolute -inset-6 bg-orange-500/10 rounded-full blur-2xl animate-pulse" />
                                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center relative shadow-lg">
                                            {order.status === "preparing" ? (
                                                <ChefHat className="h-8 w-8 text-orange-500" />
                                            ) : (
                                                <Package className="h-8 w-8 text-orange-500" />
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-1">
                                        {order.status === "preparing" ? "Chef is Preparing Your Food" : "Order Confirmed & Queued"}
                                    </p>
                                    <p className="max-w-xs text-xs text-slate-500">
                                        Live GPS map will activate as soon as the delivery rider picks up your package.
                                    </p>
                                </div>
                            )}

                            {/* Driver Badge Overlay */}
                            <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 flex items-center justify-between bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-xl z-[1000]">
                                <div className="flex items-center gap-3">
                                    <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md overflow-hidden shrink-0">
                                        <img
                                            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop"
                                            alt="Delivery Partner"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-wider">Delivery Partner</p>
                                        <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Rider Assigned</h4>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <ShieldCheck className="h-3 w-3 text-emerald-500" />
                                            <span className="text-[10px] font-semibold text-slate-400">Vaccinated & Verified</span>
                                        </div>
                                    </div>
                                </div>
                                <a
                                    href="tel:+919876543210"
                                    className="h-10 sm:h-11 px-3.5 sm:px-4 bg-slate-900 hover:bg-orange-500 dark:bg-white dark:hover:bg-orange-500 dark:text-slate-900 dark:hover:text-white text-white rounded-xl flex items-center gap-1.5 font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
                                >
                                    <Phone className="h-3.5 w-3.5" />
                                    <span>Call</span>
                                </a>
                            </div>
                        </div>

                        {/* Order Timeline & Item Summary Grid */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Order Timeline */}
                            <div className="bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm">
                                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-orange-500" />
                                    Order Progress
                                </h3>
                                <div className="space-y-6">
                                    <TimelineStep
                                        icon={<CheckCircle className="h-4 w-4" />}
                                        title="Order Received"
                                        time={order.createdAt ? format(order.createdAt.toDate(), "hh:mm a") : "Confirmed"}
                                        active={["pending", "confirmed", "preparing", "ready", "picked_up", "delivered"].includes(order.status)}
                                    />
                                    <TimelineStep
                                        icon={<ChefHat className="h-4 w-4" />}
                                        title="Cooking in Kitchen"
                                        time="Freshly Made"
                                        active={["preparing", "ready", "picked_up", "delivered"].includes(order.status)}
                                        pulse={order.status === "preparing"}
                                    />
                                    <TimelineStep
                                        icon={<Navigation className="h-4 w-4" />}
                                        title="Out for Delivery"
                                        time="On Route"
                                        active={["picked_up", "delivered"].includes(order.status)}
                                        pulse={order.status === "picked_up"}
                                    />
                                    <TimelineStep
                                        icon={<MapPin className="h-4 w-4" />}
                                        title="Delivered to Doorstep"
                                        time="Tinsukia"
                                        active={order.status === "delivered"}
                                    />
                                </div>
                            </div>

                            {/* Order Items Breakdown */}
                            <div className="bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm flex flex-col justify-between">
                                <div>
                                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-4">
                                        Ordered Items ({order.items.length})
                                    </h3>
                                    <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-zinc-800">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="pt-2.5 first:pt-0 flex justify-between items-center text-xs sm:text-sm">
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                    {item.quantity}x {item.name}
                                                </span>
                                                <span className="font-black text-slate-900 dark:text-white">
                                                    ₹{item.price * item.quantity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800">
                                    <div className="flex justify-between items-center text-sm sm:text-base font-black text-slate-900 dark:text-white">
                                        <span>Total Amount</span>
                                        <span className="text-orange-600 dark:text-orange-400">₹{order.total}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-1">
                                        Delivery destination: {order.customerLocation?.address || "Tinsukia Local Delivery"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

function TimelineStep({ icon, title, time, active = false, pulse = false }: any) {
    return (
        <div className="flex gap-4 items-start relative group">
            <div className={cn(
                "h-7 w-7 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all text-xs",
                active ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20" : "bg-white dark:bg-black border-slate-200 dark:border-zinc-800 text-slate-300",
                pulse && "animate-pulse ring-4 ring-orange-500/20"
            )}>
                {icon}
            </div>
            <div className="absolute left-[13px] top-7 bottom-[-24px] w-[2px] bg-slate-100 dark:bg-zinc-800 group-last:hidden" />
            <div>
                <h4 className={cn("font-bold text-xs sm:text-sm leading-tight", active ? "text-slate-900 dark:text-white" : "text-slate-400")}>
                    {title}
                </h4>
                <p className="text-[11px] text-orange-500 font-semibold mt-0.5">{time}</p>
            </div>
        </div>
    );
}
