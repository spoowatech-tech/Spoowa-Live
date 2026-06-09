import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag, Plus, Minus, Trash2, MoveRight,
  Lock, ShieldCheck, Star, Truck, Check, Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const FREE_SHIPPING_THRESHOLD = 49900; // In paise (₹499)

function QuantitySelector({ qty, onUpdate }) {
  return (
    <div className="inline-flex items-center rounded-xl border-2 border-gray-200 bg-white overflow-hidden">
      <button
        onClick={() => onUpdate(qty - 1)}
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

function CartItem({ item, onUpdateQuantity, onRemove, formatPrice }) {
  const title = item.title || item.product_title || "Product";
  const description = item.description || item.product_description || "";
  const thumbnail = item.thumbnail;
  const unitPrice = item.unit_price || 0;
  const totalPrice = item.total || unitPrice * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-200 hover:border-[#F4B000]/15 hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:gap-5 sm:p-5"
    >
      {/* Product image */}
      <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-100 sm:h-28 sm:w-28 overflow-hidden">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="h-[85%] object-contain drop-shadow-sm" />
        ) : (
          <ShoppingBag className="h-10 w-10 text-gray-300" />
        )}
      </div>

      {/* Product info */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-extrabold text-[#2B1D12] line-clamp-2 leading-snug">
              {title}
            </h3>
            {description && (
              <p className="mt-0.5 text-xs text-gray-500 font-medium line-clamp-1">{description}</p>
            )}
            {item.variant_title && item.variant_title !== "Default Variant" && (
              <span className="mt-1.5 inline-block rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-500">
                {item.variant_title}
              </span>
            )}
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="shrink-0 rounded-full p-1.5 text-gray-300 transition-all hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Bottom row */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <QuantitySelector qty={item.quantity} onUpdate={(q) => onUpdateQuantity(item.id, q)} />
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-[#2B1D12]">
              {formatPrice(totalPrice)}
            </span>
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

  const formatAmount = (paise) => `₹${Math.round(paise / 100)}`;

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
              Add <span className="text-[#D88A00] font-extrabold">{formatAmount(remaining)}</span> more for free shipping
            </p>
          )}
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
  const { items, cart, summary, updateQuantity, remove, formatPrice, loading } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) return <EmptyCart />;

  const subtotal = cart?.item_subtotal || 0;
  const total = cart?.total || 0;
  const shippingTotal = cart?.shipping_total || 0;
  const discountTotal = cart?.discount_total || 0;

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
          <div className="flex flex-col gap-4 lg:col-span-2">
            {/* Items */}
            <AnimatePresence>
              <div className="flex flex-col gap-3">
                {items.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={remove}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            </AnimatePresence>

            {/* Free shipping progress */}
            <FreeShippingBar subtotal={subtotal} />
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <div className="sticky top-24 flex flex-col gap-4">
              {/* Price details */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
                <h3 className="text-sm font-extrabold text-[#2B1D12] mb-4">
                  Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium">Subtotal</span>
                    <span className="text-sm font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  {discountTotal > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 font-medium">Discount</span>
                      <span className="text-sm font-bold text-green-600">-{formatPrice(discountTotal)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium">Shipping</span>
                    <span className={`text-sm font-semibold ${shippingTotal === 0 ? "text-green-600 font-extrabold" : ""}`}>
                      {shippingTotal === 0 ? "FREE 🎉" : formatPrice(shippingTotal)}
                    </span>
                  </div>
                  <div className="border-t-2 border-gray-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-extrabold text-[#2B1D12]">Total Amount</span>
                      <span className="text-2xl font-black text-[#F4B000]">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  disabled={loading || items.length === 0}
                  onClick={() => {
                    if (!user) {
                      navigate('/auth');
                    } else {
                      navigate('/checkout');
                    }
                  }}
                  className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-2xl btn-gold py-4 text-sm font-extrabold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock className="h-4 w-4" />
                  Proceed to Checkout
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
                  <p className="text-sm font-extrabold text-[#2B1D12]">Estimated Delivery</p>
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
