import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Building2, Dumbbell, UserCheck, ArrowRight, Sparkles, Shield } from "lucide-react";

const ROLES = [
  {
    key: "trainer",
    title: "Trainer / Retailer",
    description: "Join as a fitness trainer or retailer. Earn commissions on every sale through your referral code. You'll need your gym owner's referral code (or apply as a freelancer).",
    icon: UserCheck,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    link: "/apply/trainer",
    benefits: ["Earn 10% commission on each sale", "Get your own referral code", "Track your network & earnings"],
  },
  {
    key: "gym",
    title: "Gym / Area Distributor",
    description: "Partner your gym or fitness center with SPOOWA. Manage trainers in your network and earn commissions. Enter your City Distributor's referral code to link up.",
    icon: Dumbbell,
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    link: "/apply/gym",
    benefits: ["Earn 5% commission on network sales", "Manage trainers under your gym", "Get exclusive gym distributor perks"],
  },
  {
    key: "city",
    title: "City Distributor",
    description: "Become the regional powerhouse. Manage gyms and trainers in your city. This role is for established distributors — contact us to apply.",
    icon: Building2,
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    link: null, // Contact-only
    benefits: ["Earn 3% commission on city-wide sales", "Manage all gyms & trainers in your area", "Priority support & exclusive deals"],
  },
];

export default function ApplyForRolesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <AnnouncementBar />
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#F4B000]/25 bg-[#FFFDF0] px-3.5 py-1 text-[10px] font-extrabold tracking-widest text-[#D4AF37] uppercase mb-4 shadow-sm">
            <Sparkles className="h-3 w-3" /> Partner With Us
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 uppercase leading-tight">
            Apply for a Role
          </h1>
          <p className="text-base text-gray-500 font-medium mt-4 max-w-2xl mx-auto">
            Join the SPOOWA network as a Trainer, Gym Distributor, or City Distributor. 
            Earn commissions on every sale in your network.
          </p>
        </div>

        {/* Referral Flow Diagram */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-14 flex-wrap">
          {[
            { label: "City Distributor", color: "bg-blue-100 text-blue-700", code: "CD-xxxx" },
            { label: "Gym Distributor", color: "bg-purple-100 text-purple-700", code: "GD-xxxx" },
            { label: "Trainer", color: "bg-green-100 text-green-700", code: "TR-xxxx" },
            { label: "Customer", color: "bg-amber-100 text-amber-700", code: "Uses code" },
          ].map((item, i) => (
            <div key={item.label} className="flex items-center gap-2 sm:gap-4">
              <div className="text-center">
                <span className={`inline-block text-[10px] font-bold uppercase px-3 py-1.5 rounded-full ${item.color}`}>
                  {item.label}
                </span>
                <p className="text-[9px] text-gray-400 font-semibold mt-1">{item.code}</p>
              </div>
              {i < 3 && <ArrowRight className="h-4 w-4 text-gray-300 shrink-0" />}
            </div>
          ))}
        </div>

        {/* Role Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {ROLES.map((role, i) => (
            <motion.div
              key={role.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-3xl border ${role.borderColor} p-6 shadow-sm hover:shadow-md transition-all flex flex-col`}
            >
              {/* Icon */}
              <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${role.color} text-white grid place-items-center mb-5 shadow-lg`}>
                <role.icon className="h-7 w-7" />
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-black text-gray-900 mb-2">{role.title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-5 flex-1">{role.description}</p>

              {/* Benefits */}
              <div className="mb-6 space-y-2">
                {role.benefits.map((b, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-br ${role.color} mt-1.5 shrink-0`} />
                    <span className="text-xs text-gray-600 font-medium">{b}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              {role.link ? (
                <Link to={role.link}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-br ${role.color} text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all`}>
                  Apply Now <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link to="/contact"
                  className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-all">
                  <Shield className="h-4 w-4" /> Contact Us to Apply
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-14 text-center">
          <p className="text-sm text-gray-400 font-medium max-w-xl mx-auto">
            Already have an account? You can enter a referral code from your profile settings to link with a trainer, gym, or city distributor.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
