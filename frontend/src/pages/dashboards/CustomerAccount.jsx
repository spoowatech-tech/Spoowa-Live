import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getCustomerDashboardData, getAddresses, getReferralInfo } from "@/services/api";
import {
  User, Package, Heart, MapPin, Settings, LogOut, ShoppingBag,
  ChevronRight, Award, Flame, Copy
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function CustomerAccount() {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const result = await getCustomerDashboardData();
      setData(result);
    } catch (err) {
      console.error("Account load error:", err);
    } finally {
      setLoading(false);
    }
  }

  const menuItems = [
    { key: "profile", label: "Profile", icon: User },
    { key: "orders", label: "My Orders", icon: Package },
    { key: "subscriptions", label: "My Subscriptions", icon: Heart },
    { key: "referral", label: "Referral Information", icon: Award },
    { key: "addresses", label: "Saved Addresses", icon: MapPin },
    { key: "streak", label: "Sweat Streak", icon: Flame },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <AnnouncementBar />
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 h-fit shadow-sm">
            {/* User Info */}
            <div className="flex items-center gap-3 pb-5 border-b border-gray-100 mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#F4B000] to-[#E59700] text-white grid place-items-center uppercase text-lg font-black shadow-md">
                {user?.name?.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-gray-900 truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-400 font-semibold truncate">{user?.email}</p>
              </div>
            </div>

            {/* Menu */}
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                    activeSection === item.key
                      ? "bg-[#FFF8E8] text-[#D88A00]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                  <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-40" />
                </button>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-all mt-2"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Logout
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="min-w-0">
            {loading ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-12 flex justify-center">
                <div className="h-8 w-8 rounded-full border-3 border-[#F4B000] border-t-transparent animate-spin" />
              </div>
            ) : (
              <>
                {/* Profile Section */}
                {activeSection === "profile" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                    <h2 className="text-xl font-black text-gray-900 uppercase mb-6">Profile</h2>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Name</label>
                        <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Email</label>
                        <p className="text-sm font-bold text-gray-800">{user?.email}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Total Orders</label>
                        <p className="text-sm font-bold text-gray-800">{data?.total_orders || 0}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Total Spent</label>
                        <p className="text-sm font-bold text-[#D88A00]">₹{Number(data?.total_spent || 0).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* My Orders */}
                {activeSection === "orders" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                    <h2 className="text-xl font-black text-gray-900 uppercase mb-6">My Orders</h2>
                    {(data?.orders || []).length === 0 ? (
                      <div className="py-12 text-center">
                        <ShoppingBag className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-sm text-gray-400 font-semibold">No orders yet</p>
                        <Link to="/shop" className="inline-flex mt-4 px-5 py-2.5 rounded-full bg-[#F4B000] text-[#2B1D12] text-xs font-black uppercase tracking-widest hover:bg-[#E59700] transition-colors">
                          Start Shopping
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {data.orders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                            <div>
                              <p className="text-xs font-black text-gray-800">Order #{order.id}</p>
                              <p className="text-[10px] text-gray-400 font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-gray-900">₹{Number(order.total || 0).toLocaleString('en-IN')}</p>
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>{order.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Subscriptions */}
                {activeSection === "subscriptions" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                    <h2 className="text-xl font-black text-gray-900 uppercase mb-6">My Subscriptions</h2>
                    <div className="py-12 text-center">
                      <Heart className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                      <p className="text-sm text-gray-400 font-semibold">Subscription feature coming soon!</p>
                    </div>
                  </motion.div>
                )}

                {/* Referral Info */}
                {activeSection === "referral" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                    <h2 className="text-xl font-black text-gray-900 uppercase mb-6">Referral Information</h2>
                    {data?.referral ? (
                      <div className="p-5 rounded-2xl border border-gray-100 bg-[#FFF8E8]">
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Referred By</p>
                        <p className="text-lg font-black text-gray-900">{data.referral.referrer_name}</p>
                        <p className="text-xs text-gray-500 font-semibold mt-1">Code used: <span className="font-black text-[#D88A00]">{data.referral.referral_code_used}</span></p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 font-semibold py-8 text-center">No referral information. You signed up directly.</p>
                    )}
                  </motion.div>
                )}

                {/* Addresses */}
                {activeSection === "addresses" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                    <h2 className="text-xl font-black text-gray-900 uppercase mb-6">Saved Addresses</h2>
                    {(data?.addresses || []).length === 0 ? (
                      <div className="py-12 text-center">
                        <MapPin className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-sm text-gray-400 font-semibold">No saved addresses</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {data.addresses.map((addr) => (
                          <div key={addr.id} className="p-4 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{addr.label}</span>
                              {addr.is_default && <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#FFF8E8] text-[#D88A00]">Default</span>}
                            </div>
                            <p className="text-sm font-bold text-gray-800">{addr.full_name}</p>
                            <p className="text-xs text-gray-500 font-semibold">{addr.address_line}, {addr.city}, {addr.state} - {addr.pin_code}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Sweat Streak */}
                {activeSection === "streak" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                    <h2 className="text-xl font-black text-gray-900 uppercase mb-6">Sweat Streak 🔥</h2>
                    <div className="py-12 text-center">
                      <Flame className="h-16 w-16 text-orange-300 mx-auto mb-3" />
                      <p className="text-3xl font-black text-gray-900 mb-1">0 Days</p>
                      <p className="text-sm text-gray-400 font-semibold">Streak tracking coming soon!</p>
                    </div>
                  </motion.div>
                )}

                {/* Settings */}
                {activeSection === "settings" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                    <h2 className="text-xl font-black text-gray-900 uppercase mb-6">Settings</h2>
                    <div className="py-12 text-center">
                      <Settings className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                      <p className="text-sm text-gray-400 font-semibold">Account settings coming soon!</p>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
