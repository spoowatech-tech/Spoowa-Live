import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Story } from "@/components/Story";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

function About() {
  // Floating particle array helper
  const droplets = [
    { size: 8, delay: 0, duration: 6, top: "25%", left: "12%", opacity: 0.35 },
    { size: 14, delay: 1.5, duration: 8, top: "65%", left: "8%", opacity: 0.2 },
    { size: 10, delay: 0.5, duration: 7, top: "35%", right: "14%", opacity: 0.3 },
    { size: 6, delay: 2, duration: 5, top: "75%", right: "10%", opacity: 0.4 },
    { size: 12, delay: 3, duration: 9, top: "15%", left: "45%", opacity: 0.25 },
  ];

  return (
    <div className="min-h-screen bg-page">
      <AnnouncementBar />
      <Navbar />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        {/* Immersive Dark Gold Hero Section */}
        <section className="relative bg-[#1A120B] py-24 md:py-32 overflow-hidden border-b border-[#F4B000]/10">
          {/* Glowing ambient backgrounds */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,176,0,0.12),transparent_45%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.06),transparent_50%)] pointer-events-none" />
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
          
          {/* Fine dotted tech pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Floating animated honey-droplet elements */}
          {droplets.map((d, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 0 }}
              animate={{ y: [-15, 15, -15], x: [-5, 5, -5] }}
              transition={{
                duration: d.duration,
                repeat: Infinity,
                delay: d.delay,
                ease: "easeInOut",
              }}
              style={{
                width: d.size,
                height: d.size,
                top: d.top,
                left: d.left,
                right: d.right,
                opacity: d.opacity,
              }}
              className="absolute rounded-full bg-gradient-to-b from-[#FFA800] to-[#E59700] blur-[1px] pointer-events-none shadow-[0_0_10px_rgba(244,176,0,0.5)]"
            />
          ))}

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, type: "spring", stiffness: 60 }}
            >
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#F4B000]/30 bg-amber-500/5 px-4 py-1.5 text-[10px] font-extrabold tracking-[0.25em] text-[#FFC83D] uppercase mb-6 shadow-sm">
                <span>The Alchemy of Stamina</span>
              </div>

              <h1 className="text-display text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[0.92] uppercase">
                ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC83D] via-[#F4B000] to-orange-500 filter drop-shadow-sm">SPOOWA</span>
              </h1>
              
              <p className="mt-6 mx-auto max-w-2xl text-base sm:text-lg text-gray-300 font-medium leading-relaxed">
                Discover our mission to craft functional, natural beverages and premium honey formulations backed by sports science and clinical research.
              </p>
            </motion.div>
          </div>

          {/* Subtle honey drip visual wave separator at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-page pointer-events-none overflow-hidden">
            <svg viewBox="0 0 1440 32" className="absolute bottom-0 w-full h-full fill-page text-page" preserveAspectRatio="none">
              <path d="M0,16 C120,28 240,28 360,16 C480,4 600,4 720,16 C840,28 960,28 1080,16 C1200,4 1320,4 1440,16 L1440,32 L0,32 Z" />
            </svg>
          </div>
        </section>
        
        {/* Core story section */}
        <Story />
      </motion.main>
      <Footer />
    </div>
  );
}

export default About;
