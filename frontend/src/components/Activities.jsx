import running from "@/assets/activity-running.jpg";
import cycling from "@/assets/activity-cycling.jpg";
import gym from "@/assets/activity-gym.jpg";
import outdoor from "@/assets/activity-outdoor.jpg";

const activities = [
  { title: "RUNNING", desc: "Stay light. Stay fast.", img: running, icon: "🏃" },
  { title: "CYCLING", desc: "Pedal stronger. Go longer.", img: cycling, icon: "🚴" },
  { title: "GYM & FITNESS", desc: "Train hard. Recover smart.", img: gym, icon: "🏋️" },
  { title: "OUTDOOR", desc: "Fuel adventures. Naturally.", img: outdoor, icon: "🥾" },
];

export function Activities() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="text-display text-3xl sm:text-4xl lg:text-5xl">
        MADE FOR EVERY <span className="underline-lime">MOVE</span>
      </h2>
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {activities.map((a) => (
          <a key={a.title} href="#" className="group relative block aspect-[3/4] overflow-hidden rounded-2xl shadow-card">
            <img src={a.img} alt={a.title} loading="lazy" width={800} height={1000} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-[color:var(--lime)] text-base">
              {a.icon}
            </div>
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <h3 className="text-display text-xl sm:text-2xl">{a.title}</h3>
              <p className="mt-1 text-xs opacity-90 sm:text-sm">{a.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
