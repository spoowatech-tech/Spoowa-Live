import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, HeartCrack, ShoppingCart, ArrowRight, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar, AnnouncementBar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import productHoney from "@/assets/product_honey.png";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

function StarRatingLocal({ rating, size = "sm" }) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  const full = Math.floor(rating || 0);
  const half = (rating || 0) - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`${starSize} ${
            s <= full
              ? "fill-[#F4B000] text-[#F4B000]"
              : s === full + 1 && half
              ? "fill-[#F4B000]/50 text-[#F4B000]"
              : "fill-gray-200 text-gray-200"
          }`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function WishlistCard({ item, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();

  // Handle differences in snake_case vs camelCase from db
  const originalPrice = item.original_price || item.originalPrice;
  const savings = originalPrice ? originalPrice - item.price : 0;
  const discountPct = originalPrice ? Math.round((savings / originalPrice) * 100) : item.discount || 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (addingToCart) return;
    setAddingToCart(true);
    try {
      await addToCart(item.product_id || item.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(item.product_id || item.id);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-[24px] border border-border/40 bg-white shadow-card transition-all duration-300 hover:shadow-lift hover:-translate-y-2 overflow-hidden"
    >
      <Link to={`/product/${item.product_id || item.id}`} className="block">
        {/* Badges */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5">
          {item.badge && (
            <span className="rounded-full bg-[#F4B000] px-2.5 py-1 text-[10px] font-extrabold text-white tracking-wide shadow-sm">
              {item.badge}
            </span>
          )}
          {discountPct > 0 && (
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Remove from Wishlist */}
        <button
          onClick={handleRemove}
          title="Remove from Wishlist"
          className="absolute top-3.5 right-3.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all hover:scale-110 hover:bg-red-50 group/remove"
        >
          <Trash2 className="h-4 w-4 text-gray-400 group-hover/remove:text-red-500 transition-colors" />
        </button>

        {/* Product Image */}
        <div className={`relative flex aspect-[4/5] items-center justify-center bg-gradient-to-br ${item.gradient || "from-amber-50 to-yellow-100"} p-8 overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
          <motion.img
            src={item.image || productHoney}
            alt={item.name}
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-h-full max-w-full object-contain drop-shadow-[0_12px_28px_rgba(244,176,0,0.15)]"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="px-4 pb-4 pt-3.5">
        <Link to={`/product/${item.product_id || item.id}`}>
          <h3 className="text-sm font-bold text-foreground hover:text-[#D88A00] transition-colors leading-snug line-clamp-2">{item.name}</h3>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-2">
          <StarRatingLocal rating={item.rating || 5} />
          <span className="text-xs font-bold text-foreground/80">{item.rating || "5.0"}</span>
          <span className="text-xs text-muted-foreground">({item.reviews || 0})</span>
        </div>

        {/* Pricing */}
        <div className="mt-3 flex items-end gap-2">
          <span className="text-lg font-black text-foreground">₹{item.price}</span>
          {originalPrice > item.price && (
            <span className="text-sm text-muted-foreground line-through pb-0.5">₹{originalPrice}</span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-3.5 space-y-2">
          <button
            onClick={handleAddToCart}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold tracking-wide transition-all duration-300 ${
              added
                ? "bg-green-500 text-white shadow-[0_4px_14px_rgba(34,197,94,0.30)]"
                : "bg-[#2B1D12] text-white hover:bg-[#F4B000] hover:shadow-[0_6px_20px_rgba(244,176,0,0.30)] active:scale-[0.97]"
            }`}
          >
            {added ? (
              <>✓ Added to Cart</>
            ) : addingToCart ? (
              <span className="animate-pulse">Adding…</span>
            ) : (
              <><ShoppingCart className="h-3.5 w-3.5" /> Add to Cart</>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function Wishlist() {
  const { items, loading } = useWishlist();

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-body flex flex-col">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:py-14">
        <div className="mb-8 border-b border-border/40 pb-6">
          <h1 className="text-3xl font-black text-[#2B1D12] font-display flex items-center gap-3">
            <Heart className="h-8 w-8 text-[#EF4444] fill-[#EF4444]" />
            My Wishlist
            {items.length > 0 && (
              <span className="text-lg font-bold text-muted-foreground bg-gray-100 px-3 py-1 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Save your favorite honey products and access them easily anytime.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 rounded-[24px] bg-white border border-border/40 shadow-card animate-shimmer overflow-hidden" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item, index) => (
              <WishlistCard key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center rounded-[32px] border border-border/40 bg-white shadow-sm"
          >
            <div className="h-24 w-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
              <HeartCrack className="h-10 w-10 text-red-300" />
            </div>
            <h3 className="text-2xl font-black text-foreground font-display">Your wishlist is empty</h3>
            <p className="text-[15px] text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed">
              You haven't saved any items yet. Explore our collection of premium pure honey and find your favorites!
            </p>
            <Link
              to="/shop"
              className="mt-8 rounded-full bg-gradient-to-r from-[#F4B000] to-[#E59700] px-8 py-4 text-sm font-extrabold text-white shadow-gold hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 group"
            >
              Explore Products <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Wishlist;
