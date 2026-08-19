"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { ShoppingCart, Search, Utensils, Star, Plus, Minus, X, Loader2, Sparkles, ShieldCheck, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { orderService } from "@/lib/orderService";
import { useRouter } from "next/navigation";

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
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fee parameters
    const DELIVERY_FEE = 25;
    const TAX_AND_SERVICE_FEE = 10;

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

    const totalCartCount = cart.reduce((a, b) => a + b.quantity, 0);
    const itemsSubtotal = cart.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);
    const totalOrderAmount = cart.length > 0 ? itemsSubtotal + DELIVERY_FEE + TAX_AND_SERVICE_FEE : 0;

    const handleCheckout = async () => {
        if (!user || !profile) {
            router.push("/login");
            return;
        }

        setIsSubmitting(true);
        try {
            await orderService.createOrder({
                customerId: user.uid,
                customerName: profile.displayName || "Valued Customer",
                items: cart.map(item => ({
                    id: item.cartKey,
                    name: `${item.product.name} (${item.variant.name})`,
                    price: item.variant.price,
                    quantity: item.quantity
                })),
                total: totalOrderAmount,
                status: "pending",
                customerLocation: {
                    lat: 27.4924,
                    lng: 95.3626,
                    address: "Tinsukia Local Delivery Address"
                }
            });
            setCart([]);
            setIsCartOpen(false);
            router.push("/track");
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Checkout failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-zinc-950 font-sans pb-24 md:pb-12">
            <Header />

            <div className="container mx-auto py-6 sm:py-10 px-3 sm:px-4 md:px-6 flex-1">
                {/* Mobile Header Hero */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                            <Sparkles className="h-3 w-3" />
                            Tinsukia Fresh Fast Food
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Food<span className="text-orange-500">NJoy</span> Menu
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-xs sm:text-sm">
                            Freshly prepared momos, rolls, noodles & Chinese delicacies.
                        </p>
                    </div>

                    {/* Mobile-optimized Search Bar */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search dishes or categories..."
                            className="w-full pl-10 pr-9 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm text-sm text-slate-900 dark:text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Horizontal Scrolling Category Pills */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar touch-pan-x">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap border shadow-sm active:scale-95",
                                activeCategory === cat
                                    ? "bg-orange-500 text-white border-orange-500 shadow-orange-500/25"
                                    : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-zinc-800 hover:border-orange-500/40"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid - Mobile Optimized (Responsive single column or 2 columns on tablet/desktop) */}
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map(product => {
                        const currentVariant = selectedVariants[product.id] || product.variants[0];
                        const cartItem = cart.find(c => c.cartKey === `${product.id}-${currentVariant.name}`);

                        return (
                            <div
                                key={product.id}
                                className="group bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:border-orange-500/30"
                            >
                                {/* Dish Image Container */}
                                <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                                    {/* Top Badges */}
                                    <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                                        {product.isVeg ? (
                                            <span className="bg-emerald-600/95 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1 shadow-md">
                                                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                                Veg
                                            </span>
                                        ) : (
                                            <span className="bg-amber-600/95 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full shadow-md">
                                                Non-Veg
                                            </span>
                                        )}
                                        {product.isChefSpecial && (
                                            <span className="bg-orange-500/95 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full shadow-md">
                                                ★ Special
                                            </span>
                                        )}
                                    </div>

                                    {/* Rating badge */}
                                    <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 text-[11px] font-bold text-white shadow-lg border border-white/10">
                                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                                        {product.rating}
                                    </div>

                                    {/* Price tag on image */}
                                    <div className="absolute bottom-2.5 right-2.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 py-1 rounded-full shadow-lg border border-slate-100 dark:border-zinc-800">
                                        <span className="text-sm sm:text-base font-black text-orange-600 dark:text-orange-400">
                                            ₹{currentVariant.price}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors leading-snug mb-1">
                                            {product.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                                            {product.description}
                                        </p>
                                    </div>

                                    <div>
                                        {/* Portion/Variant Selector with large touch targets */}
                                        {product.variants.length > 1 && (
                                            <div className="mb-3">
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                                    Portion
                                                </div>
                                                <div className="flex gap-1.5 bg-slate-100 dark:bg-zinc-800/60 p-1 rounded-xl">
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
                                                                        ? "bg-white dark:bg-zinc-900 text-orange-600 dark:text-orange-400 shadow-sm"
                                                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                                                )}
                                                            >
                                                                <span>{variant.name}</span>
                                                                <span className="text-[10px] opacity-75 font-semibold">₹{variant.price}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Add to Cart or Quantity Selector */}
                                        {cartItem ? (
                                            <div className="flex items-center justify-between bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 rounded-2xl p-1.5">
                                                <button
                                                    onClick={() => updateQuantity(cartItem.cartKey, -1)}
                                                    className="h-9 w-9 rounded-xl bg-white dark:bg-zinc-800 text-slate-800 dark:text-white flex items-center justify-center shadow-sm active:scale-95"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="font-black text-sm text-orange-600 dark:text-orange-400">
                                                    {cartItem.quantity} in cart
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(cartItem.cartKey, 1)}
                                                    className="h-9 w-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-sm active:scale-95"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => addToCart(product)}
                                                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-orange-500 dark:bg-zinc-800 dark:hover:bg-orange-500 text-white font-bold py-3 rounded-2xl shadow-md transition-all active:scale-[0.98] text-sm min-h-[44px]"
                                            >
                                                <Plus className="h-4 w-4" />
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
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between transition-transform active:scale-[0.98] border-2 border-white/20"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative bg-white/20 p-2 rounded-xl">
                                <ShoppingCart className="h-5 w-5" />
                                <span className="absolute -top-1.5 -right-1.5 bg-white text-orange-600 text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
                                    {totalCartCount}
                                </span>
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-orange-100 uppercase tracking-wider">{totalCartCount} Items</p>
                                <p className="text-base font-black">₹{totalOrderAmount}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 font-extrabold text-sm bg-white/20 px-3.5 py-1.5 rounded-xl">
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
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsCartOpen(false)}
                    />
                    <div className="fixed bottom-0 sm:top-0 right-0 z-50 h-[85vh] sm:h-full w-full max-w-md bg-white dark:bg-zinc-950 rounded-t-[32px] sm:rounded-none shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-right duration-300 flex flex-col">
                        {/* Mobile Pull Bar */}
                        <div className="w-12 h-1 bg-slate-300 dark:bg-zinc-700 rounded-full mx-auto mt-3 sm:hidden" />

                        {/* Drawer Header */}
                        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                                <ShoppingCart className="h-5 w-5 text-orange-500" />
                                Your Cart ({totalCartCount})
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-full transition-all text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                aria-label="Close cart"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Cart Items List */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <Utensils className="h-16 w-16 mb-4 opacity-20" />
                                    <p className="font-bold text-slate-600 dark:text-slate-300">Your cart is empty</p>
                                    <p className="text-xs text-slate-400 mt-1">Add your favorite momos, chowmein or rolls!</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div
                                        key={item.cartKey}
                                        className="flex gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800"
                                    >
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="h-16 w-16 rounded-xl object-cover shadow-sm shrink-0"
                                        />
                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight truncate">
                                                        {item.product.name}
                                                    </h4>
                                                    <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                                                        {item.variant.name} • ₹{item.variant.price}
                                                    </span>
                                                </div>
                                                <span className="font-black text-sm text-slate-900 dark:text-white">
                                                    ₹{item.variant.price * item.quantity}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Qty</span>
                                                <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.cartKey, -1)}
                                                        className="h-7 w-7 rounded bg-slate-100 dark:bg-zinc-700 hover:bg-orange-500 hover:text-white transition-colors flex items-center justify-center text-slate-600 dark:text-slate-300 active:scale-95"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="font-bold text-xs w-4 text-center text-slate-900 dark:text-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.cartKey, 1)}
                                                        className="h-7 w-7 rounded bg-orange-500 text-white flex items-center justify-center shadow-sm active:scale-95"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Bill Breakdown & Sticky Checkout Footer */}
                        {cart.length > 0 && (
                            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/90 dark:bg-zinc-900/90">
                                <div className="space-y-2 mb-4 text-xs text-slate-600 dark:text-slate-400">
                                    <div className="flex justify-between">
                                        <span>Item Subtotal</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">₹{itemsSubtotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery Partner Fee (Tinsukia)</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">₹{DELIVERY_FEE}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Govt Taxes & Packaging Fee</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">₹{TAX_AND_SERVICE_FEE}</span>
                                    </div>
                                    <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2.5 border-t border-slate-200 dark:border-zinc-800">
                                        <span>To Pay</span>
                                        <span className="text-orange-600 dark:text-orange-400">₹{totalOrderAmount}</span>
                                    </div>
                                </div>

                                <button
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/25 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-sm min-h-[48px]"
                                    disabled={isSubmitting}
                                    onClick={handleCheckout}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Placing Order...
                                        </>
                                    ) : (
                                        `Proceed to Pay • ₹${totalOrderAmount}`
                                    )}
                                </button>

                                <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                                    <span>Safe & Encrypted Checkout</span>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </main>
    );
}
