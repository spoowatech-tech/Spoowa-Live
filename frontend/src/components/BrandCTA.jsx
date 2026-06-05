import { Check, Users, Droplets, MapPin, Ban } from "lucide-react";
import splash from "@/assets/cta-splash.jpg";

const features = [
  "Electrolytes + Essential Vitamins",
  "Real Fruit Flavors",
  "Low Calorie",
  "No Artificial Ingredients",
];

const stats = [
  { icon: Users, value: "50K+", label: "Happy Customers" },
  { icon: Droplets, value: "4", label: "Refreshing Flavors" },
  { icon: MapPin, value: "100%", label: "Made in India" },
  { icon: Ban, value: "0", label: "Artificial Ingredients" },
];

export function BrandCTA() {
  return (
    <section id="ingredients" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-white via-white to-[color:color-mix(in_oklab,var(--berry)_8%,white)] shadow-card">
        <div className="grid items-center gap-6 lg:grid-cols-12 lg:gap-4">
          <div className="relative lg:col-span-4">
            <img src={splash} alt="Spoowa Berry Blitz splash" loading="lazy" width={1024} height={1024} className="h-full w-full object-contain" />
          </div>
          <div className="px-6 pb-8 lg:col-span-4 lg:py-12">
            <h2 className="text-display text-3xl leading-[0.95] sm:text-4xl lg:text-5xl">
              HYDRATE.
              <br />
              PERFORM.
              <br />
              <span className="text-accent">REPEAT.</span>
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Spoowa is more than just a drink. It's your daily partner for hydration, clean ingredients and better performance.
            </p>
            <ul className="mt-5 space-y-2.5">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm font-medium">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-accent-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4 px-6 pb-8 lg:col-span-4 lg:py-12 lg:pr-12">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-white/70 p-5">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[color:color-mix(in_oklab,var(--accent)_15%,white)] text-accent">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-display text-2xl">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
