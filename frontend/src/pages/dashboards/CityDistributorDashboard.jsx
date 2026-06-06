import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import DataTable from "@/components/dashboard/DataTable";
import { getCityDistributorDashboard } from "@/services/api";
import { TrendingUp, Building2, Dumbbell, Users, ShoppingBag, Wallet, Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function CityDistributorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const result = await getCityDistributorDashboard();
      setData(result);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout badge="City Distributor" title="Loading...">
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 rounded-full border-3 border-[#F4B000] border-t-transparent animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const profile = data?.profile || {};
  const stats = data?.stats || {};
  const network = data?.network || { gyms: [], trainers: [], customers: [] };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(profile.referral_code || "");
    toast.success("Referral code copied!");
  };

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "network", label: "Network Tree" },
    { key: "products", label: "Product Sales" },
  ];

  return (
    <DashboardLayout
      badge="City Distributor Portal"
      title={profile.city_name || "City Distributor"}
      subtitle={
        <span className="flex items-center gap-3 flex-wrap">
          <span>Referral Code: <span className="font-extrabold text-[#D88A00]">{profile.referral_code}</span></span>
          <button onClick={copyReferralCode} className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-[#D88A00] transition-colors">
            <Copy className="h-3 w-3" /> Copy
          </button>
        </span>
      }
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.key ? "bg-[#2B1D12] text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-10">
            <StatsCard index={0} label="Revenue" value={`₹${Number(stats.revenue || 0).toLocaleString('en-IN')}`} icon={TrendingUp} colorClass="from-amber-50 to-amber-100/50 border-amber-200/25" />
            <StatsCard index={1} label="Gyms" value={stats.gyms || 0} icon={Building2} colorClass="from-blue-50 to-blue-100/50 border-blue-200/25" />
            <StatsCard index={2} label="Trainers" value={stats.trainers || 0} icon={Dumbbell} colorClass="from-purple-50 to-purple-100/50 border-purple-200/25" />
            <StatsCard index={3} label="Customers" value={stats.customers || 0} icon={Users} colorClass="from-emerald-50 to-emerald-100/50 border-emerald-200/25" />
            <StatsCard index={4} label="Orders" value={stats.orders || 0} icon={ShoppingBag} colorClass="from-pink-50 to-pink-100/50 border-pink-200/25" />
          </div>

          <DataTable
            title="Recent Orders"
            subtitle="Your network's orders"
            columns={[
              { key: "id", label: "Order ID", className: "text-xs font-black text-gray-800" },
              { key: "customer_name", label: "Customer", className: "text-xs font-bold text-gray-600" },
              { key: "total", label: "Amount", className: "text-xs font-black text-gray-900", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
              { key: "status", label: "Status", render: (v) => (
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${v === 'delivered' || v === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}`}>{v}</span>
              )},
            ]}
            data={data?.recent_orders || []}
          />
        </>
      )}

      {activeTab === "network" && (
        <div className="space-y-8">
          {/* Gym Network */}
          <div className="bg-white border border-gray-150 rounded-[36px] p-6 sm:p-8 shadow-sm">
            <span className="text-[10px] font-extrabold tracking-widest text-gray-400 uppercase block mb-1">Network</span>
            <h3 className="text-xl font-black text-[#2B1D12] uppercase leading-tight mb-6">Your Gyms ({network.gyms.length})</h3>
            
            {network.gyms.length === 0 ? (
              <p className="text-sm text-gray-400 font-semibold py-8 text-center">No gyms in your network yet. Share your referral code!</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {network.gyms.map((gym) => (
                  <div key={gym.id} className="rounded-2xl border border-gray-100 p-5 bg-gradient-to-br from-blue-50/30 to-white hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-gray-900">{gym.facility_name || gym.name}</h4>
                        <p className="text-[10px] text-gray-400 font-semibold">{gym.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${gym.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{gym.status}</span>
                      <span className="text-[10px] font-bold text-gray-400">Code: {gym.referral_code}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trainers */}
          <DataTable
            title={`Trainers (${network.trainers.length})`}
            subtitle="Under your gyms"
            columns={[
              { key: "name", label: "Name", className: "text-xs font-black text-gray-800" },
              { key: "gym_name", label: "Gym", className: "text-xs font-semibold text-gray-500" },
              { key: "status", label: "Status", render: (v) => (
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${v === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{v}</span>
              )},
            ]}
            data={network.trainers}
          />
        </div>
      )}

      {activeTab === "products" && (
        <DataTable
          title="Product-Wise Sales"
          subtitle="Sales within your network"
          columns={[
            { key: "name", label: "Product", className: "text-xs font-black text-gray-800" },
            { key: "quantity", label: "Units Sold", className: "text-xs font-bold text-gray-600" },
            { key: "revenue", label: "Revenue", className: "text-xs font-black text-[#D88A00]", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
          ]}
          data={data?.product_sales || []}
        />
      )}
    </DashboardLayout>
  );
}
