import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import DataTable from "@/components/dashboard/DataTable";
import {
  getSuperAdminDashboard, getApplications, reviewApplication,
  getAllUsers, updateUserRoleApi,
  getCommissionRules, createCommissionRuleApi, updateCommissionRuleApi, deleteCommissionRuleApi,
  getAllProductsAdmin, createProduct, updateProduct, deleteProductAdmin,
  getContactMessages, markContactMessageRead,
  getNewsletterSubscribers,
  getAdminOrders, updateOrderStatusApi,
  getCommissionBreakdown,
} from "@/services/api";
import {
  LayoutDashboard, Package, PlusCircle, ShoppingCart, FileText,
  Users, Mail, Newspaper, Settings2, TrendingUp, ShoppingBag,
  CheckCircle2, XCircle, Clock, Plus, Pencil, Trash2, Save, X,
  Eye, EyeOff, ChevronDown, BarChart3, DollarSign,
  Building2, Dumbbell, MapPin, UserCheck, UserX, Repeat, Activity,
  Search, Gift, Heart
} from "lucide-react";
import toast from "react-hot-toast";

const ADMIN_MENU = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "products", label: "Products", icon: Package },
  { key: "addProduct", label: "Add Product", icon: PlusCircle },
  { key: "orders", label: "Orders", icon: ShoppingCart },
  { key: "applications", label: "User Requests", icon: FileText },
  { key: "users", label: "Users", icon: Users },
  { key: "commissions", label: "Commissions", icon: DollarSign },
  { key: "messages", label: "Messages", icon: Mail },
  { key: "newsletters", label: "Newsletters", icon: Newspaper },
  { key: "settings", label: "Settings", icon: Settings2 },
];

const VALID_ROLES = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "CITY_DISTRIBUTOR", label: "City Distributor" },
  { value: "GYM_OR_AREA_DISTRIBUTOR", label: "Gym / Area Distributor" },
  { value: "TRAINER_OR_RETAILER", label: "Trainer / Retailer" },
  { value: "CUSTOMER", label: "Customer" },
];

const ORDER_STATUSES = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Products state
  const [products, setProducts] = useState([]);
  const [productsTotal, setProductsTotal] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({});

  // Add product form
  const [newProduct, setNewProduct] = useState({
    name: "", description: "", short_description: "", price: "", original_price: "",
    category: "", type: "", benefit: "", image: "", stock: "", is_bestseller: false, is_new: false
  });

  // Orders state
  const [adminOrders, setAdminOrders] = useState([]);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // Applications state
  const [applications, setApplications] = useState([]);
  const [appFilter, setAppFilter] = useState("PENDING");

  // Users state
  const [users, setUsers] = useState([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [editRoleValue, setEditRoleValue] = useState("");

  // Messages state
  const [messages, setMessages] = useState([]);
  const [messagesUnread, setMessagesUnread] = useState(0);

  // Newsletters state
  const [subscribers, setSubscribers] = useState([]);
  const [subscribersTotal, setSubscribersTotal] = useState(0);

  // Commission rules state
  const [commissionRules, setCommissionRules] = useState([]);
  const [rulesLoading, setRulesLoading] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ role: 'TRAINER_OR_RETAILER', commission_percent: '', product_category: '*' });

  // Commissions Tracking State
  const [commissionsList, setCommissionsList] = useState([]);
  const [commissionsSummary, setCommissionsSummary] = useState({});
  const [commissionsUserBreakdown, setCommissionsUserBreakdown] = useState([]);

  useEffect(() => { loadDashboard(); }, []);
  useEffect(() => { if (activeTab === "applications") loadApplications(); }, [activeTab, appFilter]);
  useEffect(() => { if (activeTab === "products") loadProducts(); }, [activeTab]);
  useEffect(() => { if (activeTab === "orders") loadAdminOrders(); }, [activeTab, orderStatusFilter]);
  useEffect(() => { if (activeTab === "users") loadUsers(); }, [activeTab, userRoleFilter]);
  useEffect(() => { if (activeTab === "messages") loadMessages(); }, [activeTab]);
  useEffect(() => { if (activeTab === "newsletters") loadNewsletters(); }, [activeTab]);
  useEffect(() => { if (activeTab === "settings") loadCommissionRules(); }, [activeTab]);
  useEffect(() => { if (activeTab === "commissions") loadCommissions(); }, [activeTab]);

  async function loadDashboard() {
    try { const result = await getSuperAdminDashboard(); setData(result); }
    catch (err) { console.error("Dashboard load error:", err); }
    finally { setLoading(false); }
  }

  async function loadProducts() {
    try {
      const result = await getAllProductsAdmin();
      setProducts(result.products || []); setProductsTotal(result.total || 0);
    } catch (err) { console.error("Products load error:", err); }
  }

  async function loadAdminOrders() {
    try {
      const result = await getAdminOrders({ search: orderSearch || undefined, status: orderStatusFilter !== 'all' ? orderStatusFilter : undefined });
      setAdminOrders(result.orders || []); setOrdersTotal(result.total || 0);
    } catch (err) { console.error("Orders load error:", err); }
  }

  async function loadApplications() {
    try { const result = await getApplications({ status: appFilter }); setApplications(result.applications || []); }
    catch (err) { console.error("Apps load error:", err); }
  }

  async function loadUsers() {
    try {
      const result = await getAllUsers({ role: userRoleFilter || undefined });
      setUsers(result.users || []); setUsersTotal(result.total || 0);
    } catch (err) { console.error("Users load error:", err); }
  }

  async function loadMessages() {
    try {
      const result = await getContactMessages();
      setMessages(result.messages || []); setMessagesUnread(result.unread || 0);
    } catch (err) { console.error("Messages load error:", err); }
  }

  async function loadNewsletters() {
    try {
      const result = await getNewsletterSubscribers();
      setSubscribers(result.subscribers || []); setSubscribersTotal(result.total || 0);
    } catch (err) { console.error("Newsletter load error:", err); }
  }

  async function loadCommissionRules() {
    setRulesLoading(true);
    try { const result = await getCommissionRules(); setCommissionRules(result.rules || []); }
    catch (err) { console.error("Rules load error:", err); }
    finally { setRulesLoading(false); }
  }

  async function loadCommissions() {
    try {
      const result = await getCommissionBreakdown();
      setCommissionsList(result.commissions || []);
      setCommissionsSummary(result.summary || {});
      setCommissionsUserBreakdown(result.user_breakdown || []);
    } catch (err) { console.error("Commissions load error:", err); }
  }

  // Action Handlers
  async function handleReview(id, decision) {
    try { await reviewApplication(id, decision); toast.success(`Application ${decision.toLowerCase()}!`); loadApplications(); loadDashboard(); }
    catch (err) { toast.error(err.message); }
  }

  async function handleCreateProduct(e) {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) { toast.error("Name and price are required."); return; }
    try {
      await createProduct({ ...newProduct, price: Number(newProduct.price), original_price: Number(newProduct.original_price || newProduct.price), stock: Number(newProduct.stock || 0) });
      toast.success("Product created!");
      setNewProduct({ name: "", description: "", short_description: "", price: "", original_price: "", category: "", type: "", benefit: "", image: "", stock: "", is_bestseller: false, is_new: false });
      setActiveTab("products"); loadProducts();
    } catch (err) { toast.error(err.message); }
  }

  async function handleUpdateProduct() {
    try { await updateProduct(editingProduct, productForm); toast.success("Product updated!"); setEditingProduct(null); loadProducts(); }
    catch (err) { toast.error(err.message); }
  }

  async function handleDeleteProduct(id) {
    if (!confirm("Deactivate this product?")) return;
    try { await deleteProductAdmin(id); toast.success("Product deactivated!"); loadProducts(); }
    catch (err) { toast.error(err.message); }
  }

  async function handleUpdateOrderStatus(orderId, newStatus) {
    try { await updateOrderStatusApi(orderId, newStatus); toast.success("Order status updated!"); loadAdminOrders(); loadDashboard(); }
    catch (err) { toast.error(err.message); }
  }

  async function handleUpdateUserRole(userId) {
    try { await updateUserRoleApi(userId, { role: editRoleValue }); toast.success("User role updated!"); setEditingUserId(null); loadUsers(); loadDashboard(); }
    catch (err) { toast.error(err.message); }
  }

  async function handleMarkRead(id) {
    try { await markContactMessageRead(id); loadMessages(); }
    catch (err) { toast.error(err.message); }
  }

  async function handleSaveRule() {
    try { await updateCommissionRuleApi(editingRule, editForm); toast.success("Commission rule updated!"); setEditingRule(null); loadCommissionRules(); loadDashboard(); }
    catch (err) { toast.error(err.message); }
  }

  async function handleAddRule() {
    if (!addForm.commission_percent) { toast.error("Enter a commission %."); return; }
    try { await createCommissionRuleApi(addForm); toast.success("Rule created!"); setShowAddForm(false); setAddForm({ role: 'TRAINER_OR_RETAILER', commission_percent: '', product_category: '*' }); loadCommissionRules(); }
    catch (err) { toast.error(err.message); }
  }

  async function handleDeleteRule(id) {
    try { await deleteCommissionRuleApi(id); toast.success("Rule deactivated!"); loadCommissionRules(); }
    catch (err) { toast.error(err.message); }
  }

  const menuWithBadges = ADMIN_MENU.map(item => {
    if (item.key === "applications") return { ...item, badge: applications.length || undefined };
    if (item.key === "messages") return { ...item, badge: messagesUnread || undefined };
    if (item.key === "products") return { ...item, badge: productsTotal || undefined };
    return item;
  });

  const stats = data?.stats || {};

  const headerActions = (
    <button onClick={() => setActiveTab("addProduct")} className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2B1D12] text-white text-xs font-bold hover:bg-[#3D2A1A] transition-colors shadow-sm">
      <Plus className="h-3.5 w-3.5" /> Add Product
    </button>
  );

  if (loading) {
    return (
      <DashboardLayout brandSubtitle="ADMIN PANEL" menuItems={ADMIN_MENU} activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className="flex justify-center items-center h-64"><div className="h-10 w-10 rounded-full border-3 border-[#F4B000] border-t-transparent animate-spin" /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout brandSubtitle="ADMIN PANEL" menuItems={menuWithBadges} activeTab={activeTab} setActiveTab={setActiveTab} headerActions={headerActions}>

      {/* ═══════ DASHBOARD ═══════ */}
      {activeTab === "dashboard" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatsCard index={0} label="Total Products" value={productsTotal || "—"} icon={Package} trend={`${stats.total_orders || 0} orders`} />
            <StatsCard index={1} label="Total Users" value={stats.total_users || 0} icon={Users} trend={`${stats.total_customers || 0} customers`} />
            <StatsCard index={2} label="Total Orders" value={stats.total_orders || 0} icon={ShoppingBag} trend={`${stats.pending_applications || 0} pending apps`} />
            <StatsCard index={3} label="Revenue" value={`₹${Number(stats.total_revenue || 0).toLocaleString('en-IN')}`} icon={DollarSign} trend={`Avg ₹${Number(stats.avg_order_value || 0).toFixed(0)}/order`} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatsCard index={0} label="Trainers" value={stats.total_trainers || 0} icon={Dumbbell} />
            <StatsCard index={1} label="Gyms" value={stats.total_gyms || 0} icon={Building2} />
            <StatsCard index={2} label="City Distributors" value={stats.total_city_distributors || 0} icon={MapPin} />
            <StatsCard index={3} label="Repeat Purchase Rate" value={`${stats.repeat_purchase_rate || 0}%`} icon={Repeat} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            <DataTable title="Top Selling Products" subtitle="Product performance" columns={[
              { key: "name", label: "Product", className: "text-xs font-bold text-gray-800" },
              { key: "total_sold", label: "Units", className: "text-xs text-gray-600" },
              { key: "total_revenue", label: "Revenue", className: "text-xs font-bold text-[#D88A00]", render: (v) => `₹${Number(v||0).toLocaleString('en-IN')}` },
            ]} data={data?.top_products || []} emptyMessage="No sales data yet" />
            <DataTable title="Recent Registrations" subtitle="New users" columns={[
              { key: "name", label: "Name", className: "text-xs font-semibold text-gray-800" },
              { key: "email", label: "Email", className: "text-xs text-gray-500" },
              { key: "role", label: "Role", render: (v) => <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{v?.replace(/_/g,' ')}</span> },
            ]} data={data?.recent_registrations || []} />
          </div>
        </>
      )}

      {/* ═══════ PRODUCTS ═══════ */}
      {activeTab === "products" && (
        <DataTable title={`All Products (${productsTotal})`} subtitle="Manage your product catalog"
          actions={<button onClick={() => setActiveTab("addProduct")} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2B1D12] text-white text-xs font-bold hover:bg-[#3D2A1A] transition-colors"><Plus className="h-3.5 w-3.5" /> Add Product</button>}
          columns={[
            { key: "image", label: "", render: (v) => v ? <img src={v} alt="" className="h-10 w-10 rounded-lg object-cover border border-gray-100" /> : <div className="h-10 w-10 rounded-lg bg-gray-100" /> },
            { key: "name", label: "Product", className: "text-xs font-bold text-gray-800" },
            { key: "price", label: "Price", className: "text-xs font-bold text-gray-900", render: (v) => `₹${Number(v||0).toLocaleString('en-IN')}` },
            { key: "category", label: "Category", className: "text-xs text-gray-500" },
            { key: "stock", label: "Stock", render: (v) => <span className={v > 0 ? "text-xs font-semibold text-emerald-600" : "text-xs font-semibold text-red-500"}>{v||0}</span> },
            { key: "is_active", label: "Status", render: (v) => <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${v?'bg-emerald-50 text-emerald-700':'bg-red-50 text-red-600'}`}>{v?'Active':'Inactive'}</span> },
            { key: "id", label: "Actions", render: (v, row) => (
              <div className="flex gap-1.5">
                <button onClick={() => { setEditingProduct(v); setProductForm({ name: row.name, price: row.price, original_price: row.original_price, category: row.category, stock: row.stock, description: row.description, image: row.image }); }} className="h-7 w-7 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                {row.is_active && <button onClick={() => handleDeleteProduct(v)} className="h-7 w-7 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>}
              </div>
            )},
          ]}
          data={products} emptyMessage="No products yet"
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setEditingProduct(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-black text-[#2B1D12] mb-4">Edit Product</h3>
            <div className="grid gap-3 sm:grid-cols-2 mb-4">
              {[{ key:"name",label:"Name",type:"text" },{ key:"price",label:"Price",type:"number" },{ key:"original_price",label:"Original Price",type:"number" },{ key:"category",label:"Category",type:"text" },{ key:"stock",label:"Stock",type:"number" },{ key:"image",label:"Image URL",type:"text" }].map(f => (
                <div key={f.key}><label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">{f.label}</label>
                <input type={f.type} value={productForm[f.key]??""} onChange={e => setProductForm({...productForm,[f.key]:e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-[#F4B000]/30 focus:border-[#F4B000] outline-none" /></div>
              ))}
            </div>
            <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Description</label>
            <textarea rows={3} value={productForm.description??""} onChange={e => setProductForm({...productForm,description:e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-[#F4B000]/30 focus:border-[#F4B000] outline-none resize-none" /></div>
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={() => setEditingProduct(null)} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200">Cancel</button>
              <button onClick={handleUpdateProduct} className="px-4 py-2 rounded-xl bg-[#2B1D12] text-white text-xs font-bold hover:bg-[#3D2A1A]">Save Changes</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ═══════ ADD PRODUCT ═══════ */}
      {activeTab === "addProduct" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm max-w-2xl">
          <h3 className="text-base font-black text-[#2B1D12] mb-5">Add New Product</h3>
          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {[{ key:"name",label:"Product Name *",type:"text",required:true },{ key:"price",label:"Price (₹) *",type:"number",required:true },{ key:"original_price",label:"Original Price (₹)",type:"number" },{ key:"category",label:"Category",type:"text" },{ key:"type",label:"Type",type:"text" },{ key:"benefit",label:"Benefit",type:"text" },{ key:"stock",label:"Stock",type:"number" },{ key:"image",label:"Image URL",type:"text" }].map(f => (
                <div key={f.key}><label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">{f.label}</label>
                <input type={f.type} value={newProduct[f.key]} onChange={e => setNewProduct({...newProduct,[f.key]:e.target.value})} required={f.required} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-[#F4B000]/30 focus:border-[#F4B000] outline-none" /></div>
              ))}
            </div>
            <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Description</label>
            <textarea rows={4} value={newProduct.description} onChange={e => setNewProduct({...newProduct,description:e.target.value})} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-[#F4B000]/30 focus:border-[#F4B000] outline-none resize-none" /></div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-600"><input type="checkbox" checked={newProduct.is_bestseller} onChange={e => setNewProduct({...newProduct,is_bestseller:e.target.checked})} className="rounded" /> Bestseller</label>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-600"><input type="checkbox" checked={newProduct.is_new} onChange={e => setNewProduct({...newProduct,is_new:e.target.checked})} className="rounded" /> New Arrival</label>
            </div>
            <button type="submit" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2B1D12] text-white text-sm font-bold hover:bg-[#3D2A1A] transition-colors shadow-sm"><Plus className="h-4 w-4" /> Create Product</button>
          </form>
        </motion.div>
      )}

      {/* ═══════ ORDERS TAB (NIRVI-style) ═══════ */}
      {activeTab === "orders" && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-black text-[#2B1D12] mb-1">Orders</h2>
            <p className="text-sm text-gray-400 font-medium">Monitor fulfillment progress and update order statuses in place.</p>
          </div>

          {/* Search + Status Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 max-w-md">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input type="text" placeholder="Search by order ID, customer, or product" value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') loadAdminOrders(); }}
                className="flex-1 text-sm font-medium text-gray-700 placeholder:text-gray-300 outline-none bg-transparent" />
            </div>
            <div className="relative">
              <select value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm font-medium text-gray-600 outline-none focus:ring-2 focus:ring-[#F4B000]/30 focus:border-[#F4B000]">
                <option value="all">All Statuses</option>
                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Orders Table — NIRVI Style */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-5 py-3.5 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Order</th>
                    <th className="px-5 py-3.5 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Customer & Delivery</th>
                    <th className="px-5 py-3.5 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Products</th>
                    <th className="px-5 py-3.5 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Total</th>
                    <th className="px-5 py-3.5 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Payment</th>
                    <th className="px-5 py-3.5 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Extras & Notes</th>
                    <th className="px-5 py-3.5 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3.5 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Placed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {adminOrders.length === 0 ? (
                    <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-400 font-medium">No orders found</td></tr>
                  ) : adminOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors align-top">
                      {/* Order # */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-black text-gray-900">{order.id}</p>
                        <p className="text-[10px] text-gray-400 font-semibold">{order.items?.length || 0} product(s)</p>
                        {order.gifting_amount > 0 && (
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded bg-pink-50 text-[9px] font-bold text-pink-600 uppercase"><Gift className="h-3 w-3" /> Gift Wrap</span>
                        )}
                      </td>

                      {/* Customer & Delivery */}
                      <td className="px-5 py-4 max-w-[200px]">
                        <p className="text-xs font-bold text-gray-900">{order.customer_name}</p>
                        {order.addr_name && (
                          <div className="mt-1">
                            <p className="text-[10px] font-semibold text-gray-500">Delivery Address:</p>
                            <p className="text-[10px] text-gray-400 leading-relaxed">
                              {order.addr_name} - {order.addr_phone}<br />
                              {order.address_line}{order.city ? `, ${order.city}` : ''}{order.state ? `, ${order.state}` : ''} - {order.pin_code}
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Products */}
                      <td className="px-5 py-4 max-w-[200px]">
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {order.items?.map(item => `${item.name} x${item.quantity}`).join(', ') || '—'}
                        </p>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-black text-gray-900">Rs. {Number(order.total || 0).toLocaleString('en-IN')}</p>
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-bold capitalize ${order.payment_status === 'paid' ? 'text-emerald-600' : 'text-yellow-600'}`}>
                          {order.payment_status || 'Pending'}
                        </span>
                      </td>

                      {/* Extras & Notes */}
                      <td className="px-5 py-4 max-w-[150px]">
                        {order.gifting_message && (
                          <p className="text-[10px] text-gray-500"><span className="font-semibold">Gift:</span> {order.gifting_message}</p>
                        )}
                        {order.donation_amount > 0 && (
                          <p className="text-[10px] text-gray-500 mt-0.5"><span className="font-semibold">Donation:</span> Rs. {order.donation_amount}</p>
                        )}
                        {!order.gifting_message && !(order.donation_amount > 0) && (
                          <span className="text-[10px] text-gray-300">None</span>
                        )}
                      </td>

                      {/* Status dropdown */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700'
                            : order.status === 'cancelled' ? 'bg-red-50 text-red-600'
                            : order.status === 'shipped' ? 'bg-blue-50 text-blue-700'
                            : 'bg-yellow-50 text-yellow-700'
                          }`}>{order.status}</span>
                          <div className="relative">
                            <select value={order.status} onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="appearance-none bg-white border border-gray-200 rounded-lg px-2 py-1 pr-6 text-[10px] font-medium text-gray-500 outline-none focus:ring-1 focus:ring-[#F4B000]/30 cursor-pointer">
                              {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                            </select>
                            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </td>

                      {/* Placed date */}
                      <td className="px-5 py-4">
                        <p className="text-xs text-gray-400 font-medium whitespace-nowrap">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ APPLICATIONS ═══════ */}
      {activeTab === "applications" && (
        <>
          <div className="flex gap-2 mb-5 flex-wrap">
            {["PENDING","APPROVED","REJECTED"].map(s => (
              <button key={s} onClick={() => setAppFilter(s)} className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${appFilter===s?"bg-[#2B1D12] text-white shadow-sm":"bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{s}</button>
            ))}
          </div>
          <div className="space-y-3">
            {applications.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center"><p className="text-sm text-gray-400 font-medium">No {appFilter.toLowerCase()} applications</p></div>
            ) : applications.map(app => (
              <motion.div key={app.id} initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${app.application_type==='trainer'?'bg-purple-50 text-purple-700':'bg-blue-50 text-blue-700'}`}>{app.application_type}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${app.status==='PENDING'?'bg-yellow-50 text-yellow-700':app.status==='APPROVED'?'bg-emerald-50 text-emerald-700':'bg-red-50 text-red-700'}`}>{app.status}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900">{app.name}</h4>
                    <p className="text-xs text-gray-500">{app.email} • {app.mobile}</p>
                    {app.facility_name && <p className="text-xs text-gray-400 mt-0.5">Facility: <span className="font-semibold text-gray-600">{app.facility_name}</span></p>}
                    {app.referral_code && <p className="text-xs text-gray-400 mt-0.5">Referral: <span className="font-semibold text-[#D88A00]">{app.referral_code}</span></p>}
                  </div>
                  {app.status === 'PENDING' && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleReview(app.id,'APPROVED')} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> Approve</button>
                      <button onClick={() => handleReview(app.id,'REJECTED')} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600"><XCircle className="h-3.5 w-3.5" /> Reject</button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* ═══════ USERS ═══════ */}
      {activeTab === "users" && (
        <>
          <div className="flex gap-2 mb-5 flex-wrap">
            <button onClick={() => setUserRoleFilter("")} className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${!userRoleFilter?"bg-[#2B1D12] text-white":"bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>All</button>
            {VALID_ROLES.map(r => (
              <button key={r.value} onClick={() => setUserRoleFilter(r.value)} className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${userRoleFilter===r.value?"bg-[#2B1D12] text-white":"bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{r.label}</button>
            ))}
          </div>
          <DataTable title={`Users (${usersTotal})`} subtitle="Manage user roles" columns={[
            { key: "name", label: "Name", className: "text-xs font-bold text-gray-800" },
            { key: "email", label: "Email", className: "text-xs text-gray-500" },
            { key: "phone", label: "Phone", className: "text-xs text-gray-500" },
            { key: "role", label: "Role", render: (v, row) => {
              if (editingUserId === row.id) return (
                <div className="flex items-center gap-1.5">
                  <select value={editRoleValue} onChange={e => setEditRoleValue(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1 font-medium focus:ring-2 focus:ring-[#F4B000]/30 outline-none">
                    {VALID_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                  <button onClick={() => handleUpdateUserRole(row.id)} className="h-6 w-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100"><Save className="h-3 w-3" /></button>
                  <button onClick={() => setEditingUserId(null)} className="h-6 w-6 rounded-md bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-100"><X className="h-3 w-3" /></button>
                </div>
              );
              return (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{v?.replace(/_/g,' ')}</span>
                  <button onClick={() => { setEditingUserId(row.id); setEditRoleValue(v); }} className="h-5 w-5 rounded flex items-center justify-center text-gray-300 hover:text-blue-500"><Pencil className="h-3 w-3" /></button>
                </div>
              );
            }},
            { key: "created_at", label: "Joined", className: "text-xs text-gray-400", render: (v) => new Date(v).toLocaleDateString() },
          ]} data={users} />
        </>
      )}

      {/* ═══════ COMMISSIONS ═══════ */}
      {activeTab === "commissions" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 mb-8">
            <StatsCard index={0} label="Total Commissions Paid" value={`₹${Number(commissionsSummary.total_paid_out || 0).toLocaleString('en-IN')}`} icon={DollarSign} />
            <StatsCard index={1} label="Total Pending Commissions" value={`₹${Number(commissionsSummary.total_pending || 0).toLocaleString('en-IN')}`} icon={Clock} />
          </div>

          <div className="mb-8">
            <DataTable
              title="Network Revenue Breakdown"
              subtitle="Direct total revenue driven by each Distributor/Trainer"
              columns={[
                { key: "name", label: "Network Partner", className: "text-xs font-bold text-gray-800" },
                { key: "role", label: "Role", render: (v) => <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{v?.replace(/_/g,' ')}</span> },
                { key: "total_revenue", label: "Total Revenue Generated", className: "text-xs font-bold text-emerald-600", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
                { key: "total_commission", label: "Total Commission", className: "text-xs font-bold text-[#D88A00]", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
                { key: "pending_commission", label: "Pending", className: "text-xs text-gray-500", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
              ]}
              data={commissionsUserBreakdown}
            />
          </div>

          <DataTable
            title="Individual Commission Transactions"
            subtitle="Detailed breakdown of every order commission"
            columns={[
              { key: "created_at", label: "Date", className: "text-xs text-gray-400", render: (v) => new Date(v).toLocaleDateString() },
              { key: "name", label: "Recipient", className: "text-xs font-bold text-gray-800" },
              { key: "user_role", label: "Role", render: (v) => <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{v?.replace(/_/g,' ')}</span> },
              { key: "order_id", label: "Order ID", className: "text-xs text-gray-500" },
              { key: "order_total", label: "Order Amount", className: "text-xs font-medium text-gray-800", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
              { key: "amount", label: "Commission", className: "text-xs font-black text-[#D88A00]", render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
              { key: "status", label: "Status", render: (v) => (
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${v === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-yellow-50 text-yellow-700'}`}>{v}</span>
              )},
            ]}
            data={commissionsList}
          />
        </>
      )}

      {/* ═══════ MESSAGES ═══════ */}
      {activeTab === "messages" && (
        <>
          <div className="flex items-center gap-3 mb-5">
            <h3 className="text-base font-black text-[#2B1D12]">Contact Messages</h3>
            {messagesUnread > 0 && <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600">{messagesUnread} unread</span>}
          </div>
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center"><Mail className="h-10 w-10 text-gray-200 mx-auto mb-2" /><p className="text-sm text-gray-400 font-medium">No contact messages yet</p></div>
            ) : messages.map(msg => (
              <motion.div key={msg.id} initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} className={`bg-white border rounded-2xl p-5 shadow-sm ${msg.is_read?'border-gray-100':'border-[#F4B000]/30 bg-[#FFFDF7]'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1"><span className="text-sm font-bold text-gray-900">{msg.name}</span>{!msg.is_read && <span className="h-2 w-2 rounded-full bg-[#F4B000]" />}</div>
                    <p className="text-xs text-gray-500 mb-1">{msg.email}</p>
                    {msg.subject && <p className="text-xs font-semibold text-gray-700 mb-1">{msg.subject}</p>}
                    <p className="text-sm text-gray-600 leading-relaxed">{msg.message}</p>
                    <p className="text-[10px] text-gray-300 mt-2">{new Date(msg.created_at).toLocaleString()}</p>
                  </div>
                  {!msg.is_read && (
                    <button onClick={() => handleMarkRead(msg.id)} className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50 text-xs font-semibold text-gray-500 hover:bg-[#FFF8E8] hover:text-[#D88A00] transition-colors"><Eye className="h-3.5 w-3.5" /> Read</button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* ═══════ NEWSLETTERS ═══════ */}
      {activeTab === "newsletters" && (
        <DataTable title={`Newsletter Subscribers (${subscribersTotal})`} subtitle="All email subscribers" columns={[
          { key: "email", label: "Email", className: "text-xs font-semibold text-gray-800" },
          { key: "subscribed_at", label: "Subscribed", className: "text-xs text-gray-400", render: (v) => v ? new Date(v).toLocaleDateString() : "—" },
        ]} data={subscribers} emptyMessage="No subscribers yet" />
      )}

      {/* ═══════ SETTINGS (Commission Rules) ═══════ */}
      {activeTab === "settings" && (
        <>
          <div className="flex items-center justify-between mb-5">
            <div><h3 className="text-base font-black text-[#2B1D12]">Commission Rules</h3><p className="text-[11px] text-gray-400 font-medium mt-0.5">Manage commission percentages per role and product category</p></div>
            <button onClick={() => setShowAddForm(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F4B000] text-[#2B1D12] text-xs font-bold hover:bg-[#E59700] transition-colors shadow-sm"><Plus className="h-3.5 w-3.5" /> Add Rule</button>
          </div>
          {showAddForm && (
            <motion.div initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0 }} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-5">
              <h4 className="text-sm font-bold text-[#2B1D12] mb-3">New Commission Rule</h4>
              <div className="grid gap-3 sm:grid-cols-3 mb-3">
                <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Role</label>
                <select value={addForm.role} onChange={e => setAddForm({...addForm,role:e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#F4B000]/30 outline-none">
                  <option value="TRAINER_OR_RETAILER">Trainer / Retailer</option><option value="GYM_OR_AREA_DISTRIBUTOR">Gym / Area Distributor</option><option value="CITY_DISTRIBUTOR">City Distributor</option>
                </select></div>
                <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Commission %</label>
                <input type="number" min="0" max="100" step="0.01" value={addForm.commission_percent} onChange={e => setAddForm({...addForm,commission_percent:e.target.value})} placeholder="e.g. 10" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#F4B000]/30 outline-none" /></div>
                <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Category</label>
                <input type="text" value={addForm.product_category} onChange={e => setAddForm({...addForm,product_category:e.target.value})} placeholder="* for all" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#F4B000]/30 outline-none" /></div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200">Cancel</button>
                <button onClick={handleAddRule} className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600">Create</button>
              </div>
            </motion.div>
          )}
          {rulesLoading ? (
            <div className="flex justify-center py-10"><div className="h-8 w-8 rounded-full border-3 border-[#F4B000] border-t-transparent animate-spin" /></div>
          ) : commissionRules.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center"><Settings2 className="h-10 w-10 text-gray-200 mx-auto mb-2" /><p className="text-sm text-gray-400 font-medium">No commission rules configured</p></div>
          ) : (
            <div className="space-y-2">
              {commissionRules.map(rule => (
                <motion.div key={rule.id} initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                  {editingRule === rule.id ? (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 grid gap-3 sm:grid-cols-2">
                        <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Commission %</label>
                        <input type="number" min="0" max="100" step="0.01" value={editForm.commission_percent??''} onChange={e => setEditForm({...editForm,commission_percent:e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#F4B000]/30 outline-none" /></div>
                        <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Category</label>
                        <input type="text" value={editForm.product_category??''} onChange={e => setEditForm({...editForm,product_category:e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#F4B000]/30 outline-none" /></div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={handleSaveRule} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-[10px] font-bold hover:bg-emerald-600"><Save className="h-3.5 w-3.5" /></button>
                        <button onClick={() => setEditingRule(null)} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 text-[10px] font-bold hover:bg-gray-200"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${rule.role==='TRAINER_OR_RETAILER'?'bg-purple-50 text-purple-700':rule.role==='GYM_OR_AREA_DISTRIBUTOR'?'bg-blue-50 text-blue-700':'bg-cyan-50 text-cyan-700'}`}>{rule.role?.replace(/_/g,' ')}</span>
                        <span className="text-lg font-black text-gray-900">{Number(rule.commission_percent)}%</span>
                        <span className="text-xs text-gray-400">Category: <span className="font-semibold text-gray-600">{rule.product_category==='*'?'All':rule.product_category}</span></span>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={() => { setEditingRule(rule.id); setEditForm({ commission_percent:rule.commission_percent, product_category:rule.product_category }); }} className="h-7 w-7 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600"><Pencil className="h-3.5 w-3.5" /></button>
                        {rule.active && <button onClick={() => handleDeleteRule(rule.id)} className="h-7 w-7 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>}
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
