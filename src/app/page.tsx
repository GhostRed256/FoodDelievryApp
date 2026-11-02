import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import { Utensils, MapPin, Sparkles, ArrowRight, ShieldCheck, Leaf, Heart, Flame, Star, Award } from "lucide-react";
import * as motion from "framer-motion/client";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f7fbf8] dark:bg-[#040905] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-amber-500 selection:text-black relative pb-10 overflow-x-hidden transition-colors duration-300">
      
      {/* Background Image + Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/hero-bg.jpg"
          alt="Restaurant ambiance"
          fill
          priority
          className="object-cover opacity-20 dark:opacity-25"
          sizes="100vw"
          quality={60}
        />
        {/* Dark overlay gradients for text readability in Dark Mode */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040905] via-[#040905]/70 to-transparent dark:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040905]/80 via-transparent to-transparent h-40 dark:block hidden" />
        <div className="absolute inset-0 bg-black/40 dark:block hidden" />

        {/* Light overlay gradients for text readability in Light Mode */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f7fbf8] via-[#f7fbf8]/85 to-transparent dark:hidden block" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f7fbf8]/90 via-transparent to-transparent h-40 dark:hidden block" />
        <div className="absolute inset-0 bg-white/40 dark:hidden block" />
      </div>

      <Header />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center pt-16 pb-12 px-5 z-10 min-h-[65vh]">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-full p-1.5 bg-gradient-to-tr from-emerald-500 via-green-400 to-amber-400 shadow-[0_0_50px_rgba(34,197,94,0.35)] mb-6"
        >
          <div className="h-full w-full rounded-full overflow-hidden bg-black border-4 border-white dark:border-[#040905] shadow-lg">
            <img
              src="/logo.jpg"
              alt="FoodNJoy Frog Chef Crest"
              className="h-full w-full object-cover scale-105"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-3 flex items-center justify-center">
            Food<span className="text-gold-gradient font-black">N</span>Joy
          </h2>

          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-600/10 dark:bg-emerald-500/15 border border-emerald-600/25 dark:border-emerald-500/30 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-emerald-900 dark:text-emerald-400 shadow-sm mb-6">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            The Tinsukia Canteen • Good Food • Good Mood
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-zinc-900 dark:text-white mb-6 leading-[1.1]">
            Authentic Taste.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-amber-500 dark:from-emerald-300 dark:via-green-400 dark:to-amber-300">
              Delivered Hot & Fresh.
            </span>
          </h1>

          <p className="mx-auto max-w-lg text-base sm:text-lg text-zinc-600 dark:text-zinc-300 mb-10 leading-relaxed font-medium">
            Freshly prepared favourites, comforting classics and local specialities crafted with unmatched hygiene.
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
            className="w-full inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-lg shadow-xl shadow-amber-500/25 transition-all active:scale-[0.98]"
          >
            <Utensils className="h-5 w-5 text-black" />
            Order Now
            <ArrowRight className="h-5 w-5 ml-1 text-black" />
          </Link>
          
          <Link
            href="/track"
            className="w-full inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold transition-all shadow-sm active:scale-[0.98]"
          >
            <MapPin className="h-5 w-5 text-amber-500" />
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
          <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-white/90 dark:bg-zinc-900/50 border border-emerald-500/25 dark:border-zinc-800/50 backdrop-blur-sm shadow-md">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-2">100% Hygienic</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Strict safety and hygiene standards for every single meal we prepare.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-white/90 dark:bg-zinc-900/50 border border-emerald-500/25 dark:border-zinc-800/50 backdrop-blur-sm shadow-md">
            <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4">
              <Leaf className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-2">Fresh Ingredients</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Farm-sourced produce and tender chicken with our signature spices.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-white/90 dark:bg-zinc-900/50 border border-emerald-500/25 dark:border-zinc-800/50 backdrop-blur-sm shadow-md">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-4">
              <Heart className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-2">Made with Love</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Authentic recipes passed down and perfected for your enjoyment.</p>
          </div>
        </motion.div>
      </section>

      {/* Signature Items Teaser */}
      <section className="py-12 md:py-20 px-4 md:px-6 relative overflow-hidden mt-12 bg-emerald-950/10 dark:bg-black/50 border-t border-emerald-500/20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs sm:text-sm tracking-widest uppercase mb-2">
                <Flame className="h-4 w-4" />
                Specialties
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
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
              { name: "Chicken Biryani", image: "/dishes/chicken_biryani.jpg" },
              { name: "Chicken Butter Masala", image: "/dishes/chicken_butter_masala.jpg" },
              { name: "Chicken Steamed Momo", image: "/dishes/chicken_momos.jpg" },
              { name: "Pork Thali", image: "/dishes/pork_thali.jpg" },
              { name: "Paneer Butter Masala", image: "/dishes/paneer_butter_masala.jpg" },
              { name: "Duck Curry", image: "/dishes/duck_curry.jpg" },
              { name: "Chicken Roll", image: "/dishes/chicken_kathi_roll.jpg" },
              { name: "KitKat Shake", image: "/dishes/kitkat_shake.jpg" }
            ].map((item, i) => (
              <div key={i} className="snap-center shrink-0 w-[260px] sm:w-[320px] group cursor-pointer relative overflow-hidden rounded-3xl border border-emerald-500/30 dark:border-amber-500/20 bg-white dark:bg-zinc-900 shadow-md">
                <div className="absolute top-4 right-4 z-10 bg-black/75 backdrop-blur-md border border-amber-500/40 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg preserve-white">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-black text-amber-300">4.9</span>
                </div>
                <div className="aspect-[4/5] sm:aspect-square overflow-hidden relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    quality={40}
                    sizes="320px"
                    loading="lazy"
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-12 preserve-white">
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
      <section className="py-12 border-t border-emerald-500/20 bg-white/50 dark:bg-[#040905]">
        <div className="container mx-auto max-w-4xl px-4 flex flex-wrap justify-center gap-8 sm:gap-16 opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-emerald-500" />
            <div className="text-sm font-bold text-zinc-700 dark:text-zinc-300">FSSAI<br/>Registered</div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-amber-500" />
            <div className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Premium<br/>Quality</div>
          </div>
          <div className="flex items-center gap-3">
            <Leaf className="h-8 w-8 text-green-500" />
            <div className="text-sm font-bold text-zinc-700 dark:text-zinc-300">100% Fresh<br/>Sourced</div>
          </div>
        </div>
      </section>

    </main>
  );
}
