"use client";

import { ShoppingCart, Search, Utensils, Star, Plus, Minus, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { orderService } from "@/lib/orderService";
import { useRouter } from "next/navigation";

const CATEGORIES = ["All", "Appetizers", "Main Course", "Sushi", "Ramen", "Desserts", "Drinks"];

const PRODUCTS = [
    { id: 1, name: "Spicy Miso Ramen", category: "Ramen", price: 14.50, rating: 4.8, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&auto=format&fit=crop", description: "Rich pork broth, spicy miso paste, bamboo shoots, and soft-boiled egg." },
    { id: 2, name: "California Roll", category: "Sushi", price: 12.00, rating: 4.9, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop", description: "Fresh crab, avocado, and cucumber rolled with sesame seeds." },
    { id: 3, name: "Wagyu Beef Slider", category: "Appetizers", price: 18.00, rating: 4.7, image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop", description: "Two premium wagyu sliders with caramelized onions and truffle mayo." },
    { id: 4, name: "Salmon Teriyaki", category: "Main Course", price: 22.00, rating: 4.6, image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop", description: "Grilled salmon glazed with house-made teriyaki sauce, served with rice." },
    { id: 5, name: "Matcha Lava Cake", category: "Desserts", price: 9.50, rating: 4.9, image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=800&auto=format&fit=crop", description: "Warm matcha cake with a molten center, served with vanilla bean ice cream." },
    { id: 6, name: "Iced Hibiscus Tea", category: "Drinks", price: 4.50, rating: 4.5, image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?q=80&w=800&auto=format&fit=crop", description: "Refreshing cold-brewed hibiscus tea with honey and mint." },
];

export default function MenuPage() {
    const { profile, user } = useAuth();
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState<{ product: any, quantity: number }[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredProducts = PRODUCTS.filter(p =>
        (activeCategory === "All" || p.category === activeCategory) &&
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const addToCart = (product: any) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === id) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

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
                    id: item.product.id.toString(),
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity
                })),
                total: cartTotal,
                status: "pending",
                customerLocation: {
                    lat: 0, // Placeholder
                    lng: 0, // Placeholder
                    address: "Local Delivery Address"
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
        <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-zinc-950 font-sans">
            <Header />

            <div className="container mx-auto py-12 px-4 md:px-6 flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Our Selection</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Gourmet flavors delivered from StayNJoy</p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search dishes..."
                            className="w-full pl-12 pr-4 py-4 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm text-slate-900 dark:text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border capitalize",
                                activeCategory === cat
                                    ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30"
                                    : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-zinc-800 hover:border-orange-500/50"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="group bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden transition-all hover:shadow-xl hover:-translate-y-2">
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white shadow-lg">
                                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                    {product.rating}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{product.name}</h3>
                                    <span className="text-xl font-black text-orange-600">${product.price.toFixed(2)}</span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6">
                                    {product.description}
                                </p>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-orange-500 hover:text-white transition-all active:scale-95 group-hover:bg-orange-500 group-hover:text-white"
                                >
                                    <Plus className="h-5 w-5" />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Persistent Cart Drawer Button */}
            {cart.length > 0 && (
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="fixed bottom-8 right-8 z-50 bg-orange-600 text-white p-5 rounded-full shadow-2xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
                >
                    <div className="relative">
                        <ShoppingCart className="h-6 w-6" />
                        <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-orange-600">
                            {cart.reduce((a, b) => a + b.quantity, 0)}
                        </span>
                    </div>
                    <span className="font-black pr-2 border-l border-white/20 pl-3">
                        ${cartTotal.toFixed(2)}
                    </span>
                </button>
            )}

            {/* Cart Drawer */}
            {isCartOpen && (
                <>
                    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsCartOpen(false)}></div>
                    <div className="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-white dark:bg-zinc-950 shadow-2xl animate-in slide-in-from-right duration-300">
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                    <ShoppingCart className="h-6 w-6 text-orange-500" />
                                    Your Cart
                                </h2>
                                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-full transition-all">
                                    <X className="h-6 w-6 text-slate-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {cart.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                        <Utensils className="h-16 w-16 mb-4 opacity-20" />
                                        <p className="font-bold">Your cart is empty</p>
                                        <p className="text-sm">Add some delicious dishes to get started!</p>
                                    </div>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.product.id} className="flex gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 animate-in fade-in slide-in-from-right-4">
                                            <img src={item.product.image} className="h-20 w-20 rounded-2xl object-cover shadow-md" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.product.name}</h4>
                                                    <span className="font-bold text-orange-600">${(item.product.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mb-3">{item.product.category}</p>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, -1)}
                                                        className="h-8 w-8 rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 flex items-center justify-center hover:bg-orange-50 transition-all"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, 1)}
                                                        className="h-8 w-8 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-8 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>Subtotal</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>Delivery Fee</span>
                                        <span className="text-green-500 font-bold">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-2xl font-black text-slate-900 dark:text-white pt-4 border-t border-slate-200 dark:border-zinc-800">
                                        <span>Total</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                                <button
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    disabled={cart.length === 0 || isSubmitting}
                                    onClick={handleCheckout}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Checkout Now"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}
