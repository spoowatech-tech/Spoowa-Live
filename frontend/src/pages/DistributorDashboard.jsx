import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Truck, ShieldCheck, Box, Users, ChevronRight, TrendingUp,
  Clock, CheckCircle2, Play, Info, ArrowUpRight, BarChart3, Landmark, Sparkles
} from "lucide-react";
import toast from "react-hot-toast";

export default function DistributorDashboard() {
  const [dispatchQueue, setDispatchQueue] = useState([
    { id: "DISP-4902", store: "Glow Fitness Gym", location: "Koramangala, BLR", items: "120 Cases (Citrus Burst)", date: "Today, 10:15 AM", status: "pending" },
    { id: "DISP-4891", store: "Velo Cycling Arena", location: "Whitefield, BLR", items: "80 Cases (Tropical Tide)", date: "Today, 08:30 AM", status: "pending" },
    { id: "DISP-4852", store: "Boxers Den Bengaluru", location: "Indiranagar, BLR", items: "240 Cases (Berry Blitz)", date: "Yesterday", status: "pending" },
    { id: "DISP-4720", store: "Total Wellness Hub", location: "Jayanagar, BLR", items: "60 Cases (Melon Mist)", date: "June 03, 2026", status: "dispatched" }
  ]);

  const subRetailers = [
    { name: "Glow Fitness Gym", location: "Koramangala, BLR", orders: 14, sales: "₹4,20,000", override: "₹33,600", status: "active" },
    { name: "Velo Cycling Arena", location: "Whitefield, BLR", orders: 12, sales: "₹3,90,000", override: "₹31,200", status: "active" },
    { name: "Boxers Den Bengaluru", location: "Indiranagar, BLR", orders: 22, sales: "₹7,80,000", override: "₹62,400", status: "active" },
    { name: "Fit & Flex Studio", location: "Sadashivanagar, BLR", orders: 8, sales: "₹2,10,000", override: "₹16,800", status: "active" }
  ];

  const handleDispatch = (dispatchId) => {
    setDispatchQueue(prev => 
      prev.map(item => item.id === dispatchId ? { ...item, status: "dispatched" } : item)
    );
    toast.success(`Shipment ${dispatchId} marked as DISPATCHED! 🚚`, {
      style: {
        background: '#1A120B',
        color: '#FFF8E8',
        border: '1px solid #F4B000',
        fontWeight: 'bold',
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#110D08] text-white">
      <AnnouncementBar />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        
        {/* Glow ambient background orbs */}
        <div className="absolute top-[20%] left-[-15%] w-[500px] h-[500px] rounded-full bg-[#F4B000]/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-15%] w-[450px] h-[450px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />

        {/* Portal Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/5 pb-8 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FFC83D]/30 bg-amber-500/5 px-3.5 py-1 text-[10px] font-extrabold tracking-widest text-[#FFC83D] uppercase mb-3.5 shadow-sm">
              <Sparkles className="h-3 w-3" />
              <span>Distributor Logistics Console</span>
            </div>
            <h1 className="text-display text-4xl font-black text-white leading-tight uppercase tracking-tight">South-Zone Logistics</h1>
            <p className="text-xs text-white/50 font-semibold mt-1">
              Distributor ID: <span className="font-extrabold text-white/80">DB-8302</span> | Hub Status: <span className="font-extrabold text-[#FFC83D] uppercase">Platinum Partner (8% Override)</span>
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-xs font-black bg-white/5 border border-white/10 px-5 py-3 rounded-2xl text-white/80 flex items-center gap-1.5">
              <Landmark className="h-4.5 w-4.5 text-[#FFC83D]" /> Wallet Credit: ₹2,45,000
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {[
            { label: "Cases Shipped", val: "52,400 Cases", desc: "1 Case = 24 cans distributed", icon: Box, color: "border-white/5 bg-white/[0.02]" },
            { label: "Partner Retailers", val: "48 Stores", desc: "Active sub-retailer accounts", icon: Users, color: "border-white/5 bg-white/[0.02]" },
            { label: "Override Earnings", val: "₹1,96,000", desc: "8% margin override earned", icon: TrendingUp, color: "border-white/5 bg-white/[0.02]" },
            { label: "Fleet Shipments", val: "168 Deliveries", desc: "Completed dispatch operations", icon: Truck, color: "border-white/5 bg-white/[0.02]" },
          ].map((s) => (
            <div 
              key={s.label}
              className={`rounded-3xl border ${s.color} p-6 shadow-md hover:border-[#FFC83D]/20 transition-all`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest leading-none">{s.label}</span>
                <s.icon className="h-5 w-5 text-white/30" />
              </div>
              <p className="text-display text-3xl font-black text-white leading-none mt-4">{s.val}</p>
              <p className="mt-2.5 text-[10px] font-semibold text-white/45 uppercase tracking-wider">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Charts & Dispatch Split */}
        <div className="grid gap-8 lg:grid-cols-12 mb-10">
          
          {/* Left: SVG Warehouse Inventory Chart */}
          <div className="lg:col-span-6 bg-white/[0.02] border border-white/5 p-6 sm:p-8 rounded-[36px] shadow-2xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-white/40 uppercase block mb-1">Stock Status</span>
              <h3 className="text-xl font-black text-white uppercase leading-tight">Warehouse Inventory Levels</h3>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="w-full h-[220px] mt-6">
              <svg viewBox="0 0 500 220" className="w-full h-full overflow-visible">
                {/* Grid lines */}
                <line x1="40" y1="40" x2="480" y2="40" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="40" y1="90" x2="480" y2="90" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="40" y1="190" x2="480" y2="190" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />

                {/* Y-axis labels */}
                <text x="30" y="45" className="text-[9px] fill-white/40 font-black text-right" textAnchor="end">12K</text>
                <text x="30" y="95" className="text-[9px] fill-white/40 font-black text-right" textAnchor="end">8K</text>
                <text x="30" y="145" className="text-[9px] fill-white/40 font-black text-right" textAnchor="end">4K</text>
                <text x="30" y="195" className="text-[9px] fill-white/40 font-black text-right" textAnchor="end">0</text>

                {/* Bars - Melon Mist (4.2K), Citrus Burst (8.4K), Berry Blitz (12K), Tropical Tide (7.5K) */}
                
                {/* 1. Melon Mist (Green) */}
                <rect x="70" y="140" width="45" height="50" fill="#84CC16" opacity="0.85" rx="6" />
                <text x="92" y="130" className="text-[10px] fill-white font-black text-center" textAnchor="middle">4.2K</text>
                <text x="92" y="208" className="text-[10px] fill-white/60 font-bold text-center" textAnchor="middle">Melon</text>

                {/* 2. Citrus Burst (Gold) */}
                <rect x="170" y="90" width="45" height="100" fill="#F4B000" opacity="0.85" rx="6" />
                <text x="192" y="80" className="text-[10px] fill-white font-black text-center" textAnchor="middle">8.4K</text>
                <text x="192" y="208" className="text-[10px] fill-white/60 font-bold text-center" textAnchor="middle">Citrus</text>

                {/* 3. Berry Blitz (Pink) */}
                <rect x="270" y="40" width="45" height="150" fill="#EC4899" opacity="0.85" rx="6" />
                <text x="292" y="30" className="text-[10px] fill-white font-black text-center" textAnchor="middle">12K</text>
                <text x="292" y="208" className="text-[10px] fill-white/60 font-bold text-center" textAnchor="middle">Berry</text>

                {/* 4. Tropical Tide (Teal) */}
                <rect x="370" y="100" width="45" height="90" fill="#06B6D4" opacity="0.85" rx="6" />
                <text x="392" y="90" className="text-[10px] fill-white font-black text-center" textAnchor="middle">7.5K</text>
                <text x="392" y="208" className="text-[10px] fill-white/60 font-bold text-center" textAnchor="middle">Tide</text>
              </svg>
            </div>
          </div>

          {/* Right: Wholesale Dispatch Queue */}
          <div className="lg:col-span-6 bg-white/[0.02] border border-white/5 p-6 sm:p-8 rounded-[36px] shadow-2xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-white/40 uppercase block mb-1">Fulfillment queue</span>
              <h3 className="text-xl font-black text-white uppercase leading-tight">Pending Store Shipments</h3>
              
              <div className="mt-5 space-y-3">
                {dispatchQueue.map((disp) => (
                  <div key={disp.id} className="flex justify-between items-center p-3.5 border border-white/5 rounded-2xl bg-white/[0.01]">
                    <div className="flex gap-3 items-center">
                      <div className={`h-9 w-9 rounded-xl grid place-items-center ${
                        disp.status === "dispatched" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                      }`}>
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white">{disp.store}</p>
                        <p className="text-[10px] font-semibold text-white/40">{disp.items} | {disp.location}</p>
                      </div>
                    </div>
                    
                    {disp.status === "dispatched" ? (
                      <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400">
                        Dispatched ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDispatch(disp.id)}
                        className="text-[9px] font-black uppercase px-3 py-1.5 rounded-full bg-white text-[#110D08] hover:bg-[#FFC83D] transition-colors cursor-pointer"
                      >
                        Dispatch
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Registered Retailers Performance */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[36px] p-6 sm:p-8 shadow-2xl overflow-hidden">
          <div className="mb-6">
            <span className="text-[10px] font-extrabold tracking-widest text-white/40 uppercase block mb-1">Accounts Registry</span>
            <h3 className="text-xl font-black text-white uppercase leading-tight">Linked Sub-Retailers</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-medium border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-6 py-4.5 font-black text-white/60 text-xs uppercase tracking-wider rounded-l-2xl">Store Name</th>
                  <th className="px-6 py-4.5 font-black text-white/60 text-xs uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4.5 font-black text-white/60 text-xs uppercase tracking-wider">Orders Count</th>
                  <th className="px-6 py-4.5 font-black text-white/60 text-xs uppercase tracking-wider">Monthly Sales Volume</th>
                  <th className="px-6 py-4.5 font-black text-[#FFC83D] text-xs uppercase tracking-wider">Distributor Margin (8%)</th>
                  <th className="px-6 py-4.5 font-black text-white/60 text-xs uppercase tracking-wider rounded-r-2xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {subRetailers.map((store) => (
                  <tr key={store.name} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 font-black text-white">{store.name}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-white/50">{store.location}</td>
                    <td className="px-6 py-4 text-xs font-bold text-white/70">{store.orders}</td>
                    <td className="px-6 py-4 font-extrabold text-white">{store.sales}</td>
                    <td className="px-6 py-4 font-black text-[#FFC83D]">{store.override}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" /> {store.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
