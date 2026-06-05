import cansOnRock from "@/assets/cans_on_rock.png";
import { ArrowRight, Heart, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-tr from-[#FFF7EA] via-[#FFF0F2] to-[#E9FAFC] py-12 sm:py-16 lg:py-24 text-gray-900 border-b border-gray-100">
      {/* Soft pastel glowing ambient blobs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 40, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 blur-[130px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -35, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-500/15 to-purple-600/10 blur-[130px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [15, -15, 15],
          y: [-25, 25, -25]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] left-[20%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-500/10 blur-[120px] pointer-events-none"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pb-28">
        {/* Left Column: Copy & Actions */}
        <div className="lg:col-span-5 flex flex-col justify-center animate-fade-up">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gray-200/70 bg-white/60 px-3.5 py-1.5 text-[11px] font-extrabold tracking-widest text-[#D4AF37] uppercase w-fit mb-6 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span>Pure Hydration & Energy</span>
          </div>

          <h1 className="text-display text-5xl leading-[0.95] text-gray-900 sm:text-6xl lg:text-7xl">
            HYDRATION
            <br />
            THAT MOVES
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-[#D4AF37] font-black">
              WITH YOU
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base text-gray-600 leading-relaxed font-medium">
            Real fruit flavors. Essential electrolytes. Honey base formulas designed in India to optimize stamina and speed recovery.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#bestsellers"
              className="group inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-7 py-4 text-xs font-bold tracking-widest text-white shadow-md hover:shadow-lg transition-all hover:bg-[#b8931d] hover:scale-102"
            >
              SHOP NOW
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/25 text-white transition-transform group-hover:translate-x-0.5">
                <Zap className="h-3.5 w-3.5 fill-current" />
              </span>
            </a>
            <a
              href="#bestsellers"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 backdrop-blur-sm px-7 py-4 text-xs font-bold tracking-widest text-gray-800 transition-all hover:bg-white hover:border-gray-300"
            >
              EXPLORE FLAVORS
            </a>
          </div>

          <div className="mt-10">
            <p className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">Trusted by 50,000+ athletes</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["#f97316", "#a855f7", "#0ea5e9", "#84cc16"].map((c, i) => (
                  <div key={i} className="h-9 w-9 rounded-full border-2 border-white" style={{ background: c }} />
                ))}
              </div>
              <span className="text-xs font-extrabold text-[#D4AF37] uppercase tracking-wider bg-white/60 border border-[#D4AF37]/20 px-2.5 py-1 rounded-full shadow-sm">+50K Active Users</span>
            </div>
          </div>
        </div>

        {/* Right Column: Image Presentation */}
        <div className="relative lg:col-span-7 flex items-center justify-center">
          <div className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37] px-3.5 py-1.5 text-[10px] font-extrabold tracking-wider text-white shadow-md uppercase">
            <Heart className="h-3.5 w-3.5 fill-current text-white animate-pulse" /> Made in India
          </div>

          {/* Floating Feature Badge 1: Raw Honey */}
          <div className="absolute -left-2 top-[10%] z-25 bg-white/95 backdrop-blur-md border border-[#F4B000]/25 rounded-2xl px-4 py-3.5 shadow-[0_12px_36px_rgba(244,176,0,0.14)] flex items-center gap-2.5 animate-float hover:scale-105 transition-transform cursor-pointer" style={{ animationDelay: "0.2s" }}>
            <span className="text-xl">🍯</span>
            <div>
              <span className="text-[9px] font-extrabold tracking-wider text-gray-400 block uppercase leading-none mb-1">Naturally Sweetened</span>
              <span className="text-xs font-black text-gray-800 block leading-none">Raw Honey Base</span>
            </div>
          </div>

          {/* Floating Feature Badge 2: Electrolytes */}
          <div className="absolute -right-2 top-[35%] z-25 bg-white/95 backdrop-blur-md border border-blue-200/40 rounded-2xl px-4 py-3.5 shadow-[0_12px_36px_rgba(59,130,246,0.12)] flex items-center gap-2.5 animate-float hover:scale-105 transition-transform cursor-pointer" style={{ animationDelay: "1.2s" }}>
            <span className="text-xl">⚡</span>
            <div>
              <span className="text-[9px] font-extrabold tracking-wider text-gray-400 block uppercase leading-none mb-1">Optimal Recovery</span>
              <span className="text-xs font-black text-gray-800 block leading-none">Electrolyte Boost</span>
            </div>
          </div>

          {/* Floating Feature Badge 3: Monk Fruit */}
          <div className="absolute left-[12%] bottom-[2%] z-25 bg-white/95 backdrop-blur-md border border-emerald-200/40 rounded-2xl px-4 py-3.5 shadow-[0_12px_36px_rgba(16,185,129,0.12)] flex items-center gap-2.5 animate-float hover:scale-105 transition-transform cursor-pointer" style={{ animationDelay: "2.2s" }}>
            <span className="text-xl">🍃</span>
            <div>
              <span className="text-[9px] font-extrabold tracking-wider text-gray-400 block uppercase leading-none mb-1">Zero Added Sugar</span>
              <span className="text-xs font-black text-gray-800 block leading-none">Monk Fruit Sweetened</span>
            </div>
          </div>

          <div className="w-full relative flex items-center justify-center p-2">
            {/* Ambient glows behind the rock setup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-pink-500/10 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-10 left-1/4 w-36 h-36 bg-[#F4B000]/10 rounded-full blur-[50px] pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              whileHover={{ scale: 1.03, filter: "drop-shadow(0 20px 45px rgba(244,176,0,0.25))" }}
              transition={{
                animate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                scale: { type: "spring", stiffness: 100, damping: 15 }
              }}
              className="relative z-10 w-full max-w-[500px] cursor-pointer filter drop-shadow-[0_12px_28px_rgba(43,29,18,0.15)]"
            >
              <img 
                src={cansOnRock} 
                alt="SPOOWA cans setup on wet rock with ice, oranges, and lemons" 
                className="w-full h-auto object-contain select-none" 
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Feature Strip */}
      <div className="relative mx-auto -mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-gray-250/40 bg-gray-200/50 md:grid-cols-4 backdrop-blur-md">
          {[
            { icon: "⚡", title: "FASTER HYDRATION", desc: "Advanced electrolyte formula", color: "var(--lime)" },
            { icon: "🍯", title: "RAW HONEY SWEETENED", desc: "Natural monk-fruit sweet base", color: "var(--melon)" },
            { icon: "💪", title: "PERFORMANCE BOOST", desc: "Supports stamina & endurance", color: "var(--citrus)" },
            { icon: "🇮🇳", title: "MADE IN INDIA", desc: "Formulated for active lives", color: "var(--berry)" },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3 bg-white/60 p-5 hover:bg-white/80 transition-colors">
              <div
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-xl border border-white"
                style={{ background: `color-mix(in oklab, ${f.color} 20%, transparent)` }}
              >
                <span>{f.icon}</span>
              </div>
              <div>
                <p className="text-[11px] font-bold tracking-wider uppercase text-gray-800">{f.title}</p>
                <p className="mt-1 text-[11px] text-gray-500 leading-tight font-medium">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
