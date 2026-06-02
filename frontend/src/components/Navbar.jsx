import { Search, User, ShoppingBag, Menu, ChevronDown } from "lucide-react";
import { useState } from "react";

export function AnnouncementBar() {
  const items = [
    "🇮🇳 MADE IN INDIA",
    "● NO ARTIFICIAL FLAVORS",
    "⚡ ELECTROLYTES + VITAMINS",
    "💧 FAST HYDRATION",
    "📦 FREE SHIPPING ON ORDERS ABOVE ₹499",
  ];
  return (
    <div className="border-b border-border/60 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 overflow-x-auto px-4 py-2.5 text-[11px] font-semibold tracking-wider text-foreground/80 sm:px-6 lg:px-8">
        {items.map((it) => (
          <span key={it} className="whitespace-nowrap">{it}</span>
        ))}
      </div>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "SHOP", hasMenu: true },
    { label: "OUR STORY" },
    { label: "INGREDIENTS" },
    { label: "HYDRATION GUIDE" },
  ];
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background">
            <span className="text-display text-lg">S</span>
          </div>
          <span className="text-display text-2xl tracking-tight">SPOOWA</span>
        </a>

        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <a key={l.label} href="#" className="flex items-center gap-1 text-sm font-bold tracking-wide text-foreground/80 transition-colors hover:text-accent">
              {l.label}
              {l.hasMenu && <ChevronDown className="h-3.5 w-3.5" />}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button aria-label="Search" className="hidden sm:inline-flex rounded-full p-2 hover:bg-muted">
            <Search className="h-5 w-5" />
          </button>
          <button aria-label="Account" className="hidden sm:inline-flex rounded-full p-2 hover:bg-muted">
            <User className="h-5 w-5" />
          </button>
          <button aria-label="Cart" className="relative rounded-full p-2 hover:bg-muted">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">2</span>
          </button>
          <button aria-label="Menu" onClick={() => setOpen(!open)} className="lg:hidden rounded-full p-2 hover:bg-muted">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-white lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <a key={l.label} href="#" className="rounded-md px-2 py-2.5 text-sm font-bold hover:bg-muted">{l.label}</a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
