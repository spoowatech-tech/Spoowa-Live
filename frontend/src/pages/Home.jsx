import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Bestsellers } from "@/components/Bestsellers";
import { Activities } from "@/components/Activities";
import { BrandCTA } from "@/components/BrandCTA";
import { HydrationCalculator } from "@/components/HydrationCalculator";
import { Footer } from "@/components/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar />
      <main className="animate-fade-up">
        <Hero />
        <Activities />
        <BrandCTA />
        <HydrationCalculator />
        <Bestsellers />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
