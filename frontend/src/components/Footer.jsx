import { Link } from "react-router-dom";
import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import logo from "@/assets/logo.png";
import logoSpefl from "@/assets/logo_spefl.png";

const SOCIAL = [
  { url: "https://www.linkedin.com/company/spoowa", iconClass: "fa-brands fa-linkedin-in", label: "LinkedIn" },
  { url: "https://www.instagram.com/spoowa_official?igsh=eW93ZGhlNHR3aHlr", iconClass: "fa-brands fa-instagram", label: "Instagram" },
  { url: "https://x.com/Spoowa_offcial", iconClass: "fa-brands fa-x-twitter", label: "X (Twitter)" },
  { url: "https://www.facebook.com/Spoowa", iconClass: "fa-brands fa-facebook-f", label: "Facebook" },
  { url: "https://www.threads.net/@spoowa_official?igshid=NTc4MTIwNjQ2YQ==", iconClass: "fa-brands fa-threads", label: "Threads" },
  { url: "https://www.youtube.com/@Spoowa_offcials", iconClass: "fa-brands fa-youtube", label: "YouTube" },
  { url: "https://in.pinterest.com/spowacorporate/_pins", iconClass: "fa-brands fa-pinterest-p", label: "Pinterest" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    setTimeout(() => {
      toast.success("Subscribed successfully!");
      setEmail("");
      setSubscribing(false);
    }, 1000);
  };

  return (
    <footer id="footer" className="mt-20 bg-[#140F09] text-white/80">
      {/* Newsletter Banner */}
      <div className="border-b border-white/8">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:text-left lg:justify-between lg:gap-10">
            <div className="max-w-md">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F4B000]/15 border border-[#F4B000]/20 px-3.5 py-1.5 text-[11px] font-extrabold tracking-[0.15em] text-[#F4B000] uppercase mb-3">
                <Mail className="h-3.5 w-3.5" /> Newsletter
              </div>
              <h3 className="text-xl font-black text-white font-display">Stay Hydrated. Stay Updated.</h3>
              <p className="mt-1.5 text-sm text-white/55 font-medium">Get exclusive offers, wellness tips, and new product launches — direct to your inbox.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-1">
              <div className="flex flex-1 items-center gap-2.5 pl-4">
                <Mail className="h-4 w-4 text-white/30 shrink-0" />
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  type="email"
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none font-medium"
                />
              </div>
              <button
                disabled={subscribing}
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F4B000] to-[#E59700] px-5 py-3 text-xs font-extrabold text-white shadow-[0_4px_16px_rgba(244,176,0,0.30)] hover:shadow-[0_6px_24px_rgba(244,176,0,0.40)] transition-all disabled:opacity-60"
              >
                {subscribing ? "Joining…" : <><ArrowRight className="h-3.5 w-3.5" /> Join</>}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Branding */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block rounded-xl bg-white p-2.5 border border-white/20 mb-5 shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
              <img src={logo} alt="SPOOWA Logo" className="h-8 w-auto object-contain" />
            </Link>
            <p className="text-sm text-white/65 leading-relaxed max-w-xs font-medium">
              Dynamic sports-oriented hydration and energy drink formulas combined with functional premium honey blends. Naturally sweetened.
            </p>

            {/* Certification */}
            <div className="mt-6">
              <span className="text-[9px] font-extrabold tracking-[0.2em] text-white/30 uppercase block mb-2">
                Certified & Associated with
              </span>
              <div className="inline-block bg-white p-2.5 rounded-xl border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                <img src={logoSpefl} alt="SPEFL-SC Logo" className="h-9 w-auto object-contain" />
              </div>
            </div>

            {/* Social icons */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {SOCIAL.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/50 hover:bg-[#F4B000] hover:border-[#F4B000] hover:text-white transition-all duration-200"
                >
                  <i className={`${s.iconClass} text-sm`} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <p className="text-[10px] font-extrabold tracking-[0.22em] text-white/30 uppercase mb-4">Navigation</p>
            <ul className="space-y-3">
              {[
                { label: "Products", to: "/#bestsellers" },
                { label: "Shop", to: "/shop" },
                { label: "About Us", to: "/about" },
                { label: "Our Team", to: "/team" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-white/55 hover:text-[#F4B000] font-medium transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <p className="text-[10px] font-extrabold tracking-[0.22em] text-white/30 uppercase mb-4">Support</p>
            <ul className="space-y-3">
              {[
                { label: "Contact Us", to: "/contact" },
                { label: "Apply as Trainer", to: "/apply/trainer" },
                { label: "Apply as Gym", to: "/apply/gym" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-white/55 hover:text-[#F4B000] font-medium transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Headquarters */}
          <div className="lg:col-span-4">
            <p className="text-[10px] font-extrabold tracking-[0.22em] text-white/30 uppercase mb-4">Headquarters</p>
            <p className="text-sm leading-relaxed text-white/50 font-medium">
              Sports, Physical Education, Fitness and Leisure Skills Council<br />
              207, DLF Tower, Galleria Mall,<br />
              Delhi, 110091, DL, IN
            </p>
            <p className="mt-3 text-sm text-white/50 font-medium">
              Tel:{" "}
              <a href="tel:01140539409" className="text-white/70 hover:text-[#F4B000] transition-colors font-bold">
                011-40539409
              </a>
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#F4B000]/10 border border-[#F4B000]/15 px-4 py-2.5">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-bold text-white/70">Orders shipping within 24 hours</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/8 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-white/30 font-medium">
            © {new Date().getFullYear()} Spoowa Beverages Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map(link => (
              <a key={link} href="#" className="text-xs text-white/30 hover:text-[#F4B000] font-medium transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
