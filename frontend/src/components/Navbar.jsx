import { Search, User, ShoppingBag, Menu } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";

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
    { label: "Product", href: "#bestsellers" },
    { label: "Board of Advisors", href: "#board-advisors" },
  ];
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#" className="logo">
          <img src={logo} alt="SPOOWA Logo" className="h-8 w-auto object-contain" />
        </a>

        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-sm font-bold tracking-wide text-foreground/80 transition-colors hover:text-accent">
              {l.label}
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
              <a key={l.label} href={l.href} className="rounded-md px-2 py-2.5 text-sm font-bold hover:bg-muted">{l.label}</a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
