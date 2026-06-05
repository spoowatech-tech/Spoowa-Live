import { useState } from "react";
import { Linkedin, Mail, ShieldCheck, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import teamBonita from "@/assets/team_bonita.png";
import teamHarshul from "@/assets/team_harshul.png";
import teamDilip from "@/assets/team_dilip.png";
import teamAsish from "@/assets/team_asish.png";

const teamMembers = [
  {
    id: 1,
    name: "Bonita Aranha",
    role: "Founder",
    badge: "CFTRI Alumna",
    image: teamBonita,
    linkedin: "https://www.linkedin.com/in/bonita-aranha-4ab10188/",
    bio: "Bonita Aranha, founder of Beacon Global Food Consultancy, is a visionary leader with a deep-rooted passion for innovation in the food industry. A distinguished alumna of CFTRI, Bonita's drive to create a one-stop solution for the global food industry led to the establishment of Beacon. Her expertise in product development, technical proficiency and profound understanding of global food and beverage trends are pivotal to the company's success."
  },
  {
    id: 2,
    name: "Dr. Harshul Vora",
    role: "Chief Innovation Officer",
    badge: "Beverage Expert",
    image: teamHarshul,
    linkedin: "https://www.linkedin.com/in/dr-harshul-vora-bb11549/?originalSubdomain=au",
    bio: "Dr. Harshul Vora leads the Beverage category at Beacon Global Food Consultancy, bringing over 38 years of expertise. With a proven track record at multinational B2B and B2C organizations, Dr. Vora excels in product innovation, industry insights, and global market strategies. His extensive experience in developing over 100 successful beverage products empowers clients to achieve excellence and innovation in the beverage industry."
  },
  {
    id: 3,
    name: "Dilip Malani",
    role: "Co-Founder",
    badge: "Strategic Growth",
    image: teamDilip,
    linkedin: "https://www.linkedin.com/in/dilip-malani-25901282/",
    bio: "Dilip Malani, co-founder of Beacon Global Food Consultancy, brings a wealth of experience from CFTRI and FMCG companies. With expertise in leadership, product innovation, business strategy and brand development, Dilip's visionary approach drives our company forward. His passion for excellence and entrepreneurial spirit make him an invaluable asset to our team."
  },
  {
    id: 4,
    name: "Asish Kumar Pal",
    role: "Chief Technical Officer",
    badge: "CFTRI Alumnus",
    image: teamAsish,
    linkedin: "https://www.linkedin.com/in/asish-kumar-pal/",
    bio: "Ashish Kumar Pal excels in managing turnkey, brownfield and greenfield projects, showcasing broad expertise in setting up and optimizing large-scale food and beverage operations. With over four decades in the industry, his journey is marked by achievements in project management, factory operations and market strategies. As a CFTRI alumnus, Ashish combines innovation with tradition to drive results."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 16
    }
  }
};

export function Team() {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <section id="team" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-t border-gray-100/60">
      <div className="text-center">
        <div className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-[#FFFDF5] px-4 py-1.5 shadow-sm mb-6">
          <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> CFTRI R&D Partnership
          </span>
        </div>
        <h2 className="text-display text-4xl leading-[0.95] sm:text-5xl uppercase">
          Team of SPOOWA
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-base text-gray-500 font-medium">
          Our core product development team of food scientists and technologists, backing SPOOWA's innovation with clinical precision and research expertise.
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        {teamMembers.map((member) => (
          <motion.article 
            key={member.id} 
            variants={cardVariants}
            className="group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(212,175,55,0.14)] hover:border-[#D4AF37]/30"
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
              <img
                src={member.image}
                alt={member.name}
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-102"
              />
              <div className="absolute top-4 left-4 rounded-full bg-white/95 px-3.5 py-1 text-[9px] font-extrabold tracking-wider text-[#D4AF37] uppercase shadow-sm backdrop-blur-sm">
                {member.badge}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-[#D4AF37] transition-colors leading-tight">
                    {member.name}
                  </h3>
                  <p className="mt-0.5 text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                    {member.role}
                  </p>
                </div>
                {member.linkedin && (
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="rounded-full bg-gray-50 hover:bg-accent/15 p-2 text-gray-400 hover:text-[#D4AF37] transition-colors shrink-0"
                    aria-label={`${member.name} LinkedIn Profile`}
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>

              <p className="mt-3 text-xs leading-relaxed text-gray-500 line-clamp-3 flex-grow font-medium">
                {member.bio}
              </p>

              <button 
                onClick={() => setSelectedMember(member)}
                className="mt-5 flex items-center justify-between rounded-full bg-gray-50 hover:bg-[#FFFDF5] px-4.5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-800 hover:text-[#D4AF37] border border-gray-100 hover:border-[#D4AF37]/35 transition-all w-full mt-auto cursor-pointer"
              >
                <span>Read Biography</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {/* Modal Popup Overlay */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedMember(null)}
          >
            {/* Modal Container */}
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.45, bounce: 0.12 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 rounded-full p-2 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors z-10 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Left side: Photo */}
              <div className="w-full md:w-[38%] shrink-0">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                  <img 
                    src={selectedMember.image} 
                    alt={selectedMember.name} 
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="mt-4 inline-block rounded-full bg-[#FFFDF5] border border-[#D4AF37]/25 px-3.5 py-1.2 text-[10px] font-extrabold tracking-wider text-[#D4AF37] uppercase">
                  {selectedMember.badge}
                </div>
              </div>

              {/* Right side: Detailed Biography */}
              <div className="flex-1 flex flex-col justify-start">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">{selectedMember.name}</h3>
                    <p className="text-xs font-bold tracking-wider text-[#D4AF37] uppercase mt-2">{selectedMember.role}</p>
                  </div>
                  {selectedMember.linkedin && (
                    <a 
                      href={selectedMember.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="rounded-full bg-gray-50 hover:bg-accent/15 p-2 text-gray-400 hover:text-[#D4AF37] transition-colors shrink-0 cursor-pointer"
                      aria-label={`${selectedMember.name} LinkedIn Profile`}
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                </div>
                
                <div className="border-t border-gray-100 my-4"></div>
                
                <div className="overflow-y-auto flex-grow pr-1 text-sm text-gray-600 leading-relaxed font-medium">
                  {selectedMember.bio}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
