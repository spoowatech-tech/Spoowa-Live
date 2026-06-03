import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search, User, ShoppingBag, Menu, MapPin, Plus, Minus, X,
  Heart, Truck, Lock, Calendar, Check, Tag, ChevronRight, Gift,
  Trash2, MoveRight, Percent, Clock, ShieldCheck
} from "lucide-react";
import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const products = [
  {
    id: 1,
    name: "Raw Honey",
    description: "Pure, unprocessed wild honey harvested directly from the comb.",
    weight: "500g",
    mrp: 599,
    price: 249,
    gradient: "from-amber-200 to-yellow-100",
    badge: "Bestseller",
  },
  {
    id: 2,
    name: "Honey with Turmeric",
    description: "Golden honey blended with premium turmeric for immunity support.",
    weight: "250g",
    mrp: 399,
    price: 149,
    gradient: "from-orange-200 to-yellow-50",
    badge: "Immunity",
  },
  {
    id: 3,
    name: "Wild Forest Honey",
    description: "Rare forest honey with rich, complex flavor notes from deep jungles.",
    weight: "500g",
    mrp: 500,
    price: 181.30,
    gradient: "from-amber-300 to-amber-100",
    badge: "Premium",
  },
];

const allSelected = products.map((p) => p.id);

function QuantitySelector() {
  const [qty, setQty] = useState(1);
  return (
    <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white">
      <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:text-[#F4B000]">
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="flex h-8 w-10 items-center justify-center text-sm font-semibold text-gray-900 tabular-nums">
        {qty}
      </span>
      <button onClick={() => setQty(qty + 1)} className="flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:text-[#F4B000]">
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function CartItem({ product, selected, onToggleSelect }) {
  return (
    <div className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-200 hover:border-gray-200 hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)] sm:gap-5 sm:p-5">
      <button
        onClick={() => onToggleSelect(product.id)}
        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200 ${
          selected
            ? "border-[#F4B000] bg-[#F4B000] text-white"
            : "border-gray-300 bg-white hover:border-[#F4B000]"
        }`}
      >
        {selected && <Check className="h-3 w-3 stroke-[3]" />}
      </button>

      <div className={`flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${product.gradient} sm:h-[100px] sm:w-[100px]`}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm">
          <span className="text-lg">🍯</span>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-bold text-[#2B1D12]">{product.name}</h3>
              <span className="shrink-0 rounded-full bg-[#FFF8E8] px-2 py-0.5 text-[10px] font-semibold text-[#B87A00]">{product.badge}</span>
            </div>
            <p className="mt-0.5 text-sm text-gray-500 line-clamp-1">{product.description}</p>
          </div>
          <button className="shrink-0 rounded-full p-1.5 text-gray-300 opacity-0 transition-all duration-200 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-500">{product.weight}</span>
            <QuantitySelector />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#2B1D12]">₹{product.price.toFixed(2)}</span>
            <span className="text-sm text-gray-400 line-through">₹{product.mrp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cart() {
  const [selected, setSelected] = useState([...allSelected]);
  const [couponApplied, setCouponApplied] = useState(true);
  const [couponInput, setCouponInput] = useState("SPOOWA10");

  const allSelected_ = selected.length === products.length;

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelected(allSelected_.length > 0 ? [] : [...allSelected]);
  };

  const totalMrp = products.reduce((sum, p) => sum + p.mrp, 0);
  const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
  const discount = totalMrp - totalPrice;
  const couponDiscount = 57.93;
  const subtotal = totalPrice - couponDiscount;
  const shipping = 49;
  const total = subtotal + shipping;
  const totalSaved = discount + couponDiscount;

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
                {selected.length}/{products.length} Items Selected
              </button>
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 transition-all hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 transition-all hover:bg-pink-50 hover:text-pink-600">
                  <Heart className="h-3.5 w-3.5" />
                  Wishlist
                </button>
              </div>
            </div>

            {/* Product list */}
            <div className="flex flex-col gap-3">
              {products.map((product) => (
                <CartItem
                  key={product.id}
                  product={product}
                  selected={selected.includes(product.id)}
                  onToggleSelect={toggleSelect}
                />
              ))}
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
                    onClick={() => setCouponApplied(true)}
                    className="rounded-xl bg-[#F4B000] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#DCA000]"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-green-50 px-3.5 py-2.5">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-semibold text-green-700">Coupon Applied: SPOOWA10</span>
                    </div>
                    <button
                      onClick={() => { setCouponApplied(false); setCouponInput(""); }}
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
                  Price Details ({selected.length}/{products.length} items)
                </h3>
                <div className="mt-4 space-y-3">
                  <Row label="Total MRP" value={`₹${totalMrp.toFixed(2)}`} />
                  <Row label="Discount on MRP" value={`-₹${discount.toFixed(2)}`} valueClass="text-green-600" />
                  <Row label="Coupon Discount" value={`-₹${couponDiscount.toFixed(2)}`} valueClass="text-green-600" />
                  <div className="border-t border-gray-100 pt-3">
                    <Row label="Subtotal" value={`₹${subtotal.toFixed(2)}`} bold />
                  </div>
                  <Row label="Shipping" value={selected.length > 0 ? "FREE" : `₹${shipping.toFixed(2)}`} valueClass={selected.length > 0 ? "text-green-600 font-semibold" : ""} />
                  <div className="border-t-2 border-gray-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-[#2B1D12]">Total Amount</span>
                      <span className="text-xl font-bold text-[#F4B000]">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-green-50 px-3.5 py-3">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-bold text-green-700">You saved ₹{totalSaved.toFixed(2)}</span>
                  </div>
                </div>

                <button className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#F4B000] to-[#FFC83D] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F4B000]/25 transition-all duration-300 hover:from-[#E0A000] hover:to-[#F0B800] active:scale-[0.98]">
                  <Lock className="h-4 w-4" />
                  Place Order
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
