import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ChevronRight, Star, Heart, Minus, Plus, ShoppingCart,
  MapPin, Check, Truck, RotateCcw, ShieldCheck, Tag, Droplets,
  Ban, Leaf, Zap, Shield, Sparkles, ChevronLeft, FlaskConical,
  Play, Lock, Award, ChevronDown, Gift
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar, AnnouncementBar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import productHoney from "@/assets/product_honey.png";
import { getProductById, getBestsellers } from "@/services/api";
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

function getProductTabContent(product, activeTab) {
  const isHoney = product.type?.toLowerCase().includes("honey") || product.name?.toLowerCase().includes("honey");
  
  if (activeTab === "Ingredients") {
    return (
      <div className="space-y-6">
        <p className="text-sm text-gray-500 leading-relaxed font-semibold">
          {isHoney 
            ? "100% pure, raw, and unfiltered forest honey. Sourced ethically from wild beehives in natural reserves. Free from any artificial sugars, preservatives, or dilution."
            : "Made with premium, sports-science backed hydration elements. Formulated for quick water absorption and clean energy delivery."
          }
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isHoney ? [
            { name: "Raw Forest Honey", detail: "Naturally rich in active enzymes and trace minerals." },
            { name: "Natural Bee Pollen", detail: "Provides a protein boost and enhances overall immunity." },
            { name: "Organic Wild Flora", detail: "Gives a unique, complex aroma and rich taste profile." }
          ].map((ing, i) => (
            <div key={i} className="bg-white border border-[#F4B000]/10 p-4 rounded-2xl shadow-sm">
              <span className="font-extrabold text-[#2B1D12] text-sm block">{ing.name}</span>
              <span className="text-xs text-gray-500 font-medium block mt-1">{ing.detail}</span>
            </div>
          )) : [
            { name: "Coconut Water Powder", detail: "Rich in natural potassium for cellular hydration." },
            { name: "Vitamins C & B-Complex", detail: "Supports immune function and natural cell metabolism." },
            { name: "Essential Electrolytes", detail: "Sodium, magnesium, and potassium for cramp prevention." },
            { name: "Stevia Leaf Extract", detail: "Zero calorie natural sweetener, no glycemic impact." }
          ].map((ing, i) => (
            <div key={i} className="bg-white border border-[#F4B000]/10 p-4 rounded-2xl shadow-sm">
              <span className="font-extrabold text-[#2B1D12] text-sm block">{ing.name}</span>
              <span className="text-xs text-gray-500 font-medium block mt-1">{ing.detail}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === "Nutritional Info") {
    const nutrition = isHoney ? [
      { name: "Calories", value: "304 kcal", dailyValue: "15%" },
      { name: "Total Fat", value: "0 g", dailyValue: "0%" },
      { name: "Sodium", value: "4 mg", dailyValue: "0%" },
      { name: "Total Carbohydrate", value: "82 g", dailyValue: "30%" },
      { name: "Sugars (Natural)", value: "82 g", dailyValue: "—" },
      { name: "Protein", value: "0.3 g", dailyValue: "1%" },
    ] : [
      { name: "Calories", value: "35 kcal", dailyValue: "2%" },
      { name: "Total Fat", value: "0 g", dailyValue: "0%" },
      { name: "Sodium", value: "115 mg", dailyValue: "5%" },
      { name: "Total Carbohydrate", value: "8 g", dailyValue: "3%" },
      { name: "Sugars", value: "0 g", dailyValue: "0%" },
      { name: "Potassium", value: "120 mg", dailyValue: "4%" },
      { name: "Vitamin C", value: "45 mg", dailyValue: "50%" },
    ];
    return (
      <div className="max-w-md bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm">
        <div className="bg-[#FFF8E8] px-6 py-4 border-b border-gray-100">
          <span className="font-black text-[#2B1D12] font-display text-base block">Nutrition Facts</span>
          <span className="text-xs text-gray-500 font-semibold block mt-0.5">Serving Size: {isHoney ? "1 tbsp (21g)" : "1 Can (330ml)"}</span>
        </div>
        <div className="divide-y divide-gray-100 px-6 py-3">
          {nutrition.map((nut, i) => (
            <div key={i} className="flex justify-between py-2.5 text-sm font-medium">
              <span className="text-gray-600">{nut.name}</span>
              <div className="flex gap-4">
                <span className="text-[#2B1D12] font-extrabold">{nut.value}</span>
                <span className="text-gray-400 text-xs w-8 text-right font-bold">{nut.dailyValue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }



  if (activeTab === "FAQs") {
    const faqs = isHoney ? [
      { q: "Why does raw honey crystallize?", a: "Crystallization is a natural sign of pure, raw honey. It occurs because the natural glucose binds with water. To liquefy it, simply place the jar in warm water (below 40°C)." },
      { q: "Can I give forest honey to infants?", a: "No, raw honey should not be fed to infants under 1 year of age due to the risk of infant botulism, which is a standard safety rule for all raw honey." },
      { q: "How is wild forest honey collected?", a: "It is ethically sourced directly from wild beehives in protected forest reserves by traditional beekeepers, ensuring zero harm to the honeybees and no forest disruption." }
    ] : [
      { q: "When should I drink Spoowa?", a: "Spoowa drinks are designed for active hydration. They are best consumed during or after workouts, sports sessions, or any physical activity to replenish electrolytes." },
      { q: "What makes Spoowa different from regular sports drinks?", a: "We combine functional premium honey with essential electrolytes and vitamins. Unlike most commercial drinks, we contain zero added artificial sugars or chemical colors." },
      { q: "Is this beverage carbonated?", a: "No, Spoowa hydration beverages are non-carbonated and smooth, ensuring clean and easy digestion during intense workouts." }
    ];
    return (
      <div className="space-y-4 max-w-2xl">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
            <span className="font-extrabold text-[#2B1D12] text-sm block leading-snug">Q: {faq.q}</span>
            <span className="text-sm text-gray-600 font-medium block mt-2 leading-relaxed">A: {faq.a}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
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
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [promiseOpen, setPromiseOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
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
    async function fetchRelated() {
      try {
        const bestsellers = await getBestsellers(8);
        setRelatedProducts(bestsellers);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProduct();
    fetchRelated();
  }, [id]);

  useEffect(() => {
    if (product) setWishlisted(isInWishlist(product.id));
  }, [product, isInWishlist]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

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

      <main className="mx-auto max-w-9xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8 lg:pb-2">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-5 lg:mb-8 overflow-x-auto whitespace-nowrap no-scrollbar">
          <Link to="/" className="hover:text-gray-700 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link to="/shop" className="hover:text-gray-700 transition-colors">Shop</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="hover:text-gray-700 transition-colors">{product.type}</span>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-[#D88A00] font-bold truncate max-w-[180px]">{product.name}</span>
        </nav>

        {/* Top Product Section: 3 Columns on Desktop */}
        <div className="grid gap-6 lg:gap-10 lg:grid-cols-12 items-start">

          {/* ── 1. Left Column (45% -> lg:col-span-5): Gallery ── */}
          <div className="lg:col-span-5 flex flex-col gap-4 lg:gap-5 lg:sticky lg:top-28">
            {/* Primary Main Image */}
            <div className={`relative aspect-square w-full rounded-[32px] bg-gradient-to-br ${product.gradient || "from-amber-50 to-yellow-100"} flex items-center justify-center overflow-hidden border border-[#F4B000]/10 shadow-[0_4px_32px_rgba(244,176,0,0.06)] group`}>
              
              {/* Badges Over Image */}
              <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
                <span className="rounded-full bg-red-500 text-white text-[10px] font-extrabold px-3 py-1.5 shadow-sm w-fit uppercase tracking-wider">
                  -{discountPct}% Off
                </span>
                {product.is_bestseller && (
                  <span className="rounded-full bg-[#F4B000] text-white text-[10px] font-extrabold px-3 py-1.5 shadow-sm w-fit uppercase tracking-wider flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" /> Best Seller
                  </span>
                )}
                {product.badge && (
                  <span className="rounded-full bg-[#2B1D12] text-[#FFFDF7] text-[9px] font-extrabold px-3 py-1.5 shadow-sm w-fit uppercase tracking-[0.1em]">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Flavor Badge Overlay */}
              <span className="absolute top-5 right-5 z-10 rounded-full bg-white/90 backdrop-blur-sm text-[#2B1D12] text-[10px] font-extrabold px-3.5 py-1.5 shadow-sm border border-gray-100">
                {product.type || "Pure Hydration"}
              </span>

              {/* Zoomable Image on Hover */}
              <motion.img
                key={activeThumb}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                animate={{
                  scale: isZoomed ? 1.15 : 1,
                }}
                transition={{ type: "tween", ease: "easeOut", duration: 0.35 }}
                style={{
                  transformOrigin: isZoomed ? `${zoomPos.x}% ${zoomPos.y}%` : "center",
                }}
                src={product.image || productHoney}
                alt={product.name}
                className="max-h-[82%] max-w-[82%] object-contain drop-shadow-[0_20px_48px_rgba(244,176,0,0.15)] cursor-zoom-in"
              />

              {/* Thumbnail Counter */}
              <span className="absolute bottom-5 right-5 text-[10px] font-bold text-white/90 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
                {activeThumb + 1} / {thumbnails.length}
              </span>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setActiveThumb(t => Math.max(0, t - 1))}
                className="h-9 w-9 shrink-0 rounded-full border border-gray-200 bg-white grid place-items-center text-gray-400 hover:text-gray-700 shadow-sm transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex-1 flex gap-2.5 overflow-x-auto no-scrollbar">
                {thumbnails.map((t, idx) => (
                  <button
                    key={t}
                    onClick={() => setActiveThumb(idx)}
                    className={`relative flex-shrink-0 aspect-square w-[18%] min-w-[58px] rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                      activeThumb === idx
                        ? "border-[#F4B000] shadow-[0_4px_14px_rgba(244,176,0,0.22)]"
                        : "border-gray-200 hover:border-[#F4B000]/50 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <div className={`w-full h-full bg-gradient-to-br ${product.gradient || "from-amber-50 to-yellow-100"} flex items-center justify-center p-2`}>
                      <img src={product.image || productHoney} alt="" className="object-contain h-full drop-shadow-sm" />
                    </div>
                    {idx === 3 && (
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <div className="h-6 w-6 rounded-full bg-white/90 grid place-items-center shadow-md">
                          <Play className="h-2.5 w-2.5 text-[#F4B000] ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setActiveThumb(t => Math.min(thumbnails.length - 1, t + 1))}
                className="h-9 w-9 shrink-0 rounded-full border border-gray-200 bg-white grid place-items-center text-gray-400 hover:text-gray-700 shadow-sm transition-colors cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ── 2. Center Column (35% -> lg:col-span-4): Main Product Info ── */}
          <div className="lg:col-span-4 flex flex-col gap-5 lg:gap-6">
            
            {/* Product Name */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-black leading-tight text-[#2B1D12] font-display tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating Row */}
            <div className="flex flex-wrap items-center gap-2.5 bg-white border border-gray-100/80 px-3.5 py-2.5 rounded-2xl shadow-sm w-fit">
              <StarRating rating={product.rating} />
              <span className="font-extrabold text-[#2B1D12] text-sm">{product.rating}</span>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-gray-500 font-bold hover:underline cursor-pointer">{product.reviews || 0} Reviews</span>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-[#D88A00] font-extrabold flex items-center gap-1">
                <Check className="h-3.5 w-3.5 bg-green-100 text-green-600 rounded-full p-0.5 shrink-0" strokeWidth={3} />
                2.5k+ Verified Buyers
              </span>
            </div>

            {/* Short Product Description */}
            <p className="text-sm leading-relaxed text-gray-600 font-medium border-l-4 border-[#F4B000] pl-4">
              {product.description?.slice(0, 150) || "Experience pure taste with Spoowa's sports hydration formula naturally sweetened with raw forest honey."}...
            </p>

            {/* Price Section */}
            <div className="bg-gradient-to-br from-[#FFFCEE] to-white border border-[#F4B000]/15 p-5 rounded-3xl shadow-sm">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-[#2B1D12]">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-gray-400 line-through font-semibold">₹{product.originalPrice}</span>
                )}
              </div>
              {savings > 0 && (
                <div className="mt-2 text-xs font-extrabold text-green-700 bg-green-50 border border-green-100 w-fit px-3 py-1 rounded-full flex items-center gap-1">
                  Save ₹{savings} ({discountPct}% Off)
                </div>
              )}
              <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider">Inclusive of all taxes</p>
            </div>

            {/* Availability Section */}
            <div className="flex flex-wrap items-center gap-3.5 pb-4 border-b border-gray-100">
              <span className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> In Stock
              </span>
              <span className="flex items-center gap-1.5 text-xs font-extrabold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                <Truck className="h-3.5 w-3.5" /> Fast Delivery
              </span>
              {product.price >= 499 && (
                <span className="flex items-center gap-1.5 text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                  <Check className="h-3.5 w-3.5" /> Free Shipping
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div>
              <p className="text-xs font-black text-[#2B1D12] uppercase tracking-wider mb-2.5">Quantity</p>
              <div className="inline-flex items-center rounded-2xl border-2 border-gray-200 bg-white shadow-sm overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="flex h-12 w-12 items-center justify-center text-gray-400 hover:text-[#F4B000] hover:bg-[#FFF8E8] transition-all cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-12 w-14 items-center justify-center text-base font-black text-[#2B1D12] tabular-nums border-x-2 border-gray-100">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="flex h-12 w-12 items-center justify-center text-gray-400 hover:text-[#F4B000] hover:bg-[#FFF8E8] transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 btn-gold rounded-2xl h-14 flex items-center justify-center gap-2 text-[15px] font-extrabold tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm hover:translate-y-[-1px]"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {addingToCart ? "Adding…" : "Add to Cart"}
                </button>
                
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`shrink-0 h-14 w-14 rounded-2xl border-2 flex items-center justify-center transition-all cursor-pointer ${
                    isWishlisted
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 bg-white hover:border-red-200 hover:bg-red-50"
                  }`}
                >
                  <Heart className={`h-5 w-5 transition-all duration-350 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </button>
              </div>
              
              <button
                onClick={handleBuyNow}
                className="w-full h-14 rounded-2xl border-2 border-[#F4B000] text-[#D88A00] hover:bg-[#F4B000] hover:text-white flex items-center justify-center gap-2 font-extrabold text-[15px] transition-all duration-200 cursor-pointer hover:translate-y-[-1px]"
              >
                <Zap className="h-5 w-5" fill="currentColor" /> Buy Now
              </button>
            </div>

            {/* Product Highlights feature grid */}
            <div className="border-t border-gray-100 pt-6">
              <p className="text-xs font-black text-[#2B1D12] uppercase tracking-wider mb-4">Product Highlights</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Zap, label: "Electrolytes" },
                  { icon: FlaskConical, label: "Vitamins" },
                  { icon: Leaf, label: "Natural Ingredients" },
                  { icon: Droplets, label: "Fast Hydration" },
                  { icon: Award, label: "Athlete Approved" },
                  { icon: Check, label: "Made in India" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(43,29,18,0.02)]">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#FFF8E8] text-[#D88A00] border border-[#F4B000]/10">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-gray-600 leading-snug">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── 3. Right Column (20% -> lg:col-span-3): Sticky Sidebar ── */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 lg:sticky lg:top-28">
            
            {/* Delivery Information */}
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <h3 className="flex items-center gap-2 text-xs font-black text-[#2B1D12] uppercase tracking-wider">
                <MapPin className="h-4.5 w-4.5 text-[#F4B000]" /> Delivery Information
              </h3>
              <p className="mt-2.5 text-[11px] text-gray-500 font-semibold pl-6">
                Get it by <span className="text-green-600 font-bold">Thu, Jun 11</span>
              </p>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="PIN Code"
                  defaultValue="250002"
                  className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-bold focus:border-[#F4B000] focus:ring-2 focus:ring-[#F4B000]/15 outline-none transition-all"
                />
                <button className="text-xs font-extrabold text-[#D88A00] hover:text-[#2B1D12] transition-colors pr-1 cursor-pointer">
                  Check
                </button>
              </div>
              <p className="mt-3 text-[10px] text-gray-400 font-medium pl-1">
                Enter pincode to check COD & Shipping availability.
              </p>
            </div>

            {/* Offers Section */}
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <h3 className="flex items-center gap-2 text-xs font-black text-[#2B1D12] uppercase tracking-wider">
                <Tag className="h-4.5 w-4.5 text-[#F4B000]" /> Offers Section
              </h3>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Code"
                  defaultValue="SPOOWA10"
                  className="flex-1 rounded-xl border border-[#F4B000]/30 bg-[#FFF8E8] px-3.5 py-2 text-xs font-extrabold text-[#2B1D12] focus:border-[#F4B000] focus:ring-2 focus:ring-[#F4B000]/15 outline-none transition-all"
                />
                <button className="bg-[#F4B000] hover:bg-[#D88A00] text-white px-3.5 rounded-xl text-xs font-extrabold transition-colors shadow-sm cursor-pointer">
                  Apply
                </button>
              </div>
              <div className="mt-3 bg-green-50 p-2.5 rounded-xl border border-green-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-green-700 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 shrink-0" /> SPOOWA10 Applied
                </span>
                <button className="text-[10px] font-bold text-green-700 hover:text-green-900 transition-colors cursor-pointer">Remove</button>
              </div>
              <p className="mt-3.5 text-[11px] text-gray-500 font-bold leading-relaxed border-t border-gray-50 pt-3">
                🎁 Bundle Offer: Buy 2 get 10% extra discount.
              </p>
            </div>

            {/* Rewards Section */}
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <h3 className="flex items-center gap-2 text-xs font-black text-[#2B1D12] uppercase tracking-wider">
                <Gift className="h-4.5 w-4.5 text-[#F4B000]" /> Rewards Section
              </h3>
              <div className="mt-3.5 bg-gradient-to-r from-[#FFFBEB] to-[#FFF8E8] p-3.5 rounded-2xl border border-[#F4B000]/10">
                <span className="text-[11px] font-extrabold text-[#2B1D12] block">Earn loyalty points</span>
                <span className="text-xs font-black text-[#D88A00] block mt-0.5">Earn 150 Spoowa Points</span>
                <div className="w-full bg-gray-200/60 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-[#F4B000] h-full rounded-full" style={{ width: "65%" }} />
                </div>
                <span className="text-[9px] text-gray-400 font-bold block mt-1.5">100 points away from next reward tier!</span>
              </div>
            </div>

            {/* Trust Section */}
            <div className="rounded-3xl border border-gray-100 bg-[#FAFAFA] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
              <h3 className="text-xs font-black text-[#2B1D12] uppercase tracking-wider mb-4">Spoowa Trust</h3>
              <div className="space-y-3 pl-1">
                {[
                  { icon: ShieldCheck, text: "Secure Payments" },
                  { icon: RotateCcw, text: "Easy 7 Days Returns" },
                  { icon: Check, text: "100% Authentic Products" },
                  { icon: Award, text: "24/7 Customer Support" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-[11px] font-bold text-gray-500">
                    <item.icon className="h-4 w-4 text-gray-400 shrink-0" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Mid Page Sections ── */}

        {/* 1. Trust Bar */}
        <section className="border-y border-gray-100 bg-white/50 py-6 lg:py-8 mt-12 lg:mt-20">
          <div className="mx-auto max-w-7xl px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Truck, title: "Fast Delivery", desc: "Shipping in 24 hours" },
                { icon: Lock, title: "Secure Payment", desc: "SSL encrypted checkout" },
                { icon: RotateCcw, title: "Easy Returns", desc: "7-day return policy" },
                { icon: ShieldCheck, title: "Customer Support", desc: "24/7 dedicated support" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3.5 px-4 justify-center sm:justify-start">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#FFF8E8] text-[#D88A00] border border-[#F4B000]/10 shadow-sm">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#2B1D12]">{item.title}</h4>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Product Benefits Section */}
        <section className="py-10 lg:py-16 border-b border-gray-100">
          <div className="text-center max-w-xl mx-auto mb-8 lg:mb-12">
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#D88A00] uppercase block">Engineered for Performance</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2B1D12] font-display mt-2">Product Benefits</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Droplets, title: "Hydration Support", desc: "Rapid cellular water absorption to prevent fatigue and boost metabolism.", color: "from-blue-500/10 to-sky-500/5", iconColor: "text-blue-500" },
              { icon: Zap, title: "Essential Electrolytes", desc: "Precisely matched sodium, potassium, and magnesium ratios to prevent cramping.", color: "from-amber-500/10 to-yellow-500/5", iconColor: "text-amber-600" },
              { icon: Sparkles, title: "Energy Boost", desc: "Naturally sourced premium carbohydrates from forest honey deliver sustained power.", color: "from-pink-500/10 to-rose-500/5", iconColor: "text-rose-500" },
              { icon: ShieldCheck, title: "Recovery Support", desc: "Packed with active minerals and antioxidants to recover faster post-activity.", color: "from-emerald-500/10 to-green-500/5", iconColor: "text-emerald-600" }
            ].map((b, i) => (
              <div key={i} className={`p-6 rounded-2xl border border-gray-100 bg-gradient-to-br ${b.color} shadow-sm hover:shadow-md transition-shadow duration-300`}>
                <div className={`h-11 w-11 rounded-xl bg-white flex items-center justify-center shadow-sm border border-gray-50 ${b.iconColor}`}>
                  <b.icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="text-[16px] font-extrabold text-[#2B1D12] mt-4">{b.title}</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mt-2.5">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Ingredients Section */}
        <section className="bg-gradient-to-br from-[#FFFCEE] via-white to-white py-10 lg:py-16 border-b border-gray-100">
          <div className="text-center max-w-xl mx-auto mb-8 lg:mb-12">
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#D88A00] uppercase block">Clean Formulation</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2B1D12] font-display mt-2">Premium Ingredients</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Coconut Water Powder", detail: "Rich in natural potassium for cellular hydration.", icon: Droplets },
              { name: "Vitamins C & B-Complex", detail: "Supports immune function and natural cell metabolism.", icon: FlaskConical },
              { name: "Essential Electrolytes", detail: "Sodium, magnesium, and potassium for cramp prevention.", icon: Zap },
              { name: "Stevia Leaf Extract", detail: "Zero calorie natural sweetener, no glycemic impact.", icon: Leaf }
            ].map((ing, i) => (
              <div key={i} className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="h-10 w-10 rounded-xl bg-[#FFF8E8] text-[#D88A00] border border-[#F4B000]/10 flex items-center justify-center shadow-sm">
                  <ing.icon className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-[#2B1D12] text-[16px] mt-4">{ing.name}</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mt-2">{ing.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Reviews Section (2-Columns) */}
        <section className="py-10 lg:py-16 border-b border-gray-100">
          <div className="text-center max-w-xl mx-auto mb-8 lg:mb-12">
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#D88A00] uppercase block">Customer Opinions</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2B1D12] font-display mt-2">Verified Reviews</h2>
          </div>
          
          <div className="grid gap-8 lg:gap-10 lg:grid-cols-12 items-start">
            {/* Left side: Overview & bars */}
            <div className="lg:col-span-5 flex flex-col gap-6 bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
              <div className="text-center">
                <span className="text-6xl font-black text-[#2B1D12] font-display block">{product.rating}</span>
                <div className="mt-3 flex justify-center"><StarRating rating={product.rating} /></div>
                <span className="text-xs text-gray-400 font-bold block mt-2">Based on {product.reviews || 0} customer reviews</span>
              </div>
              <div className="space-y-3.5 mt-2">
                {[
                  { stars: 5, pct: "85%" },
                  { stars: 4, pct: "10%" },
                  { stars: 3, pct: "3%" },
                  { stars: 2, pct: "1%" },
                  { stars: 1, pct: "1%" }
                ].map(row => (
                  <div key={row.stars} className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <span className="w-3 text-right">{row.stars}</span>
                    <span className="text-[#F4B000]">★</span>
                    <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-[#F4B000] rounded-full" style={{ width: row.pct }} />
                    </div>
                    <span className="w-8 text-right text-gray-400">{row.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Reviews list */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="text-lg font-black text-[#2B1D12] font-display">Customer Comments</h3>
                <button className="text-xs font-extrabold text-white bg-[#D88A00] hover:bg-[#2B1D12] px-4 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer">
                  Write Review
                </button>
              </div>
              <div className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto pr-2 no-scrollbar">
                {[
                  { name: "Rahul S.", rating: 5, date: "Jun 02, 2026", title: "Ultimate Hydration!", text: "I drink this during my running sessions. Keeps me fresh and doesn't sit heavy. Zero sugar is a huge plus." },
                  { name: "Priya M.", rating: 5, date: "May 28, 2026", title: "Pure and Natural!", text: "Tastes absolutely pure. The thickness and aroma are completely different from commercial honey brands. Highly recommend!" },
                  { name: "Amit K.", rating: 4, date: "May 15, 2026", title: "Superb Quality", text: "Nice natural flavor. Not too sweet, which I like. Feels very clean compared to normal sports drinks." }
                ].map((rev, i) => (
                  <div key={i} className="py-5 first:pt-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#2B1D12]">{rev.name}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-400 font-bold">{rev.date}</span>
                    </div>
                    <div className="mt-1"><StarRating rating={rev.rating} size="sm" /></div>
                    <span className="font-black text-[#2B1D12] text-sm block mt-2 leading-snug">{rev.title}</span>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="py-10 lg:py-16">
            <div className="text-center max-w-xl mx-auto mb-8 lg:mb-12">
              <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#D88A00] uppercase block">Tailored for You</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2B1D12] font-display mt-2">You May Also Like</h2>
            </div>
            
            <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
              {relatedProducts.slice(0, 4).map((rp) => {
                const rpSavings = rp.originalPrice - rp.price;
                const rpDiscount = Math.round((rpSavings / rp.originalPrice) * 100);
                const rpWishlisted = isInWishlist(rp.id);
                
                return (
                  <div key={rp.id} className="group relative flex flex-col bg-white border border-gray-100 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    {/* Product Image */}
                    <div className={`relative aspect-square w-full rounded-2xl bg-gradient-to-br ${rp.gradient || "from-amber-50 to-yellow-100"} flex items-center justify-center overflow-hidden mb-4`}>
                      <img src={rp.image || productHoney} alt={rp.name} className="h-[70%] w-[70%] object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300" />
                      {rpDiscount > 0 && (
                        <span className="absolute top-2.5 left-2.5 rounded-full bg-red-500 text-white text-[9px] font-extrabold px-2 py-1 shadow-sm">
                          -{rpDiscount}%
                        </span>
                      )}
                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(rp.id)}
                        className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-white/95 border border-gray-50 flex items-center justify-center shadow-sm cursor-pointer hover:bg-red-50 transition-colors"
                      >
                        <Heart className={`h-3.5 w-3.5 ${rpWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                      </button>
                    </div>

                    {/* Title & Rating */}
                    <div className="flex-1 flex flex-col min-w-0">
                      <Link to={`/product/${rp.id}`} className="font-extrabold text-sm text-[#2B1D12] hover:text-[#D88A00] transition-colors truncate">
                        {rp.name}
                      </Link>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <StarRating rating={rp.rating} size="sm" />
                        <span className="text-[10px] font-bold text-gray-400">({rp.reviews || 0})</span>
                      </div>
                      
                      {/* Price Block */}
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="font-black text-sm text-[#2B1D12]">₹{rp.price}</span>
                        {rp.originalPrice > rp.price && (
                          <span className="text-[11px] text-gray-400 line-through font-medium">₹{rp.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    {/* Quick Add Button */}
                    <button
                      onClick={() => addToCart(rp.id, 1)}
                      className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F4B000] to-[#E59700] hover:shadow-gold text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" /> Quick Add
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}


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
