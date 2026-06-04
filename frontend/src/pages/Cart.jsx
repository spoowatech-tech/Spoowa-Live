import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search, User, ShoppingBag, Menu, MapPin, Plus, Minus, X,
  Heart, Truck, Lock, Calendar, Check, Tag, ChevronRight, Gift,
  Trash2, MoveRight, Percent, Clock, ShieldCheck
} from "lucide-react";
import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import productHoney from "@/assets/product_honey.png";

function QuantitySelector({ qty, onUpdate }) {
  return (
    <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white">
      <button onClick={() => onUpdate(Math.max(1, qty - 1))} className="flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:text-[#F4B000]">
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="flex h-8 w-10 items-center justify-center text-sm font-semibold text-gray-900 tabular-nums">
        {qty}
      </span>
      <button onClick={() => onUpdate(qty + 1)} className="flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:text-[#F4B000]">
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function CartItem({ item, selected, onToggleSelect, onUpdateQuantity, onRemove }) {
  const product = item.product || {};
  
  return (
    <div className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-200 hover:border-gray-200 hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)] sm:gap-5 sm:p-5">
      <button
        onClick={() => onToggleSelect(item.product_id)}
        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200 ${
          selected
            ? "border-[#F4B000] bg-[#F4B000] text-white"
            : "border-gray-300 bg-white hover:border-[#F4B000]"
        }`}
      >
        {selected && <Check className="h-3 w-3 stroke-[3]" />}
      </button>

      <div className={`relative flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${product.gradient || 'from-amber-200 to-yellow-100'} sm:h-[100px] sm:w-[100px]`}>
        <img src={product.image || productHoney} alt={product.name} className="h-[80%] object-contain" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Link to={`/product/${product.id}`} className="truncate text-base font-bold text-[#2B1D12] hover:text-[#D88A00] transition-colors">{product.name}</Link>
              {product.badge && <span className="shrink-0 rounded-full bg-[#FFF8E8] px-2 py-0.5 text-[10px] font-semibold text-[#B87A00]">{product.badge}</span>}
            </div>
            <p className="mt-0.5 text-sm text-gray-500 line-clamp-1">{product.description}</p>
          </div>
          <button onClick={() => onRemove(item.product_id)} className="shrink-0 rounded-full p-1.5 text-gray-300 opacity-100 transition-all duration-200 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-center gap-3">
            {product.sizes && product.sizes.length > 0 && (
              <span className="rounded-md bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-500">{product.sizes[0].size_label}</span>
            )}
            <QuantitySelector qty={item.quantity} onUpdate={(q) => onUpdateQuantity(item.product_id, q)} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#2B1D12]">₹{product.price}</span>
            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cart() {
  const { user } = useAuth();
  const { items, summary, updateQuantity, remove, applyCoupon, removeCoupon, coupon, placeOrder, loading } = useCart();
  const [selected, setSelected] = useState([]);
  const [couponInput, setCouponInput] = useState("");
  const { toggleWishlist } = useWishlist();

  // Keep selected items in sync with items
  if (items.length > 0 && selected.length === 0) {
     setSelected(items.map(i => i.product_id));
  }

  const allSelected_ = items.length > 0 && selected.length === items.length;

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelected(allSelected_ ? [] : items.map(i => i.product_id));
  };

  const handleApplyCoupon = async () => {
     if (couponInput) {
       await applyCoupon(couponInput);
     }
  };

  const totalSaved = summary.discount + (coupon?.discountAmount || 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] font-body flex flex-col">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-[#2B1D12]">Please log in to view cart</h2>
          <Link to="/auth" className="mt-4 rounded-xl bg-[#F4B000] px-6 py-3 font-bold text-white shadow-sm">Login</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-body">
      <AnnouncementBar />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2B1D12] font-display tracking-tight sm:text-4xl">Your Cart</h1>
            <p className="mt-1 text-sm text-gray-500">Review your items and proceed to checkout</p>
          </div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F4B000] transition-colors hover:text-[#DCA000]">
            <MoveRight className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* Left column */}
          <div className="flex flex-col gap-5 lg:col-span-2">

            {/* Deliver To */}
            <div className="flex flex-col gap-4 rounded-[20px] border border-gray-100 bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF8E8]">
                  <MapPin className="h-5 w-5 text-[#F4B000]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2B1D12]">Deliver To</h3>
                  <p className="mt-0.5 text-sm text-gray-500">Add a delivery address to continue</p>
                  <p className="mt-0.5 text-xs text-gray-400">Add your address for faster checkout and delivery estimates.</p>
                </div>
              </div>
              <button className="shrink-0 rounded-xl border-2 border-[#F4B000] px-5 py-2.5 text-sm font-bold text-[#F4B000] transition-all duration-200 hover:bg-[#F4B000] hover:text-white">
                + Add Address
              </button>
            </div>

            {/* Selection toolbar */}
            <div className="flex items-center justify-between rounded-t-2xl bg-[#FFF8E8]/60 px-5 py-3.5">
              <button onClick={toggleSelectAll} className="flex items-center gap-2.5 text-sm font-semibold text-gray-700 transition-colors hover:text-[#F4B000]">
                <div className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${
                  allSelected_
                    ? "border-[#F4B000] bg-[#F4B000] text-white"
                    : "border-gray-300 bg-white"
                }`}>
                  {allSelected_ && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
                {selected.length}/{items.length} Items Selected
              </button>
              <div className="flex items-center gap-3">
                <button onClick={() => selected.forEach(id => remove(id))} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 transition-all hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
                <button onClick={() => selected.forEach(id => toggleWishlist(id))} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 transition-all hover:bg-pink-50 hover:text-pink-600">
                  <Heart className="h-3.5 w-3.5" />
                  Wishlist
                </button>
              </div>
            </div>

            {/* Product list */}
            <div className="flex flex-col gap-3">
              {items.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-gray-500 font-medium">Your cart is empty.</p>
                </div>
              ) : (
                items.map((item) => (
                  <CartItem
                    key={item.product_id}
                    item={item}
                    selected={selected.includes(item.product_id)}
                    onToggleSelect={toggleSelect}
                    onUpdateQuantity={updateQuantity}
                    onRemove={remove}
                  />
                ))
              )}
            </div>

            {/* Free shipping banner */}
            <div className="flex items-start gap-4 rounded-2xl border border-green-100 bg-green-50/60 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100">
                <Truck className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-bold text-green-800">Yay! You got free shipping.</p>
                <p className="mt-0.5 text-xs text-green-600">
                  Unlock more exclusive offers when you add items worth ₹200+ more.
                </p>
              </div>
              <button className="ml-auto shrink-0 rounded-lg border border-green-200 px-4 py-2 text-xs font-bold text-green-700 transition-all hover:bg-green-100">
                Explore
              </button>
            </div>

          </div>

          {/* Right column — sticky */}
          <div className="flex flex-col gap-5 lg:col-span-1">
            <div className="sticky top-28 flex flex-col gap-5">

              {/* Apply Coupons */}
              <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
                <h3 className="flex items-center gap-2 text-sm font-bold text-[#2B1D12]">
                  <Tag className="h-4 w-4 text-[#F4B000]" />
                  Apply Coupons
                </h3>
                <div className="mt-3 flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-900 uppercase placeholder:text-gray-400 placeholder:normal-case transition-all focus:border-[#F4B000] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F4B000]/20"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="rounded-xl bg-[#F4B000] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#DCA000]"
                  >
                    Apply
                  </button>
                </div>
                {coupon && (
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-green-50 px-3.5 py-2.5">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-semibold text-green-700">Coupon Applied: {coupon.code}</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-semibold text-red-500 transition-colors hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Price Details */}
              <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
                <h3 className="text-sm font-bold text-[#2B1D12]">
                  Price Details ({items.length} items)
                </h3>
                <div className="mt-4 space-y-3">
                  <Row label="Total MRP" value={`₹${summary.totalMrp.toFixed(2)}`} />
                  <Row label="Discount on MRP" value={`-₹${summary.discount.toFixed(2)}`} valueClass="text-green-600" />
                  {coupon && (
                    <Row label="Coupon Discount" value={`-₹${coupon.discountAmount.toFixed(2)}`} valueClass="text-green-600" />
                  )}
                  <div className="border-t border-gray-100 pt-3">
                    <Row label="Subtotal" value={`₹${summary.subtotal.toFixed(2)}`} bold />
                  </div>
                  <Row label="Shipping" value={summary.shipping === 0 ? "FREE" : `₹${summary.shipping.toFixed(2)}`} valueClass={summary.shipping === 0 ? "text-green-600 font-semibold" : ""} />
                  <div className="border-t-2 border-gray-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-[#2B1D12]">Total Amount</span>
                      <span className="text-xl font-bold text-[#F4B000]">₹{summary.finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-green-50 px-3.5 py-3">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-bold text-green-700">You saved ₹{totalSaved.toFixed(2)}</span>
                  </div>
                </div>

                <button disabled={loading || items.length === 0} onClick={() => placeOrder()} className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#F4B000] to-[#FFC83D] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F4B000]/25 transition-all duration-300 hover:from-[#E0A000] hover:to-[#F0B800] active:scale-[0.98] disabled:opacity-50">
                  <Lock className="h-4 w-4" />
                  {loading ? "Processing..." : "Place Order (COD)"}
                </button>

                <p className="mt-3 text-center text-[10px] leading-relaxed text-gray-400">
                  By placing the order, you agree to SPOOWA{" "}
                  <a href="#" className="underline hover:text-[#F4B000]">terms</a> and{" "}
                  <a href="#" className="underline hover:text-[#F4B000]">privacy policy</a>.
                </p>
              </div>

              {/* Delivery Timeline */}
              <div className="flex items-center gap-4 rounded-[20px] border border-gray-100 bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF8E8]">
                  <Calendar className="h-5 w-5 text-[#F4B000]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#2B1D12]">Get it by Thu, Jun 11</p>
                  <p className="text-xs text-gray-500">Standard delivery within 3-5 business days</p>
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

function Row({ label, value, valueClass = "text-gray-900", bold = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm ${bold ? "font-bold" : "font-medium"} ${valueClass}`}>{value}</span>
    </div>
  );
}

export default Cart;
