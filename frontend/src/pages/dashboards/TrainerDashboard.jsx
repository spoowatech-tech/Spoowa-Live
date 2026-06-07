import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import DataTable from "@/components/dashboard/DataTable";
import { getTrainerDashboardData } from "@/services/api";
import {
  LayoutDashboard, Users, BarChart3,
  TrendingUp, ShoppingBag, Wallet, Copy
} from "lucide-react";
import toast from "react-hot-toast";

const MENU = [
  { key: "overview", label: "Dashboard", icon: LayoutDashboard },
  { key: "customers", label: "Customers", icon: Users },
  { key: "trends", label: "Trends", icon: BarChart3 },
];

export default function TrainerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    try {
      const result = await getTrainerDashboardData();
      setData(result);
    } catch (err) { console.error("Dashboard load error:", err); }
    finally { setLoading(false); }
  }

  if (loading) {
    return (
      <DashboardLayout brandSubtitle="TRAINER" menuItems={MENU} activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className="flex justify-center items-center h-64">
          <div className="h-10 w-10 rounded-full border-3 border-[#F4B000] border-t-transparent animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const profile = data?.profile || {};
  const stats = data?.stats || {};

  return (
    <DashboardLayout
      brandSubtitle="TRAINER PORTAL"
      pageTitle={profile.name || "Trainer Dashboard"}
      menuItems={MENU}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      headerActions={
        <button
          onClick={() => { navigator.clipboard.writeText(stats.referral_code || ""); toast.success("Referral code copied!"); }}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-[#FFF8E8] hover:text-[#D88A00] transition-colors"
        >
          <Copy className="h-3.5 w-3.5" /> {stats.referral_code || "N/A"}
        </button>
      }
    >
      {activeTab === "overview" && (
        <>
          {/* Referral Code Banner */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#2B1D12] to-[#3D2A1A] rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div>
              <p className="text-[10px] font-bold tracking-wider text-[#F4B000] uppercase mb-0.5">Your Referral Code</p>
              <p className="text-2xl font-black text-white tracking-wider">{stats.referral_code || 'N/A'}</p>
              <p className="text-xs text-white/50 font-medium mt-0.5">Share with customers to link them to your network</p>
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(stats.referral_code || ""); toast.success("Copied!"); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F4B000] text-[#2B1D12] text-xs font-bold hover:bg-[#E59700] transition-colors shrink-0"
            >
              <Copy className="h-3.5 w-3.5" /> Copy Code
            </button>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatsCard index={0} label="Revenue" value={`₹${Number(stats.revenue || 0).toLocaleString('en-IN')}`} icon={TrendingUp} />
            <StatsCard index={1} label="Commission" value={`₹${Number(stats.total_commission || 0).toLocaleString('en-IN')}`} description={`Pending: ₹${Number(stats.pending_commission || 0).toLocaleString('en-IN')}`} icon={Wallet} />
            <StatsCard index={2} label="Customers" value={stats.customers || 0} icon={Users} />
            <StatsCard index={3} label="Orders" value={stats.orders || 0} icon={ShoppingBag} />
          </div>

          <DataTable
            title="Recent Orders"
            subtitle="Latest transactions"
            columns={[
              { key: "customer_name", label: "Customer", className: "text-xs font-semibold text-gray-800" },
              { key: "total", label: "Amount", className: "text-xs font-bold text-gray-900", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
              { key: "status", label: "Status", render: (v) => (
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${v === 'delivered' || v === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-yellow-50 text-yellow-700'}`}>{v}</span>
              )},
            ]}
            data={data?.recent_orders || []}
          />
        </>
      )}

      {activeTab === "customers" && (
        <DataTable
          title="Top Customers"
          subtitle="By total spend"
          columns={[
            { key: "name", label: "Customer", className: "text-xs font-bold text-gray-800" },
            { key: "total_orders", label: "Orders", className: "text-xs text-gray-600" },
            { key: "sales_total", label: "Total Spend", className: "text-xs font-bold text-[#D88A00]", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
          ]}
          data={stats.top_customers || []}
          emptyMessage="No customers yet"
        />
      )}

      {activeTab === "trends" && (
        <>
          {(data?.purchase_frequency || []).length > 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-base font-black text-[#2B1D12] mb-4">Purchase Frequency</h3>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {data.purchase_frequency.map((item) => (
                  <div key={item.month} className="rounded-xl border border-gray-100 p-3 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{item.month}</p>
                    <p className="text-xl font-black text-gray-900 mt-1">{item.orders}</p>
                    <p className="text-[10px] font-semibold text-[#D88A00]">₹{Number(item.revenue || 0).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
              <BarChart3 className="h-10 w-10 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400 font-medium">No trend data yet</p>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
