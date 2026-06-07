import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Navbar, AnnouncementBar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getCustomerDashboardData, applyReferralCode as applyReferralCodeApi, validateReferralCode } from "@/services/api";
import {
  User, Package, Heart, MapPin, Settings, ShoppingBag,
  Award, Flame, ArrowLeft, CheckCircle2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const TABS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "orders", label: "My Orders", icon: Package },
  { key: "referral", label: "Referral Info", icon: Award },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function CustomerAccount() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const result = await getCustomerDashboardData();
      setData(result);
    } catch (err) { console.error("Account load error:", err); }
    finally { setLoading(false); }
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="bg-page min-h-screen">
        {/* Header */}
        <section className="bg-gradient-to-br from-[#FFF8E8] to-[#FFFDF7] py-10 border-b border-[#F4B000]/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#D88A00] mb-4 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#F4B000] to-[#E59700] text-white grid place-items-center text-xl font-black shadow-lg shrink-0">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#2B1D12] font-display">{user?.name}</h1>
                <p className="text-sm text-gray-500 font-medium">{user?.email}</p>
                <span className="inline-flex mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 tracking-wider">{user?.role?.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Sidebar Tabs */}
              <div className="lg:col-span-3">
                <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible bg-white border border-gray-100 rounded-2xl p-2 shadow-sm">
                  {TABS.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                        activeTab === tab.key ? "bg-[#FFF8E8] text-[#D88A00] font-bold" : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <tab.icon className="h-4 w-4 shrink-0" /> {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-9">
                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="h-10 w-10 rounded-full border-3 border-[#F4B000] border-t-transparent animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* Profile */}
                    {activeTab === "profile" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-base font-black text-[#2B1D12] mb-5">Profile Information</h2>
                        <div className="grid gap-5 sm:grid-cols-2">
                          {[
                            { label: "Full Name", value: user?.name },
                            { label: "Email Address", value: user?.email },
                            { label: "Phone", value: user?.phone || "—" },
                            { label: "Account Type", value: user?.role?.replace(/_/g, ' ') },
                            { label: "Total Orders", value: data?.total_orders || 0 },
                            { label: "Total Spent", value: `₹${Number(data?.total_spent || 0).toLocaleString('en-IN')}`, highlight: true },
                          ].map(item => (
                            <div key={item.label}>
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">{item.label}</label>
                              <p className={`text-sm font-semibold ${item.highlight ? 'text-[#D88A00]' : 'text-gray-800'}`}>{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Orders */}
                    {activeTab === "orders" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-base font-black text-[#2B1D12] mb-5">My Orders</h2>
                        {(data?.orders || []).length === 0 ? (
                          <div className="py-10 text-center">
                            <ShoppingBag className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                            <p className="text-sm text-gray-400 font-medium">No orders yet</p>
                            <Link to="/shop" className="inline-flex mt-3 px-5 py-2 rounded-xl bg-[#2B1D12] text-white text-xs font-bold hover:bg-[#3D2A1A] transition-colors">Start Shopping</Link>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {data.orders.map((order) => (
                              <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                <div>
                                  <p className="text-xs font-bold text-gray-800">Order #{order.id}</p>
                                  <p className="text-[10px] text-gray-400">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-gray-900">₹{Number(order.total || 0).toLocaleString('en-IN')}</p>
                                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                    order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700'
                                    : order.status === 'cancelled' ? 'bg-red-50 text-red-600'
                                    : 'bg-yellow-50 text-yellow-700'
                                  }`}>{order.status}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Referral */}
                    {activeTab === "referral" && (
                      <ReferralTab data={data} onRefresh={loadData} />
                    )}

                    {/* Addresses */}
                    {activeTab === "addresses" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-base font-black text-[#2B1D12] mb-5">Saved Addresses</h2>
                        {(data?.addresses || []).length === 0 ? (
                          <div className="py-10 text-center">
                            <MapPin className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                            <p className="text-sm text-gray-400 font-medium">No saved addresses</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {data.addresses.map((addr) => (
                              <div key={addr.id} className="p-4 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{addr.label}</span>
                                  {addr.is_default && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#FFF8E8] text-[#D88A00]">Default</span>}
                                </div>
                                <p className="text-sm font-semibold text-gray-800">{addr.full_name}</p>
                                <p className="text-xs text-gray-500">{addr.address_line}, {addr.city}, {addr.state} - {addr.pin_code}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Settings */}
                    {activeTab === "settings" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-base font-black text-[#2B1D12] mb-5">Account Settings</h2>
                        <div className="py-10 text-center">
                          <Settings className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                          <p className="text-sm text-gray-400 font-medium">Account settings coming soon!</p>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ReferralTab({ data, onRefresh }) {
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [applying, setApplying] = useState(false);
  const [verified, setVerified] = useState(null);

  const handleVerify = async () => {
    if (!code.trim()) return;
    setVerifying(true);
    try {
      const result = await validateReferralCode(code.trim());
      setVerified(result);
      toast.success(`Valid! ${result.referrer_name} (${result.referrer_role?.replace(/_/g, ' ')})`);
    } catch {
      setVerified(null);
      toast.error("Invalid referral code");
    } finally { setVerifying(false); }
  };

  const handleApply = async () => {
    if (!code.trim()) return;
    setApplying(true);
    try {
      await applyReferralCodeApi(code.trim());
      toast.success("Referral code applied! You're now linked.");
      onRefresh();
    } catch (err) {
      toast.error(err.message || "Failed to apply code");
    } finally { setApplying(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-black text-[#2B1D12] mb-5">Referral Information</h2>

      {data?.referral ? (
        <div className="p-5 rounded-xl border border-[#F4B000]/20 bg-[#FFFDF7]">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Linked to Referrer</p>
          </div>
          <p className="text-lg font-black text-gray-900">{data.referral.referrer_name}</p>
          <p className="text-xs text-gray-500 mt-1">
            Code: <span className="font-bold text-[#D88A00]">{data.referral.referral_code_used}</span>
            <span className="ml-3 text-gray-300">|</span>
            <span className="ml-3">{data.referral.referrer_role?.replace(/_/g, ' ')}</span>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 text-center">
            <p className="text-sm text-gray-500 font-medium">No referral linked yet</p>
            <p className="text-xs text-gray-400 mt-1">Enter a trainer, gym, or city distributor code to link your account</p>
          </div>
          <div>
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">
              Enter Referral Code
            </label>
            <div className="flex gap-2">
              <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. TR-xxxx or GD-xxxx or CD-xxxx"
                className="flex-1 h-12 rounded-xl border-2 border-gray-200 bg-[#FAFAFA] px-4 text-sm font-bold text-gray-900 outline-none transition-all focus:bg-white focus:border-[#F4B000] focus:shadow-sm" />
              <button type="button" onClick={handleVerify} disabled={verifying}
                className="px-5 h-12 rounded-xl border-2 border-gray-200 bg-gray-50 text-xs font-black text-gray-600 uppercase tracking-wider hover:bg-gray-100 transition-colors disabled:opacity-50">
                {verifying ? "..." : "Verify"}
              </button>
            </div>
            {verified && (
              <div className="mt-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-700">✓ {verified.referrer_name}</p>
                  <p className="text-[10px] text-emerald-600">{verified.referrer_role?.replace(/_/g, ' ')}</p>
                </div>
                <button onClick={handleApply} disabled={applying}
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 disabled:opacity-50 transition-colors">
                  {applying ? "Applying..." : "Link Account"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
