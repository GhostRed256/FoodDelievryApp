"use client";

import Header from "@/components/Header";
import { Search, MapPin, Package, Clock, CheckCircle, Navigation, ShieldCheck, Loader2, ChefHat, Phone, ArrowLeft, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { orderService, Order } from "@/lib/orderService";
import { useAuth } from "@/lib/AuthContext";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const DeliveryMap = dynamic(() => import("@/components/DeliveryMap"), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#0c120c] animate-pulse" />
});

export default function TrackingPage() {
    const [searchId, setSearchId] = useState("");
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [etaMinutes, setEtaMinutes] = useState<number | null>(null);
    const { user } = useAuth();

    // Auto-load active order for logged-in user
    useEffect(() => {
        if (!user) return;
        const unsubscribe = orderService.subscribeToOrders({ role: "customer", uid: user.uid }, (orders) => {
            const active = orders.find(o => o.status !== "delivered" && o.status !== "cancelled");
            if (active && !order) {
                setOrder(active);
            }
        });
        return () => unsubscribe();
    }, [user]);

    // Live update for the specific tracked order
    useEffect(() => {
        if (!order?.id) return;

        const unsubscribe = orderService.subscribeToOrder(order.id, (updatedOrder) => {
            setOrder(updatedOrder);
        });

        return () => unsubscribe();
    }, [order?.id]);

    useEffect(() => {
        if (order?.status === "picked_up" && order.deliveryLocation && order.customerLocation) {
            const fetchEta = async () => {
                try {
                    const { lat: srcLat, lng: srcLng } = order.deliveryLocation!;
                    const { lat: dstLat, lng: dstLng } = order.customerLocation!;
                    const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${srcLng},${srcLat};${dstLng},${dstLat}?overview=false`);
                    const data = await res.json();
                    if (data.routes && data.routes.length > 0) {
                        const durationSeconds = data.routes[0].duration;
                        const mins = Math.ceil(durationSeconds / 60);
                        setEtaMinutes(mins);
                    }
                } catch (error) {
                    console.error("Failed to fetch ETA:", error);
                }
            };

            fetchEta();
            const interval = setInterval(fetchEta, 30000);
            return () => clearInterval(interval);
        } else {
            setEtaMinutes(null);
        }
    }, [order?.status, order?.deliveryLocation, order?.customerLocation]);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchId.trim()) return;

        setLoading(true);
        setError(null);
        try {
            // Attempt to subscribe to the specific order by ID
            const unsubscribe = orderService.subscribeToOrder(searchId.trim(), (found) => {
                if (found) {
                    setOrder(found);
                } else {
                    setError("Order not found. Please verify the exact ID from your receipt.");
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
        <main className="flex min-h-screen flex-col bg-[#070a07] text-zinc-100 font-sans pb-16 selection:bg-amber-500 selection:text-black">
            <Header />

            <div className="container mx-auto py-6 sm:py-10 px-3 sm:px-4 md:px-6 flex-1">
                {!order ? (
                    <div className="max-w-xl mx-auto text-center py-12 sm:py-20 animate-in fade-in zoom-in duration-500">
                        <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-6 shadow-xl shadow-amber-500/10">
                            <Package className="h-8 w-8 sm:h-10 sm:w-10 text-amber-400" />
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black text-white mb-2">
                            Live Order <span className="text-gold-metallic">Tracker</span>
                        </h1>
                        <p className="text-zinc-400 mb-8 text-xs sm:text-base px-4">
                            Enter your order ID to see live kitchen status and real-time delivery GPS in Tinsukia.
                        </p>

                        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto px-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
                                <input
                                    type="text"
                                    placeholder="Enter Order ID"
                                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-[#0c120c] border border-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-md text-sm text-white font-mono placeholder:text-zinc-500"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black px-6 py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] disabled:opacity-50 min-h-[48px] flex items-center justify-center text-sm"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin text-black" /> : "Track Order"}
                            </button>
                        </form>
                        {error && <p className="text-red-400 text-xs sm:text-sm mt-4 font-bold bg-red-950/40 border border-red-900/50 p-2.5 rounded-xl max-w-md mx-auto">{error}</p>}
                    </div>
                ) : (
                    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
                        {/* Top Bar with ID and Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0c120c] p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-amber-500/30 shadow-lg">
                            <div>
                                <button
                                    onClick={() => setOrder(null)}
                                    className="text-xs font-bold text-amber-400 mb-1.5 hover:underline flex items-center gap-1 active:scale-95"
                                >
                                    <ArrowLeft className="h-3 w-3" /> Back to Search
                                </button>
                                <div className="flex items-center gap-2.5">
                                    <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                                        Order #{order.id.slice(-6)}
                                    </h1>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border",
                                        order.status === "delivered"
                                            ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40"
                                            : "bg-amber-500/15 text-amber-400 border-amber-500/40 animate-pulse"
                                    )}>
                                        {order.status.replace("_", " ")}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 self-start sm:self-auto bg-black/50 border border-amber-500/20 px-3.5 py-2 rounded-xl">
                                <Clock className="h-4 w-4 text-amber-400" />
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Estimated Arrival</p>
                                    <p className="text-xs sm:text-sm font-black text-white">
                                        {etaMinutes !== null ? `${etaMinutes} mins` : "15 - 25 mins"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Map & Live Tracking Block */}
                        <div className="h-[340px] sm:h-[450px] md:h-[520px] bg-[#0c120c] rounded-2xl sm:rounded-[32px] border border-amber-500/30 shadow-2xl overflow-hidden relative">
                            {order.status === "picked_up" ? (
                                <DeliveryMap
                                    origin={{ lat: 27.4924, lng: 95.3626 }} // Tinsukia FoodNJoy Kitchen
                                    destination={order.customerLocation || { lat: 27.4924, lng: 95.3626 }}
                                    currentLocation={order.deliveryLocation}
                                />
                            ) : (
                                <div className="absolute inset-0 bg-[#080c08] flex flex-col items-center justify-center p-6 text-center">
                                    <div className="relative mb-4">
                                        <div className="absolute -inset-6 bg-amber-500/10 rounded-full blur-2xl animate-pulse" />
                                        <div className="w-16 h-16 rounded-2xl bg-[#0c120c] border border-amber-500/30 flex items-center justify-center relative shadow-lg">
                                            {order.status === "preparing" ? (
                                                <ChefHat className="h-8 w-8 text-amber-400" />
                                            ) : (
                                                <Package className="h-8 w-8 text-amber-400" />
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-base sm:text-lg font-black text-white mb-1">
                                        {order.status === "preparing" ? "Chef is Preparing Your Delicacy" : "Order Confirmed & Queued"}
                                    </p>
                                    <p className="max-w-xs text-xs text-zinc-400">
                                        Live GPS map will activate as soon as our rider picks up your package.
                                    </p>
                                </div>
                            )}

                            {/* Driver Badge Overlay */}
                            <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 flex items-center justify-between bg-[#080c08]/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-amber-500/30 shadow-2xl z-[1000]">
                                <div className="flex items-center gap-3">
                                    <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-amber-500 flex items-center justify-center text-black shadow-md overflow-hidden shrink-0 border border-amber-400">
                                        <img
                                            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop"
                                            alt="Delivery Partner"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-amber-400 uppercase tracking-wider">FoodNJoy Partner</p>
                                        <h4 className="text-xs sm:text-sm font-black text-white">Verified Rider</h4>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <ShieldCheck className="h-3 w-3 text-emerald-400" />
                                            <span className="text-[10px] font-semibold text-emerald-400">Vaccinated & Inspected</span>
                                        </div>
                                    </div>
                                </div>
                                <a
                                    href="tel:+919876543210"
                                    className="h-10 sm:h-11 px-3.5 sm:px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black rounded-xl flex items-center gap-1.5 font-black text-xs shadow-md transition-all active:scale-95 shrink-0"
                                >
                                    <Phone className="h-3.5 w-3.5 text-black" />
                                    <span>Call</span>
                                </a>
                            </div>
                        </div>

                        {/* Order Timeline & Item Summary Grid */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Order Timeline */}
                            <div className="bg-[#0c120c] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-amber-500/20 shadow-lg">
                                <h3 className="text-base sm:text-lg font-black text-white mb-6 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-amber-400" />
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
                            <div className="bg-[#0c120c] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-amber-500/20 shadow-lg flex flex-col justify-between">
                                <div>
                                    <h3 className="text-base sm:text-lg font-black text-white mb-4">
                                        Ordered Items ({order.items.length})
                                    </h3>
                                    <div className="space-y-2.5 divide-y divide-amber-500/10">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="pt-2.5 first:pt-0 flex justify-between items-center text-xs sm:text-sm">
                                                <span className="font-semibold text-zinc-200">
                                                    {item.quantity}x {item.name}
                                                </span>
                                                <span className="font-black text-gold-metallic">
                                                    ₹{item.price * item.quantity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-amber-500/20">
                                    <div className="flex justify-between items-center text-sm sm:text-base font-black text-white">
                                        <span>Total Amount</span>
                                        <span className="text-gold-metallic text-lg">₹{order.total}</span>
                                    </div>
                                    <p className="text-[11px] text-zinc-400 mt-1">
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
                active ? "bg-amber-500 border-amber-400 text-black font-bold shadow-lg shadow-amber-500/30" : "bg-[#070a07] border-zinc-800 text-zinc-600",
                pulse && "animate-pulse ring-4 ring-amber-500/30"
            )}>
                {icon}
            </div>
            <div className="absolute left-[13px] top-7 bottom-[-24px] w-[2px] bg-amber-500/20 group-last:hidden" />
            <div>
                <h4 className={cn("font-bold text-xs sm:text-sm leading-tight", active ? "text-white" : "text-zinc-500")}>
                    {title}
                </h4>
                <p className="text-[11px] text-amber-400/80 font-bold mt-0.5">{time}</p>
            </div>
        </div>
    );
}
