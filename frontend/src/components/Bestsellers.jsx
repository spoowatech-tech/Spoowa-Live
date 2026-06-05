import { ArrowRight, ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "@/services/api";
import { useCart } from "@/context/CartContext";
import productHoney from "@/assets/product_honey.png";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15
    }
  }
};

export function Bestsellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchBestsellers() {
      try {
        const data = await getProducts();
        // Just take first 4 for now, or filter by best-selling
        setProducts(data.products.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch bestsellers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBestsellers();
  }, []);
  return (
    <section id="bestsellers" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background colorful blurs */}
      <div className="absolute left-[-10%] top-1/4 w-[350px] h-[350px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute right-[-10%] top-1/2 w-[350px] h-[350px] rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />

      <div className="mb-8 flex items-center justify-between gap-4 relative z-10">
        <div>
          <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#D88A00] uppercase block">Bestselling Formulations</span>
          <h2 className="mt-2 text-display text-3xl sm:text-4xl font-black text-[#2B1D12] uppercase">Our most loved blends</h2>
        </div>
        <Link to="/shop" className="hidden items-center gap-2 text-xs font-bold tracking-wider uppercase text-gray-700 transition-all hover:text-[#D88A00] sm:inline-flex bg-white border border-gray-150 px-5 py-2.5 rounded-full shadow-sm">
          View all products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="relative z-10">
        <button type="button" aria-label="Previous products" className="absolute left-0 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-3.5 shadow-md hover:border-gray-300 lg:grid place-items-center cursor-pointer">
          <ChevronLeft className="h-4 w-4 text-foreground/70" />
        </button>
        <button type="button" aria-label="Next products" className="absolute right-0 top-1/2 z-10 hidden translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-3.5 shadow-md hover:border-gray-300 lg:grid place-items-center cursor-pointer">
          <ChevronRight className="h-4 w-4 text-foreground/70" />
        </button>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {products.map((product) => (
            <motion.article 
              key={product.id} 
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.015 }}
              className="relative rounded-[32px] border border-gray-150 bg-gradient-to-b from-white to-[#FFFDF5] p-5 shadow-sm hover:border-[#F4B000]/40 hover:shadow-[0_15px_40px_rgba(244,176,0,0.12)] transition-all duration-300"
            >
              <Link to={`/product/${product.id}`} className="block">
                <div className={`flex aspect-[4/5] items-center justify-center rounded-[24px] bg-gradient-to-br ${product.gradient} p-6 border border-gray-100/50 shadow-inner`}>
                  <img src={product.image || productHoney} alt={product.name} className="max-h-full max-w-full object-contain drop-shadow-[0_16px_20px_rgba(0,0,0,0.08)] hover:scale-103 transition-transform" />
                </div>
              </Link>

              <div className="px-1 pt-5">
                <Link to={`/product/${product.id}`} className="block">
                  <h3 className="text-sm font-black tracking-wide text-gray-900 hover:text-[#D88A00] transition-colors line-clamp-1 uppercase">{product.name}</h3>
                  <p className="mt-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider line-clamp-1">{product.benefit || product.type}</p>
                </Link>

                <div className="mt-3.5 flex items-center gap-2 text-xs text-foreground/80">
                  <div className="flex items-center gap-0.5 text-[#F4B000]">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current opacity-70" />
                  </div>
                  <span className="font-extrabold text-gray-600">{product.rating}</span>
                </div>

                <div className="mt-5 pt-3.5 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Price</span>
                    <p className="text-xl font-black text-[#2B1D12]">₹{product.price}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(product.id, 1)}
                  className="mt-5 flex w-full items-center justify-between rounded-xl bg-[#2B1D12] hover:bg-[#F4B000] hover:text-[#2B1D12] px-4 py-3.5 text-xs font-bold tracking-[0.18em] text-white transition-all cursor-pointer shadow-sm"
                >
                  <span>ADD TO CART</span>
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      <div className="mt-8 flex justify-center sm:hidden">
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-foreground/80 transition-colors hover:text-accent">
          View all products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
