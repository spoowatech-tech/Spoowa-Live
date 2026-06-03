import { Linkedin, Mail, ShieldCheck } from "lucide-react";
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

export function Team() {
  return (
    <section id="team" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-t border-gray-100">
      <div className="text-center">
        <div className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-[#FFFDF5] px-4 py-1.5 shadow-sm mb-6">
          <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> CFTRI R&D Partnership
          </span>
        </div>
        <h2 className="text-display text-4xl leading-[0.95] sm:text-5xl uppercase">
          Team of SPOOWA
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-base text-gray-500">
          Our core product development team of food scientists and technologists, backing SPOOWA's innovation with clinical precision and research expertise.
        </p>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member) => (
          <article 
            key={member.id} 
            className="group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
              <img
                src={member.image}
                alt={member.name}
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-102"
              />
              <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-0.5 text-[8px] font-bold tracking-wider text-gray-800 uppercase shadow-sm">
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
                  <p className="mt-0.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
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

              <p className="mt-3 text-xs leading-relaxed text-gray-500 flex-grow">
                {member.bio}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
