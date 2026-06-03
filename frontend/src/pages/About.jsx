import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Story } from "@/components/Story";
import { Footer } from "@/components/Footer";

function About() {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar />
      <main className="animate-fade-up">
        {/* Banner header to make page look premium */}
        <section className="bg-hero py-16 text-center border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-display text-4xl sm:text-5xl lg:text-6xl text-foreground">
              ABOUT <span className="text-accent">SPOOWA</span>
            </h1>
            <p className="mt-4 mx-auto max-w-2xl text-base text-muted-foreground">
              Discover our mission to craft functional, natural beverages and premium honey formulations backed by sports science and clinical research.
            </p>
          </div>
        </section>
        
        {/* Core story section */}
        <Story />
      </main>
      <Footer />
    </div>
  );
}

export default About;
