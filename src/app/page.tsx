import Header from "@/components/Header";
import Link from "next/link";
import { Utensils, MapPin, ChefHat, Truck, Sparkles, ArrowRight, ShieldCheck, Flame } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-zinc-950 font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden py-16 sm:py-24 px-4 md:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100/70 via-slate-50 to-slate-50 dark:from-orange-950/30 dark:via-zinc-950 dark:to-zinc-950 -z-10" />

        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1.5 text-xs sm:text-sm font-extrabold text-orange-600 dark:text-orange-400 mb-6 sm:mb-8 shadow-sm">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            Fast Delivery across Tinsukia
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 sm:mb-6 leading-tight">
            Authentic Street Food, <br className="hidden xs:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              Delivered Hot & Fresh.
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-sm sm:text-lg text-slate-600 dark:text-slate-300 mb-8 sm:mb-10 leading-relaxed px-2">
            Enjoy steaming hot Momos, Kolkata Kathi Rolls, Schezwan Fried Rice & Hakka Noodles delivered straight from FoodNJoy kitchen to your doorstep in Tinsukia.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto sm:max-w-none">
            <Link
              href="/menu"
              className="w-full sm:w-auto inline-flex h-12 sm:h-14 items-center justify-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-600 px-8 text-sm sm:text-base font-extrabold text-white shadow-lg shadow-orange-500/25 transition-all active:scale-[0.98]"
            >
              <Utensils className="h-4 w-4 sm:h-5 sm:w-5" />
              Explore Full Menu
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/track"
              className="w-full sm:w-auto inline-flex h-12 sm:h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-8 text-sm sm:text-base font-extrabold text-slate-900 dark:text-white shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-zinc-800 active:scale-[0.98]"
            >
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
              Live Order Tracker
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Quick Grid for Mobile */}
      <section className="py-8 px-4 md:px-6 container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Popular in Tinsukia
          </h2>
          <Link href="/menu" className="text-xs font-bold text-orange-600 hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/menu"
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 p-3.5 sm:p-4 shadow-sm hover:border-orange-500/40 transition-all"
          >
            <div className="h-28 sm:h-32 rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-zinc-800">
              <img
                src="/dishes/chicken_momos.jpg"
                alt="Chicken Momos"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Hot Momos</h3>
            <p className="text-[11px] text-orange-600 font-extrabold mt-0.5">From ₹59</p>
          </Link>

          <Link
            href="/menu"
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 p-3.5 sm:p-4 shadow-sm hover:border-orange-500/40 transition-all"
          >
            <div className="h-28 sm:h-32 rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-zinc-800">
              <img
                src="/dishes/chicken_kathi_roll.jpg"
                alt="Kolkata Kathi Rolls"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Kathi Rolls</h3>
            <p className="text-[11px] text-orange-600 font-extrabold mt-0.5">From ₹69</p>
          </Link>

          <Link
            href="/menu"
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 p-3.5 sm:p-4 shadow-sm hover:border-orange-500/40 transition-all"
          >
            <div className="h-28 sm:h-32 rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-zinc-800">
              <img
                src="/dishes/schezwan_triple_rice.jpg"
                alt="Triple Schezwan Rice"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Triple Schezwan</h3>
            <p className="text-[11px] text-orange-600 font-extrabold mt-0.5">From ₹59</p>
          </Link>

          <Link
            href="/menu"
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 p-3.5 sm:p-4 shadow-sm hover:border-orange-500/40 transition-all"
          >
            <div className="h-28 sm:h-32 rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-zinc-800">
              <img
                src="/dishes/chilly_chicken.jpg"
                alt="Chilli Chicken"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Chinese Starters</h3>
            <p className="text-[11px] text-orange-600 font-extrabold mt-0.5">From ₹79</p>
          </Link>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="bg-white dark:bg-zinc-900/50 py-12 sm:py-16 px-4 md:px-6 border-t border-slate-200/80 dark:border-zinc-800/80">
        <div className="container mx-auto max-w-5xl">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-3">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80">
              <div className="h-11 w-11 rounded-xl bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center shrink-0 text-orange-600">
                <ChefHat className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Fresh & Hygienic</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Prepared fresh upon every order with high culinary hygiene.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80">
              <div className="h-11 w-11 rounded-xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center shrink-0 text-blue-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Live Tracking</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Watch your delivery rider on live interactive GPS map.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80">
              <div className="h-11 w-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center shrink-0 text-emerald-600">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Swift Delivery</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Dedicated delivery riders ensuring your food arrives piping hot.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
