"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { ShoppingCart, Search, Utensils, Star, Plus, Minus, X, Loader2, Sparkles, ShieldCheck, ChevronRight, MapPin, Navigation, CheckCircle2, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { orderService } from "@/lib/orderService";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), { ssr: false });

export interface ProductVariant {
    name: string;
    price: number;
}

export interface MenuItem {
    id: string;
    name: string;
    category: string;
    description: string;
    image: string;
    rating: number;
    isVeg?: boolean;
    isChefSpecial?: boolean;
    variants: ProductVariant[];
}

const CATEGORIES = [
    "All",
    "Fried Rice",
    "Noodles",
    "Schezwan Specials",
    "Momos & Starters",
    "Kathi Rolls",
    "Gravy & Dry Chinese"
];

const PRODUCTS: MenuItem[] = [
    {
        id: "chicken-fried-rice",
        name: "Chicken Fried Rice",
        category: "Fried Rice",
        description: "Wok-tossed basmati rice with tender shredded chicken, scrambled eggs, carrots, spring onions, and aromatic seasonings.",
        image: "/dishes/chicken_fried_rice.jpg",
        rating: 4.8,
        variants: [
            { name: "Half", price: 59 },
            { name: "Full", price: 99 }
        ]
    },
    {
        id: "egg-fried-rice",
        name: "Egg Fried Rice",
        category: "Fried Rice",
        description: "Street-style wok fried rice packed with golden scrambled eggs, fresh crunchy veggies, and garlic-soy aroma.",
        image: "/dishes/egg_fried_rice.jpg",
        rating: 4.7,
        variants: [
            { name: "Half", price: 55 },
            { name: "Full", price: 89 }
        ]
    },
    {
        id: "veg-fried-rice",
        name: "Veg Fried Rice",
        category: "Fried Rice",
        description: "Flavorful rice stir-fried with garden fresh carrots, french beans, sweet corn, green peas, and spring onions.",
        image: "/dishes/veg_fried_rice.jpg",
        rating: 4.6,
        isVeg: true,
        variants: [
            { name: "Half", price: 49 },
            { name: "Full", price: 79 }
        ]
    },
    {
        id: "chicken-noodles",
        name: "Chicken Hakka Noodles",
        category: "Noodles",
        description: "High-flame wok tossed noodles with sliced chicken, egg ribbons, shredded cabbage, carrots, and spicy soy garlic glaze.",
        image: "/dishes/hakka_noodles.jpg",
        rating: 4.8,
        variants: [
            { name: "Half", price: 59 },
            { name: "Full", price: 99 }
        ]
    },
    {
        id: "egg-noodles",
        name: "Egg Hakka Noodles",
        category: "Noodles",
        description: "Delicious chowmein noodles tossed with farm fresh scrambled eggs, cabbage, capsicum, and oriental spices.",
        image: "/dishes/egg_noodles.jpg",
        rating: 4.6,
        variants: [
            { name: "Half", price: 55 },
            { name: "Full", price: 89 }
        ]
    },
    {
        id: "veg-noodles",
        name: "Veg Hakka Noodles",
        category: "Noodles",
        description: "Classic street chowmein noodles with crisp stir-fried vegetables, soya sauce, and secret spice blend.",
        image: "/dishes/veg_noodles.jpg",
        rating: 4.6,
        isVeg: true,
        variants: [
            { name: "Half", price: 49 },
            { name: "Full", price: 79 }
        ]
    },
    {
        id: "triple-schezwan-chicken-rice",
        name: "Triple Layered Schezwan Chicken Rice",
        category: "Schezwan Specials",
        description: "Signature 3-layer delight: spicy Schezwan fried rice, topped with crispy fried noodles, boiled egg, and thick savory chicken gravy.",
        image: "/dishes/schezwan_triple_rice.jpg",
        rating: 4.9,
        isChefSpecial: true,
        variants: [
            { name: "Half", price: 79 },
            { name: "Full", price: 129 }
        ]
    },
    {
        id: "triple-schezwan-egg-rice",
        name: "Triple Layered Schezwan Egg Rice",
        category: "Schezwan Specials",
        description: "Fiery Schezwan egg fried rice served with crispy noodles and rich spicy gravy topped with boiled egg.",
        image: "/dishes/schezwan_egg_rice.jpg",
        rating: 4.7,
        isChefSpecial: true,
        variants: [
            { name: "Half", price: 69 },
            { name: "Full", price: 119 }
        ]
    },
    {
        id: "triple-schezwan-veg-rice",
        name: "Triple Layered Schezwan Veg Rice",
        category: "Schezwan Specials",
        description: "Wholesome combo of Schezwan vegetable fried rice, crunchy fried noodles, and sizzling vegetable Schezwan sauce.",
        image: "/dishes/schezwan_veg_rice.jpg",
        rating: 4.7,
        isVeg: true,
        isChefSpecial: true,
        variants: [
            { name: "Half", price: 59 },
            { name: "Full", price: 99 }
        ]
    },
    {
        id: "chicken-momo",
        name: "Chicken Steamed Momos",
        category: "Momos & Starters",
        description: "Hot, juicy handcrafted dumplings filled with spiced minced chicken. Served with signature red garlic chili chutney & clear soup.",
        image: "/dishes/chicken_momos.jpg",
        rating: 4.9,
        variants: [
            { name: "Half (5 Pcs)", price: 59 },
            { name: "Full (10 Pcs)", price: 99 }
        ]
    },
    {
        id: "chicken-pops",
        name: "Crispy Chicken Pops",
        category: "Momos & Starters",
        description: "Crunchy golden bite-sized chicken popcorn bites tossed in peri-peri seasoning and served with creamy mayonnaise dip.",
        image: "/dishes/chicken_pops.jpg",
        rating: 4.8,
        variants: [
            { name: "Small", price: 79 },
            { name: "Medium", price: 109 },
            { name: "Large", price: 139 }
        ]
    },
    {
        id: "chicken-kabab",
        name: "Tandoori Chicken Kabab",
        category: "Momos & Starters",
        description: "Juicy chicken chunks marinated in rich tandoori spices and roasted to perfection. Served with mint chutney and onion salad.",
        image: "/dishes/chicken_kabab.jpg",
        rating: 4.9,
        variants: [
            { name: "Half", price: 79 },
            { name: "Full", price: 129 }
        ]
    },
    {
        id: "kolkata-chicken-kathi-roll",
        name: "Kolkata Chicken Kathi Roll",
        category: "Kathi Rolls",
        description: "Authentic flaky layered paratha roll stuffed with spiced chicken tikka, crunchy sliced onions, chaat masala, and mint chutney.",
        image: "/dishes/chicken_kathi_roll.jpg",
        rating: 4.9,
        variants: [
            { name: "Single (Half)", price: 89 },
            { name: "Double (Full)", price: 159 }
        ]
    },
    {
        id: "kolkata-egg-kathi-roll",
        name: "Kolkata Egg Kathi Roll",
        category: "Kathi Rolls",
        description: "Crispy paratha coated with golden eggs, loaded with crunchy spiced onions, green chillies, lemon, and tangy sauces.",
        image: "/dishes/egg_kathi_roll.jpg",
        rating: 4.7,
        variants: [
            { name: "Single (Half)", price: 69 },
            { name: "Double (Full)", price: 109 }
        ]
    },
    {
        id: "chicken-manchurian",
        name: "Chicken Manchurian",
        category: "Gravy & Dry Chinese",
        description: "Crispy chicken meatballs tossed in a dark, luscious garlic, ginger, soya, and spring onion Manchurian gravy.",
        image: "/dishes/chicken_manchurian.jpg",
        rating: 4.8,
        variants: [
            { name: "Half", price: 99 },
            { name: "Full", price: 189 }
        ]
    },
    {
        id: "chilly-chicken",
        name: "Indo-Chinese Chilli Chicken",
        category: "Gravy & Dry Chinese",
        description: "Popular wok-tossed crispy chicken chunks with green capsicum, sliced onions, green chillies, and savory dark soy sauce.",
        image: "/dishes/chilly_chicken.jpg",
        rating: 4.8,
        variants: [
            { name: "Half", price: 89 },
            { name: "Full", price: 139 }
        ]
    },
    {
        id: "chicken-dry-fry",
        name: "Northeast Spicy Chicken Dry Fry",
        category: "Gravy & Dry Chinese",
        description: "Traditional spicy pan-roasted chicken infused with crushed black pepper, curry leaves, ginger, and local green chilies.",
        image: "/dishes/chicken_dry_fry.jpg",
        rating: 4.9,
        variants: [
            { name: "Half", price: 79 },
            { name: "Full", price: 129 }
        ]
    },
    {
        id: "baba-chicken-roll",
        name: "Special Baba Chicken Roll",
        category: "Kathi Rolls",
        description: "Signature jumbo roll with double spiced grilled chicken, egg layer, melted cheese, and creamy garlic mayonnaise.",
        image: "/dishes/baba_chicken_roll.jpg",
        rating: 4.9,
        isChefSpecial: true,
        variants: [
            { name: "Full", price: 139 }
        ]
    },
    {
        id: "mix-special-roll",
        name: "Special Mix Veg / Egg / Chicken Roll",
        category: "Kathi Rolls",
        description: "The ultimate jumbo roll packed with spiced chicken chunks, fluffy egg, sauteed veggies, and signature condiments.",
        image: "/dishes/mix_special_roll.jpg",
        rating: 4.9,
        isChefSpecial: true,
        variants: [
            { name: "Full", price: 159 }
        ]
    }
];

interface CartItem {
    cartKey: string;
    product: MenuItem;
    variant: ProductVariant;
    quantity: number;
}

// Distance calculation using Haversine formula (returns distance in km)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function MenuPage() {
    const { profile, user } = useAuth();
    const router = useRouter();

    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariant>>(() => {
        const initial: Record<string, ProductVariant> = {};
        PRODUCTS.forEach(p => {
            initial[p.id] = p.variants[0];
        });
        return initial;
    });

    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartLoaded, setIsCartLoaded] = useState(false);

    useEffect(() => {
        try {
            const savedCart = localStorage.getItem("foodnjoy_cart");
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
        } catch (err) {
            console.error("Failed to load cart from local storage", err);
        } finally {
            setIsCartLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (isCartLoaded) {
            localStorage.setItem("foodnjoy_cart", JSON.stringify(cart));
            window.dispatchEvent(new Event("cartUpdated"));
        }
    }, [cart, isCartLoaded]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Free Browser GPS & Address State
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [customerCoords, setCustomerCoords] = useState<{ lat: number; lng: number }>({
        lat: 27.4893, // Tinsukia College Default
        lng: 95.3524
    });
    const [isLocating, setIsLocating] = useState(false);
    const [gpsAcquired, setGpsAcquired] = useState(false);
    const [checkoutError, setCheckoutError] = useState("");
    const [showMap, setShowMap] = useState(false);

    // Fee parameters (Free under 5km, ₹20 above 5km)
    // Origin: Tinsukia College (27.4893, 95.3524)
    const distanceToKitchen = calculateDistance(27.4893, 95.3524, customerCoords.lat, customerCoords.lng);
    const isOutsideTinsukia = gpsAcquired && distanceToKitchen > 12; // Reject if outside 12km radius of Tinsukia College
    const DELIVERY_FEE = (gpsAcquired && distanceToKitchen <= 5) ? 0 : 25;
    const TAX_AND_SERVICE_FEE = 15;

    const filteredProducts = PRODUCTS.filter(p =>
        (activeCategory === "All" || p.category === activeCategory) &&
        (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleSelectVariant = (productId: string, variant: ProductVariant) => {
        setSelectedVariants(prev => ({
            ...prev,
            [productId]: variant
        }));
    };

    const addToCart = (product: MenuItem) => {
        const currentVariant = selectedVariants[product.id] || product.variants[0];
        const cartKey = `${product.id}-${currentVariant.name}`;

        setCart(prev => {
            const existing = prev.find(item => item.cartKey === cartKey);
            if (existing) {
                return prev.map(item =>
                    item.cartKey === cartKey
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { cartKey, product, variant: currentVariant, quantity: 1 }];
        });
    };

    const updateQuantity = (cartKey: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.cartKey === cartKey) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    // Free device GPS capture and Reverse Geocoding (Runs on any phone browser)
    const handleFetchLocation = () => {
        if (!navigator.geolocation) {
            setCheckoutError("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setCustomerCoords({ lat: latitude, lng: longitude });
                setGpsAcquired(true);
                
                // Use free OpenStreetMap Nominatim API for reverse geocoding
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                    const data = await response.json();
                    if (data && data.display_name) {
                        setDeliveryAddress(data.display_name);
                    }
                } catch (err) {
                    console.error("Failed to reverse geocode:", err);
                }
                
                setIsLocating(false);
            },
            (error) => {
                console.warn("GPS error:", error);
                setIsLocating(false);
                setCheckoutError("Please enable location permission on your phone for direct doorstep delivery.");
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const totalCartCount = cart.reduce((a, b) => a + b.quantity, 0);
    const itemsSubtotal = cart.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);
    const totalOrderAmount = cart.length > 0 ? itemsSubtotal + DELIVERY_FEE + TAX_AND_SERVICE_FEE : 0;

    const [hasWarnedLocation, setHasWarnedLocation] = useState(false);

    const handleCheckout = () => {
        setCheckoutError("");

        // Make location optional but show a warning prompt once
        if (!gpsAcquired && !deliveryAddress.trim() && !hasWarnedLocation) {
            setCheckoutError("Delivery Location is currently empty! Please fill it or tap 'Pin My Live Location'. If you still want to order without a location, tap Place Order again.");
            setHasWarnedLocation(true);
            return;
        }

        setIsSubmitting(true);
        try {
            // WhatsApp formatting
            let msg = `*🍽️ New Order from FoodNJoy!* \n\n`;
            msg += `*Items:* \n`;
            cart.forEach(item => {
                msg += `- ${item.quantity}x ${item.product.name} (${item.variant.name}) [₹${item.variant.price * item.quantity}]\n`;
            });
            
            msg += `\n*Subtotal:* ₹${itemsSubtotal}\n`;
            msg += `*Taxes & Fees:* ₹${TAX_AND_SERVICE_FEE}\n`;
            
            let finalTotal = itemsSubtotal + TAX_AND_SERVICE_FEE;
            if (gpsAcquired) {
                msg += `*Delivery Fee:* ₹${DELIVERY_FEE}\n`;
                finalTotal += DELIVERY_FEE;
            } else {
                msg += `*Delivery Fee:* To be confirmed by kitchen\n`;
            }
            msg += `*Total Estimate:* ₹${finalTotal}\n\n`;

            msg += `*📍 Delivery Details:*\n`;
            if (deliveryAddress.trim()) {
                msg += `Address: ${deliveryAddress.trim()}\n`;
            } else {
                msg += `Address: Not Provided\n`;
            }

            if (gpsAcquired) {
                msg += `GPS Link: https://maps.google.com/?q=${customerCoords.lat},${customerCoords.lng}\n`;
            }

            const encodedMsg = encodeURIComponent(msg);
            const waUrl = `https://wa.me/918133819414?text=${encodedMsg}`;
            
            // Open WhatsApp in a new tab or app
            window.open(waUrl, "_blank");

            // Attempt to save to database silently for Kitchen Dashboard (no blocking)
            try {
                orderService.createOrder({
                    customerId: user ? user.uid : "guest",
                    customerName: profile?.displayName || user?.displayName || "WhatsApp Guest",
                    items: cart.map(item => ({
                        id: item.cartKey,
                        name: `${item.product.name} (${item.variant.name})`,
                        price: item.variant.price,
                        quantity: item.quantity
                    })),
                    total: finalTotal,
                    status: "pending",
                    customerLocation: {
                        lat: customerCoords.lat,
                        lng: customerCoords.lng,
                        address: deliveryAddress.trim() || "Not Provided"
                    }
                }).catch(console.error); // Fire and forget
            } catch (dbErr) {
                console.error("Silent DB save failed", dbErr);
            }
            
            // Clear cart after checkout
            setCart([]);
            setIsCartOpen(false);
            setHasWarnedLocation(false);
        } catch (error: any) {
            console.error("Checkout failed:", error);
            setCheckoutError("Failed to open WhatsApp. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col bg-[#070a07] text-zinc-100 font-sans pb-24 md:pb-12 selection:bg-amber-500 selection:text-black">
            <Header />

            <div className="container mx-auto py-6 sm:py-10 px-3 sm:px-4 md:px-6 flex-1">
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-amber-500/20">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-2">
                            <Sparkles className="h-3 w-3 text-emerald-400" />
                            Taste • Hygiene • Value
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                            Food<span className="text-gold-metallic">N</span>Joy Menu
                        </h1>
                        <p className="text-zinc-400 mt-0.5 text-xs sm:text-sm">
                            Steaming fresh delicacies cooked to order in Tinsukia.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400/80" />
                        <input
                            type="text"
                            placeholder="Search dishes or categories..."
                            className="w-full pl-10 pr-9 py-3 rounded-2xl bg-[#0c120c] border border-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-md text-sm text-white placeholder:text-zinc-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Horizontal Category Pills in Gold & Emerald */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar touch-pan-x">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap border shadow-sm active:scale-95",
                                activeCategory === cat
                                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20 font-black"
                                    : "bg-[#0c120c] text-zinc-300 border-amber-500/20 hover:border-amber-500/50 hover:text-white"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map(product => {
                        const currentVariant = selectedVariants[product.id] || product.variants[0];
                        const cartItem = cart.find(c => c.cartKey === `${product.id}-${currentVariant.name}`);

                        return (
                            <div
                                key={product.id}
                                className="group bg-[#0c120c] rounded-2xl sm:rounded-3xl border border-amber-500/20 shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:border-amber-400/60 hover:-translate-y-1"
                            >
                                {/* Dish Image */}
                                <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-zinc-900">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                                    {/* Top Badges */}
                                    <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                                        {product.isVeg ? (
                                            <span className="bg-emerald-600/95 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1 shadow-md border border-emerald-400/30">
                                                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                                Veg
                                            </span>
                                        ) : (
                                            <span className="bg-red-700/90 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 sm:py-1 rounded-full shadow-md border border-red-500/30">
                                                Non-Veg
                                            </span>
                                        )}
                                        {product.isChefSpecial && (
                                            <span className="bg-amber-500/90 backdrop-blur-md text-black text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 sm:py-1 rounded-full shadow-md">
                                                ★ Chef Special
                                            </span>
                                        )}
                                    </div>

                                    {/* Rating badge */}
                                    <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] font-black text-amber-400 shadow-lg border border-amber-500/30">
                                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                                        {product.rating}
                                    </div>

                                    {/* Price tag on image */}
                                    <div className="absolute bottom-2.5 right-2.5 bg-black/90 backdrop-blur-md px-3 py-1 rounded-full shadow-lg border border-amber-500/40">
                                        <span className="text-sm sm:text-base font-black text-gold-metallic">
                                            ₹{currentVariant.price}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug mb-1">
                                            {product.name}
                                        </h3>
                                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                                            {product.description}
                                        </p>
                                    </div>

                                    <div>
                                        {/* Portion/Variant Selector */}
                                        {product.variants.length > 1 && (
                                            <div className="mb-3">
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-500/80 mb-1">
                                                    Select Portion
                                                </div>
                                                <div className="flex gap-1.5 bg-zinc-900/90 border border-amber-500/20 p-1 rounded-xl">
                                                    {product.variants.map(variant => {
                                                        const isSelected = currentVariant.name === variant.name;
                                                        return (
                                                            <button
                                                                key={variant.name}
                                                                type="button"
                                                                onClick={() => handleSelectVariant(product.id, variant)}
                                                                className={cn(
                                                                    "flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95 min-h-[36px]",
                                                                    isSelected
                                                                        ? "bg-amber-500 text-black font-black shadow-md"
                                                                        : "text-zinc-400 hover:text-white"
                                                                )}
                                                            >
                                                                <span>{variant.name}</span>
                                                                <span className="text-[10px] opacity-80 font-bold">₹{variant.price}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Add to Cart or Quantity Selector */}
                                        {cartItem ? (
                                            <div className="flex items-center justify-between bg-amber-500/15 border border-amber-500/40 rounded-2xl p-1.5">
                                                <button
                                                    onClick={() => updateQuantity(cartItem.cartKey, -1)}
                                                    className="h-9 w-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center border border-amber-500/30 active:scale-95"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="h-4 w-4 text-amber-400" />
                                                </button>
                                                <span className="font-black text-sm text-amber-400">
                                                    {cartItem.quantity} in cart
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(cartItem.cartKey, 1)}
                                                    className="h-9 w-9 rounded-xl bg-amber-500 text-black flex items-center justify-center shadow-md active:scale-95 font-bold"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => addToCart(product)}
                                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-black py-3 rounded-2xl shadow-lg shadow-amber-500/15 transition-all active:scale-[0.98] text-sm min-h-[44px]"
                                            >
                                                <Plus className="h-4 w-4 text-black" />
                                                Add to Cart
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile-first Floating Sticky Cart Bar */}
            {totalCartCount > 0 && (
                <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black p-4 rounded-2xl shadow-2xl shadow-amber-500/30 flex items-center justify-between transition-transform active:scale-[0.98] border border-amber-300"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative bg-black/20 p-2 rounded-xl">
                                <ShoppingCart className="h-5 w-5 text-black" />
                                <span className="absolute -top-1.5 -right-1.5 bg-black text-amber-400 text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
                                    {totalCartCount}
                                </span>
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-black text-black/80 uppercase tracking-wider">{totalCartCount} Items</p>
                                <p className="text-base font-black text-black">₹{totalOrderAmount}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 font-black text-sm bg-black/20 px-3.5 py-1.5 rounded-xl text-black">
                            <span>View Cart</span>
                            <ChevronRight className="h-4 w-4" />
                        </div>
                    </button>
                </div>
            )}

            {/* Mobile Bottom Sheet / Drawer */}
            {isCartOpen && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsCartOpen(false)}
                    />
                    <div className="fixed bottom-0 sm:top-0 right-0 z-50 h-[90vh] sm:h-full w-full max-w-md bg-[#0a0e0a] border-t sm:border-t-0 sm:border-l border-amber-500/30 rounded-t-[32px] sm:rounded-none shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-right duration-300 flex flex-col">
                        {/* Pull bar for mobile */}
                        <div className="w-12 h-1 bg-amber-500/40 rounded-full mx-auto mt-3 sm:hidden" />

                        {/* Drawer Header */}
                        <div className="p-4 sm:p-5 border-b border-amber-500/20 flex items-center justify-between">
                            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2.5">
                                <ShoppingCart className="h-5 w-5 text-amber-400" />
                                Your Order ({totalCartCount})
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-zinc-900 rounded-full transition-all text-zinc-400 hover:text-white"
                                aria-label="Close cart"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Cart Items List */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                                    <Utensils className="h-16 w-16 mb-4 opacity-20 text-amber-400" />
                                    <p className="font-bold text-zinc-300">Your cart is empty</p>
                                    <p className="text-xs text-zinc-500 mt-1">Add your favorite momos, chowmein or rolls!</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-3">
                                        {cart.map(item => (
                                            <div
                                                key={item.cartKey}
                                                className="flex gap-3 p-3 rounded-2xl bg-[#0e140e] border border-amber-500/20 shadow-sm"
                                            >
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    className="h-16 w-16 rounded-xl object-cover shadow-sm shrink-0 border border-amber-500/20"
                                                />
                                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-bold text-sm text-white leading-tight truncate">
                                                                {item.product.name}
                                                            </h4>
                                                            <span className="text-[11px] font-semibold text-amber-400">
                                                                {item.variant.name} • ₹{item.variant.price}
                                                            </span>
                                                        </div>
                                                        <span className="font-black text-sm text-gold-metallic">
                                                            ₹{item.variant.price * item.quantity}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Qty</span>
                                                        <div className="flex items-center gap-2 bg-zinc-900 border border-amber-500/30 rounded-lg p-1">
                                                            <button
                                                                onClick={() => updateQuantity(item.cartKey, -1)}
                                                                className="h-7 w-7 rounded bg-zinc-800 hover:bg-amber-500 hover:text-black transition-colors flex items-center justify-center text-zinc-300 active:scale-95"
                                                            >
                                                                <Minus className="h-3 w-3" />
                                                            </button>
                                                            <span className="font-bold text-xs w-4 text-center text-white">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.cartKey, 1)}
                                                                className="h-7 w-7 rounded bg-amber-500 text-black flex items-center justify-center shadow-sm active:scale-95 font-bold"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Free Direct Delivery Location & Address Input (No Google API needed) */}
                                    <div className="p-4 rounded-2xl bg-[#0c120c] border border-amber-500/30 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                                                Delivery Address & Location
                                            </label>
                                            {gpsAcquired && (
                                                <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1">
                                                    <CheckCircle2 className="h-3 w-3" /> GPS Locked
                                                </span>
                                            )}
                                        </div>

                                        <input
                                            type="text"
                                            value={deliveryAddress}
                                            onChange={(e) => setDeliveryAddress(e.target.value)}
                                            placeholder="House / Flat / Street / Landmark (Tinsukia)"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#070a07] border border-amber-500/20 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        />

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={handleFetchLocation}
                                                disabled={isLocating}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] sm:text-xs transition-all active:scale-95"
                                            >
                                                {isLocating ? (
                                                    <>
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                        Locating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Navigation className="h-3.5 w-3.5 text-emerald-400" />
                                                        {gpsAcquired ? "Refresh GPS" : "Pin Live GPS"}
                                                    </>
                                                )}
                                            </button>
                                            
                                            <button
                                                type="button"
                                                onClick={() => setShowMap(true)}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 text-amber-400 font-bold text-[10px] sm:text-xs transition-all active:scale-95"
                                            >
                                                <Map className="h-3.5 w-3.5" />
                                                Select on Map
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Bill Breakdown & Sticky Checkout Footer */}
                        {cart.length > 0 && (
                            <div className="p-4 sm:p-5 border-t border-amber-500/20 bg-[#080c08]">
                                <div className="space-y-2 mb-4 text-xs text-zinc-300">
                                    <div className="flex justify-between">
                                        <span>Item Subtotal</span>
                                        <span className="font-semibold text-white">₹{itemsSubtotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery Partner Fee (Tinsukia)</span>
                                        <span className={cn("font-semibold", DELIVERY_FEE === 0 ? "text-emerald-400" : "text-white")}>
                                            {DELIVERY_FEE === 0 ? "FREE" : `₹${DELIVERY_FEE}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-zinc-400">
                                        <span>Platform & Service Fee (Applied at Checkout)</span>
                                        <span className="font-semibold text-white">₹{TAX_AND_SERVICE_FEE}</span>
                                    </div>
                                    <div className="flex justify-between text-base font-black text-white pt-2.5 border-t border-amber-500/20">
                                        <span>To Pay</span>
                                        <span className="text-gold-metallic text-lg">₹{totalOrderAmount}</span>
                                    </div>
                                </div>

                                {checkoutError && (
                                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
                                        {checkoutError}
                                    </div>
                                )}

                                <button
                                    className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-black py-4 rounded-2xl shadow-xl shadow-amber-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-sm min-h-[48px]"
                                    disabled={isSubmitting}
                                    onClick={handleCheckout}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Redirecting to WhatsApp...
                                        </>
                                    ) : (
                                        `Place Order via WhatsApp • ₹${totalOrderAmount}`
                                    )}
                                </button>

                                <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] text-emerald-400">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    <span>Fast & Direct WhatsApp Ordering</span>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
            {/* Map Modal */}
            {showMap && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-[#070a07] rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl animate-in zoom-in-95 duration-200">
                        <LocationPicker 
                            onConfirm={(loc) => {
                                setCustomerCoords({ lat: loc.lat, lng: loc.lng });
                                setDeliveryAddress(loc.address);
                                setGpsAcquired(true);
                                setShowMap(false);
                            }} 
                            onCancel={() => setShowMap(false)} 
                        />
                    </div>
                </div>
            )}
        </main>
    );
}
