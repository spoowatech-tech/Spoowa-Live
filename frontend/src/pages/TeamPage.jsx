import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { BoardOfAdvisors } from "@/components/BoardOfAdvisors";
import { Team } from "@/components/Team";
import { Footer } from "@/components/Footer";

function TeamPage() {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar />
      <main className="animate-fade-up">
        {/* Banner header to make page look premium */}
        <section className="bg-hero py-16 text-center border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-display text-4xl sm:text-5xl lg:text-6xl text-foreground">
              LEADERSHIP &amp; <span className="text-accent">ADVISORS</span>
            </h1>
            <p className="mt-4 mx-auto max-w-2xl text-base text-muted-foreground">
              Meet the distinguished board members and core food technologists driving the formulation, safety, and growth of SPOOWA.
            </p>
          </div>
        </section>
        
        {/* Advisors & core team components */}
        <BoardOfAdvisors />
        <Team />
      </main>
      <Footer />
    </div>
  );
}

export default TeamPage;
