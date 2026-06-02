import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import advisor1 from "@/assets/advisor-1.png";
import advisor2 from "@/assets/advisor-2.png";

const advisors = [
  {
    id: 1,
    name: "Prof. (Dr.) Gulshan Lal Khanna",
    role: "Pioneering Sports Scientist & Advisor",
    badge: "Advisory Board",
    image: advisor1,
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
    image: advisor2,
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
    image: advisor1,
    shortBio: "Gaurav Bidhuri is a historic bronze medalist from the World Boxing Championship in Germany, holding an elite career world ranking of 11.",
    expandedContent: (
      <ul className="space-y-2 list-disc pl-5 text-sm text-gray-600">
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
    image: advisor2,
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
    image: advisor1,
    shortBio: "Naman Bhargava is an Elite Performance Coach and former Delhi State Champion who has cultivated multiple national and international champions.",
    expandedContent: (
      <div className="space-y-4 text-sm text-gray-600">
        <div>
          <strong className="text-gray-900 block mb-1">Coaching & Leadership</strong>
          <ul className="list-disc pl-5 space-y-1">
            <li>Founder & Head Coach: First Step Badminton Academy (FSBA)</li>
            <li>Delhi Team Coach: North Zone & Sub-Junior National Championships</li>
            <li>Elite Track Record: Cultivated multiple State, National, and International (BWF) champions and medalists</li>
          </ul>
        </div>
        <div>
          <strong className="text-gray-900 block mb-1">Athletic Career</strong>
          <ul className="list-disc pl-5 space-y-1">
            <li>Team India Representative: World School Games & Asian School Games</li>
            <li>Gold Medalist: Former Delhi State Champion & CBSE National Winner</li>
            <li>National Medalist: School National Games</li>
          </ul>
        </div>
        <div>
          <strong className="text-gray-900 block mb-1">Professional Credentials</strong>
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

function AdvisorCard({ advisor }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group h-full flex flex-col overflow-hidden rounded-[20px] border border-gray-200 bg-white p-2 shadow-sm transition-all duration-500 hover:shadow-xl">
      <div className="flex flex-col md:flex-row md:items-start flex-grow">
        {/* Left: Large Portrait */}
        <div className="relative md:w-[45%] overflow-hidden rounded-[14px] shrink-0 md:sticky md:top-24">
          <img
            src={advisor.image}
            alt={advisor.name}
            className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase backdrop-blur-md shadow-sm">
            {advisor.badge}
          </div>
        </div>
        
        {/* Right: Profile Info */}
        <div className="flex flex-col p-6 md:p-8 md:w-[55%] h-full">
          <h3 className="text-display text-2xl font-bold tracking-tight text-gray-900">{advisor.name}</h3>
          <p className="mt-1 text-sm font-semibold tracking-wide text-[#D4AF37] uppercase">{advisor.role}</p>
          
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            {advisor.shortBio}
          </p>

          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded ? 'mt-5 max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="border-t border-gray-100 pt-5">
              {advisor.expandedContent}
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button 
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-900 transition-colors hover:text-[#D4AF37]"
            >
              {expanded ? 'Collapse Profile' : 'Read Full Profile'}
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BoardOfAdvisors() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-[#FFFDF5] px-4 py-1.5 shadow-sm mb-6">
          <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase">Leadership</span>
        </div>
        <h2 className="text-display text-4xl leading-[0.95] sm:text-5xl uppercase">
          Board of Advisors
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-base text-gray-500">
          Guiding SPOOWA's vision with world-class expertise in sports science, clinical medicine, elite athletics, and startup growth.
        </p>
      </div>

      <div className="mt-16 grid gap-8 xl:grid-cols-2">
        {advisors.map((advisor, index) => (
          <div key={advisor.id} className={index === 4 ? "xl:col-span-2 xl:w-1/2 xl:mx-auto h-full" : "h-full"}>
            <AdvisorCard advisor={advisor} />
          </div>
        ))}
      </div>
    </section>
  );
}
