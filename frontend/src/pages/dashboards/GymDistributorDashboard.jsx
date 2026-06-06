import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import DataTable from "@/components/dashboard/DataTable";
import { getGymDistributorDashboard } from "@/services/api";
import { TrendingUp, Dumbbell, Users, ShoppingBag, Wallet, Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function GymDistributorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const result = await getGymDistributorDashboard();
      setData(result);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout badge="Gym Distributor" title="Loading...">
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
      badge="Gym Distributor Portal"
      title={profile.facility_name || "Gym Distributor"}
      subtitle={
        <span className="flex items-center gap-3 flex-wrap">
          <span>Referral Code: <span className="font-extrabold text-[#D88A00]">{profile.referral_code}</span></span>
          <button onClick={() => { navigator.clipboard.writeText(profile.referral_code || ""); toast.success("Copied!"); }}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-[#D88A00] transition-colors">
            <Copy className="h-3 w-3" /> Copy
          </button>
          {profile.city_distributor_city && (
            <span className="text-[10px] font-semibold text-gray-400">| City: <span className="text-gray-600">{profile.city_distributor_city}</span></span>
          )}
        </span>
      }
    >
      {/* KPIs */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-10">
        <StatsCard index={0} label="Revenue" value={`₹${Number(stats.revenue || 0).toLocaleString('en-IN')}`} icon={TrendingUp} colorClass="from-amber-50 to-amber-100/50 border-amber-200/25" />
        <StatsCard index={1} label="Commission" value={`₹${Number(stats.commission || 0).toLocaleString('en-IN')}`} icon={Wallet} colorClass="from-green-50 to-green-100/50 border-green-200/25" />
        <StatsCard index={2} label="Trainers" value={stats.trainers || 0} icon={Dumbbell} colorClass="from-purple-50 to-purple-100/50 border-purple-200/25" />
        <StatsCard index={3} label="Customers" value={stats.customers || 0} icon={Users} colorClass="from-blue-50 to-blue-100/50 border-blue-200/25" />
        <StatsCard index={4} label="Orders" value={stats.orders || 0} icon={ShoppingBag} colorClass="from-pink-50 to-pink-100/50 border-pink-200/25" />
      </div>

      {/* Trainer Performance */}
      <div className="mb-10">
        <DataTable
          title="Trainer Performance"
          subtitle="Your trainers"
          columns={[
            { key: "trainer_name", label: "Trainer", className: "text-xs font-black text-gray-800" },
            { key: "referral_code", label: "Code", className: "text-xs font-bold text-[#D88A00]" },
            { key: "order_count", label: "Orders", className: "text-xs font-bold text-gray-600" },
            { key: "revenue", label: "Revenue", className: "text-xs font-black text-gray-900", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
          ]}
          data={data?.trainer_performance || []}
          emptyMessage="No trainers yet. Share your referral code!"
        />
      </div>

      {/* Product Sales & Recent Orders */}
      <div className="grid gap-8 lg:grid-cols-2">
        <DataTable
          title="Product-Wise Sales"
          subtitle="Within your network"
          columns={[
            { key: "name", label: "Product", className: "text-xs font-black text-gray-800" },
            { key: "quantity", label: "Units", className: "text-xs font-bold text-gray-600" },
            { key: "revenue", label: "Revenue", className: "text-xs font-black text-[#D88A00]", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
          ]}
          data={data?.product_sales || []}
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
    </DashboardLayout>
  );
}
