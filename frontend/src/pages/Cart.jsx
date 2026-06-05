import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag, MapPin, Plus, Minus, X,
  Heart, Truck, Lock, Calendar, Check, Tag,
  ChevronRight, Gift, Trash2, MoveRight, ShieldCheck, Sparkles, Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import productHoney from "@/assets/product_honey.png";

const FREE_SHIPPING_THRESHOLD = 499;

function QuantitySelector({ qty, onUpdate }) {
  return (
    <div className="inline-flex items-center rounded-xl border-2 border-gray-200 bg-white overflow-hidden">
      <button
        onClick={() => onUpdate(Math.max(1, qty - 1))}
        className="flex h-9 w-9 items-center justify-center text-gray-400 hover:text-[#F4B000] hover:bg-[#FFF8E8] transition-all"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="flex h-9 w-11 items-center justify-center text-sm font-extrabold text-[#2B1D12] tabular-nums border-x-2 border-gray-100">
        {qty}
      </span>
      <button
        onClick={() => onUpdate(qty + 1)}
        className="flex h-9 w-9 items-center justify-center text-gray-400 hover:text-[#F4B000] hover:bg-[#FFF8E8] transition-all"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function CartItem({ item, selected, onToggleSelect, onUpdateQuantity, onRemove }) {
  const product = item.product || {};
  const savings = (product.originalPrice || 0) - (product.price || 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-200 hover:border-[#F4B000]/15 hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:gap-5 sm:p-5"
    >
      {/* Select checkbox */}
      <button
        onClick={() => onToggleSelect(item.product_id)}
        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
          selected ? "border-[#F4B000] bg-[#F4B000] text-white" : "border-gray-200 bg-white hover:border-[#F4B000]/60"
        }`}
      >
        {selected && <Check className="h-3 w-3 stroke-[3]" />}
      </button>

      {/* Product image */}
      <div className={`relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${product.gradient || "from-amber-50 to-yellow-100"} sm:h-28 sm:w-28 overflow-hidden`}>
        <img src={product.image || productHoney} alt={product.name} className="h-[85%] object-contain drop-shadow-sm" />
        {product.badge && (
          <span className="absolute top-1.5 left-1.5 rounded-full bg-[#F4B000] text-white text-[8px] font-extrabold px-1.5 py-0.5">
            {product.badge}
          </span>
        )}
      </div>

      {/* Product info */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link
              to={`/product/${product.id}`}
              className="text-base font-extrabold text-[#2B1D12] hover:text-[#D88A00] transition-colors line-clamp-2 leading-snug"
            >
              {product.name}
            </Link>
            <p className="mt-0.5 text-xs text-gray-500 font-medium line-clamp-1">{product.description}</p>
            {product.sizes?.length > 0 && (
              <span className="mt-1.5 inline-block rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-500">
                {product.sizes[0].size_label}
              </span>
            )}
          </div>
          <button
            onClick={() => onRemove(item.product_id)}
            className="shrink-0 rounded-full p-1.5 text-gray-300 transition-all hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Bottom row */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <QuantitySelector qty={item.quantity} onUpdate={(q) => onUpdateQuantity(item.product_id, q)} />
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-[#2B1D12]">₹{(product.price * item.quantity)}</span>
            {savings > 0 && (
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">Save ₹{savings * item.quantity}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FreeShippingBar({ subtotal }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const unlocked = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className={`rounded-2xl border p-4 transition-all duration-500 ${
      unlocked ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50" : "border-amber-200/60 bg-gradient-to-r from-[#FFF8E8] to-amber-50/50"
    }`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${unlocked ? "bg-green-100" : "bg-[#FFF0C0]"}`}>
          <Truck className={`h-4.5 w-4.5 ${unlocked ? "text-green-600" : "text-[#D88A00]"}`} />
        </div>
        <div>
          {unlocked ? (
            <p className="text-sm font-extrabold text-green-800 flex items-center gap-1.5">
              <Check className="h-4 w-4" /> Free shipping unlocked! 🎉
            </p>
          ) : (
            <p className="text-sm font-bold text-[#2B1D12]">
              Add <span className="text-[#D88A00] font-extrabold">₹{remaining.toFixed(0)}</span> more for free shipping
            </p>
          )}
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            {unlocked ? "Your order qualifies for free delivery" : `Free shipping on orders above ₹${FREE_SHIPPING_THRESHOLD}`}
          </p>
        </div>
      </div>
      {/* Progress bar */}
      <div className="h-2 rounded-full bg-gray-200/60 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full ${unlocked ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-[#F4B000] to-[#FFC83D]"}`}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] font-semibold text-gray-400">₹0</span>
        <span className="text-[10px] font-semibold text-gray-400">₹{FREE_SHIPPING_THRESHOLD}</span>
      </div>
    </div>
  );
}

function PriceRow({ label, value, valueClass = "text-gray-900", bold = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <span className={`text-sm ${bold ? "font-extrabold" : "font-semibold"} ${valueClass}`}>{value}</span>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="min-h-screen bg-[#FFFDF7] font-body flex flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="h-28 w-28 rounded-[32px] bg-gradient-to-br from-[#FFF8E8] to-amber-100 flex items-center justify-center mb-6 shadow-sm border border-[#F4B000]/15">
            <ShoppingBag className="h-14 w-14 text-[#F4B000]/70" />
          </div>
          <h2 className="text-2xl font-black text-[#2B1D12] font-display">Your cart is empty</h2>
          <p className="mt-2 text-gray-500 font-medium max-w-sm">
            Looks like you haven't added anything yet. Browse our premium honey collection!
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2.5 rounded-full btn-gold px-8 py-4 text-sm font-extrabold shadow-gold"
          >
            Explore Products <MoveRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

function Cart() {
  const { user } = useAuth();
  const { items, summary, updateQuantity, remove, applyCoupon, removeCoupon, coupon, placeOrder, loading } = useCart();
  const [selected, setSelected] = useState([]);
  const [couponInput, setCouponInput] = useState("");
  const { toggleWishlist } = useWishlist();

  // Keep selected in sync with items
  if (items.length > 0 && selected.length === 0) {
    setSelected(items.map(i => i.product_id));
  }

  const allSelected = items.length > 0 && selected.length === items.length;

  const toggleSelect = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const toggleSelectAll = () =>
    setSelected(allSelected ? [] : items.map(i => i.product_id));

  const handleApplyCoupon = async () => {
    if (couponInput) await applyCoupon(couponInput);
  };

  const totalSaved = summary.discount + (coupon?.discountAmount || 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] font-body flex flex-col">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="h-24 w-24 rounded-[28px] bg-[#FFF8E8] flex items-center justify-center mb-6 border border-[#F4B000]/15 shadow-sm">
              <Lock className="h-12 w-12 text-[#F4B000]/60" />
            </div>
            <h2 className="text-2xl font-black text-[#2B1D12] font-display">Sign in to view cart</h2>
            <p className="mt-2 text-gray-500 font-medium">Your cart items will be saved when you sign in.</p>
            <Link
              to="/auth"
              className="mt-8 inline-flex items-center gap-2 rounded-full btn-gold px-8 py-4 text-sm font-extrabold shadow-gold"
            >
              Sign In / Sign Up <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-body">
      <AnnouncementBar />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#2B1D12] font-display tracking-tight sm:text-4xl flex items-center gap-3">
              Your Cart
              <span className="text-sm font-extrabold bg-[#FFF8E8] border border-[#F4B000]/25 text-[#D88A00] px-3 py-1 rounded-full">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </h1>
            <p className="mt-1 text-sm text-gray-500 font-medium">Review your items and proceed to checkout</p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#D88A00] hover:text-[#2B1D12] transition-colors group"
          >
            Continue Shopping
            <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ── Left: Cart Items ── */}
          <div className="flex flex-col gap-5 lg:col-span-2">

            {/* Delivery address card */}
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF8E8]">
                  <MapPin className="h-5 w-5 text-[#F4B000]" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#2B1D12]">Deliver To</h3>
                  <p className="mt-0.5 text-sm text-gray-500 font-medium">Add a delivery address to continue</p>
                </div>
              </div>
              <button className="shrink-0 rounded-xl border-2 border-[#F4B000] px-5 py-2.5 text-sm font-extrabold text-[#D88A00] transition-all hover:bg-[#F4B000] hover:text-white">
                + Add Address
              </button>
            </div>

            {/* Selection toolbar */}
            <div className="flex items-center justify-between rounded-xl bg-[#FFF8E8]/70 border border-[#F4B000]/15 px-5 py-3">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2.5 text-sm font-bold text-gray-700 hover:text-[#D88A00] transition-colors"
              >
                <div className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${
                  allSelected ? "border-[#F4B000] bg-[#F4B000] text-white" : "border-gray-300 bg-white"
                }`}>
                  {allSelected && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
                <span>{selected.length}/{items.length} Selected</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => selected.forEach(id => remove(id))}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
                <button
                  onClick={() => selected.forEach(id => toggleWishlist(id))}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition-all"
                >
                  <Heart className="h-3.5 w-3.5" /> Wishlist
                </button>
              </div>
            </div>

            {/* Items */}
            <AnimatePresence>
              <div className="flex flex-col gap-3">
                {items.map(item => (
                  <CartItem
                    key={item.product_id}
                    item={item}
                    selected={selected.includes(item.product_id)}
                    onToggleSelect={toggleSelect}
                    onUpdateQuantity={updateQuantity}
                    onRemove={remove}
                  />
                ))}
              </div>
            </AnimatePresence>

            {/* Free shipping progress */}
            <FreeShippingBar subtotal={summary.subtotal || 0} />
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <div className="sticky top-24 flex flex-col gap-4">

              {/* Coupon */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
                <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#2B1D12] mb-4">
                  <Tag className="h-4 w-4 text-[#F4B000]" /> Coupon & Offers
                </h3>
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === "Enter" && handleApplyCoupon()}
                    placeholder="ENTER CODE"
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-bold uppercase text-[#2B1D12] placeholder:text-gray-300 placeholder:font-medium placeholder:normal-case focus:border-[#F4B000] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F4B000]/15 transition-all"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="rounded-xl bg-[#F4B000] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#D88A00] transition-colors shadow-sm"
                  >
                    Apply
                  </button>
                </div>
                {/* Suggested codes */}
                <div className="mt-3 flex gap-2 flex-wrap">
                  {["SPOOWA10", "HONEY20", "FIRST15"].map(code => (
                    <button
                      key={code}
                      onClick={() => setCouponInput(code)}
                      className="rounded-full border border-dashed border-[#F4B000]/40 bg-[#FFF8E8] px-2.5 py-1 text-[10px] font-extrabold text-[#D88A00] hover:border-[#F4B000] transition-colors"
                    >
                      {code}
                    </button>
                  ))}
                </div>
                <AnimatePresence>
                  {coupon && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mt-3 flex items-center justify-between rounded-xl bg-green-50 border border-green-100 px-3.5 py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-extrabold text-green-700">{coupon.code} applied!</span>
                        <span className="text-xs font-bold text-green-600">-₹{coupon.discountAmount?.toFixed(2)}</span>
                      </div>
                      <button onClick={removeCoupon} className="text-xs font-extrabold text-red-500 hover:text-red-700 transition-colors">
                        Remove
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Price details */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
                <h3 className="text-sm font-extrabold text-[#2B1D12] mb-4">
                  Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
                </h3>
                <div className="space-y-3">
                  <PriceRow label="Total MRP" value={`₹${summary.totalMrp?.toFixed(2)}`} />
                  <PriceRow label="Discount on MRP" value={`-₹${summary.discount?.toFixed(2)}`} valueClass="text-green-600 font-bold" />
                  {coupon && (
                    <PriceRow label={`Coupon (${coupon.code})`} value={`-₹${coupon.discountAmount?.toFixed(2)}`} valueClass="text-green-600 font-bold" />
                  )}
                  <PriceRow
                    label="Shipping"
                    value={summary.shipping === 0 ? "FREE 🎉" : `₹${summary.shipping?.toFixed(2)}`}
                    valueClass={summary.shipping === 0 ? "text-green-600 font-extrabold" : ""}
                  />
                  <div className="border-t-2 border-gray-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-extrabold text-[#2B1D12]">Total Amount</span>
                      <span className="text-2xl font-black text-[#F4B000]">₹{summary.finalTotal?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Savings pill */}
                {totalSaved > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 border border-green-100 px-4 py-3"
                  >
                    <Gift className="h-4 w-4 text-green-600 shrink-0" />
                    <span className="text-sm font-extrabold text-green-700">
                      You're saving ₹{totalSaved.toFixed(2)} on this order!
                    </span>
                    <Sparkles className="h-4 w-4 text-green-500 ml-auto shrink-0" />
                  </motion.div>
                )}

                {/* Checkout CTA */}
                <button
                  disabled={loading || items.length === 0}
                  onClick={() => placeOrder()}
                  className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-2xl btn-gold py-4 text-sm font-extrabold tracking-wide animate-pulse-gold disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none"
                >
                  <Lock className="h-4 w-4" />
                  {loading ? "Processing…" : "Place Order (COD)"}
                </button>

                {/* Trust badges row */}
                <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
                  {[
                    { icon: ShieldCheck, text: "SSL Secure" },
                    { icon: Lock, text: "Safe Pay" },
                    { icon: Star, text: "Trusted" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                      <Icon className="h-3 w-3" /> {text}
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-center text-[10px] leading-relaxed text-gray-400">
                  By placing the order, you agree to SPOOWA{" "}
                  <a href="#" className="underline hover:text-[#F4B000] transition-colors">terms</a> and{" "}
                  <a href="#" className="underline hover:text-[#F4B000] transition-colors">privacy policy</a>.
                </p>
              </div>

              {/* Delivery timeline */}
              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-card">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF8E8]">
                  <Calendar className="h-5 w-5 text-[#F4B000]" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[#2B1D12]">Expected by Thu, Jun 11</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Standard delivery · 3–5 business days</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Cart;
