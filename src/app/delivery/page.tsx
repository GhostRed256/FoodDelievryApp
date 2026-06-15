"use client";

import { Truck, MapPin, Navigation, Phone, CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { orderService, Order } from "@/lib/orderService";
import { useAuth } from "@/lib/AuthContext";
import RoleGuard from "@/components/RoleGuard";
import Header from "@/components/Header";
import DeliveryMap from "@/components/DeliveryMap";
import { cn } from "@/lib/utils";

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

            // Check if there's an order currently being delivered by this agent
            const active = updatedOrders.find(o => o.status === "picked_up" && o.deliveryId === user?.uid);
            if (active) setActiveOrder(active);
        });
        return () => unsubscribe();
    }, [user?.uid]);

    // Live Location Sharing
    useEffect(() => {
        if (isOnline && activeOrder && navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    orderService.updateDeliveryLocation(activeOrder.id, latitude, longitude);
                },
                (error) => console.error(error),
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

    return (
        <RoleGuard allowedRoles={["admin", "delivery"]}>
            <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-zinc-950 font-sans">
                <Header />
                <div className="container mx-auto py-8 px-4 md:px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <Truck className="h-8 w-8 text-orange-500" />
                            Delivery Dashboard
                        </h1>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsOnline(!isOnline)}
                                className={cn(
                                    "px-6 py-2 rounded-full border text-sm font-bold shadow-sm transition-all",
                                    isOnline
                                        ? "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white hover:bg-slate-50"
                                        : "bg-orange-500 border-orange-500 text-white"
                                )}
                            >
                                {isOnline ? "Go Offline" : "Go Online"}
                            </button>
                            <div className={cn(
                                "flex items-center gap-2 px-6 py-2 rounded-full text-white text-sm font-bold shadow-lg transition-all",
                                isOnline ? "bg-green-500 shadow-green-500/30" : "bg-slate-400 shadow-slate-400/30"
                            )}>
                                {isOnline ? "Online" : "Offline"}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-12">
                        {/* Active Delivery Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Navigation className="h-5 w-5 text-orange-500" />
                                {activeOrder ? "Ongoing Task" : "Available Tasks"}
                            </h2>

                            {activeOrder ? (
                                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-xl overflow-hidden animate-in zoom-in-95">
                                    <div className="p-6 bg-orange-500 text-white">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-orange-100 text-xs font-bold uppercase tracking-wider">Currently Delivering</p>
                                                <h3 className="text-2xl font-bold">Order #{activeOrder.id.slice(-4).toUpperCase()}</h3>
                                            </div>
                                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                                                <Truck className="h-6 w-6" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="h-3 w-3 rounded-full bg-orange-500 ring-4 ring-orange-500/20"></div>
                                                    <div className="w-0.5 h-10 bg-slate-100 dark:bg-zinc-800 my-1"></div>
                                                    <div className="h-3 w-3 rounded-full bg-slate-300 dark:bg-zinc-700"></div>
                                                </div>
                                                <div className="space-y-6 flex-1">
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase">Pickup</p>
                                                        <p className="font-semibold text-slate-900 dark:text-white text-sm">StayNJoy Main Kitchen</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase">Dropoff</p>
                                                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{activeOrder.customerLocation?.address || "Customer Address"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updateStatus(activeOrder.id, "delivered")}
                                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="h-5 w-5" />
                                            Complete Delivery
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {availableOrders.length === 0 ? (
                                        <div className="p-8 text-center text-slate-500 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800">
                                            No orders ready for pickup.
                                        </div>
                                    ) : (
                                        availableOrders.filter(o => !o.deliveryId).map((order) => (
                                            <div key={order.id} className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm hover:border-orange-500/30 transition-all">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="font-bold text-slate-900 dark:text-white">Order #{order.id.slice(-4).toUpperCase()}</h3>
                                                    <span className="text-orange-500 font-black">${order.total.toFixed(2)}</span>
                                                </div>
                                                <button
                                                    onClick={() => updateStatus(order.id, "picked_up")}
                                                    className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold py-3 rounded-2xl hover:bg-orange-500 hover:text-white transition-all"
                                                >
                                                    Accept & Pickup
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Map View Main */}
                        <div className="lg:col-span-8 flex flex-col min-h-[600px]">
                            <div className="flex-1 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden relative group">
                                {activeOrder ? (
                                    <DeliveryMap
                                        origin={{ lat: 26.1445, lng: 91.7362 }} // Mock kitchen coords
                                        destination={activeOrder.deliveryLocation || { lat: 26.1158, lng: 91.7086 }} // Mock/Live dest
                                        currentLocation={activeOrder.deliveryLocation}
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center text-slate-400">
                                        <Truck className="h-12 w-12 mb-4 opacity-20" />
                                        <p className="text-lg font-bold">Waiting for task...</p>
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
