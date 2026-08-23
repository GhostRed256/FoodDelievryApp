"use client";

import { Truck, MapPin, Navigation, Phone, CheckCircle, Loader2, Sparkles, ShieldCheck, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { orderService, Order } from "@/lib/orderService";
import { useAuth } from "@/lib/AuthContext";
import RoleGuard from "@/components/RoleGuard";
import Header from "@/components/Header";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const DeliveryMap = dynamic(() => import("@/components/DeliveryMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-[#0c120c] animate-pulse rounded-3xl" />
});

export default function DeliveryDashboard() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [activeOrder, setActiveOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const unsubscribe = orderService.subscribeToOrders({ role: "delivery" }, (updatedOrders) => {
            setOrders(updatedOrders);
            setLoading(false);

            const active = updatedOrders.find(o => o.status === "picked_up" && o.deliveryId === user?.uid);
            if (active) setActiveOrder(active);
        });
        return () => unsubscribe();
    }, [user?.uid]);

    // Live GPS Location Sharing
    useEffect(() => {
        if (isOnline && activeOrder && navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    orderService.updateDeliveryLocation(activeOrder.id, latitude, longitude);
                },
                (error) => console.error("Rider GPS watch error:", error),
                { enableHighAccuracy: true }
            );
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, [isOnline, activeOrder]);

    const updateStatus = async (orderId: string, status: any) => {
        try {
            await orderService.updateOrderStatus(orderId, status, { deliveryId: user?.uid });
            if (status === "picked_up") {
                const order = orders.find(o => o.id === orderId);
                if (order) setActiveOrder(order);
            } else if (status === "delivered") {
                setActiveOrder(null);
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const availableOrders = orders.filter(o => o.status === "ready");

    const getGoogleMapsUrl = (lat?: number, lng?: number) => {
        if (!lat || !lng) return "https://maps.google.com";
        return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    };

    return (
        <RoleGuard allowedRoles={["admin", "delivery"]}>
            <main className="flex min-h-screen flex-col bg-[#070a07] text-zinc-100 font-sans pb-16 selection:bg-amber-500 selection:text-black">
                <Header />
                <div className="container mx-auto py-8 px-4 md:px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-amber-500/20">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                                <Sparkles className="h-3 w-3 text-emerald-400" />
                                Rider Telemetry & Navigation
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                                <Truck className="h-7 w-7 text-amber-400" />
                                Delivery <span className="text-gold-metallic">Pilot Portal</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsOnline(!isOnline)}
                                className={cn(
                                    "px-5 py-2 rounded-full border text-xs font-black uppercase tracking-wider transition-all active:scale-95",
                                    isOnline
                                        ? "bg-[#0c120c] border-amber-500/40 text-amber-400 hover:bg-zinc-900"
                                        : "bg-amber-500 border-amber-500 text-black"
                                )}
                            >
                                {isOnline ? "Switch Offline" : "Go Online"}
                            </button>
                            <div className={cn(
                                "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border shadow-md",
                                isOnline
                                    ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10"
                                    : "bg-zinc-900 text-zinc-400 border-zinc-700"
                            )}>
                                <span className={cn("h-2 w-2 rounded-full", isOnline ? "bg-emerald-400 animate-pulse" : "bg-zinc-500")} />
                                {isOnline ? "Broadcasting GPS" : "Offline"}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-12">
                        {/* Active Task or Available Tasks */}
                        <div className="lg:col-span-4 space-y-6">
                            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                                <Navigation className="h-5 w-5 text-amber-400" />
                                {activeOrder ? "Active Mission" : "Available Pickups"}
                            </h2>

                            {activeOrder ? (
                                <div className="bg-[#0c120c] rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden animate-in zoom-in-95">
                                    <div className="p-6 bg-gradient-to-r from-amber-500 to-amber-600 text-black">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-black/80 text-[10px] font-black uppercase tracking-wider">Out for Delivery</p>
                                                <h3 className="text-2xl font-black">Order #{activeOrder.id.slice(-4).toUpperCase()}</h3>
                                            </div>
                                            <div className="bg-black/20 p-2.5 rounded-2xl">
                                                <Truck className="h-6 w-6 text-black" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-5">
                                        <div className="space-y-4">
                                            <div className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="h-3.5 w-3.5 rounded-full bg-amber-400 ring-4 ring-amber-400/20" />
                                                    <div className="w-0.5 h-12 bg-amber-500/20 my-1" />
                                                    <div className="h-3.5 w-3.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
                                                </div>
                                                <div className="space-y-4 flex-1">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Pickup From</p>
                                                        <p className="font-bold text-white text-sm">FoodNJoy Kitchen (Tinsukia)</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Deliver To</p>
                                                        <p className="font-bold text-white text-sm">{activeOrder.customerLocation?.address || "Tinsukia Local Destination"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Direct Google Maps Turn-by-Turn Button */}
                                        <a
                                            href={getGoogleMapsUrl(activeOrder.customerLocation?.lat, activeOrder.customerLocation?.lng)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md active:scale-95"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            🗺️ Open Turn-by-Turn in Google Maps App
                                        </a>

                                        <button
                                            onClick={() => updateStatus(activeOrder.id, "delivered")}
                                            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
                                        >
                                            <CheckCircle className="h-5 w-5" />
                                            Confirm Handover to Customer
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {availableOrders.length === 0 ? (
                                        <div className="p-8 text-center text-zinc-500 bg-[#0c120c] rounded-3xl border border-dashed border-zinc-800 font-bold">
                                            No packed orders waiting for pickup.
                                        </div>
                                    ) : (
                                        availableOrders.filter(o => !o.deliveryId).map((order) => (
                                            <div key={order.id} className="bg-[#0c120c] p-5 rounded-3xl border border-amber-500/20 shadow-md hover:border-amber-400/50 transition-all">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h3 className="font-black text-white">Order #{order.id.slice(-4).toUpperCase()}</h3>
                                                    <span className="text-gold-metallic font-black">₹{order.total}</span>
                                                </div>
                                                <p className="text-xs text-zinc-400 mb-4 flex items-center gap-1">
                                                    <MapPin className="h-3.5 w-3.5 text-amber-400" />
                                                    {order.customerLocation?.address || "Tinsukia Local Destination"}
                                                </p>
                                                <button
                                                    onClick={() => updateStatus(order.id, "picked_up")}
                                                    className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black py-3 rounded-2xl hover:from-amber-300 hover:to-amber-400 transition-all shadow-md active:scale-95 text-xs"
                                                >
                                                    Accept & Pickup Order
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Live Delivery Map */}
                        <div className="lg:col-span-8 flex flex-col min-h-[480px] sm:min-h-[580px]">
                            <div className="flex-1 bg-[#0c120c] rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden relative">
                                {activeOrder ? (
                                    <DeliveryMap
                                        origin={{ lat: 27.4924, lng: 95.3626 }} // Tinsukia kitchen
                                        destination={activeOrder.customerLocation || { lat: 27.4924, lng: 95.3626 }}
                                        currentLocation={activeOrder.deliveryLocation}
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-[#080c08] flex flex-col items-center justify-center text-zinc-500 p-6 text-center">
                                        <Truck className="h-12 w-12 mb-3 text-amber-400/40" />
                                        <p className="text-base font-bold text-zinc-300">Rider Telemetry Ready</p>
                                        <p className="text-xs text-zinc-500 max-w-xs mt-1">
                                            Accept an order to view interactive navigation coordinates and destination route.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </RoleGuard>
    );
}
