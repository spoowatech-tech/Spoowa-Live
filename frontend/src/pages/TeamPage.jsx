import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { BoardOfAdvisors } from "@/components/BoardOfAdvisors";
import { Team } from "@/components/Team";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

function TeamPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Premium ambient background glows */}
      <div className="absolute top-[5%] left-[-15%] w-[600px] h-[600px] rounded-full bg-orange-300/10 blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute top-[45%] right-[-15%] w-[600px] h-[600px] rounded-full bg-[#D4AF37]/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-15%] w-[500px] h-[500px] rounded-full bg-orange-200/8 blur-[120px] pointer-events-none" />

      <AnnouncementBar />
      <Navbar />
      <motion.main 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10"
      >
        {/* Banner header to make page look premium */}
        <section className="bg-hero/40 py-16 text-center border-b border-gray-100/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-display text-4xl sm:text-5xl lg:text-6xl text-foreground">
              LEADERSHIP &amp; <span className="text-accent">ADVISORS</span>
            </h1>
            <p className="mt-4 mx-auto max-w-2xl text-base text-muted-foreground font-medium">
              Meet the distinguished board members and core food technologists driving the formulation, safety, and growth of SPOOWA.
            </p>
          </div>
        </section>
        
        {/* Advisors & core team components */}
        <BoardOfAdvisors />
        <Team />
      </motion.main>
      <Footer />
    </div>
  );
}

export default TeamPage;
