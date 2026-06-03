import { useState } from "react";
import { Zap, Sparkles, Check, Flame, Trophy, BatteryCharging, ArrowRight } from "lucide-react";
import productCan from "@/assets/product_can.png";
import productHoney from "@/assets/product_honey.png";

export function Bestsellers() {
  const [activeTab, setActiveTab] = useState("drink"); // "drink" or "honey"
  
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

  const products = {
    drink: {
      name: "SPOOWA Hydration X Energy Drink",
      tagline: "Sporty, Skilled & Fit Nation",
      badge: "Pure Electrolytes & Honey Sweetened",
      description: "SPOOWA Hydration X Energy Drink is engineered specifically for athletes. Brewed with organic raw honey and natural monk-fruit, it delivers instant, jitter-free energy with 4x faster cellular hydration.",
      image: productCan,
      gradient: "from-orange-500/25 via-blue-500/10 to-orange-100/50",
      textColor: "text-orange-600",
      bullets: [
        "Jitter-Free Clean Energy base",
        "Infused with Pure Raw Honey & Monk-fruit",
        "Essential Electrolytes & Vitamins",
        "Zero Added Refined Sugar & Chemicals"
      ]
    },
    honey: {
      name: "SPOOWA Unprocessed Mustard Honey",
      tagline: "A Gift For Your Health",
      badge: "Pure Organic Mustard Field Harvest",
      description: "Harvested directly from the premium yellow mustard fields of India, SPOOWA Pure Organic Unprocessed Honey is a natural powerhouse of enzymes and minerals. It provides long-lasting, slow-release energy for recovery.",
      image: productHoney,
      gradient: "from-amber-500/25 via-yellow-500/10 to-amber-100/50",
      textColor: "text-amber-600",
      bullets: [
        "100% Raw, Pure, and Unprocessed",
        "Sourced from the fertile Mustard Fields of India",
        "Rich in active antioxidants and enzymes",
        "Ideal natural sweetener for performance recovery"
      ]
    }
  };

  const activeProduct = products[activeTab];

  return (
    <section id="bestsellers" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 bg-white">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-[#FFFDF5] px-4 py-1.5 shadow-sm mb-6">
          <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Launching Soon
          </span>
        </div>
        <h2 className="text-display text-4xl leading-[0.95] sm:text-5xl uppercase">
          Interactive Product Showcase
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-base text-gray-500">
          Toggle between our flagship products, explore their clean Indian ingredients, and calculate your hydration needs live.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => setActiveTab("drink")}
          className={`px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
            activeTab === "drink"
              ? "bg-[#D4AF37] text-white border-[#D4AF37] shadow-md scale-102"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          }`}
        >
          Hydration X Energy Drink ⚡
        </button>
        <button
          onClick={() => setActiveTab("honey")}
          className={`px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
            activeTab === "honey"
              ? "bg-[#D4AF37] text-white border-[#D4AF37] shadow-md scale-102"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          }`}
        >
          Organic Mustard Honey 🍯
        </button>
      </div>

      {/* Product Display Block */}
      <div className="grid gap-12 lg:grid-cols-12 items-center">
        {/* Left: Product Image with dynamic gradient container */}
        <div className="lg:col-span-5 flex justify-center">
          <div className={`relative w-full max-w-md aspect-square rounded-[36px] bg-gradient-to-tr ${activeProduct.gradient} p-8 flex items-center justify-center shadow-sm overflow-hidden border border-gray-100 group`}>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <img
              src={activeProduct.image}
              alt={activeProduct.name}
              className="max-h-[90%] max-w-[90%] object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1"
            />
          </div>
        </div>

        {/* Right: Product details */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <span className={`text-[10px] font-extrabold tracking-widest uppercase ${activeProduct.textColor} bg-[#FFFDF5] border border-gray-100 px-3 py-1 rounded-full w-fit mb-4`}>
            {activeProduct.badge}
          </span>
          <h3 className="text-display text-3xl sm:text-4xl text-gray-900 leading-tight">
            {activeProduct.name}
          </h3>
          <p className="mt-2 text-sm font-semibold text-[#D4AF37] uppercase tracking-wide">
            {activeProduct.tagline}
          </p>
          <p className="mt-5 text-sm leading-relaxed text-gray-500">
            {activeProduct.description}
          </p>

          {/* Bullets */}
          <ul className="mt-6 space-y-3">
            {activeProduct.bullets.map((bullet, i) => (
              <li key={i} className="flex items-center gap-3 text-xs font-semibold text-gray-700">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#FFFDF5] text-[#D4AF37] border border-[#D4AF37]/20 shrink-0">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {bullet}
              </li>
            ))}
          </ul>

          {/* Pre-order/Newsletter box */}
          <div className="mt-8 p-6 rounded-2xl bg-gray-50 border border-gray-100 max-w-xl">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-[#D4AF37] animate-bounce" /> Early Access Pre-Order
            </h4>
            <p className="mt-1 text-[11px] text-gray-500">
              Join our exclusive launch circle. Get 20% off and free shipping on your first box.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="flex-1 bg-white border border-gray-200 px-4 py-2.5 rounded-full text-xs font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
              <button
                type="submit"
                className="bg-gray-900 hover:bg-[#D4AF37] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 shrink-0"
              >
                <span>Notify Me</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Interactive Hydration Calculator Widget */}
      <div className="mt-20 p-6 sm:p-10 rounded-[32px] border border-gray-100 bg-[#FFFDF5] shadow-sm max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BatteryCharging className="h-5 w-5 text-[#D4AF37]" /> SPOOWA Hydration Calculator
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Select your activity and training duration to calculate your performance recovery requirements.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(activities).map((actKey) => (
              <button
                key={actKey}
                onClick={() => setActivity(actKey)}
                className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all border ${
                  activity === actKey
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {activities[actKey].label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-12 mt-8 items-center">
          {/* Left inputs */}
          <div className="md:col-span-6 flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2">
                <span>Workout Duration</span>
                <span className="text-[#D4AF37] bg-white border border-[#D4AF37]/20 px-2 py-0.5 rounded-full">{duration} Min</span>
              </div>
              <input
                type="range"
                min="15"
                max="180"
                step="15"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
              />
              <div className="flex justify-between text-[9px] font-bold text-gray-400 mt-1">
                <span>15 Mins</span>
                <span>90 Mins</span>
                <span>180 Mins</span>
              </div>
            </div>
          </div>

          {/* Right outputs */}
          <div className="md:col-span-6 grid grid-cols-3 gap-3">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Drink Intake</span>
              <p className="text-display text-2xl text-[#D4AF37] mt-1">{calculateDrinkIntake()}</p>
              <span className="text-[9px] font-bold text-gray-500 uppercase">Cans</span>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Electrolytes</span>
              <p className="text-display text-2xl text-[#D4AF37] mt-1">{calculateElectrolytes()}</p>
              <span className="text-[9px] font-bold text-gray-500 uppercase">mg</span>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Stamina Gain</span>
              <p className="text-display text-2xl text-emerald-600 mt-1">+{calculateStaminaBonus()}%</p>
              <span className="text-[9px] font-bold text-emerald-600 uppercase">Bonus</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
          <Trophy className="h-3.5 w-3.5 text-[#D4AF37]" /> Powered by Raw Honey & Monk Fruit base formula
        </div>
      </div>
    </section>
  );
}
