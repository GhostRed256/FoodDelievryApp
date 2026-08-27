import Header from "@/components/Header";
import Link from "next/link";
import { Utensils, MapPin, Sparkles, ArrowRight, ShieldCheck, Leaf, IndianRupee, Flame, Star, Award } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#070a07] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black relative">
      {/* Animated Luxury Topographical Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23fbbf24\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '30px 30px',
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#070a07]/80 to-[#070a07] pointer-events-none" />

      <Header />

      {/* Hero Section with Luxury Gold & Emerald Aura */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden py-14 sm:py-24 px-4 md:px-6 z-10">
        {/* Ambient Radial Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[400px] bg-gradient-to-b from-amber-500/15 via-emerald-500/10 to-transparent blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-emerald-900/10 blur-[90px] -z-10 pointer-events-none animate-pulse" />

        <div className="container mx-auto max-w-4xl text-center">
          {/* Logo Crest Showcase */}
          <div className="inline-flex flex-col items-center justify-center mb-6 animate-in fade-in zoom-in duration-700">
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full p-1 bg-gradient-to-tr from-amber-500/60 via-emerald-500/40 to-amber-300/80 shadow-2xl shadow-amber-500/20 mb-3">
              <div className="h-full w-full rounded-full overflow-hidden bg-black">
                <img
                  src="/logo.jpg"
                  alt="FoodNJoy Luxury Brand Crest"
                  className="h-full w-full object-cover scale-105"
                />
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-amber-400 shadow-sm">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              Taste • Hygiene • Value
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-4 sm:mb-6 leading-tight">
            Authentic Delicacies. <br />
            <span className="text-gold-metallic">
              Steaming Hot & Delivered.
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-sm sm:text-lg text-zinc-400 mb-8 sm:mb-10 leading-relaxed px-2">
            Experience Tinsukia's favorite momos, authentic Kolkata kathi rolls, triple-layered Schezwan rice & Indo-Chinese noodles, crafted fresh with unmatched hygiene.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto sm:max-w-none">
            <Link
              href="/menu"
              className="w-full sm:w-auto inline-flex h-12 sm:h-14 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 px-8 text-sm sm:text-base font-black text-black shadow-xl shadow-amber-500/25 transition-all active:scale-[0.98] group"
            >
              <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
              <span>Explore Online Menu</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/track"
              className="w-full sm:w-auto inline-flex h-12 sm:h-14 items-center justify-center gap-2.5 rounded-2xl border border-amber-500/30 bg-zinc-950/80 hover:bg-zinc-900 px-8 text-sm sm:text-base font-bold text-zinc-200 shadow-md transition-all active:scale-[0.98]"
            >
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
              <span>Live Order Tracker</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Core Quality Pillars from Menu */}
      <section className="py-10 px-4 md:px-6 container mx-auto max-w-5xl">
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-3">
          {/* Pillar 1: Hygienic Kitchen */}
          <div className="p-5 rounded-3xl bg-[#0c120c] border border-emerald-500/25 flex items-start gap-4 shadow-lg shadow-black/40 hover:border-emerald-500/50 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wide">
                Hygienic Kitchen
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Clean, safe, and strict food preparation standards for every meal.
              </p>
            </div>
          </div>

          {/* Pillar 2: Fresh Ingredients */}
          <div className="p-5 rounded-3xl bg-[#0c120c] border border-amber-500/25 flex items-start gap-4 shadow-lg shadow-black/40 hover:border-amber-500/50 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wide">
                Fresh Ingredients
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Farm-sourced fresh produce and tender chicken with signature spices.
              </p>
            </div>
          </div>

          {/* Pillar 3: Affordable Prices */}
          <div className="p-5 rounded-3xl bg-[#0c120c] border border-emerald-500/25 flex items-start gap-4 shadow-lg shadow-black/40 hover:border-emerald-500/50 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
              <IndianRupee className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wide">
                Affordable Prices
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Great taste, generous portion sizes, and maximum value every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Menu Signature Highlights */}
      <section className="py-8 sm:py-12 px-4 md:px-6 container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-amber-500/20">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              Specialties
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Signature Dishes
            </h2>
          </div>
          <Link
            href="/menu"
            className="text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>Full Menu</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-5">
          {/* Card 1 */}
          <Link
            href="/menu"
            className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0c120c] border border-amber-500/20 p-3 sm:p-4 shadow-md hover:border-amber-400/60 transition-all hover:-translate-y-1"
          >
            <div className="h-28 sm:h-36 rounded-xl sm:rounded-2xl overflow-hidden mb-3 bg-zinc-900 relative">
              <img
                src="/dishes/chicken_momos.jpg"
                alt="Chicken Momos"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-400 flex items-center gap-0.5 border border-amber-500/20">
                <Star className="h-2.5 w-2.5 fill-amber-400" /> 4.9
              </div>
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-400 transition-colors truncate">
              Steamed Momos
            </h3>
            <p className="text-xs font-black text-amber-400 mt-0.5">From ₹59</p>
          </Link>

          {/* Card 2 */}
          <Link
            href="/menu"
            className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0c120c] border border-amber-500/20 p-3 sm:p-4 shadow-md hover:border-amber-400/60 transition-all hover:-translate-y-1"
          >
            <div className="h-28 sm:h-36 rounded-xl sm:rounded-2xl overflow-hidden mb-3 bg-zinc-900 relative">
              <img
                src="/dishes/chicken_kathi_roll.jpg"
                alt="Kolkata Kathi Rolls"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-400 flex items-center gap-0.5 border border-amber-500/20">
                <Star className="h-2.5 w-2.5 fill-amber-400" /> 4.9
              </div>
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-400 transition-colors truncate">
              Kolkata Kathi Roll
            </h3>
            <p className="text-xs font-black text-amber-400 mt-0.5">From ₹89</p>
          </Link>

          {/* Card 3 */}
          <Link
            href="/menu"
            className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0c120c] border border-amber-500/20 p-3 sm:p-4 shadow-md hover:border-amber-400/60 transition-all hover:-translate-y-1"
          >
            <div className="h-28 sm:h-36 rounded-xl sm:rounded-2xl overflow-hidden mb-3 bg-zinc-900 relative">
              <img
                src="/dishes/schezwan_triple_rice.jpg"
                alt="Triple Schezwan Rice"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-400 flex items-center gap-0.5 border border-amber-500/20">
                <Star className="h-2.5 w-2.5 fill-amber-400" /> 4.9
              </div>
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-400 transition-colors truncate">
              Triple Schezwan Rice
            </h3>
            <p className="text-xs font-black text-amber-400 mt-0.5">From ₹79</p>
          </Link>

          {/* Card 4 */}
          <Link
            href="/menu"
            className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0c120c] border border-amber-500/20 p-3 sm:p-4 shadow-md hover:border-amber-400/60 transition-all hover:-translate-y-1"
          >
            <div className="h-28 sm:h-36 rounded-xl sm:rounded-2xl overflow-hidden mb-3 bg-zinc-900 relative">
              <img
                src="/dishes/chilly_chicken.jpg"
                alt="Chilli Chicken"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-400 flex items-center gap-0.5 border border-amber-500/20">
                <Star className="h-2.5 w-2.5 fill-amber-400" /> 4.8
              </div>
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-400 transition-colors truncate">
              Chilli Chicken
            </h3>
            <p className="text-xs font-black text-amber-400 mt-0.5">From ₹89</p>
          </Link>
        </div>
      </section>

      {/* Tagline Footer Banner */}
      <footer className="mt-auto py-12 px-4 border-t border-amber-500/20 bg-[#050805] text-center">
        <div className="container mx-auto max-w-4xl flex flex-col items-center">
          <div className="h-10 w-10 rounded-full overflow-hidden border border-amber-500/40 mb-3">
            <img src="/logo.jpg" alt="Logo" className="h-full w-full object-cover" />
          </div>
          <p className="text-xl sm:text-2xl font-serif italic text-gold-gradient font-bold tracking-wide mb-2">
            "Good Food. Great Joy."
          </p>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
            FoodNJoy Tinsukia • All Rights Reserved © 2026
          </p>
        </div>
      </footer>
    </main>
  );
}
