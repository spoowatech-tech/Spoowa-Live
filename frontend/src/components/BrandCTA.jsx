import { Check, Users, Droplets, MapPin, Ban } from "lucide-react";
import { motion } from "framer-motion";
import splash from "@/assets/cta-splash.jpg";

const features = [
  "Active Carbs from Raw Forest Honey",
  "Isotonic & Hypotonic Fluid Balance",
  "Essential Vitamin Co-factors",
  "Zero Chemical Dyes or Syrups",
];

const stats = [
  { 
    icon: Users, 
    value: "50K+", 
    label: "Happy Athletes",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20" 
  },
  { 
    icon: Droplets, 
    value: "4", 
    label: "Unique Flavors",
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" 
  },
  { 
    icon: MapPin, 
    value: "100%", 
    label: "Made in India",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
  },
  { 
    icon: Ban, 
    value: "0", 
    label: "Synthetic Additives",
    color: "text-red-400 bg-red-500/10 border-red-500/20" 
  },
];

export function BrandCTA() {
  return (
    <section id="ingredients" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative">
      {/* Decorative side glowing blur */}
      <div className="absolute left-[-5%] top-1/3 w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      <div className="overflow-hidden rounded-[40px] border border-[#F4B000]/15 bg-gradient-to-br from-[#1C140D] via-[#2B1D12] to-[#120D08] shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
        <div className="grid items-center gap-10 lg:grid-cols-12 p-8 sm:p-12 lg:p-16">
          
          {/* Left splash image with custom drop shadow glow */}
          <div className="relative lg:col-span-4 flex justify-center bg-white/5 border border-white/5 rounded-3xl p-6 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,176,0,0.15),transparent_60%)] pointer-events-none" />
            <img 
              src={splash} 
              alt="Spoowa Berry Blitz splash" 
              loading="lazy" 
              className="h-auto max-h-[300px] w-auto object-contain filter drop-shadow-[0_12px_24px_rgba(244,176,0,0.22)] animate-float" 
            />
          </div>

          {/* Middle text blocks */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-display text-4xl leading-[0.92] sm:text-5xl font-black text-white uppercase">
              HYDRATE.
              <br />
              PERFORM.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC83D] to-[#F4B000]">REPEAT.</span>
            </h2>
            
            <p className="text-xs text-white/60 font-semibold leading-relaxed">
              SPOOWA is engineered to restore cellular ions and water volumes rapidly, giving you sustained carbohydrate output derived from natural forest honey.
            </p>
            
            <ul className="space-y-3 pt-2">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-xs font-bold text-white/90">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#F4B000] text-gray-900 shadow-sm">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Right stats grid */}
          <div className="grid grid-cols-2 gap-4 lg:col-span-4">
            {stats.map((s, idx) => (
              <motion.div 
                key={s.label} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                whileHover={{ y: -4, borderColor: "rgba(244, 176, 0, 0.35)" }}
                className="rounded-3xl border border-white/5 bg-white/[0.03] p-5 shadow-sm transition-all duration-300 flex flex-col justify-between min-h-[140px]"
              >
                <div className={`grid h-10 w-10 place-items-center rounded-full border ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-display text-2xl font-black text-white mt-4">{s.value}</p>
                  <p className="text-[10px] font-extrabold text-white/40 uppercase tracking-wider leading-snug mt-1">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
