import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Bestsellers } from "@/components/Bestsellers";
import { Activities } from "@/components/Activities";
import { BrandCTA } from "@/components/BrandCTA";
import { BoardOfAdvisors } from "@/components/BoardOfAdvisors";
import { Team } from "@/components/Team";
import { Footer } from "@/components/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <Bestsellers />
        <Activities />
        <BrandCTA />
        <BoardOfAdvisors />
        <Team />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
