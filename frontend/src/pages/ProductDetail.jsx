import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Heart,
  Star,
  Package,
  BadgeCheck,
  Headphones,
} from "lucide-react";
import { motion } from "framer-motion";
import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { getProductById, getProducts, getRegions, addToCart as apiAddToCart } from "@/services/api";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, formatPrice, fetchCart } = useCart();
  const { user } = useAuth();

  // Product state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI state
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  // Related products
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Selected variant
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  // Fetch product
  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      setLoading(true);
      setError("");
      try {
        // Get region first (required for price calculation)
        const regionsData = await getRegions();
        const regionId = regionsData?.regions?.[0]?.id;

        const data = await getProductById(id, regionId);
        const prod = data.product;
        if (prod) {
          setProduct(prod);
          // Set first image
          const firstImage = prod.images?.[0]?.url || prod.thumbnail;
          if (firstImage) setActiveImage(firstImage);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Failed to load product:", err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // Fetch related products
  useEffect(() => {
    async function fetchRelated() {
      try {
        const regions = await getRegions();
        const regionId = regions?.regions?.[0]?.id;
        const data = await getProducts({
          limit: 5,
          region_id: regionId,
          fields: "*variants,*variants.calculated_price",
        });
        const filtered = (data.products || []).filter((p) => p.id !== id);
        setRelatedProducts(filtered.slice(0, 4));
      } catch (err) {
        console.error("Failed to load related products:", err);
      }
    }
    fetchRelated();
  }, [id]);

  // Derived values
  const galleryImages = useMemo(() => {
    if (!product) return [];
    const imgs = [];
    if (product.thumbnail) imgs.push(product.thumbnail);
    if (product.images?.length) {
      product.images.forEach((img) => {
        const url = img.url || img;
        if (url && !imgs.includes(url)) imgs.push(url);
      });
    }
    return imgs.filter(Boolean);
  }, [product]);

  useEffect(() => {
    if (galleryImages.length > 0 && !activeImage) {
      setActiveImage(galleryImages[0]);
    }
  }, [galleryImages, activeImage]);

  const selectedVariant = product?.variants?.[selectedVariantIndex];
  const variantId = selectedVariant?.id;
  const calculatedPrice = selectedVariant?.calculated_price;
  const price = calculatedPrice?.calculated_amount;
  const originalPrice = calculatedPrice?.original_amount;
  const currencyCode = calculatedPrice?.currency_code || "inr";
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const primaryImage = activeImage || galleryImages[0] || "/placeholder.svg";

  // Format price helper (Medusa stores in smallest unit — paise for INR)
  const fmtPrice = (amount) => {
    if (amount == null) return "₹0";
    const val = amount / 100;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Add to cart
  const handleAddToCart = async () => {
    if (!variantId || adding) return;

    setAdding(true);
    try {
      // Add qty items one by one or use the addToCart from context
      const success = await addToCart(variantId, qty);
      if (success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }
    } catch (err) {
      toast.error(err.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  // Buy now — add to cart then navigate to checkout
  const handleBuyNow = async () => {
    if (!variantId || buyingNow) return;

    setBuyingNow(true);
    try {
      const success = await addToCart(variantId, qty);
      if (success) {
        navigate("/checkout");
      }
    } catch (err) {
      toast.error(err.message || "Failed to proceed");
    } finally {
      setBuyingNow(false);
    }
  };

  // Delivery date helper
  const getDeliveryDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <AnnouncementBar />
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-100 rounded-3xl animate-pulse" />
            <div className="space-y-6">
              <div className="h-8 bg-gray-100 rounded-xl w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-100 rounded-lg w-full animate-pulse" />
              <div className="h-4 bg-gray-100 rounded-lg w-2/3 animate-pulse" />
              <div className="h-12 bg-gray-100 rounded-xl w-1/3 animate-pulse" />
              <div className="h-14 bg-gray-100 rounded-xl animate-pulse" />
              <div className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <AnnouncementBar />
        <Navbar />
        <div className="pt-32 text-center px-4 pb-24">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6">
            <ChevronLeft className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-3">
            Product Not Found
          </h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {error || "The product you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft size={16} /> Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-24 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-8 font-medium">
          <Link to="/shop" className="hover:text-black transition-colors">
            Shop
          </Link>
          <ChevronRight size={14} className="text-gray-300" />
          {product.collection && (
            <>
              <span className="capitalize">
                {product.collection.title}
              </span>
              <ChevronRight size={14} className="text-gray-300" />
            </>
          )}
          <span className="text-black font-semibold truncate max-w-[200px]">
            {product.title}
          </span>
        </nav>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Left: Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image */}
            <div className="relative aspect-square bg-[#f8f8f8] rounded-3xl overflow-hidden border border-gray-100 shadow-sm group flex items-center justify-center">
              {hasDiscount && (
                <div className="absolute top-5 left-5 z-10 rounded-full bg-[#F4B000] px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-md">
                  -{discountPercent}% Off
                </div>
              )}
              <img
                src={primaryImage}
                alt={product.title}
                className="w-[85%] h-[85%] object-contain transition-transform duration-700 group-hover:scale-105"
              />
              {/* Wishlist button */}
              <button
                onClick={() => setWishlist(!wishlist)}
                className="absolute top-5 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                <Heart
                  size={20}
                  className={
                    wishlist
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400"
                  }
                />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            {galleryImages.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 bg-white p-1 transition-all duration-300 hover:shadow-md ${
                      activeImage === img
                        ? "border-[#F4B000] shadow-[0_4px_12px_rgba(244,176,0,0.2)]"
                        : "border-gray-200 hover:border-[#F4B000]/50"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      className="h-full w-full object-contain rounded-lg"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-gray-900 leading-tight">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="mt-2 text-lg text-gray-500 font-medium">
                  {product.subtitle}
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 leading-relaxed text-[15px]">
                {product.description}
              </p>
            )}

            {/* Price */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-4xl font-black text-gray-900 tracking-tight">
                  {fmtPrice(price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg font-semibold text-gray-400 line-through pb-1">
                      {fmtPrice(originalPrice)}
                    </span>
                    <span className="inline-flex items-center h-7 rounded-full bg-green-50 border border-green-200 px-3 text-xs font-extrabold text-green-700">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs font-bold text-green-600">
                Inclusive of all taxes
              </p>
            </div>

            {/* Variant Selector (if multiple variants) */}
            {product.variants?.length > 1 && (
              <div className="space-y-3">
                <span className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">
                  Variant
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        selectedVariantIndex === idx
                          ? "border-[#F4B000] bg-[#F4B000]/10 text-[#9a6e00]"
                          : "border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {v.title || `Variant ${idx + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">
                Quantity
              </span>
              <div className="inline-flex h-11 items-center rounded-full border border-gray-200 bg-white px-1 shadow-sm">
                <button
                  onClick={() => setQty((c) => Math.max(1, c - 1))}
                  className="flex h-9 w-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <Minus size={16} />
                </button>
                <span className="flex w-10 items-center justify-center text-base font-extrabold tabular-nums">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((c) => c + 1)}
                  className="flex h-9 w-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={adding || !variantId}
                className={`flex items-center justify-center gap-2 h-14 rounded-2xl text-sm font-extrabold uppercase tracking-wide transition-all duration-300 shadow-sm hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                  added
                    ? "bg-green-500 text-white"
                    : "bg-gradient-to-r from-[#F4B000] to-[#E59700] text-white shadow-[0_4px_16px_rgba(244,176,0,0.3)]"
                }`}
              >
                {adding ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : added ? (
                  <>
                    <Check size={18} /> Added!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={buyingNow || !variantId}
                className="flex items-center justify-center gap-2 h-14 rounded-2xl border-2 border-black bg-white text-black text-sm font-extrabold uppercase tracking-wide transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {buyingNow ? (
                  <div className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                ) : (
                  "Buy Now"
                )}
              </button>
            </div>

            {/* Delivery & Trust Badges */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Truck size={18} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    Free Delivery by{" "}
                    <span className="text-green-600">
                      {getDeliveryDate(7)}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Standard shipping across India
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <RefreshCcw size={18} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    Easy 7 Days Returns
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Hassle-free exchange policy
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    100% Authentic Product
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Lab tested • Clean label • SPOOWA verified
                  </p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            {product.material && (
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide mb-3">
                  Details
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Material</span>
                    <span className="font-semibold">{product.material}</span>
                  </div>
                  {product.weight && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Weight</span>
                      <span className="font-semibold">{product.weight}g</span>
                    </div>
                  )}
                  {product.origin_country && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Origin</span>
                      <span className="font-semibold">
                        {product.origin_country}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Trust Section */}
        <section className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              icon: ShieldCheck,
              title: "Secure Payments",
              text: "Encrypted checkout",
            },
            {
              icon: RefreshCcw,
              title: "7 Days Returns",
              text: "Easy exchanges",
            },
            {
              icon: BadgeCheck,
              title: "100% Authentic",
              text: "SPOOWA verified",
            },
            {
              icon: Headphones,
              title: "Dedicated Support",
              text: "Customer care",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4B000]/10 text-[#F4B000]">
                <Icon size={18} />
              </span>
              <span>
                <span className="block text-sm font-extrabold text-gray-900">
                  {title}
                </span>
                <span className="block text-xs font-medium text-gray-400">
                  {text}
                </span>
              </span>
            </div>
          ))}
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-black text-gray-900 mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {relatedProducts.map((rp) => {
                const rpVariant = rp.variants?.[0];
                const rpPrice = rpVariant?.calculated_price?.calculated_amount;
                const rpOriginal =
                  rpVariant?.calculated_price?.original_amount;
                const rpCurrency =
                  rpVariant?.calculated_price?.currency_code || "inr";
                const rpHasDiscount = rpOriginal && rpOriginal > rpPrice;
                const rpImage = rp.thumbnail || rp.images?.[0]?.url;

                const rpFormatPrice = (amount) => {
                  if (amount == null) return "₹0";
                  return new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: rpCurrency.toUpperCase(),
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(amount / 100);
                };

                return (
                  <Link
                    key={rp.id}
                    to={`/product/${rp.id}`}
                    className="group rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-square bg-[#f8f8f8] flex items-center justify-center overflow-hidden relative">
                      {rpHasDiscount && (
                        <span className="absolute top-3 left-3 rounded-full bg-[#F4B000] text-white text-[10px] font-extrabold px-2.5 py-1 shadow-sm">
                          {Math.round(
                            ((rpOriginal - rpPrice) / rpOriginal) * 100
                          )}
                          % OFF
                        </span>
                      )}
                      {rpImage ? (
                        <img
                          src={rpImage}
                          alt={rp.title}
                          className="w-[80%] h-[80%] object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <ShoppingBag className="h-12 w-12 text-gray-200" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[2.5rem]">
                        {rp.title}
                      </h3>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-lg font-black text-gray-900">
                          {rpFormatPrice(rpPrice)}
                        </span>
                        {rpHasDiscount && (
                          <span className="text-xs text-gray-400 line-through">
                            {rpFormatPrice(rpOriginal)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
