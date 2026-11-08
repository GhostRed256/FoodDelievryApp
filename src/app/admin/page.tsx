"use client";

import {
    LayoutDashboard,
    ShoppingBag,
    Utensils,
    TrendingUp,
    Clock,
    Truck,
    ChevronDown,
    ChevronUp,
    Sparkles,
    ShieldCheck,
    Search,
    Plus,
    Minus,
    Edit3,
    Check,
    X,
    Phone,
    MapPin,
    AlertCircle,
    CheckCircle2,
    RefreshCw,
    ChefHat,
    DollarSign,
    Save
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { orderService, Order, OrderStatus } from "@/lib/orderService";
import { menuService, MenuOverrides } from "@/lib/menuService";
import { PRODUCTS, CATEGORIES, MenuItem, ProductVariant } from "@/data/menuData";
import RoleGuard from "@/components/RoleGuard";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"orders" | "menu">("orders");

    // ==========================================
    // Tab 1: Live Orders & Kitchen State
    // ==========================================
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = orderService.subscribeToOrders({ role: "admin" }, (updatedOrders) => {
            setOrders(updatedOrders);
            setLoadingOrders(false);
        });
        return () => unsubscribe();
    }, []);

    const updateStatus = async (orderId: string, status: OrderStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, status);
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    // ==========================================
    // Tab 2: Daily Menu Stock & Price Editor
    // ==========================================
    const [menuOverrides, setMenuOverrides] = useState<MenuOverrides>(() => menuService.getCachedOverrides());
    const [menuSearch, setMenuSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "unavailable">("all");
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    // Price Edit Modal State
    const [editingProduct, setEditingProduct] = useState<MenuItem | null>(null);
    const [editingVariantName, setEditingVariantName] = useState<string>("");
    const [newPriceValue, setNewPriceValue] = useState<number>(0);
    const [isSavingPrice, setIsSavingPrice] = useState(false);

    useEffect(() => {
        const unsubscribe = menuService.subscribeToOverrides((overrides) => {
            setMenuOverrides(overrides);
        });
        return () => unsubscribe();
    }, []);

    const showNotification = (msg: string) => {
        setActionMessage(msg);
        setTimeout(() => setActionMessage(null), 3500);
    };

    // Helper to get active availability of an item
    const isItemAvailable = (productId: string): boolean => {
        return menuOverrides[productId]?.isAvailable !== false;
    };

    // Helper to get effective price of an item variant
    const getEffectivePrice = (productId: string, variant: ProductVariant): number => {
        const override = menuOverrides[productId];
        if (override?.variantPrices && typeof override.variantPrices[variant.name] === "number") {
            return override.variantPrices[variant.name];
        }
        if (typeof override?.price === "number" && (variant.name === "Standard" || variant.name === "Plate")) {
            return override.price;
        }
        return variant.price;
    };

    // Toggle single item availability (+ / -)
    const handleToggleAvailability = async (productId: string, productName: string) => {
        const currentlyAvailable = isItemAvailable(productId);
        const nextState = !currentlyAvailable;
        try {
            await menuService.setItemAvailability(productId, nextState);
            showNotification(
                nextState
                    ? `✓ ${productName} is now ACTIVE in menu today`
                    : `✕ ${productName} marked SOLD OUT for today`
            );
        } catch (err) {
            console.error("Failed to toggle availability:", err);
        }
    };

    // Open Price Edit Modal for a product
    const openPriceEditor = (product: MenuItem, variantName?: string) => {
        setEditingProduct(product);
        const targetVariant = variantName
            ? product.variants.find(v => v.name === variantName) || product.variants[0]
            : product.variants[0];
        setEditingVariantName(targetVariant.name);
        setNewPriceValue(getEffectivePrice(product.id, targetVariant));
    };

    // Save Price Override
    const handleSavePrice = async () => {
        if (!editingProduct || newPriceValue <= 0) return;
        setIsSavingPrice(true);
        try {
            await menuService.setItemPrice(editingProduct.id, editingVariantName, newPriceValue);
            showNotification(`💰 Price updated for ${editingProduct.name} (${editingVariantName}) to ₹${newPriceValue}`);
            setEditingProduct(null);
        } catch (err) {
            console.error("Failed to save price:", err);
        } finally {
            setIsSavingPrice(false);
        }
    };

    // Quick bulk action: Mark all in selected category as available
    const handleMakeCategoryAvailable = async () => {
        const targetProducts = selectedCategory === "All"
            ? PRODUCTS
            : PRODUCTS.filter(p => p.category === selectedCategory);
        
        const ids = targetProducts.map(p => p.id);
        try {
            await menuService.setBulkAvailability(ids, true);
            showNotification(`✓ All ${ids.length} items in "${selectedCategory}" are now available today`);
        } catch (err) {
            console.error("Failed bulk update:", err);
        }
    };

    // Reset all menu overrides to default
    const handleResetAll = async () => {
        if (!confirm("Reset all menu stock availability and custom prices back to the default menu?")) return;
        try {
            await menuService.resetAllOverrides();
            showNotification("↺ All menu overrides have been reset to factory defaults");
        } catch (err) {
            console.error("Failed to reset overrides:", err);
        }
    };

    // Filtered products for Tab 2
    const filteredMenuItems = useMemo(() => {
        return PRODUCTS.filter((product) => {
            const matchesCat = selectedCategory === "All" || product.category === selectedCategory;
            const matchesSearch =
                menuSearch.trim() === "" ||
                product.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
                product.category.toLowerCase().includes(menuSearch.toLowerCase());

            const available = isItemAvailable(product.id);
            let matchesAvailability = true;
            if (availabilityFilter === "available") matchesAvailability = available;
            if (availabilityFilter === "unavailable") matchesAvailability = !available;

            return matchesCat && matchesSearch && matchesAvailability;
        });
    }, [selectedCategory, menuSearch, availabilityFilter, menuOverrides]);

    const totalDishesCount = PRODUCTS.length;
    const availableDishesCount = useMemo(() => {
        return PRODUCTS.filter(p => isItemAvailable(p.id)).length;
    }, [menuOverrides]);
    const soldOutDishesCount = totalDishesCount - availableDishesCount;

    return (
        <RoleGuard allowedRoles={["admin"]}>
            <main className="flex min-h-screen flex-col bg-[#f7fbf8] dark:bg-[#070a07] text-zinc-900 dark:text-zinc-100 font-sans pb-24 selection:bg-amber-500 selection:text-black">
                <Header />

                <div className="container mx-auto py-6 sm:py-8 px-3 sm:px-4 md:px-6">
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-emerald-500/20 dark:border-amber-500/20">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                                <Sparkles className="h-3 w-3 text-emerald-500" />
                                Official Canteen Control Portal
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2.5">
                                <LayoutDashboard className="h-7 w-7 text-amber-500" />
                                Admin <span className="text-gold-metallic">Operations</span>
                            </h1>
                        </div>

                        {/* Top Tab Navigator (Optimized for Mobile Touch) */}
                        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-200/80 dark:bg-zinc-900 border border-emerald-500/20 dark:border-zinc-800 shadow-inner w-full sm:w-auto">
                            <button
                                onClick={() => setActiveTab("orders")}
                                className={cn(
                                    "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all active:scale-95",
                                    activeTab === "orders"
                                        ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                                        : "text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                )}
                            >
                                <ShoppingBag className="h-4 w-4" />
                                <span>Live Orders ({orders.length})</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("menu")}
                                className={cn(
                                    "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all active:scale-95",
                                    activeTab === "menu"
                                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                                        : "text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                )}
                            >
                                <Utensils className="h-4 w-4" />
                                <span>Menu & Prices ({availableDishesCount}/{totalDishesCount})</span>
                            </button>
                        </div>
                    </div>

                    {/* Toast Notification Banner */}
                    {actionMessage && (
                        <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-white text-xs sm:text-sm font-black flex items-center justify-between shadow-xl animate-in slide-in-from-top-2">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-white" />
                                <span>{actionMessage}</span>
                            </div>
                            <button onClick={() => setActionMessage(null)} className="p-1 hover:bg-white/20 rounded-lg">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {/* ======================================================== */}
                    {/* TAB 1: LIVE ORDERS & KITCHEN PIPELINE                     */}
                    {/* ======================================================== */}
                    {activeTab === "orders" && (
                        <div className="space-y-6">
                            {/* Stats Metric Cards */}
                            <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-4">
                                <StatsCard
                                    title="Total Orders"
                                    value={orders.length.toString()}
                                    icon={<ShoppingBag className="h-5 w-5 text-amber-500" />}
                                    trend="Live Stream"
                                    color="bg-amber-500/10 border-amber-500/30"
                                />
                                <StatsCard
                                    title="In Kitchen"
                                    value={orders.filter(o => o.status === "preparing").length.toString()}
                                    icon={<Clock className="h-5 w-5 text-emerald-500" />}
                                    trend="Cooking"
                                    color="bg-emerald-500/10 border-emerald-500/30"
                                />
                                <StatsCard
                                    title="Out for Delivery"
                                    value={orders.filter(o => o.status === "picked_up").length.toString()}
                                    icon={<Truck className="h-5 w-5 text-blue-500" />}
                                    trend="On Route"
                                    color="bg-blue-500/10 border-blue-500/30"
                                />
                                <StatsCard
                                    title="Gross Revenue"
                                    value={`₹${orders.reduce((sum, o) => sum + o.total, 0)}`}
                                    icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
                                    trend="Today"
                                    color="bg-emerald-500/10 border-emerald-500/30"
                                />
                            </div>

                            <div className="grid gap-6 lg:grid-cols-3">
                                {/* Order Stream Column */}
                                <div className="lg:col-span-2 bg-white dark:bg-[#0c120c] p-4 sm:p-6 rounded-3xl border border-emerald-500/20 dark:border-amber-500/20 shadow-xl">
                                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-500/10 dark:border-amber-500/10">
                                        <h2 className="text-base sm:text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
                                            <ShoppingBag className="h-5 w-5 text-amber-500" />
                                            Real-Time Order Pipeline
                                        </h2>
                                        <span className="text-xs font-bold text-zinc-500">
                                            Tap order to view items
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {loadingOrders ? (
                                            <div className="text-center py-12 text-zinc-500 font-bold">
                                                Loading active pipeline...
                                            </div>
                                        ) : orders.length === 0 ? (
                                            <div className="text-center py-16 text-zinc-500 font-bold bg-zinc-50 dark:bg-zinc-950/40 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800">
                                                No active orders found in the pipeline.
                                            </div>
                                        ) : (
                                            orders.map((order) => {
                                                const isExpanded = expandedOrderId === order.id;
                                                return (
                                                    <div
                                                        key={order.id}
                                                        className="rounded-2xl bg-zinc-50 dark:bg-[#080c08] border border-emerald-500/20 dark:border-amber-500/20 overflow-hidden shadow-sm transition-all hover:border-amber-400/50"
                                                    >
                                                        {/* Summary Row */}
                                                        <div
                                                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none active:bg-zinc-100 dark:active:bg-zinc-900/60"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-black flex items-center justify-center font-black text-xs shadow-md shrink-0">
                                                                    #{order.id.slice(-4).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="font-black text-sm text-zinc-900 dark:text-white">
                                                                            {order.customerName}
                                                                        </p>
                                                                        {order.customerPhone && (
                                                                            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                                                                ({order.customerPhone})
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                                                                        {order.items.length} items •{" "}
                                                                        <span className="text-amber-500 font-black">₹{order.total}</span>{" "}
                                                                        •{" "}
                                                                        {order.createdAt
                                                                            ? format(order.createdAt.toDate(), "HH:mm")
                                                                            : "Just now"}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between sm:justify-end gap-2.5">
                                                                <span
                                                                    className={cn(
                                                                        "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                                                                        order.status === "pending" && "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40",
                                                                        order.status === "confirmed" && "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/40",
                                                                        order.status === "preparing" && "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/40 animate-pulse",
                                                                        order.status === "ready" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40",
                                                                        order.status === "picked_up" && "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/40",
                                                                        order.status === "delivered" && "bg-zinc-200 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-400 dark:border-zinc-700"
                                                                    )}
                                                                >
                                                                    {order.status.replace("_", " ")}
                                                                </span>

                                                                {isExpanded ? (
                                                                    <ChevronUp className="h-4 w-4 text-zinc-500" />
                                                                ) : (
                                                                    <ChevronDown className="h-4 w-4 text-zinc-500" />
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Expanded Details Section: Complete Items List & Actions */}
                                                        {isExpanded && (
                                                            <div className="p-4 pt-2 border-t border-emerald-500/10 dark:border-amber-500/10 bg-white/70 dark:bg-black/40 space-y-3.5 text-xs">
                                                                {/* Detailed Items Breakdown */}
                                                                <div>
                                                                    <p className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                                                                        📋 Ordered Items ({order.items.length}):
                                                                    </p>
                                                                    <div className="space-y-1.5 pl-1">
                                                                        {order.items.map((item, idx) => (
                                                                            <div
                                                                                key={idx}
                                                                                className="flex items-center justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0"
                                                                            >
                                                                                <div className="font-bold text-zinc-800 dark:text-zinc-200">
                                                                                    <span className="text-amber-500 font-black mr-1.5">
                                                                                        {item.quantity}x
                                                                                    </span>
                                                                                    {item.name}
                                                                                </div>
                                                                                <span className="font-black text-zinc-700 dark:text-zinc-300">
                                                                                    ₹{item.price * item.quantity}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {/* Delivery Address & Contact Info */}
                                                                <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-1">
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <div className="flex items-start gap-1.5">
                                                                            <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                                                            <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                                                                                {order.customerLocation?.address || "Tinsukia Local Delivery"}
                                                                            </span>
                                                                        </div>
                                                                        {order.customerLocation?.lat && (
                                                                            <a
                                                                                href={`https://maps.google.com/?q=${order.customerLocation.lat},${order.customerLocation.lng}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="px-2 py-0.5 rounded bg-emerald-500 text-white font-bold text-[10px] shrink-0 hover:bg-emerald-600"
                                                                            >
                                                                                GPS Map
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                    {order.customerPhone && (
                                                                        <div className="flex items-center justify-between pt-1">
                                                                            <span className="text-zinc-500 font-bold">
                                                                                Phone: {order.customerPhone}
                                                                            </span>
                                                                            <a
                                                                                href={`https://api.whatsapp.com/send?phone=91${order.customerPhone.replace(/\D/g, "")}&text=Hello%20${encodeURIComponent(order.customerName)},%20regarding%20your%20FoodNJoy%20Order%20%23${order.id.slice(-6)}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-emerald-600 font-black hover:underline text-[11px]"
                                                                            >
                                                                                Message Customer
                                                                            </a>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Status Actions */}
                                                                <div className="flex flex-wrap gap-2 pt-1">
                                                                    {order.status === "pending" && (
                                                                        <button
                                                                            onClick={() => updateStatus(order.id, "confirmed")}
                                                                            className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-black py-2 rounded-xl text-xs transition-all shadow-md active:scale-95 text-center"
                                                                        >
                                                                            Accept Order
                                                                        </button>
                                                                    )}
                                                                    {order.status === "confirmed" && (
                                                                        <button
                                                                            onClick={() => updateStatus(order.id, "preparing")}
                                                                            className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-black py-2 rounded-xl text-xs transition-all shadow-md active:scale-95 text-center"
                                                                        >
                                                                            Send to Kitchen (Cook)
                                                                        </button>
                                                                    )}
                                                                    {order.status === "preparing" && (
                                                                        <button
                                                                            onClick={() => updateStatus(order.id, "ready")}
                                                                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2 rounded-xl text-xs transition-all shadow-md active:scale-95 text-center"
                                                                        >
                                                                            Mark Ready for Pickup
                                                                        </button>
                                                                    )}
                                                                    {order.status === "ready" && (
                                                                        <button
                                                                            onClick={() => updateStatus(order.id, "picked_up")}
                                                                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black py-2 rounded-xl text-xs transition-all shadow-md active:scale-95 text-center"
                                                                        >
                                                                            Dispatch (Out for Delivery)
                                                                        </button>
                                                                    )}
                                                                    {order.status === "picked_up" && (
                                                                        <button
                                                                            onClick={() => updateStatus(order.id, "delivered")}
                                                                            className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white font-black py-2 rounded-xl text-xs transition-all shadow-md active:scale-95 text-center"
                                                                        >
                                                                            Mark Completed (Delivered)
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                                {/* Side Widgets */}
                                <div className="space-y-6">
                                    <div className="bg-white dark:bg-[#0c120c] p-6 rounded-3xl border border-emerald-500/20 dark:border-amber-500/20 shadow-xl">
                                        <h2 className="text-base sm:text-lg font-black mb-4 text-zinc-900 dark:text-white flex items-center gap-2">
                                            <ChefHat className="h-5 w-5 text-amber-500" />
                                            Kitchen Workload
                                        </h2>
                                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#080c08] border border-emerald-500/20 dark:border-amber-500/20">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                                    Active Cooking Batches
                                                </span>
                                                <span className="text-xs font-black text-amber-500">
                                                    {orders.filter(o => o.status === "preparing").length} batches
                                                </span>
                                            </div>
                                            <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden border border-amber-500/20">
                                                <div
                                                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-700"
                                                    style={{ width: `${Math.min(100, Math.max(10, orders.filter(o => o.status === "preparing").length * 25))}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-[#0c120c] p-6 rounded-3xl border border-emerald-500/20 dark:border-amber-500/20 shadow-xl">
                                        <h2 className="text-base sm:text-lg font-black mb-4 text-zinc-900 dark:text-white flex items-center gap-2">
                                            <Truck className="h-5 w-5 text-emerald-500" />
                                            Delivery Partner Fleet
                                        </h2>
                                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#080c08] border border-emerald-500/20 flex justify-between items-center">
                                            <div>
                                                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Riders on the Road</p>
                                                <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                                                    Partner: +91 91810 42005
                                                </p>
                                            </div>
                                            <span className="text-2xl font-black text-amber-500">
                                                {orders.filter(o => o.status === "picked_up").length}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ======================================================== */}
                    {/* TAB 2: MENU & PRICING MANAGER (DAILY STOCK & PRICES)     */}
                    {/* ======================================================== */}
                    {activeTab === "menu" && (
                        <div className="space-y-6">
                            {/* Summary Banner for Menu Control */}
                            <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white p-4 sm:p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-emerald-400/40">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider mb-2">
                                        <ShieldCheck className="h-3 w-3" />
                                        Daily Menu Control Suite
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-black leading-tight">
                                        Today's Menu Availability & Prices
                                    </h2>
                                    <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl leading-relaxed">
                                        Use the <span className="font-black text-amber-300">+</span> and <span className="font-black text-amber-300">-</span> buttons to add or remove dishes for today, and adjust any dish price. Changes reflect instantly on customer devices.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={handleMakeCategoryAvailable}
                                        className="bg-white hover:bg-emerald-50 text-emerald-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                                    >
                                        <Check className="h-3.5 w-3.5 text-emerald-700" />
                                        <span>Mark Category Active</span>
                                    </button>

                                    <button
                                        onClick={handleResetAll}
                                        className="bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 border border-emerald-400/40 font-bold px-3 py-2.5 rounded-xl text-xs transition-all active:scale-95 flex items-center gap-1"
                                    >
                                        <RefreshCw className="h-3.5 w-3.5" />
                                        <span>Reset</span>
                                    </button>
                                </div>
                            </div>

                            {/* Search and Filters Bar */}
                            <div className="bg-white dark:bg-[#0c120c] p-4 sm:p-5 rounded-3xl border border-emerald-500/20 dark:border-amber-500/20 shadow-md space-y-3.5">
                                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                                    {/* Search Input */}
                                    <div className="relative w-full sm:w-80">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                                        <input
                                            type="text"
                                            placeholder="Search by dish name or category..."
                                            value={menuSearch}
                                            onChange={(e) => setMenuSearch(e.target.value)}
                                            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-zinc-50 dark:bg-[#070a07] border border-emerald-500/30 dark:border-amber-500/30 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                        {menuSearch && (
                                            <button
                                                onClick={() => setMenuSearch("")}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Availability Status Filter */}
                                    <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
                                        <button
                                            onClick={() => setAvailabilityFilter("all")}
                                            className={cn(
                                                "flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-black transition-all border whitespace-nowrap",
                                                availabilityFilter === "all"
                                                    ? "bg-amber-500 text-black border-amber-500 shadow-sm"
                                                    : "bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800"
                                            )}
                                        >
                                            All ({totalDishesCount})
                                        </button>
                                        <button
                                            onClick={() => setAvailabilityFilter("available")}
                                            className={cn(
                                                "flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-black transition-all border whitespace-nowrap",
                                                availabilityFilter === "available"
                                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                                    : "bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800"
                                            )}
                                        >
                                            Available ({availableDishesCount})
                                        </button>
                                        <button
                                            onClick={() => setAvailabilityFilter("unavailable")}
                                            className={cn(
                                                "flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-black transition-all border whitespace-nowrap",
                                                availabilityFilter === "unavailable"
                                                    ? "bg-red-600 text-white border-red-600 shadow-sm"
                                                    : "bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800"
                                            )}
                                        >
                                            Sold Out ({soldOutDishesCount})
                                        </button>
                                    </div>
                                </div>

                                {/* Category Horizontal Pills */}
                                <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar touch-pan-x">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={cn(
                                                "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border active:scale-95",
                                                selectedCategory === cat
                                                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black border-amber-400 font-black shadow-md"
                                                    : "bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-amber-400"
                                            )}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Dishes Grid */}
                            <div className="grid gap-3.5 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {filteredMenuItems.length === 0 ? (
                                    <div className="col-span-full py-16 text-center text-zinc-500 font-bold bg-white dark:bg-[#0c120c] rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800">
                                        No dishes matched your filter or search query.
                                    </div>
                                ) : (
                                    filteredMenuItems.map((product) => {
                                        const available = isItemAvailable(product.id);
                                        const primaryVariant = product.variants[0];
                                        const effectivePrice = getEffectivePrice(product.id, primaryVariant);
                                        const hasCustomPrice =
                                            menuOverrides[product.id]?.price !== undefined ||
                                            menuOverrides[product.id]?.variantPrices !== undefined;

                                        return (
                                            <div
                                                key={product.id}
                                                className={cn(
                                                    "bg-white dark:bg-[#0c180e] rounded-2xl p-3.5 sm:p-4 border shadow-md flex flex-col justify-between transition-all",
                                                    available
                                                        ? "border-emerald-500/25 dark:border-emerald-500/20 hover:border-amber-400/50"
                                                        : "border-red-500/30 dark:border-red-900/40 bg-red-50/20 dark:bg-red-950/10"
                                                )}
                                            >
                                                {/* Top Item Summary */}
                                                <div>
                                                    <div className="flex gap-3">
                                                        {/* Thumbnail */}
                                                        <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-zinc-900 shrink-0 border border-zinc-200 dark:border-zinc-800">
                                                            <Image
                                                                src={product.image}
                                                                alt={product.name}
                                                                fill
                                                                className={cn(
                                                                    "object-cover",
                                                                    !available && "grayscale-[40%]"
                                                                )}
                                                                sizes="80px"
                                                            />
                                                            {!available && (
                                                                <div className="absolute inset-0 bg-red-950/60 flex items-center justify-center">
                                                                    <span className="text-[9px] font-black text-red-200 uppercase tracking-tighter">
                                                                        Sold Out
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Name & Details */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                                <span
                                                                    className={cn(
                                                                        "h-2 w-2 rounded-full shrink-0",
                                                                        product.isVeg ? "bg-emerald-500" : "bg-red-500"
                                                                    )}
                                                                />
                                                                <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider truncate">
                                                                    {product.category}
                                                                </span>
                                                            </div>

                                                            <h3 className="font-black text-sm text-zinc-900 dark:text-white truncate">
                                                                {product.name}
                                                            </h3>

                                                            {/* Current Price display */}
                                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                                <span className="text-base font-black text-amber-500 dark:text-amber-400">
                                                                    ₹{effectivePrice}
                                                                </span>
                                                                {product.variants.length > 1 && (
                                                                    <span className="text-[10px] font-bold text-zinc-500">
                                                                        ({product.variants.length} portions)
                                                                    </span>
                                                                )}
                                                                {hasCustomPrice && (
                                                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase">
                                                                        Custom Price
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Controls for Admin (Touch-Optimized for Mobile) */}
                                                <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2">
                                                    {/* Plus/Minus Availability Toggle */}
                                                    <button
                                                        onClick={() => handleToggleAvailability(product.id, product.name)}
                                                        className={cn(
                                                            "flex-1 py-2.5 px-3 rounded-xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 border shadow-sm",
                                                            available
                                                                ? "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-900/50 hover:bg-rose-100"
                                                                : "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500"
                                                        )}
                                                        title={available ? "Click minus to mark as Sold Out today" : "Click plus to mark as Available today"}
                                                    >
                                                        {available ? (
                                                            <>
                                                                <Minus className="h-3.5 w-3.5" />
                                                                <span>— Remove for Today</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Plus className="h-3.5 w-3.5" />
                                                                <span>+ Add to Today's Menu</span>
                                                            </>
                                                        )}
                                                    </button>

                                                    {/* Price Edit Trigger Button */}
                                                    <button
                                                        onClick={() => openPriceEditor(product)}
                                                        className="py-2.5 px-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs border border-zinc-300 dark:border-zinc-700 flex items-center gap-1 transition-all active:scale-95 shrink-0"
                                                        title="Change price of this dish"
                                                    >
                                                        <Edit3 className="h-3.5 w-3.5 text-amber-500" />
                                                        <span>Price</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ======================================================== */}
                {/* MODAL: PRICE EDITOR SHEET FOR ADMIN                      */}
                {/* ======================================================== */}
                {editingProduct && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
                        <div className="w-full max-w-sm bg-white dark:bg-[#0c180e] rounded-3xl p-5 sm:p-6 border border-emerald-500/30 dark:border-amber-500/30 shadow-2xl relative animate-in zoom-in-95 text-zinc-900 dark:text-white space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                                        Update Dish Price
                                    </span>
                                    <h3 className="text-base font-black truncate max-w-[240px]">
                                        {editingProduct.name}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setEditingProduct(null)}
                                    className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Variant Selector (if multiple variants) */}
                            {editingProduct.variants.length > 1 && (
                                <div>
                                    <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 block mb-1">
                                        Select Portion / Variant
                                    </label>
                                    <div className="flex gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl">
                                        {editingProduct.variants.map((v) => {
                                            const isSelected = editingVariantName === v.name;
                                            return (
                                                <button
                                                    key={v.name}
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingVariantName(v.name);
                                                        setNewPriceValue(getEffectivePrice(editingProduct.id, v));
                                                    }}
                                                    className={cn(
                                                        "flex-1 py-1.5 rounded-lg text-xs font-black transition-all",
                                                        isSelected
                                                            ? "bg-amber-500 text-black shadow-sm"
                                                            : "text-zinc-600 dark:text-zinc-400 hover:text-white"
                                                    )}
                                                >
                                                    {v.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Price Input & Quick Adjusters */}
                            <div className="space-y-2 text-center py-1">
                                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                    Price for {editingVariantName || "Standard"} (₹ INR)
                                </label>
                                <div className="relative max-w-[180px] mx-auto">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-amber-500">
                                        ₹
                                    </span>
                                    <input
                                        type="number"
                                        min={1}
                                        max={9999}
                                        value={newPriceValue}
                                        onChange={(e) => setNewPriceValue(Math.max(1, parseInt(e.target.value) || 0))}
                                        className="w-full pl-9 pr-4 py-3 rounded-2xl bg-zinc-50 dark:bg-[#070a07] border-2 border-emerald-500/40 dark:border-amber-500/40 text-2xl font-black text-center text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                                    />
                                </div>

                                {/* Quick Increment / Decrement Buttons for Mobile */}
                                <div className="flex items-center justify-center gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setNewPriceValue(prev => Math.max(10, prev - 10))}
                                        className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-bold text-zinc-700 dark:text-zinc-300"
                                    >
                                        - ₹10
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewPriceValue(prev => prev + 10)}
                                        className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-bold text-zinc-700 dark:text-zinc-300"
                                    >
                                        + ₹10
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewPriceValue(prev => prev + 20)}
                                        className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-bold text-zinc-700 dark:text-zinc-300"
                                    >
                                        + ₹20
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewPriceValue(prev => prev + 50)}
                                        className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-bold text-zinc-700 dark:text-zinc-300"
                                    >
                                        + ₹50
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={isSavingPrice || newPriceValue <= 0}
                                    onClick={handleSavePrice}
                                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />
                                    <span>{isSavingPrice ? "Saving..." : "Save Price"}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </RoleGuard>
    );
}

function StatsCard({ title, value, icon, trend, color }: any) {
    return (
        <div className={cn("p-4 sm:p-5 rounded-3xl border shadow-md flex items-center gap-3.5 bg-white dark:bg-[#0c120c]", color)}>
            <div className="h-11 w-11 rounded-2xl bg-black/40 border border-amber-500/20 flex items-center justify-center text-lg shadow-md shrink-0">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 truncate">
                    {title}
                </p>
                <div className="flex items-baseline gap-2 mt-0.5">
                    <h3 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white truncate">
                        {value}
                    </h3>
                    <span className="text-[10px] font-black text-emerald-500 shrink-0">
                        {trend}
                    </span>
                </div>
            </div>
        </div>
    );
}
