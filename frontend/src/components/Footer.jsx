import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import logoSpefl from "@/assets/logo_spefl.png";

export function Footer() {
  return (
    <footer className="mt-20 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Column 1: Branding & Skill Council Logo */}
          <div className="lg:col-span-4">
            <Link to="/" className="logo inline-block bg-white p-1.5 rounded mb-4">
              <img src={logo} alt="SPOOWA Logo" className="h-8 w-auto object-contain" />
            </Link>
            <p className="mt-2 max-w-xs text-sm text-background/70">
              Dynamic sports-oriented hydration and energy drink formulas combined with functional premium honey blends. Naturally sweetened.
            </p>
            
            {/* Associated certification logo */}
            <div className="mt-6 flex flex-col gap-2">
              <span className="text-[9px] font-bold tracking-wider text-background/40 uppercase">Certified & Associated with</span>
              <div className="bg-white p-2 rounded max-w-[150px] border border-white/10 flex items-center justify-center">
                <img src={logoSpefl} alt="SPEFL-SC Logo" className="h-10 w-auto object-contain" />
              </div>
            </div>

            {/* Social links */}
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { url: "https://www.linkedin.com/company/spoowa", iconClass: "fa-brands fa-linkedin-in", label: "LinkedIn" },
                { url: "https://www.instagram.com/spoowa_official?igsh=eW93ZGhlNHR3aHlr", iconClass: "fa-brands fa-instagram", label: "Instagram" },
                { url: "https://x.com/Spoowa_offcial", iconClass: "fa-brands fa-x-twitter", label: "X (Twitter)" },
                { url: "https://www.facebook.com/Spoowa", iconClass: "fa-brands fa-facebook-f", label: "Facebook" },
                { url: "https://www.threads.net/@spoowa_official?igshid=NTc4MTIwNjQ2YQ==", iconClass: "fa-brands fa-threads", label: "Threads" },
                { url: "https://www.youtube.com/@Spoowa_offcials", iconClass: "fa-brands fa-youtube", label: "YouTube" },
                { url: "https://in.pinterest.com/spowacorporate/_pins", iconClass: "fa-brands fa-pinterest-p", label: "Pinterest" }
              ].map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="grid h-9 w-9 place-items-center rounded-full border border-background/20 hover:bg-accent hover:border-accent hover:text-white transition-colors">
                  <i className={`${s.iconClass} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-2">
            <p className="text-xs font-bold tracking-[0.18em] text-background/60">NAVIGATION</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link to="/#bestsellers" className="text-background/85 hover:text-accent font-medium">Product</Link>
              </li>
              <li>
                <Link to="/about" className="text-background/85 hover:text-accent font-medium">About</Link>
              </li>
              <li>
                <Link to="/team" className="text-background/85 hover:text-accent font-medium">Team</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Headquarters Address & Contact */}
          <div className="lg:col-span-3">
            <p className="text-xs font-bold tracking-[0.18em] text-background/60">HEADQUARTERS</p>
            <p className="mt-4 text-xs leading-relaxed text-background/75">
              Sports, Physical Education, Fitness and Leisure Skills Council<br />
              207, DLF Tower, Galleria Mall,<br />
              Delhi, 110091, DL, IN
            </p>
            <p className="mt-3 text-xs text-background/75">
              <strong>Tel:</strong> <a href="tel:01140539409" className="hover:text-accent transition-colors">011-40539409</a>
            </p>
          </div>

          {/* Column 4: Newsletter */}
          <div className="lg:col-span-3">
            <p className="text-xs font-bold tracking-[0.18em] text-background/60">STAY HYDRATED</p>
            <p className="mt-4 text-sm text-background/75">Get launch updates & deals.</p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-3 flex overflow-hidden rounded-full border border-background/20">
              <input placeholder="Email" required type="email" className="flex-1 bg-transparent px-3 py-2 text-sm placeholder:text-background/50 outline-none" />
              <button type="submit" className="bg-accent px-4 text-xs font-bold text-white hover:bg-accent/80 transition-colors">JOIN</button>
            </form>
          </div>
        </div>

        {/* Footer bottom */}
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
