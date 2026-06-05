import running from "@/assets/activity-running.jpg";
import cycling from "@/assets/activity-cycling.jpg";
import gym from "@/assets/activity-gym.jpg";
import outdoor from "@/assets/activity-outdoor.jpg";
import { motion } from "framer-motion";

const activities = [
  { 
    title: "RUNNING", 
    desc: "Stay light. Stay fast.", 
    img: running, 
    icon: "🏃", 
    color: "#F4B000", 
    borderColor: "hover:border-[#F4B000]/60", 
    glowColor: "group-hover:shadow-[0_0_35px_rgba(244,176,0,0.28)]" 
  },
  { 
    title: "CYCLING", 
    desc: "Pedal stronger. Go longer.", 
    img: cycling, 
    icon: "🚴", 
    color: "#3B82F6", 
    borderColor: "hover:border-[#3B82F6]/60", 
    glowColor: "group-hover:shadow-[0_0_35px_rgba(59,130,246,0.28)]" 
  },
  { 
    title: "GYM & FITNESS", 
    desc: "Train hard. Recover smart.", 
    img: gym, 
    icon: "🏋️", 
    color: "#EC4899", 
    borderColor: "hover:border-[#EC4899]/60", 
    glowColor: "group-hover:shadow-[0_0_35px_rgba(236,72,153,0.28)]" 
  },
  { 
    title: "OUTDOOR", 
    desc: "Fuel adventures. Naturally.", 
    img: outdoor, 
    icon: "🥾", 
    color: "#84CC16", 
    borderColor: "hover:border-[#84CC16]/60", 
    glowColor: "group-hover:shadow-[0_0_35px_rgba(132,204,22,0.28)]" 
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 85,
      damping: 14
    }
  }
};

export function Activities() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background colorful details */}
      <div className="absolute right-0 top-1/4 w-80 h-80 rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute left-0 bottom-10 w-72 h-72 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#D88A00] uppercase block">Engineered for Movement</span>
          <h2 className="text-display text-4xl font-black text-[#2B1D12] mt-2 uppercase">
            Made for every <span className="underline-gold">move</span>
          </h2>
        </div>
        <p className="text-xs text-gray-500 font-semibold max-w-xs md:text-right">
          Hydration designed to match the specific metabolic rates of your training regime.
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-2 gap-5 lg:grid-cols-4"
      >
        {activities.map((a) => (
          <motion.a 
            key={a.title} 
            href="#" 
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            className={`group relative block aspect-[3/4] overflow-hidden rounded-[32px] border-2 border-gray-150/70 bg-[#1A120B] shadow-md transition-all duration-300 cursor-pointer ${a.borderColor} ${a.glowColor}`}
          >
            {/* Background image */}
            <img 
              src={a.img} 
              alt={a.title} 
              loading="lazy" 
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-108" 
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            
            {/* Color-wash on hover */}
            <div 
              style={{ backgroundColor: a.color }}
              className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-300 pointer-events-none" 
            />

            {/* Floating Icon Badges */}
            <div 
              style={{ backgroundColor: a.color }}
              className="absolute left-5 top-5 grid h-10 w-10 place-items-center rounded-full text-base text-white shadow-md border-2 border-white/90"
            >
              {a.icon}
            </div>

            {/* Labels */}
            <div className="absolute bottom-6 left-6 right-6 text-white z-10">
              <h3 className="text-display text-xl sm:text-2xl font-black tracking-tight leading-tight">{a.title}</h3>
              <p className="mt-1.5 text-[11px] font-extrabold tracking-wide uppercase opacity-80" style={{ color: a.color }}>
                {a.desc}
              </p>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
