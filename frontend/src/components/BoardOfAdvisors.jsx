import { useState } from "react";
import { X, ChevronRight, GraduationCap, Award, Briefcase } from "lucide-react";
import boardKhanna from "@/assets/board_khanna.jpg";
import boardOberoi from "@/assets/board_oberoi.jpg";
import boardBidhuri from "@/assets/board_bidhuri.png";
import boardAli from "@/assets/board_ali.jpg";
import boardNaman from "@/assets/board_naman.png";

const advisors = [
  {
    id: 1,
    name: "Prof. (Dr.) Gulshan Lal Khanna",
    role: "Pioneering Sports Scientist & Advisor",
    badge: "Advisory Board",
    image: boardKhanna,
    shortBio: "Prof. (Dr.) Gulshan Lal Khanna is one of India’s pioneering sports scientists whose work has significantly contributed to the development of sports science, athlete performance systems, and sports policy in India and internationally.",
    expandedContent: (
      <div className="space-y-4 text-sm text-gray-600">
        <p>Prof. (Dr.) Gulshan Lal Khanna is one of India’s pioneering sports scientists whose work has significantly contributed to the development of sports science, athlete performance systems, and sports policy in India and internationally. With more than four decades of engagement in elite sport, research, academic leadership, and policy development, he has played a transformative role in integrating scientific approaches into India’s high-performance sport ecosystem.</p>
        <p>Prof. Khanna served as Pro-Vice-Chancellor of Manav Rachna International Institute of Research and Studies (MRIIRS), Faridabad, and SGT University, Gurugram (Delhi-NCR). Through these leadership roles he contributed to strengthening interdisciplinary education, research, and innovation in sports science, health sciences, and high-performance sport development.</p>
        <p>He continues to contribute to higher education and sports science development as Advisor to SGT University and also serves as Academic Advisor to Delhi Pharmaceutical Sciences and Research University (DPSRU).</p>
      </div>
    )
  },
  {
    id: 2,
    name: "Mipandeep Singh Oberoi",
    role: "Strategic Growth Mentor & Advisory Partner",
    badge: "Advisory Board",
    image: boardOberoi,
    shortBio: "Mipandeep Singh Oberoi serves as a startup growth mentor and advisory partner, focusing on scaling, fundraising, and refining business models.",
    expandedContent: (
      <div className="space-y-4 text-sm text-gray-600">
        <p>As a strategic growth mentor for early-stage founders, Mipandeep serves as a startup advisory partner focused on fundraising, investor readiness, and achieving product–market fit through refined go-to-market strategies.</p>
        <p>He acts as a trusted sounding board, helping entrepreneurs strengthen financial discipline, optimize unit economics, and plan effectively for scale-up. His role extends to governance and risk advisory for fast-growing ventures, connecting founders with strategic partners, domain experts, and capital networks to accelerate growth.</p>
        <p>He guides teams in building execution-focused, high-ownership cultures while ensuring compliance with regulatory requirements. With hands-on involvement in refining business models, revenue engines, and translating vision into measurable milestones and OKRs, Mipandeep helps founders turn strategic intent into sustainable, results-driven execution.</p>
      </div>
    )
  },
  {
    id: 3,
    name: "Gaurav Bidhuri",
    role: "World Boxing Medalist & Elite Athlete Representative",
    badge: "Advisory Board",
    image: boardBidhuri,
    shortBio: "Gaurav Bidhuri is a historic bronze medalist from the World Boxing Championship in Germany, holding an elite career world ranking of 11.",
    expandedContent: (
      <ul className="space-y-2.5 list-disc pl-5 text-sm text-gray-600">
        <li>World Boxing Championship, Germany: Bronze Medalist.</li>
        <li>World Ranked 11 in elite professional boxing.</li>
        <li>4th Indian ever to win a medal in World Boxing Championship history.</li>
        <li>1 & Only Indian with two successive contracts in the World Series of Boxing. Played for the Italian National Team 🇮🇹 (2015) and USA Team 🇺🇸 (2016).</li>
        <li>Grand Prix 2017, Czech Republic: Gold Medalist.</li>
        <li>President's Cup, Indonesia 2019: Silver Medalist.</li>
        <li>Represented India in major international events including the Asian Games, World Olympic Qualifier, and Asian Championship.</li>
        <li>Recieved the Best Boxer of the Year Award by Times of India.</li>
        <li>Two-time Arjuna Award Nominee (2018 and 2019).</li>
        <li>Proudly representing India at the world level since 2007.</li>
      </ul>
    )
  },
  {
    id: 4,
    name: "Dr. Farhan Ali, M.D, FACP",
    role: "Hospitalist & Internal Medicine Specialist",
    badge: "Medical Board",
    image: boardAli,
    shortBio: "Dr. Farhan Ali is a highly accomplished Hospitalist and Internal Medicine Specialist practicing at Multicare Yakima Memorial Hospital in Washington, USA.",
    expandedContent: (
      <div className="space-y-4 text-sm text-gray-600">
        <p>Dr. Farhan Ali, M.D, FACP is a board-certified Internal Medicine Specialist and Hospitalist based in the United States. He currently operates at the Multicare Yakima Memorial Hospital located in Yakima, Washington.</p>
        <p>With clinical expertise covering internal medicine, diagnostic care, and inpatient hospital management, Dr. Ali brings a wealth of medical and physiological oversight to SPOOWA's formulation, helping bridge the gap between active sports recovery and clinical wellness standards.</p>
      </div>
    )
  },
  {
    id: 5,
    name: "Naman Bhargava",
    role: "Elite Performance Coach",
    badge: "Technical Consultant",
    image: boardNaman,
    shortBio: "Naman Bhargava is an Elite Performance Coach and former Delhi State Champion who has cultivated multiple national and international champions.",
    expandedContent: (
      <div className="space-y-4 text-sm text-gray-600">
        <div>
          <strong className="text-gray-900 flex items-center gap-1.5 mb-1.5"><Briefcase className="h-4 w-4 text-[#D4AF37]" /> Coaching & Leadership</strong>
          <ul className="list-disc pl-5 space-y-1">
            <li>Founder & Head Coach: First Step Badminton Academy (FSBA)</li>
            <li>Delhi Team Coach: North Zone & Sub-Junior National Championships</li>
            <li>Elite Track Record: Cultivated multiple State, National, and International (BWF) champions and medalists</li>
          </ul>
        </div>
        <div className="pt-2">
          <strong className="text-gray-900 flex items-center gap-1.5 mb-1.5"><Award className="h-4 w-4 text-[#D4AF37]" /> Athletic Career</strong>
          <ul className="list-disc pl-5 space-y-1">
            <li>Team India Representative: World School Games & Asian School Games</li>
            <li>Gold Medalist: Former Delhi State Champion & CBSE National Winner</li>
            <li>National Medalist: School National Games</li>
          </ul>
        </div>
        <div className="pt-2">
          <strong className="text-gray-900 flex items-center gap-1.5 mb-1.5"><GraduationCap className="h-4 w-4 text-[#D4AF37]" /> Professional Credentials</strong>
          <ul className="list-disc pl-5 space-y-1">
            <li>BWF: Level 1 Coach & Shuttle Time Instructor</li>
            <li>International Olympic Committee (IOC): Certified in Sports Psychology, Sports Nutrition, Sports Exercise Physiology, and Sports Science</li>
            <li>IUSCA: Level 1 Strength & Conditioning</li>
          </ul>
        </div>
      </div>
    )
  }
];

export function BoardOfAdvisors() {
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);

  return (
    <section id="board-advisors" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-[#FFFDF5] px-4 py-1.5 shadow-sm mb-6">
          <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase">Guidance & Policy</span>
        </div>
        <h2 className="text-display text-4xl leading-[0.95] sm:text-5xl uppercase">
          Board of Advisors
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-base text-gray-500">
          Guiding SPOOWA's vision with world-class expertise in sports science, clinical medicine, elite athletics, and startup growth.
        </p>
      </div>

      {/* Advisory Grid */}
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {advisors.map((advisor) => (
          <div 
            key={advisor.id} 
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            {/* Image Wrapper */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-50">
              <img
                src={advisor.image}
                alt={advisor.name}
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-102"
              />
              <div className="absolute top-4 left-4 rounded-full bg-white/95 px-3.5 py-1 text-[9px] font-bold tracking-wider text-[#D4AF37] uppercase shadow-sm backdrop-blur-sm">
                {advisor.badge}
              </div>
            </div>
            
            {/* Body */}
            <div className="flex flex-col flex-grow p-4">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#D4AF37] transition-colors leading-tight">{advisor.name}</h3>
              <p className="mt-1 text-[11px] font-bold tracking-wider text-gray-400 uppercase">{advisor.role}</p>
              <p className="mt-3 text-xs leading-relaxed text-gray-500 line-clamp-3">
                {advisor.shortBio}
              </p>
              
              <button 
                onClick={() => setSelectedAdvisor(advisor)}
                className="mt-6 flex items-center justify-between rounded-full bg-gray-50 hover:bg-[#FFFDF5] px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-800 hover:text-[#D4AF37] border border-gray-100 hover:border-[#D4AF37]/35 transition-all w-full mt-auto"
              >
                <span>Read Biography</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup Overlay */}
      {selectedAdvisor && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-modal-fade"
          onClick={() => setSelectedAdvisor(null)}
        >
          {/* Modal Container */}
          <div 
            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 max-h-[85vh] overflow-y-auto animate-modal-slide"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={() => setSelectedAdvisor(null)}
              className="absolute top-4 right-4 rounded-full p-2 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left side: Photo */}
            <div className="w-full md:w-[38%] shrink-0">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                <img 
                  src={selectedAdvisor.image} 
                  alt={selectedAdvisor.name} 
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="mt-3 inline-block rounded-full bg-[#FFFDF5] border border-[#D4AF37]/20 px-3 py-1 text-[10px] font-bold tracking-wider text-[#D4AF37] uppercase">
                {selectedAdvisor.badge}
              </div>
            </div>

            {/* Right side: Detailed Biography */}
            <div className="flex-1 flex flex-col justify-start">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">{selectedAdvisor.name}</h3>
              <p className="text-xs font-bold tracking-wider text-[#D4AF37] uppercase mt-1.5">{selectedAdvisor.role}</p>
              
              <div className="border-t border-gray-100 my-4"></div>
              
              <div className="overflow-y-auto flex-grow pr-1">
                {selectedAdvisor.expandedContent}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
