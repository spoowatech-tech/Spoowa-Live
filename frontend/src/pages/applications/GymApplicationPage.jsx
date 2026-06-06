import { useState } from "react";
import { motion } from "framer-motion";
import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { submitGymApplication, validateReferralCode } from "@/services/api";
import { Sparkles, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function GymApplicationPage() {
  const [form, setForm] = useState({
    facility_name: "", contact_person: "", email: "", mobile: "",
    address: "", bank_details: "", is_certified: false, referral_code: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referralValid, setReferralValid] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleReferralCheck = async () => {
    if (!form.referral_code.trim()) return;
    try {
      const result = await validateReferralCode(form.referral_code.trim());
      setReferralValid(result);
      toast.success(`Valid! Referred by ${result.referrer_name}`);
    } catch {
      setReferralValid(null);
      toast.error("Invalid referral code");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.facility_name || !form.email || !form.mobile) {
      toast.error("Facility name, email, and mobile are required.");
      return;
    }
    setSubmitting(true);
    try {
      await submitGymApplication(form);
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <AnnouncementBar />
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
            <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 uppercase mb-3">Application Submitted!</h2>
            <p className="text-sm text-gray-500 font-medium max-w-md mx-auto">
              Thank you for applying to become a SPOOWA Gym/Area Distributor. Our team will review your application and get back to you shortly.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#F4B000]/25 bg-[#FFFDF0] px-3.5 py-1 text-[10px] font-extrabold tracking-widest text-[#D4AF37] uppercase mb-4 shadow-sm">
                <Sparkles className="h-3 w-3" /> Gym Application
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase leading-tight">Become a SPOOWA Distributor</h1>
              <p className="text-sm text-gray-500 font-medium mt-3 max-w-md mx-auto">
                Partner your gym or facility with SPOOWA. Manage trainers in your network and earn from every sale.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-5">
              {[
                { name: "facility_name", label: "Facility / Gym Name", type: "text", required: true },
                { name: "contact_person", label: "Contact Person Name", type: "text" },
                { name: "email", label: "Email Address", type: "email", required: true },
                { name: "mobile", label: "Mobile Number", type: "tel", required: true },
                { name: "address", label: "Address", type: "text" },
                { name: "bank_details", label: "Bank Details (UPI / Account)", type: "text" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">
                    {field.label} {field.required && <span className="text-red-400">*</span>}
                  </label>
                  <input
                    name={field.name}
                    type={field.type}
                    value={form[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full h-12 rounded-xl border-2 border-gray-200 bg-[#FAFAFA] px-4 text-sm font-bold text-gray-900 outline-none transition-all focus:bg-white focus:border-[#F4B000] focus:shadow-sm"
                  />
                </div>
              ))}

              {/* Certified checkbox */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="is_certified" checked={form.is_certified} onChange={handleChange}
                  className="h-5 w-5 rounded border-gray-300 text-[#F4B000] focus:ring-[#F4B000]" />
                <span className="text-sm font-bold text-gray-700">This facility is certified</span>
              </label>

              {/* Referral Code */}
              <div>
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">
                  City Distributor Referral Code <span className="text-gray-300">(optional)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    name="referral_code"
                    value={form.referral_code}
                    onChange={handleChange}
                    placeholder="e.g. CD-A1B2C3D4"
                    className="flex-1 h-12 rounded-xl border-2 border-gray-200 bg-[#FAFAFA] px-4 text-sm font-bold text-gray-900 outline-none transition-all focus:bg-white focus:border-[#F4B000] focus:shadow-sm"
                  />
                  <button type="button" onClick={handleReferralCheck}
                    className="px-5 h-12 rounded-xl border-2 border-gray-200 bg-gray-50 text-xs font-black text-gray-600 uppercase tracking-wider hover:bg-gray-100 transition-colors">
                    Verify
                  </button>
                </div>
                {referralValid && (
                  <p className="text-[10px] font-bold text-emerald-600 mt-1">✓ Linked to: {referralValid.referrer_name}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 text-xs font-black tracking-widest uppercase bg-[#2B1D12] hover:bg-[#F4B000] hover:text-[#2B1D12] text-white rounded-full transition-colors shadow-sm disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
