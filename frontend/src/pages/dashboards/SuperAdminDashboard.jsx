import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import DataTable from "@/components/dashboard/DataTable";
import { getSuperAdminDashboard, getApplications, reviewApplication, getAllUsers, getCommissionRules, createCommissionRuleApi, updateCommissionRuleApi, deleteCommissionRuleApi } from "@/services/api";
import {
  TrendingUp, ShoppingBag, Users, Dumbbell, Building2, MapPin,
  Package, BarChart3, CheckCircle2, XCircle, Clock, Eye,
  UserCheck, UserX, Repeat, CalendarDays, DollarSign, Layers,
  MapPinned, Activity, Settings2, Plus, Pencil, Trash2, Save, X
} from "lucide-react";
import toast from "react-hot-toast";

export default function SuperAdminDashboard() {
  const [data, setData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [appFilter, setAppFilter] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Commission rules state
  const [commissionRules, setCommissionRules] = useState([]);
  const [rulesLoading, setRulesLoading] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ role: 'TRAINER_OR_RETAILER', commission_percent: '', product_category: '*' });

  useEffect(() => {
    loadDashboard();
    loadApplications();
  }, []);

  useEffect(() => {
    loadApplications();
  }, [appFilter]);

  useEffect(() => {
    if (activeTab === "commission") {
      loadCommissionRules();
    }
  }, [activeTab]);

  async function loadDashboard() {
    try {
      const result = await getSuperAdminDashboard();
      setData(result);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadApplications() {
    try {
      const result = await getApplications({ status: appFilter });
      setApplications(result.applications || []);
    } catch (err) {
      console.error("Applications load error:", err);
    }
  }

  async function loadCommissionRules() {
    setRulesLoading(true);
    try {
      const result = await getCommissionRules();
      setCommissionRules(result.rules || []);
    } catch (err) {
      console.error("Commission rules load error:", err);
    } finally {
      setRulesLoading(false);
    }
  }

  async function handleReview(id, decision) {
    try {
      await reviewApplication(id, decision);
      toast.success(`Application ${decision.toLowerCase()} successfully!`);
      loadApplications();
      loadDashboard();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleSaveRule() {
    try {
      await updateCommissionRuleApi(editingRule, editForm);
      toast.success("Commission rule updated!");
      setEditingRule(null);
      loadCommissionRules();
      loadDashboard();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleAddRule() {
    if (!addForm.commission_percent) {
      toast.error("Please enter a commission percentage.");
      return;
    }
    try {
      await createCommissionRuleApi(addForm);
      toast.success("Commission rule created!");
      setShowAddForm(false);
      setAddForm({ role: 'TRAINER_OR_RETAILER', commission_percent: '', product_category: '*' });
      loadCommissionRules();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDeleteRule(id) {
    try {
      await deleteCommissionRuleApi(id);
      toast.success("Commission rule deactivated!");
      loadCommissionRules();
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading) {
    return (
      <DashboardLayout badge="Super Admin" title="Loading...">
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 rounded-full border-3 border-[#F4B000] border-t-transparent animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const stats = data?.stats || {};
  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "customers", label: "Customers" },
    { key: "revenue", label: "Revenue" },
    { key: "applications", label: `Applications (${applications.length})` },
    { key: "sales", label: "Sales Analytics" },
    { key: "commission", label: "Commission Rules" },
  ];

  const roleLabels = {
    'TRAINER_OR_RETAILER': 'Trainer / Retailer',
    'GYM_OR_AREA_DISTRIBUTOR': 'Gym / Area Distributor',
    'CITY_DISTRIBUTOR': 'City Distributor',
  };

  return (
    <DashboardLayout
      badge="Super Admin Portal"
      title="Command Center"
      subtitle={`Total Users: ${stats.total_users || 0} | Pending Applications: ${stats.pending_applications || 0}`}
    >
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-[#2B1D12] text-white shadow-md"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <>
          {/* KPI Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-10">
            <StatsCard index={0} label="Total Revenue" value={`₹${Number(stats.total_revenue || 0).toLocaleString('en-IN')}`} icon={TrendingUp} colorClass="from-amber-50 to-amber-100/50 border-amber-200/25" />
            <StatsCard index={1} label="Total Orders" value={stats.total_orders || 0} icon={ShoppingBag} colorClass="from-blue-50 to-blue-100/50 border-blue-200/25" />
            <StatsCard index={2} label="Customers" value={stats.total_customers || 0} icon={Users} colorClass="from-emerald-50 to-emerald-100/50 border-emerald-200/25" />
            <StatsCard index={3} label="Trainers" value={stats.total_trainers || 0} icon={Dumbbell} colorClass="from-purple-50 to-purple-100/50 border-purple-200/25" />
            <StatsCard index={4} label="Gyms" value={stats.total_gyms || 0} icon={Building2} colorClass="from-pink-50 to-pink-100/50 border-pink-200/25" />
            <StatsCard index={5} label="City Distributors" value={stats.total_city_distributors || 0} icon={MapPin} colorClass="from-cyan-50 to-cyan-100/50 border-cyan-200/25" />
          </div>

          {/* Secondary Metrics */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            <StatsCard index={0} label="Avg Order Value" value={`₹${Number(stats.avg_order_value || 0).toFixed(0)}`} icon={BarChart3} colorClass="from-orange-50 to-orange-100/50 border-orange-200/25" />
            <StatsCard index={1} label="Repeat Purchase Rate" value={`${stats.repeat_purchase_rate || 0}%`} icon={Repeat} colorClass="from-green-50 to-green-100/50 border-green-200/25" />
            <StatsCard index={2} label="Customer Retention" value={`${stats.customer_retention_rate || 0}%`} icon={UserCheck} colorClass="from-teal-50 to-teal-100/50 border-teal-200/25" />
            <StatsCard index={3} label="Pending Applications" value={stats.pending_applications || 0} icon={Clock} colorClass="from-yellow-50 to-yellow-100/50 border-yellow-200/25" />
          </div>

          {/* Top Products & Recent Orders */}
          <div className="grid gap-8 lg:grid-cols-2 mb-10">
            <DataTable
              title="Top Selling Products"
              subtitle="Product performance"
              columns={[
                { key: "name", label: "Product", className: "text-xs font-black text-gray-800" },
                { key: "total_sold", label: "Units Sold", className: "text-xs font-bold text-gray-600" },
                { key: "total_revenue", label: "Revenue", className: "text-xs font-black text-[#D88A00]", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
              ]}
              data={data?.top_products || []}
              emptyMessage="No sales data yet"
            />
            <DataTable
              title="Recent Orders"
              subtitle="Latest transactions"
              columns={[
                { key: "customer_name", label: "Customer", className: "text-xs font-bold text-gray-800" },
                { key: "total", label: "Amount", className: "text-xs font-black text-gray-900", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
                { key: "status", label: "Status", render: (v) => (
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${v === 'delivered' || v === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : v === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{v}</span>
                )},
              ]}
              data={data?.recent_orders || []}
              emptyMessage="No orders yet"
            />
          </div>

          {/* Recent Registrations */}
          <DataTable
            title="Recent Registrations"
            subtitle="New users"
            columns={[
              { key: "name", label: "Name", className: "text-xs font-bold text-gray-800" },
              { key: "email", label: "Email", className: "text-xs font-semibold text-gray-500" },
              { key: "role", label: "Role", render: (v) => (
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">{v?.replace(/_/g, ' ')}</span>
              )},
              { key: "created_at", label: "Joined", className: "text-xs font-semibold text-gray-400", render: (v) => new Date(v).toLocaleDateString() },
            ]}
            data={data?.recent_registrations || []}
          />
        </>
      )}

      {/* Customers Tab */}
      {activeTab === "customers" && (
        <>
          {/* Customer KPI Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            <StatsCard index={0} label="Total Customers" value={stats.total_customers || 0} icon={Users} colorClass="from-emerald-50 to-emerald-100/50 border-emerald-200/25" />
            <StatsCard index={1} label="Repeat Purchase Rate" value={`${stats.repeat_purchase_rate || 0}%`} icon={Repeat} colorClass="from-green-50 to-green-100/50 border-green-200/25" />
            <StatsCard index={2} label="Customer Retention (30d)" value={`${stats.customer_retention_rate || 0}%`} icon={UserCheck} colorClass="from-teal-50 to-teal-100/50 border-teal-200/25" />
            <StatsCard index={3} label="Inactive Customers" value={(data?.inactive_customers || []).length} icon={UserX} colorClass="from-red-50 to-red-100/50 border-red-200/25" />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <DataTable
              title="Top Customers"
              subtitle="By total spent"
              columns={[
                { key: "name", label: "Customer", className: "text-xs font-black text-gray-800" },
                { key: "email", label: "Email", className: "text-xs font-semibold text-gray-500" },
                { key: "order_count", label: "Orders", className: "text-xs font-bold text-gray-600" },
                { key: "total_spent", label: "Total Spent", className: "text-xs font-black text-[#D88A00]", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
              ]}
              data={data?.top_customers || []}
              emptyMessage="No customer data yet"
            />
            <DataTable
              title="Inactive Customers"
              subtitle="No order in 90+ days"
              columns={[
                { key: "name", label: "Customer", className: "text-xs font-black text-gray-800" },
                { key: "email", label: "Email", className: "text-xs font-semibold text-gray-500" },
                { key: "days_since_last_order", label: "Days Inactive", className: "text-xs font-black text-red-600", render: (v) => v ? `${v} days` : 'Never ordered' },
                { key: "last_order_date", label: "Last Order", className: "text-xs font-semibold text-gray-400", render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
              ]}
              data={data?.inactive_customers || []}
              emptyMessage="No inactive customers"
            />
          </div>
        </>
      )}

      {/* Revenue Tab */}
      {activeTab === "revenue" && (
        <>
          {/* Revenue KPI Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            <StatsCard index={0} label="Total Revenue" value={`₹${Number(stats.total_revenue || 0).toLocaleString('en-IN')}`} icon={DollarSign} colorClass="from-amber-50 to-amber-100/50 border-amber-200/25" />
            <StatsCard index={1} label="Avg Order Value" value={`₹${Number(stats.avg_order_value || 0).toFixed(0)}`} icon={BarChart3} colorClass="from-orange-50 to-orange-100/50 border-orange-200/25" />
            <StatsCard index={2} label="Total Orders" value={stats.total_orders || 0} icon={ShoppingBag} colorClass="from-blue-50 to-blue-100/50 border-blue-200/25" />
            <StatsCard index={3} label="Subscription Growth" value="Coming soon" icon={Activity} colorClass="from-violet-50 to-violet-100/50 border-violet-200/25" />
          </div>

          <div className="grid gap-8 lg:grid-cols-2 mb-10">
            <DataTable
              title="Revenue by Product"
              subtitle="Product-level breakdown"
              columns={[
                { key: "name", label: "Product", className: "text-xs font-black text-gray-800" },
                { key: "quantity", label: "Units", className: "text-xs font-bold text-gray-600" },
                { key: "revenue", label: "Revenue", className: "text-xs font-black text-[#D88A00]", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
              ]}
              data={data?.product_wise_sales || []}
              emptyMessage="No product sales data"
            />
            <DataTable
              title="Revenue by Category"
              subtitle="Category-level breakdown"
              columns={[
                { key: "category", label: "Category", className: "text-xs font-black text-gray-800" },
                { key: "units_sold", label: "Units", className: "text-xs font-bold text-gray-600" },
                { key: "revenue", label: "Revenue", className: "text-xs font-black text-[#D88A00]", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
              ]}
              data={data?.revenue_by_category || []}
              emptyMessage="No category data"
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <DataTable
              title="Revenue by City"
              subtitle="Geographic breakdown"
              columns={[
                { key: "city", label: "City", className: "text-xs font-black text-gray-800" },
                { key: "order_count", label: "Orders", className: "text-xs font-bold text-gray-600" },
                { key: "revenue", label: "Revenue", className: "text-xs font-black text-[#D88A00]", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
              ]}
              data={data?.revenue_by_city || []}
              emptyMessage="No city data"
            />
            <DataTable
              title="Monthly Revenue Trends"
              subtitle="Last 12 months"
              columns={[
                { key: "month", label: "Month", className: "text-xs font-black text-gray-800" },
                { key: "orders", label: "Orders", className: "text-xs font-bold text-gray-600" },
                { key: "revenue", label: "Revenue", className: "text-xs font-black text-[#D88A00]", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
              ]}
              data={data?.monthly_revenue || []}
              emptyMessage="No monthly data"
            />
          </div>
        </>
      )}

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <>
          <div className="flex gap-2 mb-6 flex-wrap">
            {["PENDING", "APPROVED", "REJECTED"].map((s) => (
              <button
                key={s}
                onClick={() => setAppFilter(s)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  appFilter === s
                    ? "bg-[#F4B000] text-[#2B1D12] shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="bg-white border border-gray-150 rounded-3xl p-12 text-center">
                <p className="text-sm text-gray-400 font-semibold">No {appFilter.toLowerCase()} applications</p>
              </div>
            ) : (
              applications.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                          app.application_type === 'trainer' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {app.application_type}
                        </span>
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                          app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-gray-900">{app.name}</h4>
                      <p className="text-xs text-gray-500 font-medium">{app.email} • {app.mobile}</p>
                      {app.facility_name && <p className="text-xs text-gray-400 mt-1">Facility: <span className="font-bold text-gray-600">{app.facility_name}</span></p>}
                      {app.certification_name && <p className="text-xs text-gray-400 mt-1">Cert: <span className="font-bold text-gray-600">{app.certification_name}</span></p>}
                      {app.referral_code && <p className="text-xs text-gray-400 mt-1">Referral: <span className="font-bold text-[#D88A00]">{app.referral_code}</span></p>}
                      <p className="text-[10px] text-gray-300 font-semibold mt-2">Applied: {new Date(app.created_at).toLocaleDateString()}</p>
                    </div>

                    {app.status === 'PENDING' && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleReview(app.id, 'APPROVED')}
                          className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-500 text-white text-xs font-black uppercase tracking-wider hover:bg-emerald-600 transition-colors"
                        >
                          <CheckCircle2 className="h-4 w-4" /> Approve
                        </button>
                        <button
                          onClick={() => handleReview(app.id, 'REJECTED')}
                          className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-red-500 text-white text-xs font-black uppercase tracking-wider hover:bg-red-600 transition-colors"
                        >
                          <XCircle className="h-4 w-4" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </>
      )}

      {/* Sales Analytics Tab */}
      {activeTab === "sales" && (
        <div className="grid gap-8 lg:grid-cols-2">
          <DataTable
            title="Trainer-Wise Sales"
            subtitle="Performance by trainer"
            columns={[
              { key: "trainer_name", label: "Trainer", className: "text-xs font-black text-gray-800" },
              { key: "referral_code", label: "Code", className: "text-xs font-bold text-[#D88A00]" },
              { key: "order_count", label: "Orders", className: "text-xs font-bold text-gray-600" },
              { key: "revenue", label: "Revenue", className: "text-xs font-black text-gray-900", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
            ]}
            data={data?.trainer_wise_sales || []}
          />
          <DataTable
            title="Gym-Wise Sales"
            subtitle="Performance by gym"
            columns={[
              { key: "facility_name", label: "Gym", className: "text-xs font-black text-gray-800" },
              { key: "order_count", label: "Orders", className: "text-xs font-bold text-gray-600" },
              { key: "revenue", label: "Revenue", className: "text-xs font-black text-gray-900", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
            ]}
            data={data?.gym_wise_sales || []}
          />
          <DataTable
            title="City Distributor Sales"
            subtitle="Performance by city"
            columns={[
              { key: "city_name", label: "City", className: "text-xs font-black text-gray-800" },
              { key: "distributor_name", label: "Distributor", className: "text-xs font-bold text-gray-600" },
              { key: "order_count", label: "Orders", className: "text-xs font-bold text-gray-600" },
              { key: "revenue", label: "Revenue", className: "text-xs font-black text-gray-900", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
            ]}
            data={data?.city_wise_sales || []}
          />
          <DataTable
            title="Product-Wise Sales"
            subtitle="Revenue by product"
            columns={[
              { key: "name", label: "Product", className: "text-xs font-black text-gray-800" },
              { key: "quantity", label: "Units", className: "text-xs font-bold text-gray-600" },
              { key: "revenue", label: "Revenue", className: "text-xs font-black text-[#D88A00]", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
            ]}
            data={data?.product_wise_sales || []}
          />
        </div>
      )}

      {/* Commission Rules Tab */}
      {activeTab === "commission" && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-gray-900 uppercase">Commission Rules</h3>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">Manage commission percentages per role and product category</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#F4B000] text-[#2B1D12] text-xs font-black uppercase tracking-wider hover:bg-[#E59700] transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add Rule
            </button>
          </div>

          {/* Add Rule Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm mb-6"
            >
              <h4 className="text-sm font-black text-gray-900 uppercase mb-4">New Commission Rule</h4>
              <div className="grid gap-4 sm:grid-cols-3 mb-4">
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Role</label>
                  <select
                    value={addForm.role}
                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-[#F4B000]/30 focus:border-[#F4B000] outline-none"
                  >
                    {Object.entries(roleLabels).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Commission %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={addForm.commission_percent}
                    onChange={(e) => setAddForm({ ...addForm, commission_percent: e.target.value })}
                    placeholder="e.g. 10.00"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-[#F4B000]/30 focus:border-[#F4B000] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Category</label>
                  <input
                    type="text"
                    value={addForm.product_category}
                    onChange={(e) => setAddForm({ ...addForm, product_category: e.target.value })}
                    placeholder="* for all"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-[#F4B000]/30 focus:border-[#F4B000] outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-xs font-black uppercase tracking-wider hover:bg-gray-200 transition-colors"
                >
                  <X className="h-3.5 w-3.5" /> Cancel
                </button>
                <button
                  onClick={handleAddRule}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500 text-white text-xs font-black uppercase tracking-wider hover:bg-emerald-600 transition-colors"
                >
                  <Save className="h-3.5 w-3.5" /> Create
                </button>
              </div>
            </motion.div>
          )}

          {/* Rules List */}
          {rulesLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 rounded-full border-3 border-[#F4B000] border-t-transparent animate-spin" />
            </div>
          ) : commissionRules.length === 0 ? (
            <div className="bg-white border border-gray-150 rounded-3xl p-12 text-center">
              <Settings2 className="h-12 w-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400 font-semibold">No commission rules configured</p>
            </div>
          ) : (
            <div className="space-y-3">
              {commissionRules.map((rule) => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm"
                >
                  {editingRule === rule.id ? (
                    /* Inline Edit Mode */
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 grid gap-3 sm:grid-cols-3">
                        <div>
                          <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Role</label>
                          <p className="text-xs font-black text-gray-800">{roleLabels[rule.role] || rule.role}</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Commission %</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={editForm.commission_percent ?? ''}
                            onChange={(e) => setEditForm({ ...editForm, commission_percent: e.target.value })}
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#F4B000]/30 focus:border-[#F4B000] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Category</label>
                          <input
                            type="text"
                            value={editForm.product_category ?? ''}
                            onChange={(e) => setEditForm({ ...editForm, product_category: e.target.value })}
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#F4B000]/30 focus:border-[#F4B000] outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={handleSaveRule} className="flex items-center gap-1 px-3 py-2 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider hover:bg-emerald-600 transition-colors">
                          <Save className="h-3.5 w-3.5" /> Save
                        </button>
                        <button onClick={() => setEditingRule(null)} className="flex items-center gap-1 px-3 py-2 rounded-full bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-wider hover:bg-gray-200 transition-colors">
                          <X className="h-3.5 w-3.5" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display Mode */
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1 flex items-center gap-4 flex-wrap">
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                          rule.role === 'TRAINER_OR_RETAILER' ? 'bg-purple-50 text-purple-700' :
                          rule.role === 'GYM_OR_AREA_DISTRIBUTOR' ? 'bg-blue-50 text-blue-700' :
                          'bg-cyan-50 text-cyan-700'
                        }`}>
                          {roleLabels[rule.role] || rule.role}
                        </span>
                        <span className="text-lg font-black text-gray-900">{Number(rule.commission_percent)}%</span>
                        <span className="text-xs font-semibold text-gray-400">Category: <span className="font-bold text-gray-600">{rule.product_category === '*' ? 'All Products' : rule.product_category}</span></span>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${rule.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {rule.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingRule(rule.id);
                            setEditForm({ commission_percent: rule.commission_percent, product_category: rule.product_category });
                          }}
                          className="flex items-center gap-1 px-3 py-2 rounded-full bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-wider hover:bg-gray-200 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        {rule.active && (
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            className="flex items-center gap-1 px-3 py-2 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Deactivate
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
