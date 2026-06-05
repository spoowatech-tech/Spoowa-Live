import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  TrendingUp, Wallet, ShoppingBag, Percent, ArrowUpRight, 
  Download, Clock, CheckCircle2, ChevronRight, X, Sparkles, Building
} from "lucide-react";
import toast from "react-hot-toast";

export default function RetailerDashboard() {
  const [payoutModal, setPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("5000");
  const [payoutUpi, setPayoutUpi] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletBalance, setWalletBalance] = useState(18250);

  const [payoutLogs, setPayoutLogs] = useState([
    { id: "PAY-8041", date: "May 28, 2026", amount: "₹4,500", status: "completed", account: "UPI: store@pay" },
    { id: "PAY-7928", date: "May 10, 2026", amount: "₹8,200", status: "completed", account: "UPI: store@pay" },
    { id: "PAY-7649", date: "Apr 25, 2026", amount: "₹3,400", status: "completed", account: "UPI: store@pay" }
  ]);

  const recentSales = [
    { id: "ORD-9402", date: "June 05, 2026", client: "arun.kumar@gmail.com", items: "12 Cans (Citrus Burst)", amount: "₹4,990", commission: "₹598", status: "delivered" },
    { id: "ORD-9381", date: "June 04, 2026", client: "priya.nair@hotmail.com", items: "24 Cans (Berry Blitz)", amount: "₹9,980", commission: "₹1,197", status: "delivered" },
    { id: "ORD-9356", date: "June 02, 2026", client: "sneha_sharma@yahoo.com", items: "6 Cans (Melon Mist)", amount: "₹2,490", commission: "₹298", status: "delivered" },
    { id: "ORD-9294", date: "May 29, 2026", client: "vikram.singh@outlook.com", items: "18 Cans (Tropical Tide)", amount: "₹7,480", commission: "₹897", status: "delivered" }
  ];

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(payoutAmount);
    if (!payoutAmount || isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid payout amount");
      return;
    }
    if (amountNum > walletBalance) {
      toast.error("Requested amount exceeds wallet balance");
      return;
    }
    if (!payoutUpi.trim()) {
      toast.error("Please enter a valid UPI ID or Bank account details");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setWalletBalance(prev => prev - amountNum);
      const newLog = {
        id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
        date: "Today",
        amount: `₹${amountNum.toLocaleString('en-IN')}`,
        status: "pending",
        account: payoutUpi
      };
      setPayoutLogs(prev => [newLog, ...prev]);
      setIsSubmitting(false);
      setPayoutModal(false);
      toast.success("Withdrawal request submitted successfully! 🍯");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-page bg-[radial-gradient(circle_at_top_left,rgba(255,180,0,0.05),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.04),transparent_40%)]">
      <AnnouncementBar />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        
        {/* Portal Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-gray-150 pb-8 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#F4B000]/25 bg-[#FFFDF0] px-3.5 py-1 text-[10px] font-extrabold tracking-widest text-[#D4AF37] uppercase mb-3.5 shadow-sm">
              <Sparkles className="h-3 w-3 text-[#D4AF37]" />
              <span>Retailer Partner Portal</span>
            </div>
            <h1 className="text-display text-4xl font-black text-gray-900 leading-tight uppercase">Fitness Stop Bengaluru</h1>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              Store ID: <span className="font-extrabold text-gray-700">RT-29402</span> | Partner Status: <span className="font-extrabold text-amber-500 uppercase">Gold Tier (12% Comm.)</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setPayoutModal(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#2B1D12] text-white hover:bg-[#F4B000] hover:text-[#2B1D12] px-6 py-3 text-xs font-black tracking-widest uppercase transition-all shadow-sm cursor-pointer"
            >
              <Wallet className="h-4 w-4" /> Request Payout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {[
            { label: "Wallet Balance", val: `₹${walletBalance.toLocaleString('en-IN')}`, desc: "Available for withdrawal", icon: Wallet, color: "from-amber-50 to-amber-100/50 border-amber-200/25" },
            { label: "Total Sales Referred", val: "₹1,48,900", desc: "Lifetime referred sales", icon: ShoppingBag, color: "from-blue-50 to-blue-100/50 border-blue-200/25" },
            { label: "Total Volume Sold", val: "3,240 Cans", desc: "Units sold via link/portal", icon: TrendingUp, color: "from-emerald-50 to-emerald-100/50 border-emerald-200/25" },
            { label: "Commission Tier", val: "12%", desc: "Lifetime referral payout rate", icon: Percent, color: "from-pink-50 to-pink-100/50 border-pink-200/25" },
          ].map((s) => (
            <div 
              key={s.label}
              className={`rounded-3xl border bg-gradient-to-br ${s.color} p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest leading-none">{s.label}</span>
                <s.icon className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-display text-3xl font-black text-gray-900 leading-none mt-4">{s.val}</p>
              <p className="mt-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Analytics & Logs Split */}
        <div className="grid gap-8 lg:grid-cols-12 mb-10">
          
          {/* Left: SVG Sales Chart */}
          <div className="lg:col-span-8 bg-white border border-gray-150 p-6 sm:p-8 rounded-[36px] shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-gray-400 uppercase block mb-1">Weekly Earnings</span>
              <h3 className="text-xl font-black text-[#2B1D12] uppercase leading-tight">Sales Analytics</h3>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="w-full h-[220px] mt-6">
              <svg viewBox="0 0 600 220" className="w-full h-full overflow-visible">
                {/* Horizontal lines */}
                <line x1="40" y1="40" x2="580" y2="40" stroke="#F3F4F6" strokeWidth="1" />
                <line x1="40" y1="90" x2="580" y2="90" stroke="#F3F4F6" strokeWidth="1" />
                <line x1="40" y1="140" x2="580" y2="140" stroke="#F3F4F6" strokeWidth="1" />
                <line x1="40" y1="190" x2="580" y2="190" stroke="#E5E7EB" strokeWidth="2" />

                {/* Y-axis values */}
                <text x="30" y="45" className="text-[10px] fill-gray-400 font-extrabold text-right" textAnchor="end">₹15K</text>
                <text x="30" y="95" className="text-[10px] fill-gray-400 font-extrabold text-right" textAnchor="end">₹10K</text>
                <text x="30" y="145" className="text-[10px] fill-gray-400 font-extrabold text-right" textAnchor="end">₹5K</text>
                <text x="30" y="195" className="text-[10px] fill-gray-400 font-extrabold text-right" textAnchor="end">0</text>

                {/* X-axis labels */}
                <text x="50" y="212" className="text-[11px] fill-gray-500 font-bold" textAnchor="middle">Mon</text>
                <text x="135" y="212" className="text-[11px] fill-gray-500 font-bold" textAnchor="middle">Tue</text>
                <text x="220" y="212" className="text-[11px] fill-gray-500 font-bold" textAnchor="middle">Wed</text>
                <text x="305" y="212" className="text-[11px] fill-gray-500 font-bold" textAnchor="middle">Thu</text>
                <text x="390" y="212" className="text-[11px] fill-gray-500 font-bold" textAnchor="middle">Fri</text>
                <text x="475" y="212" className="text-[11px] fill-gray-500 font-bold" textAnchor="middle">Sat</text>
                <text x="560" y="212" className="text-[11px] fill-gray-500 font-bold" textAnchor="middle">Sun</text>

                {/* Golden Earnings Line Path */}
                {/* Points: Mon=170 (₹2K), Tue=150 (₹4K), Wed=100 (₹9K), Thu=120 (₹7K), Fri=70 (₹12K), Sat=50 (₹14K), Sun=40 (₹15K) */}
                <path
                  d="M 50 170 Q 135 150 220 100 T 305 120 T 390 70 T 475 50 T 560 40"
                  fill="none"
                  stroke="#F4B000"
                  strokeWidth="4"
                  className="glow-gold"
                />

                {/* Dots on nodes */}
                <circle cx="50" cy="170" r="5" fill="#2B1D12" stroke="#F4B000" strokeWidth="2" />
                <circle cx="220" cy="100" r="5" fill="#2B1D12" stroke="#F4B000" strokeWidth="2" />
                <circle cx="390" cy="70" r="5" fill="#2B1D12" stroke="#F4B000" strokeWidth="2" />
                <circle cx="560" cy="40" r="5" fill="#2B1D12" stroke="#F4B000" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Right: Wallet Payout Logs */}
          <div className="lg:col-span-4 bg-white border border-gray-150 p-6 sm:p-8 rounded-[36px] shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-gray-400 uppercase block mb-1">Log Files</span>
              <h3 className="text-xl font-black text-[#2B1D12] uppercase leading-tight">Payout History</h3>
              
              <div className="mt-5 space-y-3">
                {payoutLogs.map((log) => (
                  <div key={log.id} className="flex justify-between items-center p-3.5 border border-gray-100 rounded-2xl bg-gray-50/50">
                    <div className="flex gap-3 items-center">
                      <div className="h-9 w-9 bg-amber-500/10 text-amber-600 rounded-xl grid place-items-center">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-800">{log.amount}</p>
                        <p className="text-[10px] font-semibold text-gray-400">{log.date} | {log.account}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
                      log.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => toast.success("Payout details ledger downloaded!")}
              className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white/70 hover:border-gray-300 py-3 text-xs font-bold tracking-wider uppercase text-gray-700 transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" /> Export Ledger (.csv)
            </button>
          </div>
        </div>

        {/* Recent referred sales list */}
        <div className="bg-white border border-gray-150 rounded-[36px] p-6 sm:p-8 shadow-sm overflow-hidden">
          <div className="mb-6">
            <span className="text-[10px] font-extrabold tracking-widest text-gray-400 uppercase block mb-1">Referral metrics</span>
            <h3 className="text-xl font-black text-[#2B1D12] uppercase leading-tight">Recent Client Orders</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-medium border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-[#FFFDF7]">
                  <th className="px-6 py-4.5 font-black text-gray-800 text-xs uppercase tracking-wider rounded-l-2xl">Order ID</th>
                  <th className="px-6 py-4.5 font-black text-gray-800 text-xs uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4.5 font-black text-gray-800 text-xs uppercase tracking-wider">Client Email</th>
                  <th className="px-6 py-4.5 font-black text-gray-800 text-xs uppercase tracking-wider">Items Sold</th>
                  <th className="px-6 py-4.5 font-black text-gray-800 text-xs uppercase tracking-wider">Order Value</th>
                  <th className="px-6 py-4.5 font-black text-[#D88A00] text-xs uppercase tracking-wider">Commission</th>
                  <th className="px-6 py-4.5 font-black text-gray-800 text-xs uppercase tracking-wider rounded-r-2xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-black text-gray-800">{sale.id}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-500">{sale.date}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-700">{sale.client}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-600">{sale.items}</td>
                    <td className="px-6 py-4 font-extrabold text-gray-900">{sale.amount}</td>
                    <td className="px-6 py-4 font-black text-[#D88A00]">{sale.commission}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" /> {sale.status}
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

      {/* WITHDRAW PAYOUT MODAL */}
      <AnimatePresence>
        {payoutModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPayoutModal(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              className="fixed left-4 right-4 top-1/2 -translate-y-1/2 mx-auto max-w-md bg-white border border-gray-150 rounded-[36px] p-8 shadow-2xl z-50 text-gray-900"
            >
              <button 
                onClick={() => setPayoutModal(false)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors border border-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Wallet className="h-6 w-6 text-[#D88A00]" />
                <span className="text-[10px] font-extrabold tracking-widest text-[#D88A00] uppercase">
                  Wallet Withdrawal
                </span>
              </div>

              <h3 className="text-display text-2xl font-black uppercase mb-2 leading-tight">
                Request Payout
              </h3>
              <p className="text-xs text-gray-500 font-semibold mb-6">
                Your request will be validated and credited to your registered UPI or Bank account within 24 hours.
              </p>

              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">Withdraw Amount (₹)</label>
                  <input
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    max={walletBalance}
                    placeholder="Enter amount to withdraw"
                    className="w-full h-12 rounded-xl border-2 border-gray-200 bg-[#FAFAFA] px-4 text-sm font-bold text-[#111827] outline-none transition-all focus:bg-white focus:border-[#F4B000] focus:shadow-sm"
                  />
                  <span className="text-[10px] font-bold text-gray-400 block mt-1">Available balance: ₹{walletBalance.toLocaleString('en-IN')}</span>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">UPI ID or Bank Details</label>
                  <input
                    type="text"
                    value={payoutUpi}
                    onChange={(e) => setPayoutUpi(e.target.value)}
                    placeholder="e.g. store@upi or Bank Account details"
                    className="w-full h-12 rounded-xl border-2 border-gray-200 bg-[#FAFAFA] px-4 text-sm font-bold text-[#111827] outline-none transition-all focus:bg-white focus:border-[#F4B000] focus:shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-xs font-black tracking-widest uppercase bg-[#2B1D12] hover:bg-[#F4B000] hover:text-[#2B1D12] text-white rounded-full transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? "Processing Request..." : "Confirm Withdrawal"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
