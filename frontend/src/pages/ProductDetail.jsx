import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight, Star, Heart, Minus, Plus, ShoppingCart, Play, Search,
  MapPin, Check, Truck, RotateCcw, ShieldCheck, Tag, Droplets, Ban, Leaf, Zap, Shield, Sparkles, ChevronLeft, FlaskConical
} from "lucide-react";
import { Navbar, AnnouncementBar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import productHoney from "@/assets/product_honey.png";

export default function ProductDetail() {
  const [size, setSize] = useState("500g");
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");

  // Placeholder thumbnails
  const thumbnails = [1, 2, 3, 4, 5];

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-body text-[#2B1D12]">
      <AnnouncementBar />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 pb-20 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link to="/shop" className="hover:text-gray-900 transition-colors">Shop</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="hover:text-gray-900 transition-colors">Raw Honey</span>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-[#F4B000]">Raw Forest Honey</span>
        </nav>

        {/* Top Product Section */}
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          
          {/* Left Column: Image Gallery (Col 5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative aspect-[4/4.5] w-full rounded-[32px] bg-[#FFF8E8] flex items-center justify-center p-8 overflow-hidden group border border-[#F4B000]/10 shadow-sm">
              <span className="absolute top-6 left-6 bg-[#F4B000] text-white text-[11px] font-bold px-3 py-1.5 rounded-full z-10 shadow-sm tracking-wide">
                -29%
              </span>
              <button className="absolute top-6 right-6 bg-white shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-sm text-gray-600 hover:text-gray-900 z-10 transition-colors">
                <Search className="h-4 w-4" />
              </button>
              
              <img 
                src={productHoney} 
                alt="Raw Forest Honey" 
                className="max-h-full max-w-full object-contain drop-shadow-[0_20px_40px_rgba(244,176,0,0.15)] transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            
            {/* Thumbnail Row */}
            <div className="relative flex items-center gap-3 mt-2">
              <button className="h-8 w-8 shrink-0 rounded-full border border-gray-200 bg-white grid place-items-center text-gray-500 hover:text-gray-900 shadow-sm">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex-1 flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {thumbnails.map((t, idx) => (
                  <div key={t} className={`relative flex-shrink-0 aspect-square w-[22%] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${idx === 0 ? 'border-[#F4B000] shadow-sm' : 'border-transparent hover:border-[#F4B000]/40'}`}>
                    <div className="w-full h-full bg-[#FFF8E8] flex items-center justify-center p-2">
                       <img src={productHoney} alt="" className="object-contain h-full drop-shadow-sm" />
                    </div>
                    {idx === 3 && (
                      <div className="absolute inset-0 bg-black/15 flex items-center justify-center backdrop-blur-[1px]">
                        <div className="h-8 w-8 rounded-full bg-white grid place-items-center shadow-md">
                           <Play className="h-3 w-3 text-[#F4B000] ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button className="h-8 w-8 shrink-0 rounded-full border border-gray-200 bg-white grid place-items-center text-gray-500 hover:text-gray-900 shadow-sm">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Center Column: Product Details (Col 4) */}
          <div className="lg:col-span-4 flex flex-col pt-2">
            <span className="bg-[#FFF8E8] text-[#D88A00] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full w-fit mb-4 border border-[#F4B000]/20 shadow-sm">
              Bestseller
            </span>
            <h1 className="text-4xl md:text-[42px] font-black leading-tight text-[#2B1D12] font-display">
              Raw Forest Honey
            </h1>
            
            <div className="flex items-center gap-3 mt-4 text-sm border-b border-gray-100 pb-5">
              <div className="flex items-center gap-0.5 text-[#F4B000]">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current opacity-60" />
              </div>
              <span className="font-bold">4.9 <span className="text-gray-500 font-medium">(2,156 Reviews)</span></span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500 font-medium tracking-wide">12K+ Sold</span>
            </div>

            <p className="mt-5 text-[15px] leading-relaxed text-gray-600 font-medium">
              Unprocessed, unfiltered, and 100% pure honey sourced from wild forest beekeepers. Rich in nutrients, enzymes, and antioxidants.
            </p>

            <div className="mt-6 flex items-end gap-4">
              <span className="text-4xl md:text-5xl font-black text-[#2B1D12]">₹499</span>
              <span className="text-xl text-gray-400 line-through font-medium border-b border-transparent pb-1">₹699</span>
              <span className="bg-[#FFF8E8] text-[#D88A00] text-xs font-bold px-3 py-1.5 rounded-full mb-1 border border-[#F4B000]/20">
                Save ₹200 (29%)
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2 tracking-wide">Inclusive of all taxes</p>

            <div className="flex items-center gap-5 py-6 border-b border-gray-100 flex-wrap mt-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                 <Droplets className="h-4 w-4 text-[#F4B000]" /> 100% Pure
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                 <ShieldCheck className="h-4 w-4 text-[#F4B000]" /> Lab Tested
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                 <Ban className="h-4 w-4 text-[#F4B000]" /> No Added Sugar
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                 <Leaf className="h-4 w-4 text-[#F4B000]" /> Natural
              </div>
            </div>

            <div className="mt-6 border-b border-gray-100 pb-7">
              <p className="text-sm font-bold text-[#2B1D12] mb-3">Choose Size</p>
              <div className="flex items-center gap-3">
                {["250g", "500g", "1kg"].map(s => (
                  <button 
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-6 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                      size === s 
                        ? "border-[#F4B000] bg-[#FFF8E8] text-[#D88A00] shadow-[0_4px_12px_rgba(244,176,0,0.15)]" 
                        : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <p className="text-sm font-bold text-[#2B1D12] mb-3 mt-8">Quantity</p>
              <div className="inline-flex items-center rounded-xl border-2 border-gray-200 bg-white min-w-[140px] shadow-sm">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-12 flex-1 items-center justify-center text-gray-500 transition-colors hover:text-[#F4B000]">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-12 w-12 items-center justify-center text-base font-bold text-gray-900 tabular-nums border-x-2 border-gray-100">
                  {qty}
                </span>
                <button onClick={() => setQty(qty + 1)} className="flex h-12 flex-1 items-center justify-center text-gray-500 transition-colors hover:text-[#F4B000]">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

             <div className="mt-7 flex flex-col gap-4">
              <div className="flex gap-4">
                <button className="flex-1 bg-gradient-to-r from-[#F4B000] to-[#E59700] hover:from-[#E59700] hover:to-[#D48500] text-white rounded-xl h-14 flex items-center justify-center gap-2 font-bold text-[15px] tracking-wide transition-all shadow-[0_8px_20px_rgba(244,176,0,0.25)]">
                  <ShoppingCart className="h-5 w-5" /> Add to Cart
                </button>
                <button className="shrink-0 h-14 w-14 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#F4B000] hover:bg-[#FFF8E8] hover:text-[#F4B000] transition-all bg-white shadow-sm">
                  <Heart className="h-6 w-6" />
                </button>
              </div>
              <button className="w-full h-14 rounded-xl border-2 border-[#F4B000] text-[#D88A00] hover:bg-[#F4B000] hover:text-white flex items-center justify-center gap-2 font-bold text-[15px] tracking-wide transition-all shadow-sm">
                 <Zap className="h-5 w-5" fill="currentColor" /> Buy Now
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 items-center justify-between px-4 bg-[#FAFAFA] py-4 rounded-xl border border-gray-100">
               <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-gray-600">
                  <Truck className="h-4 w-4 text-[#F4B000]" /> Free Shipping
               </div>
               <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-gray-600">
                  <RotateCcw className="h-4 w-4 text-[#F4B000]" /> Easy Returns
               </div>
               <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-gray-600">
                  <ShieldCheck className="h-4 w-4 text-[#F4B000]" /> Secure Payments
               </div>
            </div>
          </div>

          {/* Right Column: Sidebar (Col 3) */}
          <div className="lg:col-span-3 flex flex-col gap-5 pt-2">
            {/* Delivery Card */}
            <div className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm">
               <h3 className="flex items-center gap-2 text-base font-bold text-[#2B1D12]">
                 <MapPin className="h-5 w-5 text-[#F4B000]" /> Deliver To
               </h3>
               <p className="mt-1.5 text-xs text-gray-500 font-medium pl-7">Get it by <span className="text-green-600 font-bold">Thu, Jun 11</span></p>
               
               <div className="mt-5 flex gap-2">
                 <input type="text" placeholder="PIN Code" defaultValue={"250002"} className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium focus:border-[#F4B000] focus:ring-1 focus:ring-[#F4B000]/20 outline-none" />
                 <button className="text-sm font-bold text-[#D88A00] pr-2 hover:text-[#B87A00] transition-colors">Change</button>
               </div>

               <div className="mt-6 space-y-4 pl-1">
                 {["Free Shipping on orders above ₹999", "Cash on Delivery Available", "Easy 7 Days Returns", "100% Secure Payments"].map((text, i) => (
                   <div key={i} className="flex items-center gap-3 text-[13px] font-medium text-gray-600">
                     {i === 0 && <Truck className="h-4 w-4 text-gray-400" />}
                     {i === 1 && <span className="h-4 w-4 flex items-center justify-center font-bold pb-0.5 border border-gray-300 rounded text-gray-400 text-[10px]">₹</span>}
                     {i === 2 && <RotateCcw className="h-4 w-4 text-gray-400" />}
                     {i === 3 && <ShieldCheck className="h-4 w-4 text-gray-400" />}
                     <span className={i === 1 ? 'ml-0.5' : ''}>{text}</span>
                   </div>
                 ))}
               </div>
            </div>

            {/* Coupon Card */}
            <div className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm">
               <h3 className="flex items-center gap-2 text-base font-bold text-[#2B1D12]">
                 <Tag className="h-5 w-5 text-[#F4B000]" /> Apply Coupon
               </h3>
               <div className="mt-5 flex gap-2">
                 <input type="text" placeholder="Enter Code" defaultValue={"SPOOWA10"} className="flex-1 rounded-xl border border-[#F4B000]/30 bg-[#FFF8E8] px-4 py-3 text-sm font-bold focus:border-[#F4B000] focus:ring-2 focus:ring-[#F4B000]/20 outline-none text-[#2B1D12]" />
                 <button className="bg-[#F4B000] hover:bg-[#D88A00] text-white px-5 rounded-xl text-sm font-bold transition-colors shadow-sm">Apply</button>
               </div>
               <div className="mt-4 flex items-center justify-between bg-green-50/80 px-4 py-3 rounded-xl border border-green-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-green-700">
                     <Check className="h-4 w-4" /> Coupon Applied: SPOOWA10
                  </div>
                  <button className="text-xs font-bold text-green-700 hover:text-green-900 transition-colors">Remove</button>
               </div>
            </div>

             {/* Why Choose Card */}
             <div className="rounded-[20px] border border-gray-100 bg-[#FAFAFA] p-6 shadow-sm">
               <h3 className="text-base font-bold text-[#2B1D12]">Why Choose SPOOWA Honey?</h3>
               <div className="mt-5 space-y-4">
                 {[
                   "Directly sourced from trusted beekeepers", 
                   "Raw, unfiltered and unprocessed", 
                   "Rich in natural enzymes & antioxidants", 
                   "Supports immunity and overall wellness"
                 ].map(text => (
                   <div key={text} className="flex items-start gap-3">
                     <div className="mt-0.5 shrink-0 h-4 w-4 rounded-full bg-[#FFF8E8] border border-[#F4B000]/30 flex items-center justify-center">
                       <Check className="h-2.5 w-2.5 text-[#F4B000]" strokeWidth={3} />
                     </div>
                     <span className="text-[13px] font-medium text-gray-600 leading-snug">{text}</span>
                   </div>
                 ))}
               </div>
            </div>

            {/* Promise Row */}
            <div className="rounded-[20px] border border-[#F4B000]/20 bg-[#FFFDF5] p-6 shadow-[0_4px_20px_rgba(244,176,0,0.05)]">
              <h3 className="flex items-center gap-2 text-base font-bold text-[#2B1D12] mb-6">
                 <Sparkles className="h-5 w-5 text-[#F4B000]" /> SPOOWA Promise
              </h3>
              <div className="grid grid-cols-4 gap-2">
                 {[
                   { icon: Droplets, text: "100% Pure & Natural" },
                   { icon: Leaf, text: "Ethically Sourced" },
                   { icon: FlaskConical, text: "Lab Tested" },
                   { icon: Shield, text: "Premium Quality" },
                 ].map((p, i) => (
                   <div key={i} className="flex flex-col items-center gap-2.5 text-center px-1">
                     <div className="h-10 w-10 rounded-full bg-white border border-[#F4B000]/20 flex items-center justify-center shadow-sm">
                        <p.icon className="h-4 w-4 text-[#D88A00]" />
                     </div>
                     <span className="text-[9px] font-extrabold text-[#2B1D12] uppercase leading-[1.3] text-center w-full">{p.text}</span>
                   </div>
                 ))}
              </div>
            </div>

          </div>
        </div>

        {/* Lower Section: Tabs and Details */}
        <div className="mt-24 pt-2">
           <div className="flex gap-10 overflow-x-auto no-scrollbar border-b border-gray-200">
             {["Description", "Ingredients", "Nutritional Info", "Reviews (2,156)", "FAQs"].map(tab => (
               <button 
                 key={tab} 
                 onClick={() => setActiveTab(tab)}
                 className={`pb-5 text-[15px] font-bold tracking-wide whitespace-nowrap border-b-[3px] transition-all ${
                   activeTab === tab 
                     ? "border-[#F4B000] text-[#D88A00]" 
                     : "border-transparent text-gray-500 hover:text-gray-900"
                 }`}
               >
                 {tab}
               </button>
             ))}
           </div>

           <div className="py-14 lg:pr-[25%] animate-fade-up">
             <h2 className="text-3xl md:text-4xl font-black text-[#2B1D12] font-display">Pure. Raw. From the Forest.</h2>
             <p className="mt-6 text-[17px] text-gray-600 leading-relaxed font-medium">
               Our Raw Forest Honey is collected from wild forests where bees naturally forage on a variety of flowers and herbs. It is minimally processed to retain all the natural goodness, enzymes, pollens, and antioxidants. It represents pure vitality in a jar, serving as a clean energy source for modern, active lifestyles while supporting local beekeeping communities.
             </p>

             <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { title: "Boosts Immunity", desc: "Rich in antioxidants and natural compounds.", icon: ShieldCheck },
                  { title: "Natural Energy", desc: "Provides instant and sustained energy.", icon: Zap },
                  { title: "Supports Digestion", desc: "Aids digestion and improves gut health.", icon: Leaf },
                  { title: "Healthy Skin", desc: "Nourishes skin and promotes glow.", icon: Sparkles },
                ].map((b, i) => (
                  <div key={i} className="flex flex-col gap-3 group">
                    <div className="h-14 w-14 rounded-2xl bg-[#FFF8E8] flex items-center justify-center border border-[#F4B000]/10 transition-transform group-hover:-translate-y-1">
                       <b.icon className="h-6 w-6 text-[#F4B000]" />
                    </div>
                    <h4 className="text-[15px] font-bold text-[#2B1D12] mt-2">{b.title}</h4>
                    <p className="text-[13px] text-gray-500 leading-relaxed font-medium">{b.desc}</p>
                  </div>
                ))}
             </div>
           </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
