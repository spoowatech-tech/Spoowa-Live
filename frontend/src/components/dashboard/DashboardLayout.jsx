import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sparkles } from "lucide-react";

/**
 * Common layout wrapper for all role dashboards.
 */
export default function DashboardLayout({ children, badge, title, subtitle, actions }) {
  return (
    <div className="min-h-screen bg-page bg-[radial-gradient(circle_at_top_left,rgba(255,180,0,0.05),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.04),transparent_40%)]">
      <AnnouncementBar />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-gray-150 pb-8 mb-10">
          <div>
            {badge && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#F4B000]/25 bg-[#FFFDF0] px-3.5 py-1 text-[10px] font-extrabold tracking-widest text-[#D4AF37] uppercase mb-3.5 shadow-sm">
                <Sparkles className="h-3 w-3 text-[#D4AF37]" />
                <span>{badge}</span>
              </div>
            )}
            {title && <h1 className="text-display text-3xl sm:text-4xl font-black text-gray-900 leading-tight uppercase">{title}</h1>}
            {subtitle && <p className="text-xs text-gray-500 font-semibold mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex gap-3 flex-wrap">{actions}</div>}
        </div>

        {children}
      </main>

      <Footer />
    </div>
  );
}
