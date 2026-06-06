import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, StarHalf, ShoppingCart, Plus, Minus, Trash2, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPriceINR, getProductPricing } from '@/lib/pricing';
import { getEntityStock, isOutOfStock } from '@/lib/stock';

// ─── Star Rating ─────────────────────────────────────────────────────────────
function StarRating({ rating = 0, reviews = 0 }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  if (!rating) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-px">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={12} className="text-gray-200" />
          ))}
        </div>
        <span className="text-[10px] text-gray-400 italic">No ratings yet</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <div className="flex items-center gap-px">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`f-${i}`} size={12} className="fill-[#F4B000] text-[#F4B000]" />
        ))}
        {hasHalf && <StarHalf size={12} className="fill-[#F4B000] text-[#F4B000]" />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`e-${i}`} size={12} className="text-gray-200" />
        ))}
      </div>
      <span className="text-[11px] font-bold text-foreground/70">{rating.toFixed(1)}</span>
      <span className="text-[11px] text-muted-foreground">
        ({Number(reviews).toLocaleString('en-IN')})
      </span>
    </div>
  );
}

// ─── Badge colour map ─────────────────────────────────────────────────────────
const BADGE_STYLES = {
  'Best Seller':      'bg-[#F4B000] text-white',
  'New Arrival':      'bg-[#3B82F6] text-white',
  'Most Popular':     'bg-[#8B5CF6] text-white',
  'Athlete Favorite': 'bg-[#EF4444] text-white',
  'Limited Edition':  'bg-[#EC4899] text-white',
};
function getBadgeStyle(badge) {
  return BADGE_STYLES[badge] || 'bg-[#2B1D12] text-white';
}

// ─── ProductCard ─────────────────────────────────────────────────────────────
/**
 * Reusable product card.
 *
 * Props:
 *   product    – product object from API
 *   index      – position in list (used for staggered animation & eager-loading)
 *   eagerCount – how many cards from the top should load images eagerly (default 12)
 *   ctaLabel   – override the "Add to Cart" button label
 */
function ProductCard({ product, index = 0, eagerCount = 12, ctaLabel = 'Add to Cart' }) {
  const navigate = useNavigate();
  const { items, addToCart, updateQuantity, remove } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [isHovered, setIsHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(index < eagerCount);
  const cardRef = useRef(null);
  const preloadedRef = useRef(false);

  // ── Derived values ──────────────────────────────────────────────────────────
  const productId = product?.id ?? product?.product_id;
  // Cart item uses `product_id` field from backend
  const cartItem = items.find((i) => i.product_id === productId);
  const qty = cartItem?.quantity || 0;

  const pricing = getProductPricing(product);
  const stockValue = getEntityStock(product);
  const outOfStock = isOutOfStock(product);
  const reachedStockLimit = Boolean(cartItem && !outOfStock && qty >= stockValue);
  const wishlisted = isInWishlist(productId);

  const primaryImage = product.image || product.images?.[0];
  const isFreeDelivery = pricing.finalPrice >= 499;
  const isAboveFold = index < eagerCount;

  // ── Lazy-load images via IntersectionObserver ───────────────────────────────
  const preloadImage = useCallback((src) => {
    if (preloadedRef.current || !src) return;
    preloadedRef.current = true;
    const img = new Image();
    img.src = src;
    if (img.complete) { setImgLoaded(true); return; }
    img.onload = () => setImgLoaded(true);
    img.onerror = () => setImgLoaded(true);
  }, []);

  useEffect(() => {
    if (isAboveFold) { preloadImage(primaryImage); return; }
    if (isVisible) { preloadImage(primaryImage); return; }

    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          preloadImage(primaryImage);
          observer.disconnect();
        }
      },
      { rootMargin: '800px 0px', threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible, primaryImage, preloadImage, isAboveFold]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const goToProduct = () => { if (productId) navigate(`/product/${productId}`); };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(productId);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    await addToCart(productId, 1);
  };

  const handleIncrease = async (e) => {
    e.stopPropagation();
    if (reachedStockLimit) return;
    await updateQuantity(productId, qty + 1);
  };

  const handleDecrease = async (e) => {
    e.stopPropagation();
    if (qty <= 1) await remove(productId);
    else await updateQuantity(productId, qty - 1);
  };

  const handleRemove = async (e) => {
    e.stopPropagation();
    await remove(productId);
  };

  const handleNotifyMe = (e) => {
    e.stopPropagation();
    toast('Notify Me is coming soon — stay tuned!', { icon: '🔔' });
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      ref={cardRef}
      className={`group h-full transition-[opacity,transform] duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={goToProduct}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && goToProduct()}
        aria-label={`View ${product.name}`}
        className="relative flex flex-col cursor-pointer bg-white rounded-2xl border border-border/40 shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden transition-shadow duration-300 hover:shadow-[0_10px_32px_rgba(0,0,0,0.11)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B000] focus-visible:ring-offset-2 h-full"
      >

        {/* ── Image ─────────────────────────────────────────────────────────── */}
        <div className={`relative bg-gradient-to-br ${product.gradient || 'from-amber-50 to-yellow-100'} p-3`}>
          <div className="aspect-square relative overflow-hidden rounded-xl">
            {/* Shimmer */}
            {!imgLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
            )}
            {(isVisible || isAboveFold) && primaryImage && (
              <img
                src={primaryImage}
                alt={product.name}
                loading={isAboveFold ? 'eager' : 'lazy'}
                decoding={isAboveFold ? 'sync' : 'async'}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgLoaded(true)}
                className={`w-full h-full object-contain transition-all duration-500 ${
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                } ${isHovered ? 'scale-105' : 'scale-100'} ${outOfStock ? 'grayscale opacity-70' : ''}`}
              />
            )}
          </div>

          {/* Out of stock badge */}
          {outOfStock && (
            <span className="absolute left-4 top-4 rounded-full bg-gray-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
              Out of Stock
            </span>
          )}

          {/* Discount badge — top left */}
          {pricing.hasDiscount && !outOfStock && (
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
              <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-extrabold text-white shadow leading-none">
                -{pricing.discountLabel}%
              </span>
              {product.badge && (
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold leading-none shadow ${getBadgeStyle(product.badge)}`}>
                  {product.badge}
                </span>
              )}
            </div>
          )}
          {!pricing.hasDiscount && product.badge && (
            <span className={`absolute top-4 left-4 z-10 rounded-full px-2.5 py-1 text-[10px] font-extrabold leading-none shadow ${getBadgeStyle(product.badge)}`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* ── Wishlist heart — top right ────────────────────────────────────── */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-4 top-4 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all hover:bg-white hover:shadow-md hover:scale-110"
        >
          <Heart
            size={15}
            className={`transition-all duration-200 ${
              wishlisted ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400 hover:text-red-400'
            }`}
          />
        </button>

        {/* ── Info ──────────────────────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 px-3 pt-2.5 pb-3">

          {/* Name */}
          <h3 className="text-xs sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 hover:text-[#D88A00] transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mt-1.5">
            <StarRating
              rating={Number(product.rating ?? product.average_rating ?? 0)}
              reviews={Number(product.reviews ?? product.review_count ?? 0)}
            />
          </div>

          {/* Pricing */}
          <div className="mt-2 space-y-0.5">
            {/* Row 1: Sale price + M.R.P. */}
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-black text-foreground">
                ₹{formatPriceINR(pricing.finalPrice)}
              </span>
              {pricing.hasDiscount && (
                <span className="text-xs text-muted-foreground">
                  M.R.P.:{' '}
                  <span className="line-through">₹{formatPriceINR(pricing.mrp)}</span>
                </span>
              )}
            </div>
            {/* Row 2: You Save */}
            {pricing.hasDiscount && pricing.savings > 0 && (
              <p className="text-[11px] font-bold text-green-600">
                You Save: ₹{formatPriceINR(pricing.savings)} ({pricing.discountLabel}%)
              </p>
            )}
            {/* Delivery badge */}
            <div className="flex items-center gap-1 mt-0.5">
              <Truck size={11} className="text-[#F4B000] shrink-0" />
              <span className="text-[10px] font-extrabold text-[#D88A00] uppercase tracking-wide">
                {isFreeDelivery ? 'FREE Delivery' : 'Free on ₹499+'}
              </span>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1 min-h-[8px]" />

          {/* ── CTA ─────────────────────────────────────────────────────────── */}
          <div className="mt-2.5">
            <AnimatePresence mode="wait">

              {/* Out-of-stock state */}
              {outOfStock && !cartItem && (
                <motion.div key="oos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                  <button disabled className="w-full py-2.5 rounded-xl text-xs font-bold bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed tracking-wide">
                    Currently Unavailable
                  </button>
                  <button onClick={handleNotifyMe} className="w-full py-2 rounded-xl text-xs font-bold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors tracking-wide">
                    Notify Me 🔔
                  </button>
                </motion.div>
              )}

              {/* Add to Cart */}
              {!outOfStock && qty === 0 && (
                <motion.button
                  key="add"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold tracking-wide bg-[#2B1D12] text-white transition-all duration-300 hover:bg-[#F4B000] hover:shadow-[0_6px_20px_rgba(244,176,0,0.30)] active:scale-[0.97]"
                >
                  <ShoppingCart size={13} className="shrink-0" />
                  <span>{ctaLabel}</span>
                </motion.button>
              )}

              {/* Qty stepper + remove */}
              {!outOfStock && qty > 0 && (
                <motion.div
                  key="stepper"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="flex flex-1 items-center justify-between rounded-xl border-2 border-[#F4B000]/50 bg-[#FFF8E8] overflow-hidden">
                      <button
                        type="button"
                        onClick={handleDecrease}
                        className="flex h-9 w-9 items-center justify-center text-[#D88A00] hover:bg-[#F4B000]/20 transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="text-sm font-black text-[#2B1D12] tabular-nums min-w-[20px] text-center">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={handleIncrease}
                        disabled={reachedStockLimit}
                        className="flex h-9 w-9 items-center justify-center text-[#D88A00] hover:bg-[#F4B000]/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemove}
                      title="Remove from cart"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-red-100 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  {reachedStockLimit && (
                    <p className="mt-1.5 text-[10px] font-bold text-center text-gray-400 uppercase tracking-wide">
                      Max stock reached
                    </p>
                  )}
                </motion.div>
              )}

              {/* OOS but still in cart (stale) */}
              {outOfStock && cartItem && (
                <motion.div key="oos-cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                  <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50/60 px-3 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-red-500">
                      Unavailable
                    </p>
                    <button type="button" onClick={handleRemove} className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ProductCard;
