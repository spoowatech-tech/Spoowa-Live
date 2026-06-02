import { ArrowRight, ShoppingBag, Star, ChevronLeft, ChevronRight } from "lucide-react";
import citrus from "@/assets/can-citrus.jpg";
import berry from "@/assets/can-berry.jpg";
import tropical from "@/assets/can-tropical.jpg";
import melon from "@/assets/can-melon.jpg";

const products = [
  { name: "CITRUS BURST", tag: "Super Electrolytes", img: citrus, rating: 4.8, reviews: 120, price: 149, bg: "var(--citrus)" },
  { name: "BERRY BLITZ", tag: "Extra Electrolytes", img: berry, rating: 4.8, reviews: 98, price: 149, bg: "var(--berry)" },
  { name: "TROPICAL TIDE", tag: "Super Electrolytes", img: tropical, rating: 4.9, reviews: 110, price: 149, bg: "var(--tropical)" },
  { name: "MELON MIST", tag: "Super Electrolytes", img: melon, rating: 4.7, reviews: 89, price: 149, bg: "var(--melon)" },
];

export function Bestsellers() {
  return (
    <section id="bestsellers" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-display text-3xl sm:text-4xl lg:text-5xl">BESTSELLERS</h2>
        <a href="#" className="group inline-flex items-center gap-2 text-sm font-bold tracking-wide text-foreground/80 hover:text-accent">
          VIEW ALL PRODUCTS
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      <div className="relative mt-10">
        <button aria-label="Previous" className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-card hover:bg-muted md:block">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button aria-label="Next" className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-card hover:bg-muted md:block">
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <article key={p.name} className="group rounded-2xl border border-border bg-white p-4 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift">
              <div
                className="relative aspect-square overflow-hidden rounded-xl"
                style={{ background: `linear-gradient(160deg, color-mix(in oklab, ${p.bg} 10%, white), white)` }}
              >
                <img src={p.img} alt={p.name} loading="lazy" width={768} height={1024} className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="mt-4 px-1">
                <h3 className="text-display text-lg">{p.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{p.tag}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(p.rating) ? "fill-[color:var(--lime)] text-[color:var(--lime)]" : "text-border"}`} />
                    ))}
                  </div>
                  <span className="text-xs font-semibold">{p.rating} ({p.reviews})</span>
                </div>
                <p className="mt-2 text-base font-bold">₹{p.price}</p>
                <button className="mt-3 flex w-full items-center justify-between rounded-full bg-foreground px-5 py-3 text-xs font-bold tracking-wide text-background transition-colors hover:bg-accent">
                  ADD TO CART
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15">
                    <ShoppingBag className="h-3.5 w-3.5" />
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
