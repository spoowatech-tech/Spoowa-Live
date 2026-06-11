import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

const GRADIENT_COLORS = [
  "from-amber-50 to-yellow-100",
  "from-orange-50 to-amber-100",
  "from-emerald-50 to-green-100",
  "from-blue-50 to-sky-100",
  "from-purple-50 to-violet-100",
  "from-rose-50 to-pink-100",
];

function ProductCard({ product, index = 0 }) {
  const { addToCart, formatPrice } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Medusa product shape
  const title = product.title || "Product";
  const description = product.description || "";
  const thumbnail = product.thumbnail || product.images?.[0]?.url;
  const variant = product.variants?.[0];
  const variantId = variant?.id;
  const price = variant?.calculated_price?.calculated_amount;
  const originalPrice = variant?.calculated_price?.original_amount;
  const currencyCode = variant?.calculated_price?.currency_code || "inr";
  const hasDiscount = originalPrice && originalPrice > price;

  // Pick a gradient based on index
  const gradient = GRADIENT_COLORS[index % GRADIENT_COLORS.length];

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!variantId || adding) return;

    setAdding(true);
    const success = await addToCart(variantId, 1);
    setAdding(false);

    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const formatMoney = (amount) => {
    if (amount == null) return "₹0";
    const val = amount / 100;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <Link to={`/product/${product.id}`} className="block">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: (index % 4) * 0.06 }}
      className="group rounded-[24px] border border-border/40 bg-white overflow-hidden shadow-card hover:shadow-lift hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className={`relative aspect-[4/5] bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-[85%] w-[85%] object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <ShoppingBag className="h-16 w-16" />
            <span className="text-xs font-bold">No Image</span>
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 rounded-full bg-[#F4B000] text-white text-[10px] font-extrabold px-2.5 py-1 shadow-sm">
            {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-base font-extrabold text-[#2B1D12] line-clamp-2 leading-snug min-h-[2.5rem]">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-xs text-gray-500 line-clamp-2 font-medium">
            {description}
          </p>
        )}

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-black text-[#2B1D12]">
            {formatMoney(price)}
          </span>
          {hasDiscount && (
            <span className="text-sm font-semibold text-gray-400 line-through">
              {formatMoney(originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={adding || !variantId}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold transition-all duration-300 ${
            added
              ? "bg-green-500 text-white shadow-sm"
              : "bg-gradient-to-r from-[#F4B000] to-[#E59700] text-white shadow-[0_4px_15px_rgba(244,176,0,0.3)] hover:shadow-[0_6px_20px_rgba(244,176,0,0.4)] hover:-translate-y-0.5 active:scale-[0.97]"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {adding ? (
            <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : added ? (
            <>
              <Check className="h-4 w-4" /> Added!
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
    </Link>
  );
}

export default ProductCard;
