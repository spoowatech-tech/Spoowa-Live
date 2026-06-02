import { Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  const cols = [
    { title: "SHOP", links: ["All Products", "Citrus Burst", "Berry Blitz", "Tropical Tide", "Melon Mist"] },
    { title: "COMPANY", links: ["Our Story", "Ingredients", "Hydration Guide", "Sustainability", "Careers"] },
    { title: "SUPPORT", links: ["Contact", "Shipping", "Returns", "FAQs", "Wholesale"] },
  ];
  return (
    <footer className="mt-20 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-background text-foreground">
                <span className="text-display text-lg">S</span>
              </div>
              <span className="text-display text-2xl">SPOOWA</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-background/70">
              Hydration that moves with you. Real fruit, clean electrolytes, proudly made in India.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-background/20 hover:bg-accent hover:border-accent">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title} className="lg:col-span-2">
              <p className="text-xs font-bold tracking-[0.18em] text-background/60">{c.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {c.links.map((l) => (
                  <li key={l}><a href="#" className="text-background/85 hover:text-accent">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
          <div className="lg:col-span-2">
            <p className="text-xs font-bold tracking-[0.18em] text-background/60">STAY HYDRATED</p>
            <p className="mt-4 text-sm text-background/75">Drops, deals & hydration tips.</p>
            <form className="mt-3 flex overflow-hidden rounded-full border border-background/20">
              <input placeholder="Email" className="flex-1 bg-transparent px-3 py-2 text-sm placeholder:text-background/50 outline-none" />
              <button className="bg-accent px-4 text-xs font-bold">JOIN</button>
            </form>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-background/15 pt-6 text-xs text-background/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Spoowa Beverages Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-accent">Privacy</a>
            <a href="#" className="hover:text-accent">Terms</a>
            <a href="#" className="hover:text-accent">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
