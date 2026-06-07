import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import DataTable from "@/components/dashboard/DataTable";
import { getGymDistributorDashboard } from "@/services/api";
import {
  LayoutDashboard, Users, Package,
  TrendingUp, Dumbbell, ShoppingBag, Wallet, Copy
} from "lucide-react";
import toast from "react-hot-toast";

const MENU = [
  { key: "overview", label: "Dashboard", icon: LayoutDashboard },
  { key: "trainers", label: "Trainers", icon: Dumbbell },
  { key: "sales", label: "Sales & Orders", icon: Package },
];

export default function GymDistributorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    try {
      const result = await getGymDistributorDashboard();
      setData(result);
    } catch (err) { console.error("Dashboard load error:", err); }
    finally { setLoading(false); }
  }

  if (loading) {
    return (
      <DashboardLayout brandSubtitle="GYM DISTRIBUTOR" menuItems={MENU} activeTab={activeTab} setActiveTab={setActiveTab}>
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
      brandSubtitle="GYM DISTRIBUTOR"
      pageTitle={profile.facility_name || "Gym Distributor"}
      menuItems={MENU}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      headerActions={
        <button
          onClick={() => { navigator.clipboard.writeText(profile.referral_code || ""); toast.success("Copied!"); }}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-[#FFF8E8] hover:text-[#D88A00] transition-colors"
        >
          <Copy className="h-3.5 w-3.5" /> {profile.referral_code}
        </button>
      }
    >
      {activeTab === "overview" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
            <StatsCard index={0} label="Revenue" value={`₹${Number(stats.revenue || 0).toLocaleString('en-IN')}`} icon={TrendingUp} />
            <StatsCard index={1} label="Commission" value={`₹${Number(stats.commission || 0).toLocaleString('en-IN')}`} icon={Wallet} />
            <StatsCard index={2} label="Trainers" value={stats.trainers || 0} icon={Dumbbell} />
            <StatsCard index={3} label="Customers" value={stats.customers || 0} icon={Users} />
            <StatsCard index={4} label="Orders" value={stats.orders || 0} icon={ShoppingBag} />
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

      {activeTab === "trainers" && (
        <DataTable
          title="Trainer Performance"
          subtitle="Your trainers"
          columns={[
            { key: "trainer_name", label: "Trainer", className: "text-xs font-bold text-gray-800" },
            { key: "referral_code", label: "Code", className: "text-xs font-semibold text-[#D88A00]" },
            { key: "order_count", label: "Orders", className: "text-xs text-gray-600" },
            { key: "revenue", label: "Revenue", className: "text-xs font-bold text-gray-900", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
          ]}
          data={data?.trainer_performance || []}
          emptyMessage="No trainers yet. Share your referral code!"
        />
      )}

      {activeTab === "sales" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <DataTable
            title="Product-Wise Sales"
            subtitle="Within your network"
            columns={[
              { key: "name", label: "Product", className: "text-xs font-bold text-gray-800" },
              { key: "quantity", label: "Units", className: "text-xs text-gray-600" },
              { key: "revenue", label: "Revenue", className: "text-xs font-bold text-[#D88A00]", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
            ]}
            data={data?.product_sales || []}
          />
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
        </div>
      )}
    </DashboardLayout>
  );
}
