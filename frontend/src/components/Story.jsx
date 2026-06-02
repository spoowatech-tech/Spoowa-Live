export function Story() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-accent">OUR STORY</p>
          <h2 className="mt-3 text-display text-4xl leading-[0.95] sm:text-5xl">
            BUILT IN INDIA.
            <br />
            <span className="underline-lime">MADE TO MOVE.</span>
          </h2>
          <p className="mt-6 text-base text-muted-foreground">
            Spoowa was born from a simple idea: hydration shouldn't taste like compromise. We pair real fruit with a clean electrolyte + vitamin blend, brewed and canned in India for athletes, weekend warriors, and everyone in between.
          </p>
          <p className="mt-4 text-base text-muted-foreground">
            No artificial colors. No empty calories. Just hydration that keeps up with your pace — from morning runs to late nights at the gym.
          </p>
          <a href="#" className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-accent">
            READ OUR JOURNEY
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: "2023", label: "Founded in Bengaluru" },
            { value: "4", label: "Signature flavors" },
            { value: "0g", label: "Added sugar*" },
            { value: "100%", label: "Recyclable cans" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-white p-6 shadow-card">
              <p className="text-display text-4xl text-accent">{s.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
