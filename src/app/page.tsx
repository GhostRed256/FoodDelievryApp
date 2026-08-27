import Header from "@/components/Header";
import Link from "next/link";
import { Utensils, MapPin, Sparkles, ArrowRight, ShieldCheck, Leaf, Heart, Flame, Star, Award } from "lucide-react";
import * as motion from "framer-motion/client";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#070a07] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black relative pb-10 overflow-x-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-[#070a07]/80 to-[#070a07] pointer-events-none" />
      <div 
        className="absolute top-0 left-0 right-0 h-[500px] z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 0%, #fbbf24 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />

      <Header />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center pt-16 pb-12 px-5 z-10 min-h-[65vh]">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-200 shadow-[0_0_40px_rgba(251,191,36,0.3)] mb-6"
        >
          <div className="h-full w-full rounded-full overflow-hidden bg-black border-4 border-[#070a07]">
            <img
              src="/logo.jpg"
              alt="FoodNJoy Crest"
              className="h-full w-full object-cover scale-105"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-amber-400 shadow-sm mb-6">
            <Sparkles className="h-3 w-3" />
            Tinsukia's Premium Kitchen
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]">
            Authentic Taste.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
              Delivered Hot.
            </span>
          </h1>

          <p className="mx-auto max-w-lg text-base sm:text-lg text-zinc-300 mb-10 leading-relaxed font-medium">
            Experience the finest momos, Kolkata kathi rolls, and Indo-Chinese delicacies. Crafted fresh with unmatched hygiene.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto"
        >
          <Link
            href="/menu"
            className="w-full inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-black text-lg shadow-xl shadow-amber-500/20 transition-all active:scale-[0.98]"
          >
            <Utensils className="h-5 w-5" />
            Order Now
            <ArrowRight className="h-5 w-5 ml-1" />
          </Link>
          
          <Link
            href="/track"
            className="w-full inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-amber-500/30 text-white font-bold transition-all active:scale-[0.98]"
          >
            <MapPin className="h-5 w-5 text-amber-400" />
            Live Tracker
          </Link>
        </motion.div>
      </section>

      {/* Quality Pillars */}
      <section className="relative z-10 px-5 max-w-5xl mx-auto w-full pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid gap-4 sm:gap-6 sm:grid-cols-3"
        >
          <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-black text-white mb-2">100% Hygienic</h3>
            <p className="text-sm text-zinc-400">Strict safety and hygiene standards for every single meal we prepare.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm">
            <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <Leaf className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-black text-white mb-2">Fresh Ingredients</h3>
            <p className="text-sm text-zinc-400">Farm-sourced produce and tender chicken with our signature spices.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
              <Heart className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-black text-white mb-2">Made with Love</h3>
            <p className="text-sm text-zinc-400">Authentic recipes passed down and perfected for your enjoyment.</p>
          </div>
        </motion.div>
      </section>

      {/* Signature Items Teaser */}
      <section className="py-12 md:py-20 px-4 md:px-6 relative overflow-hidden mt-12 bg-black/50 border-t border-amber-500/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm tracking-widest uppercase mb-2">
                <Flame className="h-4 w-4" />
                Specialties
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                Signature Dishes
              </h2>
            </div>
            <Link 
              href="/menu"
              className="hidden sm:flex items-center gap-2 text-amber-500 font-bold hover:text-amber-400 transition-colors"
            >
              Full Menu <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Scrollable Gallery */}
          <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { name: "Chicken Steamed Momo", image: "/chicken_steamed_momo_1786735232675.jpg" },
              { name: "Chicken Kathi Roll", image: "/chicken_kathi_roll_1786735165181.jpg" },
              { name: "Schezwan Veg Rice", image: "/schezwan_veg_rice_1786736024030.jpg" }
            ].map((item, i) => (
              <div key={i} className="snap-center shrink-0 w-[260px] sm:w-[320px] group cursor-pointer relative overflow-hidden rounded-3xl border border-amber-500/20 bg-zinc-900">
                <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-white">4.9</span>
                </div>
                <div className="aspect-[4/5] sm:aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-12">
                  <h3 className="text-lg sm:text-xl font-black text-white">{item.name}</h3>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center sm:hidden">
            <Link 
              href="/menu"
              className="inline-flex items-center gap-2 text-amber-500 font-bold hover:text-amber-400 transition-colors"
            >
              Explore Full Menu <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-t border-amber-500/10 bg-[#070a07]">
        <div className="container mx-auto max-w-4xl px-4 flex flex-wrap justify-center gap-8 sm:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-emerald-500" />
            <div className="text-sm font-bold text-zinc-300">FSSAI<br/>Registered</div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-amber-500" />
            <div className="text-sm font-bold text-zinc-300">Premium<br/>Quality</div>
          </div>
          <div className="flex items-center gap-3">
            <Leaf className="h-8 w-8 text-green-500" />
            <div className="text-sm font-bold text-zinc-300">100% Fresh<br/>Sourced</div>
          </div>
        </div>
      </section>

    </main>
  );
}
