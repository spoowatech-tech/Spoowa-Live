import { ArrowRight, ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "@/services/api";
import { useCart } from "@/context/CartContext";

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
    <section id="bestsellers" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold tracking-[0.2em] text-muted-foreground uppercase">Best Sellers</p>
          <h2 className="mt-2 text-display text-3xl sm:text-4xl">Our most loved cans</h2>
        </div>
        <Link to="/shop" className="hidden items-center gap-2 text-xs font-bold tracking-wider uppercase text-foreground/80 transition-colors hover:text-accent sm:inline-flex">
          View all products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="relative">
        <button type="button" aria-label="Previous products" className="absolute left-0 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-white p-3 shadow-md lg:grid place-items-center">
          <ChevronLeft className="h-4 w-4 text-foreground/70" />
        </button>
        <button type="button" aria-label="Next products" className="absolute right-0 top-1/2 z-10 hidden translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-white p-3 shadow-md lg:grid place-items-center">
          <ChevronRight className="h-4 w-4 text-foreground/70" />
        </button>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <article key={product.id} className="relative rounded-3xl border border-border bg-white p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
              <Link to={`/product/${product.id}`} className="block">
                <div className={`flex aspect-[4/5] items-center justify-center rounded-[24px] bg-gradient-to-br ${product.gradient} p-5`}>
                  <img src={product.image || citrusCan} alt={product.name} className="max-h-full max-w-full object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,0.12)]" />
                </div>
              </Link>

              <div className="px-1 pt-4">
                <Link to={`/product/${product.id}`} className="block">
                  <h3 className="text-sm font-extrabold tracking-wide text-foreground hover:text-[#D88A00] transition-colors line-clamp-1">{product.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{product.benefit || product.type}</p>
                </Link>

                <div className="mt-3 flex items-center gap-2 text-xs text-foreground/80">
                  <div className="flex items-center gap-0.5 text-[#F4B000]">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current opacity-70" />
                  </div>
                  <span className="font-medium">{product.rating}</span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-lg font-extrabold text-foreground">₹{product.price}</p>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(product.id, 1)}
                  className="mt-4 flex w-full items-center justify-between rounded-xl bg-foreground px-4 py-3 text-xs font-bold tracking-[0.18em] text-white transition-colors hover:bg-accent"
                >
                  <span>ADD TO CART</span>
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center sm:hidden">
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-foreground/80 transition-colors hover:text-accent">
          View all products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
