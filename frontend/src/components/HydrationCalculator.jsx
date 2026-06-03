import { useState } from "react";
import { BatteryCharging } from "lucide-react";

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

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Interactive Hydration Calculator Widget */}
      <div className="p-8 sm:p-12 rounded-[40px] border-2 border-[#D4AF37] bg-gradient-to-br from-[#FFFDF5] via-[#FFFBF0] to-[#FCF1C5]/40 shadow-[0_20px_50px_rgba(212,175,55,0.22)] w-full transition-all hover:shadow-[0_25px_60px_rgba(212,175,55,0.3)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#D4AF37]/20">
          <div>
            <h3 className="text-display text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BatteryCharging className="h-6 w-6 text-[#D4AF37] animate-bounce" /> SPOOWA Hydration Calculator
            </h3>
            <p className="text-xs text-gray-600 mt-1 font-medium">
              Select your activity and training duration to calculate your performance recovery requirements.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(activities).map((actKey) => (
              <button
                key={actKey}
                onClick={() => setActivity(actKey)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                  activity === actKey
                    ? "bg-[#D4AF37] text-white border-[#D4AF37] shadow-md scale-102"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#D4AF37]/50"
                }`}
              >
                {activities[actKey].label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-12 mt-8 items-center">
          {/* Left inputs */}
          <div className="md:col-span-6 flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-3">
                <span>Workout Duration</span>
                <span className="text-white bg-[#D4AF37] px-3 py-1 rounded-full text-[11px] font-bold shadow-sm">{duration} Min</span>
              </div>
              <input
                type="range"
                min="15"
                max="180"
                step="15"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D4AF37] focus:outline-none"
              />
              <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2">
                <span>15 Mins</span>
                <span>90 Mins</span>
                <span>180 Mins</span>
              </div>
            </div>
          </div>

          {/* Right outputs */}
          <div className="md:col-span-6 grid grid-cols-3 gap-4">
            <div className="bg-white border-2 border-[#D4AF37]/20 hover:border-[#D4AF37] rounded-3xl p-5 text-center transition-all shadow-sm">
              <span className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">Drink Intake</span>
              <p className="text-display text-3xl text-[#D4AF37] mt-1 font-black">{calculateDrinkIntake()}</p>
              <span className="text-[9px] font-bold text-gray-500 uppercase">Cans</span>
            </div>
            
            <div className="bg-white border-2 border-[#D4AF37]/20 hover:border-[#D4AF37] rounded-3xl p-5 text-center transition-all shadow-sm">
              <span className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">Electrolytes</span>
              <p className="text-display text-3xl text-[#D4AF37] mt-1 font-black">{calculateElectrolytes()} mg</p>
              <span className="text-[9px] font-bold text-gray-500 uppercase">Required</span>
            </div>

            <div className="bg-white border-2 border-[#D4AF37]/20 hover:border-[#D4AF37] rounded-3xl p-5 text-center transition-all shadow-sm">
              <span className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">Stamina Boost</span>
              <p className="text-display text-3xl text-[#D4AF37] mt-1 font-black">+{calculateStaminaBonus()}%</p>
              <span className="text-[9px] font-bold text-gray-500 uppercase">Performance</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
