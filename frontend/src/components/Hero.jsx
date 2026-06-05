import heroCans from "@/assets/hero-cans.jpg";
import { ArrowRight, Heart, Zap, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-tr from-orange-50 via-amber-50 to-blue-50 py-12 sm:py-16 lg:py-24 text-gray-900 border-b border-gray-100">
      {/* Soft pastel glowing ambient blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full bg-orange-300/15 blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#D4AF37]/15 blur-[120px] pointer-events-none"></div>

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
          <div className="w-full relative rounded-[32px] overflow-hidden p-2 bg-white/20 border border-white/30 backdrop-blur-sm shadow-sm">
            <img
              src={heroCans}
              alt="Spoowa hydration cans splashing water"
              width={1536}
              height={1024}
              className="w-full animate-float drop-shadow-[0_15px_35px_rgba(212,175,55,0.12)] rounded-2xl"
            />
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
