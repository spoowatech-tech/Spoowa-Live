import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Bestsellers } from "@/components/Bestsellers";
import { Activities } from "@/components/Activities";
import { BrandCTA } from "@/components/BrandCTA";
import { HydrationCalculator } from "@/components/HydrationCalculator";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

function Home() {
  return (
    <div className="min-h-screen bg-page bg-[radial-gradient(circle_at_top_left,rgba(255,180,0,0.06),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.05),transparent_40%),radial-gradient(circle_at_center,rgba(59,130,246,0.04),transparent_50%)]">
      <AnnouncementBar />
      <Navbar />
      <motion.main 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Hero />
        <Activities />
        <BrandCTA />
        <HydrationCalculator />
        <Bestsellers />
      </motion.main>
      <Footer />
    </div>
  );
}

export default Home;
