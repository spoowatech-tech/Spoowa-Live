import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "@/services/api";
import ProductCard from "@/components/ProductCard";

export function Bestsellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBestsellers() {
      try {
        const data = await getProducts();
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
    <section id="bestsellers" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold tracking-[0.2em] text-muted-foreground uppercase">
            Best Sellers
          </p>
          <h2 className="mt-2 font-display text-3xl font-black text-[#2B1D12] sm:text-4xl">
            Our most loved products
          </h2>
        </div>
        <Link
          to="/shop"
          className="hidden items-center gap-2 text-xs font-bold tracking-wider uppercase text-foreground/70 transition-colors hover:text-[#D88A00] sm:inline-flex"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-border/40 bg-white overflow-hidden">
              <div className="aspect-square animate-pulse bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 rounded-lg bg-gray-100 animate-pulse" />
                <div className="h-3 rounded-lg bg-gray-100 animate-pulse w-2/3" />
                <div className="h-9 rounded-xl bg-gray-100 animate-pulse mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} eagerCount={4} />
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center sm:hidden">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 rounded-full border-2 border-[#F4B000]/40 bg-[#FFF8E8] px-6 py-3 text-xs font-bold tracking-wider uppercase text-[#D88A00] hover:bg-[#F4B000] hover:text-white transition-all"
        >
          View all products <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
