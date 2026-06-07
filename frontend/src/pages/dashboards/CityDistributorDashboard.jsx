import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import DataTable from "@/components/dashboard/DataTable";
import { getCityDistributorDashboard } from "@/services/api";
import {
  LayoutDashboard, Users, Package, Network,
  TrendingUp, Building2, Dumbbell, ShoppingBag, Copy, DollarSign
} from "lucide-react";
import toast from "react-hot-toast";

const MENU = [
  { key: "overview", label: "Dashboard", icon: LayoutDashboard },
  { key: "network", label: "Network Tree", icon: Network },
  { key: "products", label: "Product Sales", icon: Package },
];

export default function CityDistributorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    try {
      const result = await getCityDistributorDashboard();
      setData(result);
    } catch (err) { console.error("Dashboard load error:", err); }
    finally { setLoading(false); }
  }

  if (loading) {
    return (
      <DashboardLayout brandSubtitle="CITY DISTRIBUTOR" menuItems={MENU} activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className="flex justify-center items-center h-64">
          <div className="h-10 w-10 rounded-full border-3 border-[#F4B000] border-t-transparent animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const profile = data?.profile || {};
  const stats = data?.stats || {};
  const network = data?.network || { gyms: [], trainers: [], customers: [] };

  return (
    <DashboardLayout
      brandSubtitle="CITY DISTRIBUTOR"
      pageTitle={profile.city_name || "City Distributor"}
      menuItems={MENU}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      headerActions={
        <button
          onClick={() => { navigator.clipboard.writeText(profile.referral_code || ""); toast.success("Referral code copied!"); }}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-[#FFF8E8] hover:text-[#D88A00] transition-colors"
        >
          <Copy className="h-3.5 w-3.5" /> {profile.referral_code}
        </button>
      }
    >
      {activeTab === "overview" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
            <StatsCard index={0} label="Revenue" value={`₹${Number(stats.revenue || 0).toLocaleString('en-IN')}`} icon={TrendingUp} />
            <StatsCard index={1} label="Commission Earned" value={`₹${Number(stats.commission || 0).toLocaleString('en-IN')}`} icon={DollarSign} trend="Your 3% share" />
            <StatsCard index={2} label="Orders" value={stats.orders || 0} icon={ShoppingBag} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <StatsCard index={3} label="Gyms" value={stats.gyms || 0} icon={Building2} />
            <StatsCard index={4} label="Trainers" value={stats.trainers || 0} icon={Dumbbell} />
            <StatsCard index={5} label="Customers" value={stats.customers || 0} icon={Users} />
          </div>

          <DataTable
            title="Recent Orders"
            subtitle="Your network's orders"
            columns={[
              { key: "id", label: "Order ID", className: "text-xs font-bold text-gray-800" },
              { key: "customer_name", label: "Customer", className: "text-xs text-gray-600" },
              { key: "total", label: "Amount", className: "text-xs font-bold text-gray-900", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
              { key: "status", label: "Status", render: (v) => (
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${v === 'delivered' || v === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-yellow-50 text-yellow-700'}`}>{v}</span>
              )},
            ]}
            data={data?.recent_orders || []}
          />
        </>
      )}

      {activeTab === "network" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="text-base font-black text-[#2B1D12] mb-4">Your Gyms ({network.gyms.length})</h3>
            {network.gyms.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">No gyms yet. Share your referral code!</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {network.gyms.map((gym) => (
                  <div key={gym.id} className="rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-800">{gym.facility_name || gym.name}</h4>
                        <p className="text-[10px] text-gray-400">{gym.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${gym.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{gym.status}</span>
                      <span className="text-[10px] text-gray-400">Code: {gym.referral_code}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DataTable
            title={`Trainers (${network.trainers.length})`}
            subtitle="Under your gyms"
            columns={[
              { key: "name", label: "Name", className: "text-xs font-bold text-gray-800" },
              { key: "gym_name", label: "Gym", className: "text-xs text-gray-500" },
              { key: "status", label: "Status", render: (v) => (
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${v === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{v}</span>
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
            { key: "name", label: "Product", className: "text-xs font-bold text-gray-800" },
            { key: "quantity", label: "Units Sold", className: "text-xs text-gray-600" },
            { key: "revenue", label: "Revenue", className: "text-xs font-bold text-[#D88A00]", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
          ]}
          data={data?.product_sales || []}
        />
      )}
    </DashboardLayout>
  );
}
