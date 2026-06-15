import Header from "@/components/Header";
import Link from "next/link";
import { Utensils, MapPin, ChefHat, Truck } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-zinc-950 font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden py-24 px-4 md:px-6 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100 via-slate-50 to-slate-50 dark:from-orange-900/20 dark:via-zinc-950 dark:to-zinc-950 -z-10" />

        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-600 dark:text-orange-400 mb-8">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Live tracking available in your area
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-slate-900 dark:text-white mb-6">
            Craving it? <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">We deliver it.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
            The premium food delivery experience straight from StayNJoy's kitchen to your doorstep. Hot, fresh, and meticulously tracked.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/menu" className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full bg-orange-500 px-8 text-base font-medium text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 hover:shadow-orange-500/40 hover:-translate-y-0.5">
              Order Now
            </Link>
            <Link href="/track" className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-slate-200 dark:border-white/10 bg-transparent px-8 text-base font-medium text-slate-900 dark:text-white transition-all hover:bg-slate-100 dark:hover:bg-white/5 hover:-translate-y-0.5">
              <MapPin className="h-4 w-4" />
              Track Delivery
            </Link>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="bg-white dark:bg-zinc-900/50 py-24 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 transition-transform hover:-translate-y-1">
              <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                <ChefHat className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Gourmet Chefs</h3>
              <p className="text-slate-600 dark:text-slate-400">Prepared by HotelLuxe's top culinary experts with premium ingredients.</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 transition-transform hover:-translate-y-1">
              <div className="h-14 w-14 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6 text-orange-600 dark:text-orange-400">
                <MapPin className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Live Map Tracking</h3>
              <p className="text-slate-600 dark:text-slate-400">Watch your driver in real-time on our interactive map dashboard.</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 transition-transform hover:-translate-y-1">
              <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                <Truck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Lightning Fast</h3>
              <p className="text-slate-600 dark:text-slate-400">Our dedicated delivery agents ensure your food arrives hot and fresh.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
