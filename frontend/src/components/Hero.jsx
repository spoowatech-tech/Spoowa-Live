import heroCans from "@/assets/hero-cans.jpg";
import { ArrowRight, Heart, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-12 pb-20 sm:px-6 lg:grid-cols-12 lg:gap-6 lg:px-8 lg:pt-20 lg:pb-28">
        {/* Copy */}
        <div className="lg:col-span-5 lg:pt-6 animate-fade-up">
          <h1 className="text-display text-5xl leading-[0.95] text-foreground sm:text-6xl lg:text-7xl">
            HYDRATION
            <br />
            THAT MOVES
            <br />
            <span className="text-accent">WITH YOU</span>
          </h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg">
            Real fruit flavors. Essential electrolytes. Made for every move you make.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#bestsellers" className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-4 text-sm font-bold tracking-wide text-background transition-all hover:bg-accent">
              SHOP NOW
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[color:var(--lime)] text-foreground transition-transform group-hover:translate-x-0.5">
                <Zap className="h-3.5 w-3.5" />
              </span>
            </a>
            <a href="#flavors" className="inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-transparent px-7 py-4 text-sm font-bold tracking-wide text-foreground transition-colors hover:bg-foreground hover:text-background">
              EXPLORE FLAVORS
            </a>
          </div>

          <div className="mt-10">
            <p className="text-xs font-semibold tracking-wide text-foreground/70">Trusted by 50,000+ athletes</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["#f97316", "#a855f7", "#0ea5e9", "#84cc16"].map((c, i) => (
                  <div key={i} className="h-9 w-9 rounded-full border-2 border-white" style={{ background: c }} />
                ))}
              </div>
              <span className="text-sm font-bold">+50K</span>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative lg:col-span-7">
          <div className="absolute right-2 top-2 z-10 inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-accent-foreground shadow-lift">
            <Heart className="h-3.5 w-3.5 fill-current" /> MADE IN INDIA
          </div>
          <img
            src={heroCans}
            alt="Spoowa Citrus Burst, Berry Blitz, Tropical Tide and Melon Mist hydration cans with splashing water"
            width={1536}
            height={1024}
            className="relative w-full animate-float drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Feature strip */}
      <div className="relative mx-auto -mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
          {[
            { icon: "⚡", title: "FASTER HYDRATION", desc: "Advanced electrolyte formula", color: "var(--lime)" },
            { icon: "🌿", title: "CLEAN & HEALTHY", desc: "No artificial colors or flavors", color: "var(--melon)" },
            { icon: "💪", title: "PERFORMANCE", desc: "Supports endurance & recovery", color: "var(--citrus)" },
            { icon: "🇮🇳", title: "MADE IN INDIA", desc: "Proudly Indian. Trusted by thousands.", color: "var(--berry)" },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3 bg-white p-5">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-xl" style={{ background: `color-mix(in oklab, ${f.color} 18%, white)` }}>
                <span>{f.icon}</span>
              </div>
              <div>
                <p className="text-xs font-bold tracking-wide">{f.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
