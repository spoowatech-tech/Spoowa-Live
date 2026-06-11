import { Search, User, ShoppingBag, Menu, LogOut, X, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import logo from "@/assets/logo.png";

const TICKER_ITEMS = [
  "🇮🇳 MADE IN INDIA",
  "● NO ARTIFICIAL FLAVORS",
  "⚡ ELECTROLYTES + VITAMINS",
  "💧 FAST HYDRATION",
  "📦 FREE SHIPPING ON ORDERS ABOVE ₹499",
  "🌿 100% NATURAL INGREDIENTS",
  "🏆 TRUSTED BY 50K+ CUSTOMERS",
];

export function AnnouncementBar() {
  const repeated = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative overflow-hidden bg-[#2B1D12] py-2.5">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-[#2B1D12] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-[#2B1D12] to-transparent" />
      <div className="flex animate-marquee whitespace-nowrap">
        {repeated.map((item, i) => (
          <span key={i} className="mx-6 text-[11px] font-bold tracking-[0.18em] text-white/90 uppercase shrink-0">
            {item}
            <span className="ml-6 text-[#F4B000]/60">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(0);
  const [cartBump, setCartBump] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { summary } = useCart();
  const cartCount = summary?.totalItems || 0;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (cartCount > prevCartCount) {
      setCartBump(true);
      const t = setTimeout(() => setCartBump(false), 500);
      return () => clearTimeout(t);
    }
    setPrevCartCount(cartCount);
  }, [cartCount]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const links = [
    { label: "Shop", to: "/shop" },
    { label: "Explore All", to: "/products" },
    { label: "Cart", to: "/cart" },
  ];

  const isActive = (to) => location.pathname.startsWith(to);

  const displayName = user?.first_name || user?.name || user?.email || "U";

  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "shadow-[0_1px_24px_rgba(43,29,18,0.10)] border-b border-[#F4B000]/10" : "border-b border-border/40"
      }`}
    >
      <div className="mx-auto flex max-w-[1920px] items-center justify-between px-4 py-3.5 lg:px-8">
        {/* Logo */}
        <Link to="/shop" className="inline-flex items-center shrink-0">
          <img src={logo} alt="SPOOWA Logo" className="h-9 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className={`relative text-[13px] font-bold tracking-wide transition-colors duration-200 py-1 ${
                isActive(l.to) ? "text-[#D88A00]" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {l.label}
              {isActive(l.to) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-[#F4B000] to-[#E59700]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {/* Profile icon */}
          <div className="relative hidden sm:inline-block" ref={dropdownRef}>
            {user ? (
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-full p-1.5 hover:bg-muted transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#F4B000] to-[#E59700] text-white grid place-items-center uppercase text-xs font-bold shadow-[0_4px_12px_rgba(244,176,0,0.30)]">
                  {displayName.charAt(0)}
                </div>
              </button>
            ) : (
              <Link to="/auth" aria-label="Account" className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors">
                <User className="h-5 w-5 text-foreground/70" />
              </Link>
            )}

            <AnimatePresence>
              {userDropdownOpen && user && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden z-50"
                >
                  <div className="px-4 py-3.5 bg-gradient-to-br from-[#FFF8E8] to-white border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#F4B000] to-[#E59700] text-white grid place-items-center uppercase text-sm font-bold shrink-0 shadow-sm">
                        {displayName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#2B1D12] truncate">{displayName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1.5">
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 shrink-0" /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart */}
          <Link to="/cart" aria-label="Cart" className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors">
            <ShoppingBag className="h-5 w-5 text-foreground/70" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span key={cartCount} initial={{ scale: 0 }} animate={{ scale: cartBump ? [1, 1.4, 0.9, 1] : 1 }} transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] px-1 place-items-center rounded-full bg-gradient-to-br from-[#F4B000] to-[#E59700] text-[9px] font-bold text-white shadow-sm">
                  {cartCount > 99 ? "99+" : cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Mobile menu toggle */}
          <button aria-label="Open menu" onClick={() => setOpen(!open)} className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Menu className="h-5 w-5 text-foreground/70" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden" />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 h-full w-[78vw] max-w-[320px] bg-white shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <img src={logo} alt="SPOOWA" className="h-8 w-auto object-contain" />
                <button onClick={() => setOpen(false)} className="h-9 w-9 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-4">
                {links.map((l, i) => (
                  <motion.div key={l.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04, duration: 0.3 }}>
                    <Link to={l.to} onClick={() => setOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-bold transition-all ${
                        isActive(l.to) ? "bg-[#FFF8E8] text-[#D88A00]" : "text-foreground/80 hover:bg-muted"
                      }`}>
                      {l.label}
                      <ChevronRight className="h-4 w-4 opacity-40" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="border-t border-gray-100 p-4 space-y-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FFF8E8]">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#F4B000] to-[#E59700] text-white grid place-items-center uppercase text-sm font-bold shadow-sm shrink-0">
                        {displayName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#2B1D12] truncate">{displayName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button onClick={() => { logout(); setOpen(false); }}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F4B000] to-[#E59700] py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(244,176,0,0.30)]">
                    <User className="h-4 w-4" /> Sign In / Sign Up
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
