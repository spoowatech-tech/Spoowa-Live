import { useState } from "react";
import { BatteryCharging } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function HydrationCalculator() {
  // Calculator state
  const [activity, setActivity] = useState("run"); // "run", "cycle", "gym", "box"
  const [duration, setDuration] = useState(60); // minutes

  // Activity config
  const activities = {
    run: { label: "Running 🏃", factor: 1.2, name: "Running" },
    cycle: { label: "Cycling 🚴", factor: 1.0, name: "Cycling" },
    gym: { label: "Gym & Strength 🏋️", factor: 0.9, name: "Gym Workout" },
    box: { label: "Boxing & Sparring 🥊", factor: 1.5, name: "Boxing Session" }
  };

  // Live calculations
  const calculateDrinkIntake = () => {
    const baseCans = (duration / 45) * activities[activity].factor;
    return Math.max(1, Math.round(baseCans * 2) / 2); // rounded to nearest 0.5 can, minimum 1 can
  };

  const calculateElectrolytes = () => {
    return Math.round(duration * 14 * activities[activity].factor); // mg
  };

  const calculateStaminaBonus = () => {
    return Math.min(95, Math.round((duration / 1.5) * activities[activity].factor)); // %
  };

  const drinkIntake = calculateDrinkIntake();
  const electrolytes = calculateElectrolytes();
  const staminaBonus = calculateStaminaBonus();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background ambient glow blur */}
      <div className="absolute right-[-10%] top-1/3 w-[350px] h-[350px] rounded-full bg-amber-400/5 blur-[120px] pointer-events-none" />

      {/* Interactive Hydration Calculator Widget */}
      <div className="p-8 sm:p-12 rounded-[40px] border-2 border-[#F4B000]/30 bg-gradient-to-br from-[#FFFBEF] via-[#FFF7DB] to-[#FFECA7]/50 shadow-[0_20px_50px_rgba(244,176,0,0.18)] w-full transition-all hover:shadow-[0_25px_60px_rgba(244,176,0,0.25)] relative overflow-hidden">
        
        {/* Decorative ambient bubbles */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#F4B000]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-[25%] top-[-30px] w-24 h-24 bg-orange-300/15 rounded-full blur-xl pointer-events-none" />

        {/* Header Block */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-[#F4B000]/20 relative z-10">
          <div>
            <h3 className="text-display text-2xl font-black text-[#2B1D12] flex items-center gap-2.5 uppercase">
              <BatteryCharging className="h-6 w-6 text-[#D88A00] animate-pulse" /> Hydration Calculator
            </h3>
            <p className="text-xs text-gray-600 mt-1 font-semibold leading-relaxed">
              Input your activity and training duration to calculate your performance recovery requirements.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {Object.keys(activities).map((actKey) => (
              <motion.button
                key={actKey}
                onClick={() => setActivity(actKey)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                className={`px-5 py-3 rounded-full text-xs font-black tracking-wider uppercase transition-all border-2 cursor-pointer ${
                  activity === actKey
                    ? "bg-[#2B1D12] text-white border-[#2B1D12] shadow-md scale-102"
                    : "bg-white text-gray-600 border-gray-150 hover:border-[#F4B000]/50"
                }`}
              >
                {activities[actKey].label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid gap-10 lg:grid-cols-12 mt-8 items-center relative z-10">
          {/* Left duration slider */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between text-xs font-extrabold text-[#2B1D12] mb-4 uppercase tracking-wider">
                <span>Workout Duration</span>
                <motion.span 
                  key={duration}
                  initial={{ scale: 0.85, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-white bg-[#2B1D12] px-3.5 py-1.5 rounded-full text-[11px] font-black shadow-sm"
                >
                  {duration} Min
                </motion.span>
              </div>
              <input
                type="range"
                min="15"
                max="180"
                step="15"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-[#D88A00] border border-gray-250 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] font-extrabold text-gray-400 mt-3">
                <span>15 MINS</span>
                <span>90 MINS</span>
                <span>180 MINS</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1" />

          {/* Right output counters */}
          <div className="lg:col-span-6 grid grid-cols-3 gap-4">
            {[
              { title: "Fluid Volume", val: drinkIntake, unit: "Cans", color: "text-[#D88A00]" },
              { title: "Electrolyte Intake", val: electrolytes, unit: "mg Required", color: "text-[#D88A00]" },
              { title: "Stamina Boost", val: `+${staminaBonus}%`, unit: "Performance", color: "text-[#D88A00]" }
            ].map((out) => (
              <div 
                key={out.title}
                className="bg-white/80 border border-[#F4B000]/15 hover:border-[#F4B000]/40 rounded-[28px] p-5 text-center transition-all duration-300 shadow-sm flex flex-col justify-between items-center min-h-[145px]"
              >
                <span className="text-[9px] font-extrabold tracking-wider text-gray-400 uppercase">{out.title}</span>
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={out.val}
                    initial={{ y: 8, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -8, opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 350, damping: 15 }}
                    className={`text-display text-2xl sm:text-3xl font-black my-1.5 ${out.color}`}
                  >
                    {out.val}
                  </motion.p>
                </AnimatePresence>
                <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest">{out.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stamina Visual Gauge Bar */}
        <div className="mt-8 relative z-10 bg-white/70 border border-[#F4B000]/10 p-5 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center text-[10px] font-extrabold text-[#2B1D12] mb-2.5 uppercase tracking-wider">
            <span>Stamina Refill Efficiency</span>
            <span className="text-[#D88A00] font-black">{staminaBonus}% Refilled</span>
          </div>
          <div className="w-full bg-white h-4.5 rounded-full overflow-hidden border border-gray-150 p-1">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${staminaBonus}%` }}
              transition={{ type: "spring", stiffness: 60, damping: 14 }}
              className="h-full bg-gradient-to-r from-orange-400 via-[#F4B000] to-[#FFC83D] rounded-full"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
