import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Share } from "lucide-react";
import { motion } from "framer-motion";
import { getProducts, getRegions } from "@/services/api";
import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// --- Components ---

function BrandNav() {
  const navLinks = [
    "HOME", "HYDRATION", "ENERGY DRINKS", "HONEY BLENDS", 
    "DISCOVERY BOXES", "SUBSCRIPTIONS", "SWEAT STREAK", 
    "TRAINERS", "ACADEMIES", "RETAILERS", "LAB REPORTS", 
    "INGREDIENTS", "ATHLETE PICKS", "BEST SELLERS", 
    "NEW ARRIVALS", "OFFERS", "MORE"
  ];
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm w-full font-sans">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4 min-w-max">
          <span className="text-sm font-semibold tracking-tight">SPOOWA Brand Page</span>
          <button className="px-4 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 transition-colors rounded-full border border-gray-300">
            Follow
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-700">
            <Share className="w-4 h-4" />
          </button>
        </div>
        <div className="hidden lg:flex flex-1 overflow-x-auto items-center space-x-6 px-8 no-scrollbar">
          {navLinks.map((link) => (
            <Link key={link} to={`#${link.toLowerCase().replace(' ', '-')}`} className={`text-xs font-semibold whitespace-nowrap hover:text-black transition-colors ${link === 'HOME' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-600'}`}>
              {link}
            </Link>
          ))}
        </div>
        <div className="flex items-center min-w-[240px]">
          <div className="relative w-full">
            <input type="text" placeholder="Search all SPOOWA products" className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="w-full bg-[#f4f4f4] flex flex-col items-center justify-center pt-16 pb-8 min-h-[150px] max-h-[200px] overflow-hidden relative">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="z-10 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-4 flex items-center">
          SPOOWA <span className="ml-2 text-blue-500">✨</span>
        </h1>
      </motion.div>
    </section>
  );
}

function BannerCardsSection() {
  const banners = [
    { id: 1, title: "SPOOWA Hydration Mix", subtitle: "Electrolyte powered fast recovery.", text: "Clean ingredients. Real performance.", imageUrl: "/images/banner_hydration.png", cta: "Buy Now", accent: "text-emerald-700" },
    { id: 2, title: "SPOOWA Energy Drink", subtitle: "Clean energy without the crash.", text: "Natural Caffeine • Honey Powered • Zero Crash Energy", imageUrl: "/images/banner_energy.png", cta: "Buy Now", accent: "text-amber-600" },
    { id: 3, title: "SPOOWA Honey Collection", subtitle: "Nature's perfect sweetness.", text: "Raw Honey • Functional Wellness • Daily Nutrition", imageUrl: "/images/banner_honey.png", cta: "Buy Now", accent: "text-yellow-600" }
  ];
  return (
    <section className="max-w-[1920px] mx-auto px-4 lg:px-8 py-12 space-y-8">
      {banners.map((banner, idx) => (
        <motion.div key={banner.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="group relative bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row items-center cursor-pointer h-[85vh] min-h-[600px] max-h-[900px] shadow-sm border border-gray-100">
          
          <Link to="/products" className="absolute inset-0 z-30" />
          
          {/* Full Background Image */}
          <motion.div className="absolute inset-0 w-full h-full z-0 overflow-hidden" whileHover={{ scale: 1.03 }} transition={{ duration: 0.8, ease: "easeOut" }}>
             <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover md:object-right object-center" />
          </motion.div>

          {/* Text Content overlaying the white space of the image */}
          <div className="w-full md:w-1/2 p-10 lg:p-24 text-center md:text-left z-20 flex flex-col justify-center items-center md:items-start h-full relative pointer-events-none">
            <h2 className={`text-5xl lg:text-7xl font-black tracking-tight mb-4 drop-shadow-sm ${banner.accent}`}>{banner.title}</h2>
            <p className="text-2xl lg:text-3xl text-gray-900 mb-4 font-bold tracking-tight">{banner.subtitle}</p>
            <p className="text-lg lg:text-xl text-gray-700 mb-10 max-w-[450px] font-medium leading-relaxed">{banner.text}</p>
            <span className="px-10 py-4 bg-black text-white font-extrabold tracking-widest uppercase rounded-full group-hover:bg-gray-800 transition-colors text-sm shadow-xl group-hover:-translate-y-1 transform inline-block">{banner.cta}</span>
          </div>
          
        </motion.div>
      ))}
    </section>
  );
}

function SmallBannersSection({ products }) {
  const getProdId = (handle) => products.find(p => p.handle === handle)?.id;
  
  const banners = [
    { id: 1, title: "SPOOWA Hydration Mix", subtitle: "Electrolyte powered fast recovery.", imageUrl: "/images/small_hydration.png", cta: "Buy now", productId: getProdId("spoowa-hydration-mix-lime-mint") },
    { id: 2, title: "SPOOWA Energy Drink", subtitle: "Clean energy without the crash.", imageUrl: "/images/small_energy.png", cta: "Buy now", productId: getProdId("spoowa-energy-drink-tropical") },
    { id: 3, title: "SPOOWA Honey Collection", subtitle: "Nature's perfect sweetness.", imageUrl: "/images/small_honey.png", cta: "Buy now", productId: getProdId("spoowa-honey-kesar-saffron") }
  ];
  return (
    <section className="max-w-[1920px] mx-auto px-4 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {banners.map((banner, idx) => (
          <motion.div key={banner.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: idx * 0.1 }} whileHover={{ y: -5 }} className="group relative bg-white rounded-3xl overflow-hidden flex flex-col items-center pt-10 px-6 pb-0 cursor-pointer h-[500px] border border-gray-100 shadow-sm">
            
            <Link to={banner.productId ? `/product/${banner.productId}` : "/products"} className="absolute inset-0 z-30" />

            {/* Full Background Image */}
            <motion.div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
              <motion.img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover object-bottom mix-blend-multiply" whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }} />
            </motion.div>

            {/* Text Overlay */}
            <div className="text-center z-10 mb-8 flex flex-col items-center relative pointer-events-none">
              <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-black mb-2 drop-shadow-md">{banner.title}</h2>
              <p className="text-sm text-gray-700 font-medium mb-6 max-w-[250px]">{banner.subtitle}</p>
              <span className="px-8 py-2.5 bg-black text-white font-bold uppercase tracking-wider rounded-full group-hover:bg-gray-800 transition-colors text-xs shadow-md inline-block">{banner.cta}</span>
            </div>
            
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function MixedGridSection({ leftCard, rightCards }) {
  return (
    <section className="max-w-[1920px] mx-auto px-4 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px] md:min-h-[700px]">
        {/* Left Card */}
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }} className="bg-[#fcfcfc] rounded-3xl overflow-hidden flex flex-col items-center pt-14 px-8 pb-0 relative group shadow-sm border border-gray-100 min-h-[500px]">
          
          <Link to="/products" className="absolute inset-0 z-30" />

          <div className="text-center z-10 flex flex-col items-center relative pointer-events-none mt-4">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tight text-black mb-4 drop-shadow-md">{leftCard.title}</h2>
            <span className="px-10 py-3 bg-black text-white font-bold uppercase tracking-widest rounded-full group-hover:bg-gray-800 transition-colors text-sm mb-8 shadow-xl inline-block">{leftCard.cta}</span>
          </div>

          <div className="absolute inset-0 w-full h-full z-0 flex items-end justify-center pointer-events-none pb-4">
            <motion.img src={leftCard.imageUrl} alt={leftCard.title} className="w-full h-[85%] md:h-[95%] object-contain object-bottom mix-blend-multiply scale-[1.15]" whileHover={{ scale: 1.2 }} transition={{ duration: 0.6 }} />
          </div>
        </motion.div>
        
        {/* Right Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rightCards.map((card, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: idx * 0.1 }} className="bg-white rounded-3xl p-6 flex flex-col items-center justify-between text-center cursor-pointer relative overflow-hidden group shadow-sm border border-gray-100 min-h-[320px]">
              
              <Link to={card.productId ? `/product/${card.productId}` : "/products"} className="absolute inset-0 z-30" />

              {/* Full absolute background */}
              <motion.div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                {card.imageUrl && (
                  <motion.img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover object-center mix-blend-multiply" whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }} />
                )}
              </motion.div>

              {/* Text Overlay box at the top */}
              <div className="relative z-10 flex flex-col items-center pointer-events-none bg-white/70 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] w-[90%]">
                <h3 className="text-xl font-black tracking-tight text-black mb-1 line-clamp-1">{card.title}</h3>
                <p className="text-[11px] text-gray-800 font-bold mb-0 line-clamp-1 uppercase tracking-wider">{card.subtitle}</p>
              </div>

              {/* Button at the bottom */}
              <div className="relative z-10 mt-auto pointer-events-none">
                 <span className="px-8 py-2.5 bg-black text-white font-bold uppercase tracking-wider rounded-full group-hover:bg-gray-800 transition-colors text-xs shadow-lg group-hover:-translate-y-1 transform inline-block">Buy now</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SideBySideSection({ card1, card2 }) {
  const CardContent = ({ card }) => (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className={`relative bg-white rounded-3xl overflow-hidden flex flex-col pt-12 px-8 pb-8 cursor-pointer min-h-[450px] border border-gray-100 shadow-sm group ${card.bgColor || ''}`}>
      
      <Link to="/products" className="absolute inset-0 z-30" />

      {/* Full absolute background */}
      <motion.div className="absolute inset-0 w-full h-full z-0 pointer-events-none" whileHover={{ scale: 1.03 }} transition={{ duration: 0.8, ease: "easeOut" }}>
        {card.imageUrl && (
           <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover object-bottom mix-blend-multiply" />
        )}
      </motion.div>

      <div className="z-10 flex flex-col items-center text-center relative pointer-events-none">
        <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-black mb-4 drop-shadow-sm">{card.title}</h2>
        {card.features && card.features.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {card.features.map((feature, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-white/80 backdrop-blur-sm text-gray-800 text-[11px] font-bold uppercase tracking-wider rounded-full border border-white shadow-sm">{feature}</span>
            ))}
          </div>
        )}
        <span className="px-8 py-3 bg-black text-white font-bold uppercase tracking-wider rounded-full group-hover:bg-gray-800 transition-colors text-xs shadow-xl group-hover:-translate-y-1 transform inline-block">{card.cta || "Explore"}</span>
      </div>
    </motion.div>
  );
  return (
    <section className="max-w-[1920px] mx-auto px-4 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardContent card={card1} />
        <CardContent card={card2} />
      </div>
    </section>
  );
}

// --- Main Page ---

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const regions = await getRegions();
        const regionId = regions?.regions?.[0]?.id;
        const data = await getProducts({ limit: 100, region_id: regionId, fields: "*variants,*variants.calculated_price" });
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Match product IDs by handle so links are correct
  const getProductCardData = (handle, fallback) => {
    const product = products.find(p => p.handle === handle);
    if (product) {
      return {
        ...fallback,
        productId: product.id,
      };
    }
    return fallback;
  };

  const newlyLaunchedLeft = { title: "Newly Launched", cta: "Explore All", imageUrl: "/images/mixed_showcase.png" };
  const newlyLaunchedRight = [
    getProductCardData("spoowa-energy-drink-tropical", { title: "Energy Drink", subtitle: "Clean Energy Formula", imageUrl: "/images/mixed_energy.png", bgColor: "bg-green-50" }),
    getProductCardData("spoowa-honey-matcha", { title: "Honey + Matcha", subtitle: "Wellness Infused", imageUrl: "/images/mixed_matcha.png", bgColor: "bg-purple-50" }),
    getProductCardData("spoowa-honey-cinnamon", { title: "Honey + Cinnamon", subtitle: "Warm Natural Energy", imageUrl: "/images/mixed_cinnamon.png", bgColor: "bg-pink-50" }),
    getProductCardData("spoowa-discovery-box", { title: "Discovery Box", subtitle: "Premium Subscription", imageUrl: "/images/mixed_discovery.png", bgColor: "bg-blue-50" })
  ];

  const athleteFavoritesLeft = { title: "Athlete Favorites", cta: "Explore All", imageUrl: "/images/athlete_showcase.png" };
  const athleteFavoritesRight = [
    getProductCardData("spoowa-electrolyte-berry", { title: "Electrolyte Mix", subtitle: "Fast Absorption", imageUrl: "/images/athlete_hydration.png" }),
    getProductCardData("spoowa-energy-drink-tropical", { title: "Tropical Energy", subtitle: "Zero Crash", imageUrl: "/images/athlete_energy.png" }),
    getProductCardData("spoowa-honey-kesar-saffron", { title: "Kesar Honey", subtitle: "Pure Golden Amber", imageUrl: "/images/athlete_honey.png" }),
    getProductCardData("spoowa-recovery-blend", { title: "Recovery Blend", subtitle: "Post Workout", imageUrl: "/images/athlete_recovery.png" })
  ];

  const hydrationCollection = { title: "Hydration Collection", features: ["Electrolytes", "Clean Label", "Fast Recovery"], imageUrl: "/images/collection_hydration.png" };
  const energyCollection = { title: "Energy Collection", features: ["Natural Caffeine", "Honey Powered", "Zero Crash"], imageUrl: "/images/collection_energy.png" };
  const honeyWellness = { title: "Honey Wellness Collection", features: ["Natural Nutrition", "Daily Wellness"], imageUrl: "/images/collection_honey.png" };
  const performanceNutrition = { title: "Performance Nutrition Collection", features: ["Scientific Nutrition", "Sports Performance"], imageUrl: "/images/collection_performance.png" };
  const buildBox = { title: "Build Your Own Box" };
  const subscriptions = { title: "Subscription Packs" };

  return (
    <div className="bg-white min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <HeroSection />
      <BrandNav />
      <SmallBannersSection products={products} />
      
      {!loading && (
        <>
          <MixedGridSection leftCard={newlyLaunchedLeft} rightCards={newlyLaunchedRight} />
          <MixedGridSection leftCard={athleteFavoritesLeft} rightCards={athleteFavoritesRight} />
        </>
      )}

      <SideBySideSection card1={hydrationCollection} card2={energyCollection} />
      <SideBySideSection card1={honeyWellness} card2={performanceNutrition} />
      
      <div className="h-24"></div>
      <Footer />
    </div>
  );
}
