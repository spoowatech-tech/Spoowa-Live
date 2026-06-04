import { Search, User, ShoppingBag, Menu, LogOut, Package } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import logo from "@/assets/logo.png";

export function AnnouncementBar() {
  const items = [
    "🇮🇳 MADE IN INDIA",
    "● NO ARTIFICIAL FLAVORS",
    "⚡ ELECTROLYTES + VITAMINS",
    "💧 FAST HYDRATION",
    "📦 FREE SHIPPING ON ORDERS ABOVE ₹499",
  ];
  return (
    <div className="border-b border-border/60 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 overflow-x-auto px-4 py-2.5 text-[11px] font-semibold tracking-wider text-foreground/80 sm:px-6 lg:px-8">
        {items.map((it) => (
          <span key={it} className="whitespace-nowrap">{it}</span>
        ))}
      </div>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const { summary } = useCart();
  const cartCount = summary?.totalItems || 0;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    { label: "About Us", to: "/about" },
    { label: "Ingredients", to: "/about" },
    { label: "Team", to: "/team" },
    { label: "Contact", to: "/about" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="logo inline-flex items-center">
          <img src={logo} alt="SPOOWA Logo" className="h-8 w-auto object-contain" />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <Link key={l.label} to={l.to} className="text-sm font-bold tracking-wide text-foreground/80 transition-colors hover:text-accent">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button aria-label="Search" className="hidden sm:inline-flex rounded-full p-2 hover:bg-muted">
            <Search className="h-5 w-5" />
          </button>
          
          <div className="relative hidden sm:inline-block" ref={dropdownRef}>
            {user ? (
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-full p-2 hover:bg-muted font-bold text-sm text-[#2B1D12]"
              >
                <div className="h-7 w-7 rounded-full bg-[#F4B000] text-white grid place-items-center uppercase text-xs shadow-sm">
                  {user.name.charAt(0)}
                </div>
              </button>
            ) : (
              <Link to="/auth" aria-label="Account" className="inline-flex rounded-full p-2 hover:bg-muted">
                <User className="h-5 w-5" />
              </Link>
            )}
            
            {userDropdownOpen && user && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-gray-100 bg-white shadow-lg overflow-hidden py-1 z-50 animate-fade-up animate-duration-200">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-sm font-bold text-[#2B1D12] truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <button className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-[#FFF8E8] hover:text-[#D88A00] transition-colors">
                  <Package className="h-4 w-4" /> My Orders
                </button>
                <button onClick={() => { logout(); setUserDropdownOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            )}
          </div>

          <Link to="/cart" aria-label="Cart" className="relative rounded-full p-2 hover:bg-muted">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>
          <button aria-label="Menu" onClick={() => setOpen(!open)} className="lg:hidden rounded-full p-2 hover:bg-muted">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-white lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="rounded-md px-2 py-2.5 text-sm font-bold hover:bg-muted">{l.label}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
