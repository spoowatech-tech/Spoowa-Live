import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import DataTable from "@/components/dashboard/DataTable";
import { getTrainerDashboardData } from "@/services/api";
import { TrendingUp, Users, ShoppingBag, Wallet, Copy, Percent } from "lucide-react";
import toast from "react-hot-toast";

export default function TrainerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const result = await getTrainerDashboardData();
      setData(result);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout badge="Trainer" title="Loading...">
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 rounded-full border-3 border-[#F4B000] border-t-transparent animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const profile = data?.profile || {};
  const stats = data?.stats || {};

  return (
    <DashboardLayout
      badge="Trainer Portal"
      title={profile.name || "Trainer Dashboard"}
      subtitle={
        <span className="flex items-center gap-3 flex-wrap">
          {profile.gym_name && <span>Gym: <span className="font-extrabold text-gray-700">{profile.gym_name}</span></span>}
          <span>Type: <span className="font-extrabold text-gray-700 capitalize">{(profile.trainer_type || '').replace(/_/g, ' ')}</span></span>
        </span>
      }
    >
      {/* Referral Code Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#2B1D12] to-[#3D2A1A] rounded-3xl p-6 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <p className="text-[10px] font-extrabold tracking-widest text-[#F4B000] uppercase mb-1">Your Referral Code</p>
          <p className="text-3xl font-black text-white tracking-wider">{stats.referral_code || 'N/A'}</p>
          <p className="text-xs text-white/50 font-semibold mt-1">Share this with customers to link them to your network</p>
        </div>
        <button
          onClick={() => { navigator.clipboard.writeText(stats.referral_code || ""); toast.success("Referral code copied!"); }}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#F4B000] text-[#2B1D12] text-xs font-black uppercase tracking-widest hover:bg-[#E59700] transition-colors shrink-0"
        >
          <Copy className="h-4 w-4" /> Copy Code
        </button>
      </motion.div>

      {/* KPIs */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatsCard index={0} label="Revenue" value={`₹${Number(stats.revenue || 0).toLocaleString('en-IN')}`} icon={TrendingUp} colorClass="from-amber-50 to-amber-100/50 border-amber-200/25" />
        <StatsCard index={1} label="Total Commission" value={`₹${Number(stats.total_commission || 0).toLocaleString('en-IN')}`} description={`Pending: ₹${Number(stats.pending_commission || 0).toLocaleString('en-IN')}`} icon={Wallet} colorClass="from-green-50 to-green-100/50 border-green-200/25" />
        <StatsCard index={2} label="Customers" value={stats.customers || 0} icon={Users} colorClass="from-blue-50 to-blue-100/50 border-blue-200/25" />
        <StatsCard index={3} label="Orders" value={stats.orders || 0} icon={ShoppingBag} colorClass="from-pink-50 to-pink-100/50 border-pink-200/25" />
      </div>

      {/* Top Customers & Recent Orders */}
      <div className="grid gap-8 lg:grid-cols-2 mb-10">
        <DataTable
          title="Top Customers"
          subtitle="By total spend"
          columns={[
            { key: "name", label: "Customer", className: "text-xs font-black text-gray-800" },
            { key: "total_orders", label: "Orders", className: "text-xs font-bold text-gray-600" },
            { key: "sales_total", label: "Total Spend", className: "text-xs font-black text-[#D88A00]", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
          ]}
          data={stats.top_customers || []}
          emptyMessage="No customers yet"
        />
        <DataTable
          title="Recent Orders"
          subtitle="Latest transactions"
          columns={[
            { key: "customer_name", label: "Customer", className: "text-xs font-bold text-gray-800" },
            { key: "total", label: "Amount", className: "text-xs font-black text-gray-900", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
            { key: "status", label: "Status", render: (v) => (
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${v === 'delivered' || v === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}`}>{v}</span>
            )},
          ]}
          data={data?.recent_orders || []}
        />
      </div>

      {/* Purchase Frequency */}
      {(data?.purchase_frequency || []).length > 0 && (
        <div className="bg-white border border-gray-150 rounded-[36px] p-6 sm:p-8 shadow-sm">
          <span className="text-[10px] font-extrabold tracking-widest text-gray-400 uppercase block mb-1">Trends</span>
          <h3 className="text-xl font-black text-[#2B1D12] uppercase leading-tight mb-6">Purchase Frequency</h3>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {data.purchase_frequency.map((item) => (
              <div key={item.month} className="rounded-2xl border border-gray-100 p-4 bg-gray-50/50 text-center">
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">{item.month}</p>
                <p className="text-xl font-black text-gray-900 mt-1">{item.orders}</p>
                <p className="text-[10px] font-bold text-[#D88A00]">₹{Number(item.revenue || 0).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
