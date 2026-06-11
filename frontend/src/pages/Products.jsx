import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { getProducts, getRegions } from "@/services/api";
import ProductCard from "@/components/ProductCard";
import { ShoppingBag, Search } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const regions = await getRegions();
        const regionId = regions?.regions?.[0]?.id;
        const data = await getProducts({
          limit: 100,
          region_id: regionId,
          fields: "*variants,*variants.calculated_price",
        });
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filtered = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar />

      <div className="max-w-[1920px] mx-auto px-4 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-gray-900">
            All Products
          </h1>
          <p className="mt-3 text-gray-500 text-lg font-medium max-w-xl mx-auto">
            Explore our complete range of premium hydration, energy, and wellness products
          </p>

          {/* Search */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4B000]/30 focus:border-[#F4B000] transition-all"
            />
          </div>
        </motion.div>

        {/* Product count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-bold text-gray-500">
            {loading ? "Loading..." : `${filtered.length} products`}
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="rounded-3xl border border-gray-100 overflow-hidden">
                <div className="aspect-[4/5] bg-gray-100 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded-lg w-3/4 animate-pulse" />
                  <div className="h-6 bg-gray-100 rounded-lg w-1/2 animate-pulse" />
                  <div className="h-11 bg-gray-100 rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filtered.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <ShoppingBag className="h-10 w-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">
              {searchQuery ? "No products found" : "No products available"}
            </h2>
            <p className="text-gray-500 text-sm max-w-sm text-center">
              {searchQuery
                ? `We couldn't find any products matching "${searchQuery}". Try a different search.`
                : "Check back soon — new products are being added."}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
