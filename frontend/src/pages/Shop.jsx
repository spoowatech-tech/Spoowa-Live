import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search, ChevronDown,
  SlidersHorizontal, X,
  ShieldCheck, Lock, Droplets, FlaskConical,
  ArrowRight, Package, Award, Sparkles, Zap, Leaf, Truck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import { getProducts } from "@/services/api";
import ProductCard from "@/components/ProductCard";

const productTypes = ["Raw Honey", "Wild Forest Honey", "Organic Honey", "Turmeric Honey", "Acacia Honey", "Ginger Honey", "Gift Packs", "Wellness Combos"];
const healthBenefits = ["Immunity", "Energy Boost", "Digestion", "Skin Health", "Weight Management"];
const priceRanges = [{ label: "₹0 – ₹299", min: 0, max: 299 }, { label: "₹300 – ₹499", min: 300, max: 499 }, { label: "₹500 – ₹999", min: 500, max: 999 }, { label: "₹1000+", min: 1000, max: Infinity }];
const sizes = ["250g", "500g", "1kg"];

const BADGE_STYLES = {
  "Best Seller":      "bg-[#F4B000] text-white",
  "New Arrival":      "bg-[#3B82F6] text-white",
  "Most Popular":     "bg-[#8B5CF6] text-white",
  "Athlete Favorite": "bg-[#EF4444] text-white",
  "Limited Edition":  "bg-[#EC4899] text-white",
  "default":          "bg-foreground text-white",
};

function getBadgeStyle(badge) {
  return BADGE_STYLES[badge] || BADGE_STYLES["default"];
}

function CheckIcon() {
  return (
    <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function FilterCheckbox({ label, count, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-1.5">
      <div
        className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
          checked ? "border-[#F4B000] bg-[#F4B000]" : "border-gray-200 group-hover:border-[#F4B000]/60"
        }`}
      >
        {checked && <CheckIcon />}
      </div>
      <span className="flex-1 text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{label}</span>
      {count > 0 && (
        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{count}</span>
      )}
    </label>
  );
}

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/40 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3.5 text-xs font-extrabold tracking-[0.12em] text-foreground/60 uppercase"
      >
        {title}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StarRating({ rating, size = "sm" }) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${starSize} ${
            s <= full
              ? "fill-[#F4B000] text-[#F4B000]"
              : s === full + 1 && half
              ? "fill-[#F4B000]/50 text-[#F4B000]"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function FilterSidebar({ filters, setFilters, filteredProducts }) {
  const toggleType    = (type)    => setFilters(prev => ({ ...prev, types:       prev.types.includes(type)       ? prev.types.filter(t => t !== type)             : [...prev.types, type] }));
  const toggleBenefit = (b)       => setFilters(prev => ({ ...prev, benefits:    prev.benefits.includes(b)       ? prev.benefits.filter(x => x !== b)             : [...prev.benefits, b] }));
  const togglePrice   = (label)   => setFilters(prev => ({ ...prev, priceRanges: prev.priceRanges.includes(label)? prev.priceRanges.filter(p => p !== label)       : [...prev.priceRanges, label] }));
  const toggleSize    = (size)    => setFilters(prev => ({ ...prev, sizes:        prev.sizes.includes(size)       ? prev.sizes.filter(s => s !== size)             : [...prev.sizes, size] }));
  const setRating     = (rating)  => setFilters(prev => ({ ...prev, rating:       prev.rating === rating ? 0 : rating }));

  const countByType    = (t)   => filteredProducts.filter(p => p.type === t).length;
  const countByBenefit = (b)   => filteredProducts.filter(p => p.benefit === b).length;
  const countByPrice   = (r)   => filteredProducts.filter(p => p.price >= r.min && p.price <= r.max).length;
  const countBySize    = (s)   => filteredProducts.filter(p => p.sizes?.some(ps => ps.size_label === s)).length;
  const countByRating  = (min) => filteredProducts.filter(p => p.rating >= min).length;

  const hasFilters = filters.types.length || filters.benefits.length || filters.priceRanges.length || filters.sizes.length || filters.rating;

  return (
    <div className="rounded-2xl border border-border/50 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#F4B000]" /> Filters
        </h3>
        {hasFilters ? (
          <button
            onClick={() => setFilters({ types: [], benefits: [], priceRanges: [], sizes: [], rating: 0 })}
            className="text-[11px] font-bold text-[#D88A00] hover:text-[#2B1D12] transition-colors flex items-center gap-1"
          >
            <X className="h-3 w-3" /> Clear All
          </button>
        ) : null}
      </div>

      <div className="divide-y divide-border/30">
        <FilterSection title="Product Type">
          {productTypes.map(type => (
            <FilterCheckbox key={type} label={type} count={countByType(type)} checked={filters.types.includes(type)} onChange={() => toggleType(type)} />
          ))}
        </FilterSection>

        <FilterSection title="Health Benefits" defaultOpen={false}>
          {healthBenefits.map(benefit => (
            <FilterCheckbox key={benefit} label={benefit} count={countByBenefit(benefit)} checked={filters.benefits.includes(benefit)} onChange={() => toggleBenefit(benefit)} />
          ))}
        </FilterSection>

        <FilterSection title="Price Range" defaultOpen={false}>
          {priceRanges.map(range => (
            <FilterCheckbox key={range.label} label={range.label} count={countByPrice(range)} checked={filters.priceRanges.includes(range.label)} onChange={() => togglePrice(range.label)} />
          ))}
        </FilterSection>

        <FilterSection title="Size" defaultOpen={false}>
          <div className="flex flex-wrap gap-2 pt-1">
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
                  filters.sizes.includes(size)
                    ? "border-[#F4B000] bg-[#FFF8E8] text-[#D88A00]"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {size}
                <span className="ml-1 text-[10px] font-medium opacity-60">({countBySize(size)})</span>
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Rating" defaultOpen={false}>
          <div className="space-y-1.5 pt-1">
            {[5, 4, 3].map(min => (
              <button
                key={min}
                onClick={() => setRating(min)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-all ${
                  filters.rating === min ? "bg-[#FFF8E8]" : "hover:bg-muted"
                }`}
              >
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                  filters.rating === min ? "border-[#F4B000] bg-[#F4B000]" : "border-gray-200"
                }`}>
                  {filters.rating === min && <CheckIcon />}
                </div>
                <StarRating rating={min} />
                <span className="text-xs font-semibold text-muted-foreground ml-auto">
                  {min === 5 ? "5 only" : `${min}+`} <span className="opacity-60">({countByRating(min)})</span>
                </span>
              </button>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-[24px] border border-border/40 bg-white overflow-hidden">
      <div className="aspect-[4/5] animate-shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-4 rounded-lg animate-shimmer" />
        <div className="h-3 rounded-lg animate-shimmer w-2/3" />
        <div className="h-3 rounded-lg animate-shimmer w-1/2" />
        <div className="h-10 rounded-xl animate-shimmer mt-4" />
      </div>
    </div>
  );
}


function TrustSection() {
  const items = [
    { icon: Droplets, title: "100% Pure Honey", desc: "Sourced from trusted beekeepers", color: "from-amber-400 to-yellow-300" },
    { icon: Truck, title: "Free Shipping", desc: "On orders above ₹499", color: "from-emerald-400 to-green-300" },
    { icon: FlaskConical, title: "Lab Tested", desc: "For purity and quality assurance", color: "from-blue-400 to-sky-300" },
    { icon: Lock, title: "Secure Payments", desc: "100% safe and secure checkout", color: "from-purple-400 to-violet-300" },
  ];
  return (
    <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" id="trust">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="flex items-center gap-4 rounded-2xl border border-border/40 bg-white p-5 shadow-card hover:shadow-lift hover:-translate-y-0.5 transition-all duration-300 group"
        >
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} shadow-sm group-hover:scale-105 transition-transform`}>
            <item.icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{item.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Shop() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ types: [], benefits: [], priceRanges: [], sizes: [], rating: 0 });
  const [sortBy, setSortBy] = useState("best-selling");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data.products);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    if (filters.types.length && !filters.types.includes(p.type)) return false;
    if (filters.benefits.length && !filters.benefits.includes(p.benefit)) return false;
    if (filters.priceRanges.length) {
      const matched = filters.priceRanges.some(label => {
        const range = priceRanges.find(r => r.label === label);
        return range && p.price >= range.min && p.price <= range.max;
      });
      if (!matched) return false;
    }
    if (filters.sizes.length && !filters.sizes.some(s => p.sizes?.some(ps => ps.size_label === s))) return false;
    if (filters.rating && p.rating < filters.rating) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "new-arrivals":    return b.id - a.id;
      case "highest-rated":   return b.rating - a.rating;
      case "price-low-high":  return a.price - b.price;
      case "price-high-low":  return b.price - a.price;
      default:                return b.id - a.id;
    }
  });

  const activeFilterCount = filters.types.length + filters.benefits.length + filters.priceRanges.length + filters.sizes.length + (filters.rating ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-body">
      <AnnouncementBar />
      <Navbar />

      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFFBEB] via-[#FFFDF5] to-[#FEF3C7] border-b border-[#F4B000]/10">
        {/* Decorative background grid */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F4B000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#F4B000]/8 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#D4AF37]/8 blur-[120px] pointer-events-none" />

        <div className="mx-auto w-[95%] max-w-7xl px-4 py-14 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Left */}
            <div className="lg:col-span-7">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F4B000]/25 bg-white/70 backdrop-blur-sm px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-[#D88A00] uppercase shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" /> Pure by Nature, Made for You
                </span>
                <h1 className="mt-5 font-display text-[3.5rem] leading-[1.04] sm:text-[4.5rem] lg:text-[5rem] font-black text-[#2B1D12] tracking-tight">
                  Discover Pure<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4B000] to-[#E59700]">
                    Honey Goodness
                  </span>
                </h1>
                <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-gray-600 font-medium">
                  Experience nature's finest honey collection — crafted for wellness, energy, immunity, and everyday health.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a href="#product-grid" className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#F4B000] to-[#E59700] px-8 py-4 text-sm font-extrabold tracking-wide text-white shadow-[0_8px_30px_rgba(244,176,0,0.35)] hover:shadow-[0_12px_40px_rgba(244,176,0,0.45)] hover:-translate-y-0.5 transition-all active:scale-[0.98]">
                    Explore Collection <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <a href="#trust" className="group inline-flex items-center gap-2.5 rounded-full border-2 border-gray-200 bg-white/80 backdrop-blur-sm px-8 py-4 text-sm font-bold text-foreground/70 hover:border-[#F4B000]/40 hover:text-foreground transition-all">
                    <ShieldCheck className="h-4 w-4 text-[#F4B000]" /> Lab Tested Quality
                  </a>
                </div>
                {/* Stats */}
                <div className="mt-10 flex items-center gap-8 divide-x divide-gray-200">
                  {[["24+", "Honey Variants"], ["50K+", "Happy Customers"], ["100%", "Pure & Natural"]].map(([stat, label]) => (
                    <div key={label} className="flex flex-col pl-8 first:pl-0">
                      <span className="text-2xl font-black text-[#2B1D12]">{stat}</span>
                      <span className="text-[11px] font-semibold text-muted-foreground tracking-wide mt-0.5">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right visual */}
            <div className="relative lg:col-span-5 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#F4B000]/20 to-[#D4AF37]/10 rounded-full blur-[80px] scale-150" />
                <div className="relative h-[320px] w-[320px] sm:h-[400px] sm:w-[400px] rounded-full border-2 border-[#F4B000]/12 bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-[0_0_80px_rgba(244,176,0,0.10)]">
                  <div className="absolute inset-4 rounded-full border border-[#F4B000]/8" />
                  <div className="absolute inset-10 rounded-full border border-[#F4B000]/5" />
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-7xl sm:text-8xl animate-float drop-shadow-[0_10px_25px_rgba(244,176,0,0.22)]">🍯</span>
                    <span className="text-xs font-extrabold text-[#D88A00] tracking-[0.25em] uppercase">Premium Honey</span>
                  </div>
                  {/* Floating badges */}
                  <div className="absolute -top-5 -right-5 h-16 w-16 rounded-2xl bg-white border border-[#F4B000]/15 flex items-center justify-center shadow-card animate-float" style={{ animationDelay: "0.5s" }}>
                    <Award className="h-7 w-7 text-[#F4B000]" />
                  </div>
                  <div className="absolute -bottom-3 -left-5 h-14 w-14 rounded-2xl bg-white border border-[#F4B000]/15 flex items-center justify-center shadow-card animate-float" style={{ animationDelay: "1s" }}>
                    <Leaf className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="absolute top-1/2 -right-8 h-12 w-12 rounded-2xl bg-white border border-[#F4B000]/15 flex items-center justify-center shadow-card animate-float" style={{ animationDelay: "1.5s" }}>
                    <Zap className="h-5 w-5 text-[#F4B000]" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main className="mx-auto w-[95%] max-w-7xl px-4 py-10 sm:px-6 lg:py-14" id="product-grid">
        <div className="flex gap-8 lg:gap-10">

          {/* Sidebar — Desktop */}
          <aside className="hidden lg:block lg:w-[280px] xl:w-[300px] shrink-0">
            <div className="sticky top-28">
              <FilterSidebar filters={filters} setFilters={setFilters} filteredProducts={filteredProducts} />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {showMobileFilters && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMobileFilters(false)}
                  className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
                />
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 26, stiffness: 300 }}
                  className="fixed left-0 top-0 z-50 h-full w-[85vw] max-w-sm overflow-y-auto bg-white shadow-2xl lg:hidden"
                >
                  <div className="flex items-center justify-between border-b border-border px-5 py-4 sticky top-0 bg-white z-10">
                    <h3 className="text-sm font-extrabold flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-[#F4B000]" /> Filters
                      {activeFilterCount > 0 && (
                        <span className="ml-1 h-5 w-5 rounded-full bg-[#F4B000] text-white text-[10px] font-bold grid place-items-center">{activeFilterCount}</span>
                      )}
                    </h3>
                    <button onClick={() => setShowMobileFilters(false)} className="rounded-full p-1.5 hover:bg-muted">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <FilterSidebar filters={filters} setFilters={setFilters} filteredProducts={filteredProducts} />
                  </div>
                  <div className="sticky bottom-0 p-4 border-t border-border bg-white">
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="w-full rounded-xl bg-gradient-to-r from-[#F4B000] to-[#E59700] py-3.5 text-sm font-extrabold text-white shadow-gold"
                    >
                      Show {sortedProducts.length} Products
                    </button>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Product Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-bold shadow-sm hover:border-[#F4B000]/40 transition-colors relative"
                >
                  <SlidersHorizontal className="h-4 w-4 text-[#F4B000]" /> Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-[#F4B000] text-white text-[10px] font-bold grid place-items-center">{activeFilterCount}</span>
                  )}
                </button>
                <p className="text-sm font-semibold text-foreground/60">
                  <span className="text-foreground font-bold">{sortedProducts.length}</span> products
                  {filteredProducts.length !== products.length && (
                    <span className="text-muted-foreground font-normal"> of {products.length}</span>
                  )}
                </p>
              </div>

              {/* Sort control */}
              <div className="relative flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground hidden sm:block">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-border bg-white pl-4 pr-9 py-2.5 text-sm font-bold text-foreground shadow-sm outline-none focus:border-[#F4B000] focus:ring-2 focus:ring-[#F4B000]/15 transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                  }}
                >
                  <option value="best-selling">Best Selling</option>
                  <option value="new-arrivals">New Arrivals</option>
                  <option value="highest-rated">Highest Rated</option>
                  <option value="price-low-high">Price: Low → High</option>
                  <option value="price-high-low">Price: High → Low</option>
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.types.map(t => (
                  <button key={t} onClick={() => setFilters(prev => ({ ...prev, types: prev.types.filter(x => x !== t) }))}
                    className="flex items-center gap-1.5 rounded-full bg-[#FFF8E8] border border-[#F4B000]/30 px-3 py-1 text-xs font-bold text-[#D88A00] hover:bg-[#F4B000]/10 transition-colors">
                    {t} <X className="h-3 w-3" />
                  </button>
                ))}
                {filters.benefits.map(b => (
                  <button key={b} onClick={() => setFilters(prev => ({ ...prev, benefits: prev.benefits.filter(x => x !== b) }))}
                    className="flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors">
                    {b} <X className="h-3 w-3" />
                  </button>
                ))}
                {filters.rating > 0 && (
                  <button onClick={() => setFilters(prev => ({ ...prev, rating: 0 }))}
                    className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors">
                    ⭐ {filters.rating}+ Stars <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {sortedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="h-24 w-24 rounded-[28px] bg-[#FFF8E8] flex items-center justify-center mb-6 border border-[#F4B000]/15 shadow-sm">
                  <Package className="h-12 w-12 text-[#F4B000]/60" />
                </div>
                <h3 className="text-xl font-black text-foreground font-display">No products found</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                  We couldn't find any products matching your filters. Try adjusting or clearing them.
                </p>
                <button
                  onClick={() => setFilters({ types: [], benefits: [], priceRanges: [], sizes: [], rating: 0 })}
                  className="mt-6 rounded-xl bg-gradient-to-r from-[#F4B000] to-[#E59700] px-7 py-3 text-sm font-extrabold text-white shadow-gold hover:-translate-y-0.5 transition-all"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}

            {/* Trust Section */}
            <TrustSection />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Shop;
