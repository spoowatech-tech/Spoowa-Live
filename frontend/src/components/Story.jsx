import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Droplets, Leaf, Flame, Zap, Check, X, 
  Award, Heart, ShieldCheck, Smile, Star, Activity, 
  ChevronRight, TrendingUp, Info, Plus, ArrowRight, ShoppingCart
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

// Import core assets
import productHoney from "@/assets/product_honey.png";
import productCan from "@/assets/product_can.png";
import logoSpefl from "@/assets/logo_spefl.png";

export function Story() {
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState({});

  // 1. Metabolic Curve Toggles
  const [activeCurve, setActiveCurve] = useState("spoowa");

  const curvesData = {
    spoowa: {
      name: "SPOOWA Raw Honey Formulation",
      color: "#F4B000",
      glowClass: "glow-gold",
      peakGI: "35 (Low Glycemic Index)",
      crashPoint: "None (Sustained Release)",
      energyWindow: "4+ Hours of Stable Output",
      digestiveLoad: "Light (Active Honey Enzymes)",
      insulinShock: "Negligible insulin response",
      description: "SPOOWA utilizes unheated forest honey packed with live amylase enzymes. Because raw honey naturally balances complex glucose and fructose sugars, it delivers stable glycogen replenishment without forcing the pancreas into insulin shock.",
    },
    standard: {
      name: "Standard Sugar/HFCS Energy Drinks",
      color: "#EF4444",
      glowClass: "glow-red",
      peakGI: "85 (High Glycemic Spike)",
      crashPoint: "45-60 Minutes Post-Drink",
      energyWindow: "Short-lived (30-45 Mins spike)",
      digestiveLoad: "High Osmotic Load (Causes Cramping)",
      insulinShock: "Extreme insulin response",
      description: "High-fructose corn syrup and refined cane sugars dump simple sucrose directly into the blood. This triggers a massive insulin surge that quickly stores glucose away, plummeting your energy and leaving you in the crash zone.",
    }
  };

  // 2. Ingredient Hotspots
  const [activeHotspot, setActiveHotspot] = useState("honey");

  const hotspots = [
    {
      id: "honey",
      title: "Raw Forest Honey",
      short: "100% Unfiltered Honey",
      x: "38%",
      y: "28%",
      color: "from-amber-400 to-amber-600",
      details: "Ethically harvested from wild forest hives. Unheated raw honey contains natural enzymes and mineral micro-nutrients. It serves as an optimal glycogen source that absorbs slowly, saving you from gastric bloating or cramping."
    },
    {
      id: "electrolytes",
      title: "Science-Backed Electrolytes",
      short: "Na+, K+, Mg2+ Ions",
      x: "58%",
      y: "48%",
      color: "from-blue-400 to-blue-600",
      details: "Formulated in collaboration with CFTRI alumni. Contains precise isotonic ratios of sodium, potassium, and magnesium to facilitate hydration absorption across cellular membranes and eliminate muscle fatigue."
    },
    {
      id: "monkfruit",
      title: "Organic Monk Fruit",
      short: "Luo Han Guo Extract",
      x: "42%",
      y: "68%",
      color: "from-emerald-400 to-emerald-600",
      details: "An organic sweetener derived from Monk Fruit extract. Yields premium taste profiles with zero sugar and zero glycemic index, keeping the product clean and metabolically friendly."
    },
    {
      id: "vitamins",
      title: "ATP Activation Vitamins",
      short: "B-Complex & Vitamin C",
      x: "62%",
      y: "22%",
      color: "from-orange-400 to-orange-600",
      details: "Packed with active Vitamins B3, B6, B12, and Vitamin C. These act as necessary enzymatic co-factors that catalyze carbohydrate oxidation, converting organic honey directly into usable cell ATP energy."
    }
  ];

  // 3. Vibe Matcher database (real products from seed.sql)
  const [selectedActivity, setSelectedActivity] = useState("running");

  const activities = [
    { id: "running", label: "Cardio & Running", icon: "🏃" },
    { id: "lifting", label: "Strength & Gym", icon: "🏋️" },
    { id: "cycling", label: "Endurance & Cycling", icon: "🚴" },
    { id: "yoga", label: "Yoga & Flexibility", icon: "🧘" }
  ];

  const matchedProducts = {
    running: {
      productId: 1,
      name: "Raw Forest Honey",
      tagline: "100% Pure & Unfiltered",
      price: 499,
      rating: 4.9,
      reviews: 2156,
      why: "Delivers rapid, sustained carbs to maintain heart-rate stability and muscular glycogen over long runs.",
      features: ["Pure Forest Harvest", "Rich in Live Enzymes", "No Heat Processing"],
      image: productHoney,
      color: "border-amber-300 bg-amber-500/5",
      btnColor: "bg-amber-500 hover:bg-amber-600 text-white"
    },
    lifting: {
      productId: 14,
      name: "Coffee Blended Honey",
      tagline: "Energy & Focus",
      price: 449,
      rating: 4.5,
      reviews: 321,
      why: "Combines fast-acting organic honey sugars with real coffee extract to stimulate focus and explosive power.",
      features: ["Natural Caffeine Kick", "Pre-workout Fuel", "High ATP Activation"],
      image: productHoney,
      color: "border-stone-300 bg-stone-500/5",
      btnColor: "bg-stone-700 hover:bg-stone-800 text-white"
    },
    cycling: {
      productId: 3,
      name: "Acacia Honey",
      tagline: "Naturally Sweet & Light",
      price: 449,
      rating: 4.7,
      reviews: 1247,
      why: "A light, slow-release honey that maintains cellular hydration rates over hours of continuous cycling.",
      features: ["Light Glycemic Load", "Slow Burn Sugars", "Ethical Harvesting"],
      image: productHoney,
      color: "border-yellow-300 bg-yellow-500/5",
      btnColor: "bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-extrabold"
    },
    yoga: {
      productId: 5,
      name: "Ginger Honey",
      tagline: "Soothes & Strengthens",
      price: 349,
      rating: 4.6,
      reviews: 987,
      why: "Soothing honey blend that reduces muscle soreness, aids digestive system empty rates, and comforts the throat.",
      features: ["Active Gingerols", "Anti-inflammatory Boost", "Mild Sweetness"],
      image: productHoney,
      color: "border-lime-300 bg-lime-500/5",
      btnColor: "bg-lime-600 hover:bg-lime-700 text-white"
    }
  };

  const currentMatch = matchedProducts[selectedActivity];

  const handleAddToCart = async (productId, productName) => {
    try {
      setAddingToCart(prev => ({ ...prev, [productId]: true }));
      await addToCart(productId, 1);
      toast.success(`${productName} added to your cart! 🍯`, {
        style: {
          background: '#1A120B',
          color: '#FFF8E8',
          border: '1px solid #F4B000',
          fontWeight: 'bold',
        }
      });
    } catch (error) {
      toast.error("Could not add to cart. Please log in first.");
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  // 4. Timeline
  const [activeYear, setActiveYear] = useState(2026);

  const timelineMilestones = {
    2023: {
      title: "The Kitchen Spark",
      metric: "Home Brew 01",
      desc: "SPOOWA was born in a home kitchen in Bengaluru, searching for a clean athletic beverage sweetened naturally with active forest honey."
    },
    2024: {
      title: "CFTRI R&D Partnership",
      metric: "24 Lab Tests",
      desc: "Collaborated with veteran food technologists and CFTRI alumni to lock in chemical-free formulation stability, metabolic safety, and high absorption profiles."
    },
    2025: {
      title: "First Batch Launch",
      metric: "10K Cans Sold",
      desc: "Successfully launched our initial batch of natural honey hydration cans, shipping to active runners, cyclists, and fitness enthusiasts across India."
    },
    2026: {
      title: "National Scaling",
      metric: "50K+ Athletes Fueled",
      desc: "Expanding throughout active fitness centers, boxing arenas, and cycling clubs, powering thousands of active lifestyles with premium natural fuels."
    }
  };

  // 5. Certification details modal
  const [certDetail, setCertDetail] = useState(null);

  const certifications = [
    {
      title: "CFTRI Science Backed",
      badge: "Formulation Science",
      desc: "Developed alongside veteran alumni of the Central Food Technological Research Institute.",
      more: "Our formulas are engineered to verify complete electrolyte absorption rates. We test raw honey enzyme levels, osmotic pressures, and molecular stability to ensure optimal hydration without causing standard sports-drink bloating."
    },
    {
      title: "SSAC Certified Purity",
      badge: "100% Quality Lab Test",
      desc: "Independently verified for chemical purity, heavy metals, and adulteration.",
      more: "We strictly test every single batch of forest honey for zero sugar-syrup adulteration, zero heavy metals, and zero pesticide residues. You get only 100% active organic carbohydrates."
    },
    {
      title: "SPEFL-SC Association",
      badge: "Sports Skills Council",
      desc: "Associated with the Sports, Physical Education, Fitness & Leisure Skills Council.",
      more: "As a brand aligned with athletic progress, SPOOWA is committed to educating young athletes on healthy hydration alternatives, working together to remove harmful high-fructose corn syrup from sports academies."
    }
  ];

  return (
    <div className="relative">
      
      {/* Ambient top decoration */}
      <div className="absolute top-0 left-1/4 w-[350px] h-[350px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      {/* ── SECTION 1: Narrative & Core Stats ── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          {/* Left copy */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#F4B000]/25 bg-[#FFFDF0] px-3.5 py-1.5 text-[10px] font-extrabold tracking-widest text-[#D4AF37] uppercase mb-6 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>Natural Energy Revolution</span>
            </div>
            
            <h2 className="text-display text-4xl leading-[0.92] sm:text-5xl lg:text-6xl font-black text-[#2B1D12] uppercase">
              BUILT FOR SPORT.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-[#D4AF37]">
                SWEETENED BY NATURE.
              </span>
            </h2>

            <p className="mt-6 text-base text-gray-600 leading-relaxed font-medium">
              SPOOWA was born from a simple realization: athletes shouldn't have to compromise their long-term health for intra-workout energy. Mainstream energy drinks rely on refined cane sugar or synthetic fructose syrups that trigger insulin spikes, sudden fatigue, and stomach cramps. 
            </p>

            <p className="mt-4 text-base text-gray-600 leading-relaxed font-medium">
              We paired raw forest honey and organic monk fruit with a science-backed electrolyte formula to support fast cellular hydration. No chemical dyes, no synthetic preservatives, and zero artificial crashes. Just pure, clean stamina.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#energy-curve" className="inline-flex items-center gap-2 rounded-full bg-[#2B1D12] text-white hover:bg-[#F4B000] hover:text-[#2B1D12] px-7 py-3.5 text-xs font-bold tracking-widest uppercase transition-all shadow-sm">
                View Metabolic Curve <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#vibe-matcher" className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 hover:border-gray-300 px-7 py-3.5 text-xs font-bold tracking-widest uppercase text-gray-700 transition-all">
                Match My Vibe
              </a>
            </div>
          </div>

          {/* Right stats grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {[
              { value: "2023", label: "Born in Bengaluru", icon: "🌱", color: "from-amber-50 to-amber-100/40 border-amber-200/20" },
              { value: "0g", label: "Refined Added Sugar", icon: "🍯", color: "from-orange-50 to-orange-100/40 border-orange-200/20" },
              { value: "35", label: "Glycemic Index", icon: "📈", color: "from-emerald-50 to-emerald-100/40 border-emerald-200/20" },
              { value: "100%", label: "Lab Tested Batches", icon: "🧪", color: "from-blue-50 to-blue-100/40 border-blue-200/20" },
            ].map((s, idx) => (
              <motion.div 
                key={s.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`rounded-3xl border bg-gradient-to-br ${s.color} p-6 shadow-sm transition-all duration-300`}
              >
                <span className="text-2xl block mb-3">{s.icon}</span>
                <p className="text-display text-4xl font-black text-[#2B1D12] leading-none">{s.value}</p>
                <p className="mt-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider leading-snug">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: INTERACTIVE METABOLIC ENERGY CURVE ── */}
      <section id="energy-curve" className="bg-[#1A120B] text-white py-24 border-y border-[#F4B000]/10 relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-[30%] right-[-10%] w-[450px] h-[450px] rounded-full bg-[#F4B000]/5 blur-[120px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#FFC83D] uppercase block">Sports Metabolic Science</span>
            <h2 className="text-display text-4xl font-black leading-tight mt-2 uppercase">The Glycemic Curve Advantage</h2>
            <p className="mt-3 text-sm text-gray-400 font-medium leading-relaxed">
              Tapping into raw forest honey provides a stable energy release, protecting your cells from extreme insulin stress.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Left: Graphic Card */}
            <div className="lg:col-span-7 bg-[#241B12]/80 border border-[#F4B000]/10 p-6 md:p-8 rounded-[36px] shadow-2xl relative">
              <div className="flex flex-wrap gap-3 mb-8">
                <button 
                  onClick={() => setActiveCurve("spoowa")}
                  className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-black tracking-wider uppercase transition-all duration-300 border ${
                    activeCurve === "spoowa"
                      ? "bg-[#F4B000] text-[#1A120B] border-[#F4B000] shadow-[0_4px_20px_rgba(244,176,0,0.3)]"
                      : "bg-[#1A120B] text-gray-400 border-gray-800 hover:border-gray-700"
                  }`}
                >
                  🍯 SPOOWA Honey base
                </button>
                <button 
                  onClick={() => setActiveCurve("standard")}
                  className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-black tracking-wider uppercase transition-all duration-300 border ${
                    activeCurve === "standard"
                      ? "bg-red-500 text-white border-red-500 shadow-[0_4px_20px_rgba(239,68,68,0.3)]"
                      : "bg-[#1A120B] text-gray-400 border-gray-800 hover:border-gray-700"
                  }`}
                >
                  🥤 Refined Sugars / HFCS
                </button>
              </div>

              {/* The SVG energy chart */}
              <div className="relative w-full h-[280px]">
                <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible">
                  {/* Grid lines */}
                  <line x1="50" y1="20" x2="50" y2="240" stroke="#374151" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="50" y1="240" x2="580" y2="240" stroke="#4B5563" strokeWidth="2" />
                  
                  {/* Axis labels */}
                  <text x="25" y="130" transform="rotate(-90 25 130)" className="text-[10px] fill-gray-500 font-extrabold uppercase tracking-widest" textAnchor="middle">Blood Glucose</text>
                  <text x="315" y="270" className="text-[10px] fill-gray-500 font-extrabold uppercase tracking-widest text-center" textAnchor="middle">Hours Post-consumption</text>
                  
                  {/* Hours tick marks */}
                  <text x="50" y="255" className="text-[11px] fill-gray-400 font-bold" textAnchor="middle">0</text>
                  <text x="180" y="255" className="text-[11px] fill-gray-400 font-bold" textAnchor="middle">1h</text>
                  <text x="310" y="255" className="text-[11px] fill-gray-400 font-bold" textAnchor="middle">2h</text>
                  <text x="440" y="255" className="text-[11px] fill-gray-400 font-bold" textAnchor="middle">3h</text>
                  <text x="570" y="255" className="text-[11px] fill-gray-400 font-bold" textAnchor="middle">4h</text>

                  {/* Fasting baseline */}
                  <line x1="50" y1="200" x2="580" y2="200" stroke="#4B5563" strokeWidth="1" strokeDasharray="4 4" />
                  <text x="530" y="192" className="text-[9px] fill-gray-500 font-black uppercase tracking-wider" textAnchor="end">Base energy</text>

                  {/* Crash Zone */}
                  <rect x="50" y="200" width="530" height="40" fill="url(#fatigue-glow)" opacity="0.1" />
                  <text x="60" y="222" className="text-[9px] fill-red-400/80 font-black uppercase tracking-widest">Cellular fatigue / Crash zone</text>

                  <defs>
                    <linearGradient id="fatigue-glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Standard path */}
                  <motion.path
                    d="M 50 200 Q 120 40 160 60 T 230 230 Q 300 215 580 215"
                    fill="none"
                    stroke={activeCurve === 'standard' ? '#EF4444' : '#374151'}
                    strokeWidth={activeCurve === 'standard' ? 4 : 2}
                    className={activeCurve === 'standard' ? 'glow-red' : ''}
                    strokeDasharray={activeCurve === 'standard' ? '0' : '3 3'}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Spoowa path */}
                  <motion.path
                    d="M 50 200 C 120 160, 150 110, 240 110 C 330 110, 420 110, 480 140 C 530 165, 560 190, 580 200"
                    fill="none"
                    stroke={activeCurve === 'spoowa' ? '#F4B000' : '#374151'}
                    strokeWidth={activeCurve === 'spoowa' ? 4 : 2}
                    className={activeCurve === 'spoowa' ? 'glow-gold' : ''}
                    strokeDasharray={activeCurve === 'spoowa' ? '0' : '3 3'}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Dynamic indicator dots */}
                  {activeCurve === 'spoowa' && (
                    <motion.circle
                      cx="240"
                      cy="110"
                      r="6"
                      fill="#F4B000"
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  {activeCurve === 'standard' && (
                    <motion.circle
                      cx="230"
                      cy="230"
                      r="6"
                      fill="#EF4444"
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </svg>
              </div>
            </div>

            {/* Right: Info Card */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCurve}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <span 
                      style={{ color: curvesData[activeCurve].color }} 
                      className="text-xs font-black uppercase tracking-widest"
                    >
                      {activeCurve === "spoowa" ? "🍯 Stable Carbohydrates" : "⚠️ High Glycemic Spike"}
                    </span>
                    <h3 className="text-2xl font-black mt-1 uppercase leading-tight">
                      {curvesData[activeCurve].name}
                    </h3>
                    <p className="mt-3 text-xs text-gray-400 font-semibold leading-relaxed">
                      {curvesData[activeCurve].description}
                    </p>
                  </div>

                  {/* Stats list */}
                  <div className="grid gap-3 bg-[#241B12]/50 border border-white/5 rounded-3xl p-5">
                    {[
                      { label: "Peak Glycemic Index", val: curvesData[activeCurve].peakGI },
                      { label: "Glucose Crash Risk", val: curvesData[activeCurve].crashPoint },
                      { label: "Sustained Energy Window", val: curvesData[activeCurve].energyWindow },
                      { label: "Digestive Load Profile", val: curvesData[activeCurve].digestiveLoad },
                      { label: "Insulin Surge Response", val: curvesData[activeCurve].insulinShock }
                    ].map((st) => (
                      <div key={st.label} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0">
                        <span className="text-gray-400 font-bold">{st.label}</span>
                        <span className="font-extrabold text-white text-right">{st.val}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: INGREDIENT EXPLORER ── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#D88A00] uppercase block">Interactive Formulation</span>
          <h2 className="text-display text-4xl font-black text-[#2B1D12] mt-2 uppercase">Ingredient Hotspot Explorer</h2>
          <p className="mt-3 text-sm text-gray-500 font-semibold">
            Click on any flashing hotspot to inspect the sports science and biochemical selection criteria.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Left / Center Can with hotspots */}
          <div className="lg:col-span-6 flex justify-center relative bg-gradient-to-b from-orange-50/20 to-transparent py-10 rounded-[48px] border border-gray-100">
            
            {/* Ambient gold radial behind the can */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,176,0,0.14),transparent_50%)] pointer-events-none" />

            {/* Central Product Can asset */}
            <div className="relative max-w-[280px]">
              <img 
                src={productCan} 
                alt="SPOOWA Can Model" 
                className="w-full h-auto object-contain filter drop-shadow-[0_10px_30px_rgba(43,29,18,0.12)] animate-float" 
              />

              {/* Hotspots overlays */}
              {hotspots.map((hs) => (
                <button
                  key={hs.id}
                  onClick={() => setActiveHotspot(hs.id)}
                  style={{ top: hs.y, left: hs.x }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group z-20"
                >
                  <span className="relative flex h-5 w-5">
                    {/* Ring ping */}
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-gradient-to-r ${hs.color}`} />
                    {/* Center dot */}
                    <span className={`relative inline-flex rounded-full h-5 w-5 items-center justify-center border-2 border-white shadow-md bg-gradient-to-r ${hs.color} ${
                      activeHotspot === hs.id ? "scale-125" : "hover:scale-115"
                    } transition-transform`} />
                  </span>

                  {/* Tooltip labels */}
                  <span className="absolute left-1/2 -translate-x-1/2 top-7 whitespace-nowrap bg-[#2B1D12] text-[#FFF8E8] text-[9px] font-black uppercase px-2.5 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {hs.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Ingredient card display */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {hotspots.map((hs) => hs.id === activeHotspot && (
                <motion.div
                  key={hs.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-gray-150 p-8 rounded-[40px] shadow-card relative overflow-hidden"
                >
                  {/* Subtle corner icon representation */}
                  <div className="absolute top-8 right-8 text-6xl opacity-10 pointer-events-none select-none">
                    {hs.id === "honey" ? "🍯" : hs.id === "electrolytes" ? "⚡" : hs.id === "monkfruit" ? "🌿" : "🧪"}
                  </div>

                  <span className="inline-block rounded-full bg-[#FFF8E8] border border-[#F4B000]/20 text-[#D88A00] px-3.5 py-1 text-[9px] font-extrabold tracking-wider uppercase mb-5">
                    {hs.short}
                  </span>
                  
                  <h3 className="text-display text-2xl font-black text-[#2B1D12] leading-tight block mb-4 uppercase">
                    {hs.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 font-semibold leading-relaxed">
                    {hs.details}
                  </p>

                  <div className="mt-8 flex gap-6 border-t border-gray-50 pt-6">
                    <div className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 bg-emerald-100 text-emerald-600 rounded-full p-0.5" strokeWidth={3} />
                      <span className="text-xs font-bold text-gray-600">CFTRI Approved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5 bg-emerald-100 text-emerald-600 rounded-full p-0.5" strokeWidth={3} />
                      <span className="text-xs font-bold text-gray-600">100% Raw Bio-avail</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: VIBE MATCHER WIDGET (Direct Integration with shop products) ── */}
      <section id="vibe-matcher" className="bg-[#FFFDF5] border-y border-gray-100/50 py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[20%] left-[-15%] w-[450px] h-[450px] rounded-full bg-[#F4B000]/5 blur-[120px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#D88A00] uppercase block">Tailor Your Stamina</span>
            <h2 className="text-display text-4xl font-black text-[#2B1D12] mt-2 uppercase">Workout Vibe Matcher</h2>
            <p className="mt-3 text-sm text-gray-500 font-semibold">
              Select your activity type to match with our optimal honey formulation and see instant biochemical stats.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Left Column: Activity Selectors */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] font-extrabold tracking-widest text-gray-400 uppercase block mb-2">Step 1: Choose Activity</span>
              <div className="grid grid-cols-2 gap-3">
                {activities.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => setSelectedActivity(act.id)}
                    className={`flex flex-col items-center justify-center p-5 rounded-[28px] border-2 transition-all duration-300 ${
                      selectedActivity === act.id
                        ? "bg-white border-[#F4B000] text-[#D88A00] shadow-[0_10px_30px_rgba(244,176,0,0.08)] scale-102"
                        : "bg-white/60 border-gray-100 hover:border-gray-200 text-gray-600"
                    }`}
                  >
                    <span className="text-3xl block mb-2">{act.icon}</span>
                    <span className="text-xs font-black uppercase tracking-wider">{act.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Matched Product Card Display */}
            <div className="lg:col-span-7">
              <span className="text-[10px] font-extrabold tracking-widest text-gray-400 uppercase block mb-4">Step 2: Your Metabolic Match</span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedActivity}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, type: "spring", stiffness: 90 }}
                  className={`border border-gray-150 p-6 md:p-8 rounded-[40px] bg-white shadow-card grid sm:grid-cols-12 gap-8 items-center ${currentMatch.color}`}
                >
                  {/* Image render wrapper */}
                  <div className="sm:col-span-5 flex justify-center bg-white rounded-3xl p-4 border border-gray-100/50 shadow-inner">
                    <img 
                      src={currentMatch.image} 
                      alt={currentMatch.name}
                      className="max-h-[180px] w-auto object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.06)] hover:scale-105 transition-transform" 
                    />
                  </div>

                  {/* Details */}
                  <div className="sm:col-span-7 space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-1">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-extrabold">{currentMatch.rating}</span>
                        <span className="text-gray-400">({currentMatch.reviews} reviews)</span>
                      </div>
                      <h3 className="text-display text-2xl font-black text-gray-900 leading-tight">{currentMatch.name}</h3>
                      <span className="text-xs text-gray-400 font-semibold">{currentMatch.tagline}</span>
                    </div>

                    <p className="text-xs text-gray-500 font-medium leading-relaxed bg-white/70 p-3.5 rounded-2xl border border-gray-100">
                      <strong>Why:</strong> {currentMatch.why}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {currentMatch.features.map((f, i) => (
                        <span key={i} className="text-[9px] font-extrabold bg-[#2B1D12]/5 text-[#2B1D12] border border-[#2B1D12]/10 px-2.5 py-1 rounded-full uppercase">
                          ✓ {f}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 font-bold uppercase block">Price</span>
                        <span className="text-xl font-black text-[#2B1D12]">₹{currentMatch.price}</span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(currentMatch.productId, currentMatch.name)}
                        disabled={addingToCart[currentMatch.productId]}
                        className={`flex items-center gap-2 rounded-full px-5 py-3 text-xs font-black tracking-widest uppercase transition-all shadow-sm ${currentMatch.btnColor}`}
                      >
                        {addingToCart[currentMatch.productId] ? (
                          <span>Adding...</span>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4" /> Add Match to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: INTERACTIVE TIMELINE / JOURNAL ── */}
      <section className="py-24 bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#D88A00] uppercase block">The Journey</span>
            <h2 className="text-display text-4xl font-black text-[#2B1D12] mt-2 uppercase">Evolution Timeline</h2>
            <p className="mt-3 text-sm text-gray-500 font-semibold">
              Explore how we grew from a local home-kitchen concept to a nationally certified brand.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Timeline Slider Buttons */}
            <div className="relative flex justify-between items-center mb-10 max-w-md mx-auto">
              {/* Connector line */}
              <div className="absolute inset-x-0 h-1 bg-gray-100 top-1/2 -translate-y-1/2 z-0" />
              
              {/* Selection progress */}
              <div 
                style={{ 
                  width: activeYear === 2023 ? "0%" : activeYear === 2024 ? "33%" : activeYear === 2025 ? "66%" : "100%",
                  transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
                className="absolute left-0 h-1 bg-[#F4B000] top-1/2 -translate-y-1/2 z-0" 
              />

              {[2023, 2024, 2025, 2026].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setActiveYear(yr)}
                  className={`relative z-10 w-12 h-12 rounded-full grid place-items-center font-display text-sm font-black transition-all ${
                    activeYear === yr
                      ? "bg-[#2B1D12] text-white ring-4 ring-[#F4B000]/30 shadow-md scale-110"
                      : "bg-white border border-gray-150 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>

            {/* Slider Content */}
            <AnimatePresence mode="wait">
              {Object.keys(timelineMilestones).map((yr) => parseInt(yr) === activeYear && (
                <motion.div
                  key={yr}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-[#FFFDF5] to-white border border-gray-150 p-8 rounded-[36px] shadow-card text-center"
                >
                  <span className="text-[10px] font-extrabold tracking-widest text-[#D4AF37] uppercase bg-[#FFFDF0] border border-[#F4B000]/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
                    🎯 Milestone Indicator: {timelineMilestones[yr].metric}
                  </span>
                  <h3 className="text-display text-2xl font-black text-gray-900 mb-3 uppercase">
                    {timelineMilestones[yr].title}
                  </h3>
                  <p className="text-sm text-gray-500 font-semibold leading-relaxed max-w-xl mx-auto">
                    {timelineMilestones[yr].desc}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: SCIENTIFIC CERTIFICATION & TRUST CARDS ── */}
      <section className="bg-gradient-to-b from-white to-[#FFFDF7] border-t border-gray-100/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#D88A00] uppercase block">Adherence & Validation</span>
            <h2 className="text-display text-4xl font-black text-[#2B1D12] mt-2 uppercase">Certifications & Seals</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {certifications.map((c) => (
              <div
                key={c.title}
                onClick={() => setCertDetail(c)}
                className="bg-white border border-gray-150 rounded-[32px] p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-extrabold tracking-wide uppercase px-2.5 py-1 rounded-full bg-[#FFFDF0] border border-[#F4B000]/15 text-[#D88A00]">
                      {c.badge}
                    </span>
                    <Info className="h-4.5 w-4.5 text-gray-400 hover:text-gray-600" />
                  </div>
                  <h3 className="text-base font-black text-gray-900 uppercase tracking-tight block mb-2">{c.title}</h3>
                  <p className="text-xs text-gray-500 font-semibold leading-relaxed">{c.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center text-[10px] font-black text-[#D88A00] uppercase tracking-wider">
                  Read Science Verification <ChevronRight className="h-3 w-3 ml-0.5" />
                </div>
              </div>
            ))}
          </div>

          {/* Centered Spefl Council Logo representation */}
          <div className="mt-16 flex flex-col items-center justify-center bg-[#2B1D12] p-8 sm:p-12 rounded-[40px] shadow-lg text-white max-w-4xl mx-auto overflow-hidden relative">
            {/* Ambient subtle glow background */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#F4B000]/10 blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="bg-white rounded-3xl p-4 flex items-center justify-center shadow-md shrink-0 w-28 h-28">
                <img src={logoSpefl} alt="SPEFL Council Logo" className="w-full h-auto object-contain" />
              </div>
              <div>
                <span className="inline-block rounded-full bg-white/10 text-[#FFC83D] border border-[#F4B000]/30 px-3.5 py-1 text-[9px] font-extrabold tracking-wider uppercase mb-3.5">
                  Sports Skill Council
                </span>
                <h3 className="text-xl font-black uppercase mb-2">Sports Academy Alignment</h3>
                <p className="text-xs text-white/60 font-semibold leading-relaxed">
                  SPOOWA formulations are designed under the mentorship of sports medicine professionals, aligned with active guidelines to scale safe sports hydration throughout university camps, athletics facilities, and coaching academies across India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODAL OVERLAY FOR CERTIFICATION DETAIL ── */}
      <AnimatePresence>
        {certDetail && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCertDetail(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              className="fixed left-4 right-4 top-1/2 -translate-y-1/2 mx-auto max-w-lg bg-[#1A120B] border border-[#F4B000]/25 rounded-[40px] p-8 shadow-2xl z-50 text-white"
            >
              <button 
                onClick={() => setCertDetail(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Award className="h-6 w-6 text-[#FFC83D]" />
                <span className="text-[10px] font-extrabold tracking-widest text-[#FFC83D] uppercase">
                  {certDetail.badge}
                </span>
              </div>

              <h3 className="text-display text-2xl font-black uppercase mb-4 leading-tight">
                {certDetail.title}
              </h3>

              <p className="text-xs text-gray-400 font-semibold leading-relaxed mb-6">
                {certDetail.more}
              </p>

              <button
                onClick={() => setCertDetail(null)}
                className="w-full py-4 text-xs font-black tracking-widest uppercase bg-[#F4B000] text-[#1A120B] rounded-full hover:bg-[#FFC83D] transition-colors"
              >
                Acknowledge Verification
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
