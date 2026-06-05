import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ChevronRight, Star, Heart, Minus, Plus, ShoppingCart,
  MapPin, Check, Truck, RotateCcw, ShieldCheck, Tag, Droplets,
  Ban, Leaf, Zap, Shield, Sparkles, ChevronLeft, FlaskConical,
  Play, Lock, Award, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar, AnnouncementBar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import productHoney from "@/assets/product_honey.png";
import { getProductById } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const TABS = ["Description", "Ingredients", "Nutritional Info", "Reviews", "FAQs"];

function StarRating({ rating, interactive = false, size = "md" }) {
  const sz = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${sz} ${
            s <= Math.floor(rating) ? "fill-[#F4B000] text-[#F4B000]"
            : s === Math.ceil(rating) && rating % 1 >= 0.5 ? "fill-[#F4B000]/50 text-[#F4B000]"
            : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function HighlightPill({ icon: Icon, label, color = "amber" }) {
  const colors = {
    amber: "bg-amber-50 border-amber-200/60 text-amber-700",
    green: "bg-emerald-50 border-emerald-200/60 text-emerald-700",
    blue:  "bg-blue-50 border-blue-200/60 text-blue-700",
    red:   "bg-red-50 border-red-200/60 text-red-700",
  };
  return (
    <div className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wide ${colors[color]}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {label}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const [activeThumb, setActiveThumb] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(id);
        setProduct(data);
        if (data.sizes?.length) setSize(data.sizes[0].size_label);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) setWishlisted(isInWishlist(product.id));
  }, [product, isInWishlist]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] font-body flex flex-col">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="aspect-square rounded-[32px] animate-shimmer" />
            </div>
            <div className="lg:col-span-4 space-y-4">
              {[80, 50, 30, 60, 100].map((w, i) => (
                <div key={i} className={`h-4 rounded-lg animate-shimmer`} style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] font-body flex flex-col">
        <AnnouncementBar /><Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="h-24 w-24 rounded-[28px] bg-[#FFF8E8] flex items-center justify-center mb-6">
            <ShieldCheck className="h-12 w-12 text-[#F4B000]/50" />
          </div>
          <h2 className="text-2xl font-black text-[#2B1D12] font-display">Product Not Found</h2>
          <p className="mt-2 text-gray-500">This product may have been removed or doesn't exist.</p>
          <Link to="/shop" className="mt-6 rounded-xl bg-gradient-to-r from-[#F4B000] to-[#E59700] px-6 py-3 text-sm font-extrabold text-white shadow-gold">
            Back to Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const savings = product.originalPrice - product.price;
  const discountPct = Math.round((savings / product.originalPrice) * 100);
  const thumbnails = [0, 1, 2, 3, 4];

  const handleAddToCart = async () => {
    if (addingToCart) return;
    setAddingToCart(true);
    try {
      await addToCart(product.id, qty);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await addToCart(product.id, qty);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-body text-[#2B1D12]">
      <AnnouncementBar />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 pb-32 sm:px-6 lg:px-8 lg:pb-20">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-gray-700 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link to="/shop" className="hover:text-gray-700 transition-colors">Shop</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="hover:text-gray-700 transition-colors">{product.type}</span>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-[#D88A00] font-bold truncate max-w-[180px]">{product.name}</span>
        </nav>

        {/* Top Product Section */}
        <div className="grid gap-10 lg:grid-cols-12 items-start">

          {/* ── Left: Gallery ── */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Main Image */}
            <div className={`relative aspect-square w-full rounded-[32px] bg-gradient-to-br ${product.gradient || "from-amber-50 to-yellow-100"} flex items-center justify-center overflow-hidden group border border-[#F4B000]/10 shadow-[0_4px_32px_rgba(244,176,0,0.08)]`}>
              <span className="absolute top-5 left-5 z-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-[11px] font-extrabold px-3 py-1.5 shadow-sm">
                -{discountPct}%
              </span>
              {product.badge && (
                <span className="absolute top-5 left-20 z-10 rounded-full bg-[#F4B000] text-white text-[10px] font-extrabold px-3 py-1.5 shadow-sm">
                  {product.badge}
                </span>
              )}

              <AnimatePresence mode="wait">
                <motion.img
                  key={activeThumb}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  src={product.image || productHoney}
                  alt={product.name}
                  className="max-h-[80%] max-w-[80%] object-contain drop-shadow-[0_20px_48px_rgba(244,176,0,0.18)] group-hover:scale-105 transition-transform duration-500"
                />
              </AnimatePresence>

              {/* Thumbnail counter */}
              <span className="absolute bottom-4 right-4 text-[10px] font-bold text-white/80 bg-black/25 backdrop-blur-sm px-2 py-1 rounded-full">
                {activeThumb + 1} / {thumbnails.length}
              </span>
            </div>

            {/* Thumbnails */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setActiveThumb(t => Math.max(0, t - 1))}
                className="h-8 w-8 shrink-0 rounded-full border border-gray-200 bg-white grid place-items-center text-gray-400 hover:text-gray-700 shadow-sm transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex-1 flex gap-2.5 overflow-x-auto no-scrollbar">
                {thumbnails.map((t, idx) => (
                  <button
                    key={t}
                    onClick={() => setActiveThumb(idx)}
                    className={`relative flex-shrink-0 aspect-square w-[20%] min-w-[64px] rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                      activeThumb === idx
                        ? "border-[#F4B000] shadow-[0_4px_14px_rgba(244,176,0,0.25)]"
                        : "border-gray-200 hover:border-[#F4B000]/50 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className={`w-full h-full bg-gradient-to-br ${product.gradient || "from-amber-50 to-yellow-100"} flex items-center justify-center p-2`}>
                      <img src={product.image || productHoney} alt="" className="object-contain h-full drop-shadow-sm" />
                    </div>
                    {idx === 3 && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="h-7 w-7 rounded-full bg-white/90 grid place-items-center shadow-md">
                          <Play className="h-3 w-3 text-[#F4B000] ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setActiveThumb(t => Math.min(thumbnails.length - 1, t + 1))}
                className="h-8 w-8 shrink-0 rounded-full border border-gray-200 bg-white grid place-items-center text-gray-400 hover:text-gray-700 shadow-sm transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── Center: Product Info ── */}
          <div className="lg:col-span-4 flex flex-col pt-1">
            {/* Badge */}
            {product.badge && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF8E8] border border-[#F4B000]/25 text-[#D88A00] text-[10px] font-extrabold uppercase tracking-[0.18em] px-3.5 py-1.5 w-fit mb-4 shadow-sm">
                <Award className="h-3 w-3" /> {product.badge}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-black leading-tight text-[#2B1D12] font-display tracking-tight">
              {product.name}
            </h1>

            {/* Rating row */}
            <div className="flex items-center gap-3 mt-4 pb-5 border-b border-gray-100">
              <StarRating rating={product.rating} />
              <span className="font-black text-[#2B1D12] text-sm">{product.rating}</span>
              <span className="text-gray-400">·</span>
              <span className="text-sm text-gray-500 font-medium">{product.reviews || 0} Reviews</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-[#F4B000]" /> 12K+ Sold
              </span>
            </div>

            {/* Description */}
            <p className="mt-5 text-[15px] leading-relaxed text-gray-600 font-medium">
              {product.description}
            </p>

            {/* Price block */}
            <div className="mt-6 flex items-end gap-3">
              <span className="text-4xl font-black text-[#2B1D12]">₹{product.price}</span>
              <span className="text-xl text-gray-400 line-through font-medium pb-1">₹{product.originalPrice}</span>
              {savings > 0 && (
                <span className="mb-1 rounded-full bg-green-50 border border-green-200/60 text-green-700 text-xs font-extrabold px-3 py-1">
                  Save ₹{savings} ({discountPct}% off)
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1.5 font-medium">Inclusive of all taxes</p>

            {/* Highlights */}
            <div className="mt-5 flex flex-wrap gap-2">
              <HighlightPill icon={Droplets} label="100% Pure" color="amber" />
              <HighlightPill icon={ShieldCheck} label="Lab Tested" color="blue" />
              <HighlightPill icon={Ban} label="No Added Sugar" color="red" />
              <HighlightPill icon={Leaf} label="Natural" color="green" />
            </div>

            {/* Size Selector */}
            <div className="mt-7 border-t border-gray-100 pt-6">
              <p className="text-sm font-extrabold text-[#2B1D12] mb-3">Choose Size</p>
              <div className="flex items-center gap-2.5 flex-wrap">
                {product.sizes?.map(s => (
                  <button
                    key={s.size_label}
                    onClick={() => setSize(s.size_label)}
                    className={`px-5 py-2.5 rounded-xl border-2 text-sm font-extrabold transition-all duration-200 ${
                      size === s.size_label
                        ? "border-[#F4B000] bg-[#FFF8E8] text-[#D88A00] shadow-[0_4px_14px_rgba(244,176,0,0.18)] scale-[1.02]"
                        : "border-gray-200 text-gray-500 hover:border-[#F4B000]/40 bg-white"
                    }`}
                  >
                    {s.size_label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <p className="text-sm font-extrabold text-[#2B1D12] mb-3">Quantity</p>
              <div className="inline-flex items-center rounded-2xl border-2 border-gray-200 bg-white shadow-sm overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="flex h-12 w-12 items-center justify-center text-gray-400 hover:text-[#F4B000] hover:bg-[#FFF8E8] transition-all"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-12 w-14 items-center justify-center text-base font-black text-[#2B1D12] tabular-nums border-x-2 border-gray-100">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="flex h-12 w-12 items-center justify-center text-gray-400 hover:text-[#F4B000] hover:bg-[#FFF8E8] transition-all"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 btn-gold rounded-2xl h-14 flex items-center justify-center gap-2 text-[15px] font-extrabold tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {addingToCart ? "Adding…" : "Add to Cart"}
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`shrink-0 h-14 w-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                    isWishlisted
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 bg-white hover:border-red-200 hover:bg-red-50"
                  }`}
                >
                  <Heart className={`h-5 w-5 transition-all duration-300 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </button>
              </div>
              <button
                onClick={handleBuyNow}
                className="w-full h-14 rounded-2xl border-2 border-[#F4B000] text-[#D88A00] hover:bg-[#F4B000] hover:text-white flex items-center justify-center gap-2 font-extrabold text-[15px] transition-all duration-200"
              >
                <Zap className="h-5 w-5" fill="currentColor" /> Buy Now
              </button>
            </div>

            {/* Trust strip */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-gray-50/80 border border-gray-100">
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-gray-500">
                <Truck className="h-4 w-4 text-[#F4B000]" /> Free Shipping
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-gray-500">
                <RotateCcw className="h-4 w-4 text-[#F4B000]" /> Easy Returns
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-gray-500">
                <Lock className="h-4 w-4 text-[#F4B000]" /> Secure Pay
              </div>
            </div>
          </div>

          {/* ── Right: Sidebar ── */}
          <div className="lg:col-span-3 flex flex-col gap-4 pt-1">
            {/* Delivery Card */}
            <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-card">
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#2B1D12]">
                <MapPin className="h-4.5 w-4.5 text-[#F4B000]" /> Deliver To
              </h3>
              <p className="mt-1.5 text-xs text-gray-500 font-medium pl-6">Get it by <span className="text-green-600 font-bold">Thu, Jun 11</span></p>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="PIN Code"
                  defaultValue="250002"
                  className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-bold focus:border-[#F4B000] focus:ring-2 focus:ring-[#F4B000]/15 outline-none transition-all"
                />
                <button className="text-sm font-extrabold text-[#D88A00] hover:text-[#2B1D12] transition-colors pr-1">
                  Check
                </button>
              </div>
              <div className="mt-5 space-y-3.5 pl-1">
                {[
                  { icon: Truck, text: "Free Shipping on orders above ₹999" },
                  { icon: Shield, text: "Cash on Delivery Available" },
                  { icon: RotateCcw, text: "Easy 7 Days Returns" },
                  { icon: ShieldCheck, text: "100% Secure Payments" },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-3 text-[13px] font-medium text-gray-500">
                    <Icon className="h-4 w-4 text-gray-400 shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon Card */}
            <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-card">
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#2B1D12]">
                <Tag className="h-4.5 w-4.5 text-[#F4B000]" /> Apply Coupon
              </h3>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Code"
                  defaultValue="SPOOWA10"
                  className="flex-1 rounded-xl border border-[#F4B000]/30 bg-[#FFF8E8] px-3.5 py-2.5 text-sm font-extrabold text-[#2B1D12] focus:border-[#F4B000] focus:ring-2 focus:ring-[#F4B000]/15 outline-none transition-all"
                />
                <button className="bg-[#F4B000] hover:bg-[#D88A00] text-white px-4 rounded-xl text-sm font-extrabold transition-colors shadow-sm">
                  Apply
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between bg-green-50 px-4 py-3 rounded-xl border border-green-100">
                <div className="flex items-center gap-2 text-xs font-bold text-green-700">
                  <Check className="h-4 w-4" /> Coupon Applied: SPOOWA10
                </div>
                <button className="text-xs font-bold text-green-700 hover:text-green-900 transition-colors">Remove</button>
              </div>
            </div>

            {/* Why Choose */}
            <div className="rounded-[22px] border border-gray-100 bg-gray-50/80 p-5 shadow-card">
              <h3 className="text-sm font-extrabold text-[#2B1D12] mb-4">Why Choose SPOOWA?</h3>
              <div className="space-y-3.5">
                {[
                  "Directly sourced from trusted beekeepers",
                  "Raw, unfiltered and unprocessed",
                  "Rich in natural enzymes & antioxidants",
                  "Supports immunity and overall wellness"
                ].map(text => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0 h-5 w-5 rounded-full bg-white border border-[#F4B000]/30 flex items-center justify-center shadow-sm">
                      <Check className="h-3 w-3 text-[#F4B000]" strokeWidth={3} />
                    </div>
                    <span className="text-[13px] font-medium text-gray-600 leading-snug">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SPOOWA Promise */}
            <div className="rounded-[22px] border border-[#F4B000]/15 bg-gradient-to-br from-[#FFFBEB] to-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#2B1D12] mb-5">
                <Sparkles className="h-4 w-4 text-[#F4B000]" /> SPOOWA Promise
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: Droplets, text: "100% Pure" },
                  { icon: Leaf, text: "Ethical" },
                  { icon: FlaskConical, text: "Lab Tested" },
                  { icon: Shield, text: "Premium" },
                ].map((p, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 text-center">
                    <div className="h-10 w-10 rounded-full bg-white border border-[#F4B000]/20 flex items-center justify-center shadow-sm">
                      <p.icon className="h-4 w-4 text-[#D88A00]" />
                    </div>
                    <span className="text-[9px] font-extrabold text-[#2B1D12] uppercase leading-tight">{p.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs Section ── */}
        <div className="mt-20 pt-2">
          {/* Tab bar */}
          <div className="flex gap-0 overflow-x-auto no-scrollbar border-b border-gray-200">
            {[...TABS.slice(0, 4), `Reviews (${product.reviews || 0})`, "FAQs"].map(tab => {
              const isActive = tab === activeTab || (tab.startsWith("Reviews") && activeTab === "Reviews");
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.startsWith("Reviews") ? "Reviews" : tab)}
                  className={`relative pb-4 px-5 text-sm font-bold tracking-wide whitespace-nowrap transition-colors duration-200 ${
                    isActive ? "text-[#D88A00]" : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {tab}
                  {isActive && (
                    <motion.span
                      layoutId="tab-indicator"
                      className="absolute inset-x-0 bottom-0 h-[2.5px] rounded-full bg-gradient-to-r from-[#F4B000] to-[#E59700]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="py-12 lg:pr-[20%]"
            >
              <h2 className="text-3xl md:text-4xl font-black text-[#2B1D12] font-display">
                {activeTab === "Description" ? "Pure. Raw. From the Forest." : activeTab}
              </h2>
              <p className="mt-5 text-[17px] text-gray-600 leading-relaxed font-medium">
                {product.description}
              </p>

              {activeTab === "Description" && (
                <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: "Boosts Immunity", desc: "Rich in antioxidants and natural compounds.", icon: ShieldCheck, color: "from-blue-400 to-sky-300" },
                    { title: "Natural Energy", desc: "Provides instant and sustained energy.", icon: Zap, color: "from-amber-400 to-yellow-300" },
                    { title: "Supports Digestion", desc: "Aids digestion and improves gut health.", icon: Leaf, color: "from-emerald-400 to-green-300" },
                    { title: "Healthy Skin", desc: "Nourishes skin and promotes glow.", icon: Sparkles, color: "from-pink-400 to-rose-300" },
                  ].map((b, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex flex-col gap-3 group p-5 rounded-2xl border border-border/40 bg-white hover:shadow-card transition-all hover:-translate-y-1 duration-300"
                    >
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                        <b.icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="text-[15px] font-extrabold text-[#2B1D12]">{b.title}</h4>
                      <p className="text-[13px] text-gray-500 leading-relaxed font-medium">{b.desc}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── Sticky Mobile CTA ── */}
      <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md px-4 py-3 shadow-[0_-8px_32px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-500 truncate">{product.name}</p>
            <p className="text-base font-black text-[#2B1D12]">₹{product.price}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="flex-1 btn-gold rounded-xl h-12 flex items-center justify-center gap-2 text-sm font-extrabold disabled:opacity-60"
          >
            <ShoppingCart className="h-4 w-4" />
            {addingToCart ? "Adding…" : "Add to Cart"}
          </button>
          <button
            onClick={handleBuyNow}
            className="shrink-0 h-12 px-5 rounded-xl border-2 border-[#F4B000] text-[#D88A00] font-extrabold text-sm hover:bg-[#F4B000] hover:text-white transition-all"
          >
            Buy
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
