import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search, User, ShoppingBag, Menu, Heart, Star, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight, ShoppingCart, SlidersHorizontal, X,
  Truck, ShieldCheck, Lock, Droplets, FlaskConical, Sparkles,
  ArrowRight, Eye, RotateCcw, Package, Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import productHoney from "@/assets/product_honey.png";

import { getProducts } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const productTypes = ["Raw Honey", "Wild Forest Honey", "Organic Honey", "Turmeric Honey", "Acacia Honey", "Ginger Honey", "Gift Packs", "Wellness Combos"];
const healthBenefits = ["Immunity", "Energy Boost", "Digestion", "Skin Health", "Weight Management"];
const priceRanges = [{ label: "₹0 – ₹299", min: 0, max: 299 }, { label: "₹300 – ₹499", min: 300, max: 499 }, { label: "₹500 – ₹999", min: 500, max: 999 }, { label: "₹1000+", min: 1000, max: Infinity }];
const sizes = ["250g", "500g", "1kg"];

function FilterCheckbox({ label, count, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-1.5">
      <div className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
        checked ? "border-accent bg-accent" : "border-gray-300 group-hover:border-accent/60"
      }`}>
        {checked && <CheckIcon />}
      </div>
      <span className="flex-1 text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{label}</span>
      <span className="text-xs font-medium text-muted-foreground">({count})</span>
    </label>
  );
}

function CheckIcon() {
  return (
    <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/60 last:border-b-0">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-4 text-sm font-bold text-foreground">
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
            transition={{ duration: 0.25, ease: "easeInOut" }}
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
  return (
    <div className={`flex items-center gap-0.5 text-[#F4B000]`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`${starSize} ${s <= Math.floor(rating) ? "fill-current" : "fill-current opacity-30"}`} />
      ))}
    </div>
  );
}

function FilterSidebar({ filters, setFilters, filteredProducts }) {
  const toggleType = (type) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type) ? prev.types.filter(t => t !== type) : [...prev.types, type],
    }));
  };
  const toggleBenefit = (benefit) => {
    setFilters(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit) ? prev.benefits.filter(b => b !== benefit) : [...prev.benefits, benefit],
    }));
  };
  const togglePrice = (label) => {
    setFilters(prev => ({
      ...prev,
      priceRanges: prev.priceRanges.includes(label) ? prev.priceRanges.filter(p => p !== label) : [...prev.priceRanges, label],
    }));
  };
  const toggleSize = (size) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size],
    }));
  };
  const setRating = (rating) => {
    setFilters(prev => ({ ...prev, rating: prev.rating === rating ? 0 : rating }));
  };

  const countByType = (type) => filteredProducts.filter(p => p.type === type).length;
  const countByBenefit = (benefit) => filteredProducts.filter(p => p.benefit === benefit).length;
  const countByPrice = (range) => filteredProducts.filter(p => p.price >= range.min && p.price <= range.max).length;
  const countBySize = (size) => filteredProducts.filter(p => p.sizes && p.sizes.includes(size)).length;
  const countByRating = (min) => filteredProducts.filter(p => p.rating >= min).length;

  return (
    <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-accent" /> Filters
        </h3>
        <button onClick={() => setFilters({ types: [], benefits: [], priceRanges: [], sizes: [], rating: 0 })} className="text-xs font-bold text-accent hover:text-accent/80 transition-colors">Clear All</button>
      </div>

      <div className="mt-2 divide-y divide-border/40">
        <FilterSection title="PRODUCT TYPE">
          {productTypes.map(type => (
            <FilterCheckbox key={type} label={type} count={countByType(type)} checked={filters.types.includes(type)} onChange={() => toggleType(type)} />
          ))}
        </FilterSection>

        <FilterSection title="HEALTH BENEFITS">
          {healthBenefits.map(benefit => (
            <FilterCheckbox key={benefit} label={benefit} count={countByBenefit(benefit)} checked={filters.benefits.includes(benefit)} onChange={() => toggleBenefit(benefit)} />
          ))}
        </FilterSection>

        <FilterSection title="PRICE RANGE">
          {priceRanges.map(range => (
            <FilterCheckbox key={range.label} label={range.label} count={countByPrice(range)} checked={filters.priceRanges.includes(range.label)} onChange={() => togglePrice(range.label)} />
          ))}
        </FilterSection>

        <FilterSection title="SIZE">
          {sizes.map(size => (
            <FilterCheckbox key={size} label={size} count={countBySize(size)} checked={filters.sizes.includes(size)} onChange={() => toggleSize(size)} />
          ))}
        </FilterSection>

        <FilterSection title="RATINGS">
          <div className="space-y-1">
            {[5, 4].map(min => (
              <button key={min} onClick={() => setRating(min)} className={`flex w-full items-center gap-3 py-1.5 rounded-lg px-2 transition-all ${
                filters.rating === min ? "bg-accent/10" : "hover:bg-muted"
              }`}>
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                  filters.rating === min ? "border-accent bg-accent" : "border-gray-300"
                }`}>
                  {filters.rating === min && <CheckIcon />}
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-4 w-4 ${s <= min ? "fill-[#F4B000] text-[#F4B000]" : "fill-gray-200 text-gray-200"}`} />
                  ))}
                </div>
                <span className="text-xs font-medium text-muted-foreground ml-1">
                  {min === 5 ? "Only 5" : `${min} & Up`} ({countByRating(min)})
                </span>
              </button>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
}

function ProductCard({ product, index }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const savings = product.originalPrice - product.price;
  const isWishlisted = isInWishlist(product.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-[24px] border border-border/60 bg-white shadow-card transition-all duration-300 hover:shadow-lift hover:-translate-y-1.5 overflow-hidden"
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Badge */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          <span className="rounded-full bg-accent px-3 py-1.5 text-[10px] font-bold text-accent-foreground shadow-sm tracking-wide">
            {product.badge}
          </span>
          <span className="rounded-full bg-red-500/90 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm tracking-wide">
            {product.discount}
          </span>
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all hover:bg-white hover:shadow-md"
        >
          <Heart className={`h-4.5 w-4.5 transition-all ${isWishlisted ? "fill-red-500 text-red-500 scale-110" : "text-gray-500"}`} />
        </button>

        {/* Product Image */}
        <div className={`relative flex aspect-[4/5] items-center justify-center bg-gradient-to-br ${product.gradient} p-6 overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
          <img
            src={product.image || productHoney}
            alt={product.name}
            className={`max-h-full max-w-full object-contain drop-shadow-[0_15px_30px_rgba(244,176,0,0.12)] transition-all duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
          />
          {/* Quick View overlay */}
          <div className={`absolute inset-x-0 bottom-0 flex items-center justify-center transition-all duration-300 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <span className="bg-foreground/80 backdrop-blur-sm text-white text-[11px] font-bold px-5 py-2.5 rounded-t-xl flex items-center gap-1.5 tracking-wide">
              <Eye className="h-3.5 w-3.5" /> Quick View
            </span>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="px-5 pb-5 pt-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-base font-bold text-foreground hover:text-accent transition-colors">{product.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground font-medium">{product.description}</p>
        </Link>

        {/* Rating */}
        <div className="mt-2.5 flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-xs font-semibold text-foreground/70">{product.rating} <span className="text-muted-foreground font-medium">({product.reviews || 0})</span></span>
        </div>

        {/* Pricing */}
        <div className="mt-3 flex items-end gap-2.5">
          <span className="text-xl font-black text-foreground">₹{product.price}</span>
          <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
          <span className="text-[11px] font-bold text-green-600">Save ₹{savings}</span>
        </div>

        {/* Size Options */}
        <div className="mt-3.5 flex items-center gap-2">
          {product.sizes?.map(s => (
            <button
              key={s.size_label}
              onClick={() => setSelectedSize(s.size_label)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                selectedSize === s.size_label
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-gray-200 text-muted-foreground hover:border-gray-300"
              }`}
            >
              {s.size_label}
            </button>
          ))}
        </div>

        {/* Add to Cart */}
        <button onClick={() => addToCart(product.id, 1)} className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl bg-foreground py-3 text-xs font-bold tracking-wider text-white transition-all hover:bg-accent hover:shadow-[0_6px_16px_rgba(244,176,0,0.25)] active:scale-[0.98]">
          <ShoppingCart className="h-4 w-4" /> ADD TO CART
        </button>
      </div>
    </motion.article>
  );
}

function TrustSection() {
  const items = [
    { icon: Droplets, title: "100% Pure Honey", desc: "Sourced from trusted beekeepers" },
    { icon: Truck, title: "Free Shipping", desc: "On orders above ₹499" },
    { icon: FlaskConical, title: "Lab Tested", desc: "For purity and quality assurance" },
    { icon: Lock, title: "Secure Payments", desc: "100% safe and secure checkout" },
  ];
  return (
    <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="flex items-center gap-4 rounded-2xl border border-border/60 bg-white p-5 shadow-card hover:shadow-lift transition-all hover:-translate-y-0.5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
            <item.icon className="h-5.5 w-5.5 text-accent" />
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
      case "new-arrivals": return b.id - a.id;
      case "highest-rated": return b.rating - a.rating;
      case "price-low-high": return a.price - b.price;
      case "price-high-low": return b.price - a.price;
      default: return b.id - a.id;
    }
  });

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-body">
      <AnnouncementBar />
      <Navbar />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFFBEB] via-[#FFFDF2] to-[#FEF3C7] border-b border-[#F4B000]/10">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F4B000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="absolute top-[-8%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#F4B000]/8 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] rounded-full bg-[#D4AF37]/10 blur-[100px] pointer-events-none" />

        <div className="mx-auto w-[95%] max-w-[1700px] px-4 py-14 sm:py-18 lg:py-22">
          <div className="relative grid items-center gap-10 lg:grid-cols-12">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F4B000]/20 bg-white/70 backdrop-blur-sm px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-accent uppercase shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" /> Pure by Nature, Made for You
                </span>
                <h1 className="mt-6 font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl font-black text-foreground">
                  Discover Pure
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4B000] to-[#E59700]">
                    Honey Goodness
                  </span>
                </h1>
                <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-muted-foreground font-medium">
                  Experience nature&apos;s finest honey collection crafted for wellness, energy, immunity, and everyday health.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="#product-grid"
                    className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#F4B000] to-[#E59700] px-8 py-4 text-sm font-bold tracking-wider text-white shadow-lg shadow-[#F4B000]/25 transition-all hover:shadow-xl hover:shadow-[#F4B000]/30 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Explore Collection
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <a
                    href="#trust"
                    className="group inline-flex items-center gap-2.5 rounded-full border-2 border-gray-200 bg-white/80 backdrop-blur-sm px-8 py-4 text-sm font-bold tracking-wider text-foreground/70 transition-all hover:border-accent/30 hover:text-foreground hover:bg-white"
                  >
                    <ShieldCheck className="h-4 w-4 text-accent" /> Lab Tested Quality
                  </a>
                </div>
                {/* Stats */}
                <div className="mt-10 flex items-center gap-8">
                  {[["24+", "Honey Variants"], ["50K+", "Happy Customers"], ["100%", "Pure & Natural"]].map(([stat, label]) => (
                    <div key={label} className="flex flex-col">
                      <span className="text-2xl font-black text-foreground">{stat}</span>
                      <span className="text-[11px] font-semibold text-muted-foreground tracking-wide">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Visual */}
            <div className="relative lg:col-span-5 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#F4B000]/20 to-[#D4AF37]/10 rounded-full blur-[60px] scale-150" />
                <div className="relative flex items-center justify-center">
                  {/* Decorative honeycomb circle */}
                  <div className="relative h-[350px] w-[350px] sm:h-[420px] sm:w-[420px] rounded-full border-2 border-[#F4B000]/10 bg-white/40 backdrop-blur-sm flex items-center justify-center shadow-[0_0_60px_rgba(244,176,0,0.08)]">
                    <div className="absolute inset-4 rounded-full border border-[#F4B000]/8" />
                    <div className="absolute inset-10 rounded-full border border-[#F4B000]/6" />
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-7xl sm:text-8xl animate-float drop-shadow-[0_10px_25px_rgba(244,176,0,0.2)]">🍯</span>
                      <span className="text-sm font-bold text-accent tracking-widest uppercase">Premium Honey</span>
                    </div>
                  </div>
                  {/* Floating decorative elements */}
                  <div className="absolute -top-4 -right-4 h-16 w-16 rounded-2xl bg-white border border-[#F4B000]/15 flex items-center justify-center shadow-sm animate-float" style={{ animationDelay: "0.5s" }}>
                    <Award className="h-7 w-7 text-[#F4B000]" />
                  </div>
                  <div className="absolute -bottom-2 -left-4 h-14 w-14 rounded-2xl bg-white border border-[#F4B000]/15 flex items-center justify-center shadow-sm animate-float" style={{ animationDelay: "1s" }}>
                    <Package className="h-6 w-6 text-[#F4B000]" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto w-[95%] max-w-[1700px] px-4 py-10 sm:px-6 lg:py-14" id="product-grid">
        <div className="flex gap-8 lg:gap-10">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4 w-full">
            <button onClick={() => setShowMobileFilters(true)} className="flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-bold shadow-sm">
              <SlidersHorizontal className="h-4 w-4 text-accent" /> Filters & Sort
            </button>
          </div>

          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-[300px] xl:w-[320px] shrink-0">
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
                  className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:hidden"
                />
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="fixed left-0 top-0 z-50 h-full w-[85vw] max-w-sm overflow-y-auto bg-white shadow-2xl lg:hidden"
                >
                  <div className="flex items-center justify-between border-b border-border p-4">
                    <h3 className="text-base font-bold flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-accent" /> Filters</h3>
                    <button onClick={() => setShowMobileFilters(false)} className="rounded-full p-1.5 hover:bg-muted"><X className="h-5 w-5" /></button>
                  </div>
                  <div className="p-4">
                    <FilterSidebar filters={filters} setFilters={setFilters} filteredProducts={filteredProducts} />
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
                <button onClick={() => setShowMobileFilters(true)} className="lg:hidden flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-bold shadow-sm hover:border-accent/30 transition-colors">
                  <SlidersHorizontal className="h-4 w-4 text-accent" /> Filters
                </button>
                <p className="text-sm font-semibold text-foreground/70">
                  Showing <span className="text-foreground">{sortedProducts.length}</span> Products
                  {filteredProducts.length !== products.length && (
                    <span className="text-muted-foreground font-normal"> of {products.length}</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-bold text-foreground shadow-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    paddingRight: "36px",
                  }}
                >
                  <option value="best-selling">Best Selling</option>
                  <option value="new-arrivals">New Arrivals</option>
                  <option value="highest-rated">Highest Rated</option>
                  <option value="price-low-high">Price Low to High</option>
                  <option value="price-high-low">Price High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {sortedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Package className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">No products found</h3>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
                <button onClick={() => setFilters({ types: [], benefits: [], priceRanges: [], sizes: [], rating: 0 })} className="mt-4 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white hover:bg-accent/80 transition-colors">
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-12 flex items-center justify-center gap-2">
              {[1, 2, 3, "...", 8].map((page, i) => (
                <button
                  key={i}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                    page === 1
                      ? "bg-accent text-white shadow-md"
                      : page === "..."
                        ? "text-muted-foreground cursor-default"
                        : "border border-border bg-white text-foreground hover:border-accent/40 hover:text-accent"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Trust Section */}
            <div id="trust">
              <TrustSection />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Shop;
