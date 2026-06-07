import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  LogOut, Menu, X, ChevronLeft, ExternalLink, Store
} from "lucide-react";
import logo from "@/assets/logo.png";

/**
 * Sidebar + Topbar admin-panel layout for all dashboards.
 * Matches the NIRVI-style control center aesthetic.
 *
 * Props:
 *   - brandTitle: string (e.g. "SPOOWA")
 *   - brandSubtitle: string (e.g. "ADMIN PANEL")
 *   - pageTitle: string (e.g. "Dashboard")
 *   - menuItems: [{ key, label, icon: LucideIcon }]
 *   - activeTab: string
 *   - setActiveTab: fn
 *   - headerActions: ReactNode (extra buttons in the top bar)
 *   - children: ReactNode (main content)
 */
export default function DashboardLayout({
  brandTitle = "SPOOWA",
  brandSubtitle = "ADMIN PANEL",
  pageTitle = "Dashboard",
  menuItems = [],
  activeTab,
  setActiveTab,
  headerActions,
  children,
}) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const activeItem = menuItems.find(m => m.key === activeTab);

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAF8]">
      {/* ── Mobile Overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-100 shadow-sm transition-all duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static
          ${collapsed ? "lg:w-[72px]" : "lg:w-[250px]"}`}
        style={{ width: sidebarOpen ? 250 : undefined }}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center border-b border-gray-100 h-16 shrink-0 ${collapsed ? "justify-center px-2" : "px-5 gap-3"}`}>
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2.5 min-w-0">
              <img src={logo} alt="Logo" className="h-8 w-auto object-contain shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-black text-[#2B1D12] tracking-wide leading-none truncate">{brandTitle}</p>
                <p className="text-[9px] font-bold text-gray-400 tracking-[0.15em] uppercase leading-none mt-0.5">{brandSubtitle}</p>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link to="/">
              <img src={logo} alt="Logo" className="h-7 w-auto object-contain" />
            </Link>
          )}
          {/* Mobile close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden h-8 w-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 rounded-xl text-[13px] font-semibold transition-all duration-150
                  ${collapsed ? "justify-center px-2 py-2.5" : "px-3.5 py-2.5"}
                  ${isActive
                    ? "bg-[#2B1D12] text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
              >
                {Icon && <Icon className={`shrink-0 ${collapsed ? "h-5 w-5" : "h-4 w-4"}`} />}
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && item.badge !== undefined && (
                  <span className={`ml-auto text-[10px] font-bold rounded-full px-2 py-0.5 ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className={`border-t border-gray-100 p-3 space-y-2 shrink-0 ${collapsed ? "px-2" : ""}`}>
          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
            {!collapsed && <span>Collapse</span>}
          </button>

          {/* User info + Logout */}
          {!collapsed && user && (
            <div className="flex items-center gap-2.5 rounded-xl bg-gray-50 px-3 py-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#F4B000] to-[#E59700] text-white grid place-items-center uppercase text-xs font-bold shadow-sm shrink-0">
                {user.name?.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-800 truncate">{user.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{user.role?.replace(/_/g, ' ')}</p>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          {collapsed && user && (
            <button
              onClick={logout}
              title="Logout"
              className="w-full flex items-center justify-center py-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden h-9 w-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>

            <div>
              <p className="text-[9px] font-bold text-gray-400 tracking-[0.15em] uppercase leading-none">{brandTitle} CONTROL CENTER</p>
              <h1 className="text-lg font-black text-[#2B1D12] leading-tight">{activeItem?.label || pageTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Store */}
            <Link
              to="/shop"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Store className="h-3.5 w-3.5" /> View Store
            </Link>

            {headerActions}

            {/* User avatar in header */}
            {user && (
              <div className="flex items-center gap-2.5 ml-2">
                <div className="hidden sm:flex items-center gap-2 border-l border-gray-100 pl-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#F4B000] to-[#E59700] text-white grid place-items-center uppercase text-xs font-bold shadow-sm">
                    {user.name?.charAt(0)}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs font-bold text-gray-800 leading-none">{user.name}</p>
                    <p className="text-[10px] text-gray-400 leading-none mt-0.5">{user.role?.replace(/_/g, ' ').toLowerCase()}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
