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
import { getProducts, getRegions } from "@/services/api";
import ProductCard from "@/components/ProductCard";

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
  const [sortBy, setSortBy] = useState("best-selling");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const regions = await getRegions();
        const regionId = regions?.regions?.[0]?.id;
        const data = await getProducts({ limit: 100, region_id: regionId, fields: "*variants,*variants.calculated_price" });
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Filter by search
  const filteredProducts = products.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.handle?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.variants?.[0]?.calculated_price?.calculated_amount || 0;
    const priceB = b.variants?.[0]?.calculated_price?.calculated_amount || 0;
    switch (sortBy) {
      case "new-arrivals":
        return new Date(b.created_at) - new Date(a.created_at);
      case "price-low-high":
        return priceA - priceB;
      case "price-high-low":
        return priceB - priceA;
      default:
        return 0; // default order
    }
  });

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
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 min-w-[200px] sm:min-w-[280px]">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-sm font-medium text-gray-700 placeholder:text-gray-300 outline-none bg-transparent"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-gray-300 hover:text-gray-500">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <p className="text-sm font-semibold text-foreground/60">
              <span className="text-foreground font-bold">{sortedProducts.length}</span> products
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
              <option value="price-low-high">Price: Low → High</option>
              <option value="price-high-low">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              {searchQuery
                ? "No products match your search. Try a different term."
                : "No products available yet. Check back soon!"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-6 rounded-xl bg-gradient-to-r from-[#F4B000] to-[#E59700] px-7 py-3 text-sm font-extrabold text-white shadow-gold hover:-translate-y-0.5 transition-all"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        )}

        {/* Trust Section */}
        <TrustSection />
      </main>

      <Footer />
    </div>
  );
}

export default Shop;
