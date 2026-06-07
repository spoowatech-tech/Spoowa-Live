import { useState } from "react";
import { motion } from "framer-motion";
import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { submitTrainerApplication, validateReferralCode } from "@/services/api";
import { Sparkles, CheckCircle2, Dumbbell, Users } from "lucide-react";
import toast from "react-hot-toast";

export default function TrainerApplicationPage() {
  const [form, setForm] = useState({
    name: "", email: "", mobile: "", address: "",
    bank_details: "", certification_name: "", certificate_number: "",
    referral_code: "", trainer_type: "gym_trainer",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referralValid, setReferralValid] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "trainer_type" && e.target.value === "freelancer") {
      setForm(f => ({ ...f, trainer_type: e.target.value, referral_code: "" }));
      setReferralValid(null);
    }
  };

  const handleReferralCheck = async () => {
    if (!form.referral_code.trim()) return;
    try {
      const result = await validateReferralCode(form.referral_code.trim());
      if (result.referrer_role !== 'GYM_OR_AREA_DISTRIBUTOR') {
        toast.error("Please enter a Gym Distributor referral code (GD-xxxx)");
        setReferralValid(null);
        return;
      }
      setReferralValid(result);
      toast.success(`Valid! Linked to gym: ${result.referrer_name}`);
    } catch {
      setReferralValid(null);
      toast.error("Invalid referral code");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.mobile) {
      toast.error("Name, email, and mobile are required.");
      return;
    }
    if (form.trainer_type === "gym_trainer" && !form.referral_code) {
      toast.error("Please enter your gym's referral code, or select Freelancer.");
      return;
    }
    setSubmitting(true);
    try {
      await submitTrainerApplication(form);
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
              Thank you for applying. Our team will review your application and get back to you shortly.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#F4B000]/25 bg-[#FFFDF0] px-3.5 py-1 text-[10px] font-extrabold tracking-widest text-[#D4AF37] uppercase mb-4 shadow-sm">
                <Sparkles className="h-3 w-3" /> Trainer Application
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase leading-tight">Become a SPOOWA Trainer</h1>
              <p className="text-sm text-gray-500 font-medium mt-3 max-w-md mx-auto">
                Join our network. Earn commissions on every sale through your referral code.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-5">
              {/* Trainer Type Selection */}
              <div>
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-3">
                  Trainer Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => handleChange({ target: { name: "trainer_type", value: "gym_trainer" } })}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${form.trainer_type === "gym_trainer" ? "border-[#F4B000] bg-[#FFFDF0] shadow-sm" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}>
                    <Dumbbell className={`h-5 w-5 ${form.trainer_type === "gym_trainer" ? "text-[#D88A00]" : "text-gray-400"}`} />
                    <div className="text-left">
                      <p className={`text-sm font-bold ${form.trainer_type === "gym_trainer" ? "text-[#2B1D12]" : "text-gray-600"}`}>Gym Trainer</p>
                      <p className="text-[10px] text-gray-400 font-medium">Linked to a gym</p>
                    </div>
                  </button>
                  <button type="button" onClick={() => handleChange({ target: { name: "trainer_type", value: "freelancer" } })}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${form.trainer_type === "freelancer" ? "border-[#F4B000] bg-[#FFFDF0] shadow-sm" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}>
                    <Users className={`h-5 w-5 ${form.trainer_type === "freelancer" ? "text-[#D88A00]" : "text-gray-400"}`} />
                    <div className="text-left">
                      <p className={`text-sm font-bold ${form.trainer_type === "freelancer" ? "text-[#2B1D12]" : "text-gray-600"}`}>Freelancer</p>
                      <p className="text-[10px] text-gray-400 font-medium">No gym affiliation</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Gym Referral Code (required for gym_trainer) */}
              {form.trainer_type === "gym_trainer" && (
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">
                    Gym Owner Referral Code <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input name="referral_code" value={form.referral_code} onChange={handleChange} placeholder="e.g. GD-A1B2C3D4" required
                      className="flex-1 h-12 rounded-xl border-2 border-gray-200 bg-[#FAFAFA] px-4 text-sm font-bold text-gray-900 outline-none transition-all focus:bg-white focus:border-[#F4B000] focus:shadow-sm" />
                    <button type="button" onClick={handleReferralCheck}
                      className="px-5 h-12 rounded-xl border-2 border-[#F4B000] bg-[#FFFDF7] text-xs font-black text-[#D88A00] uppercase tracking-wider hover:bg-[#F4B000] hover:text-white transition-colors">
                      Verify
                    </button>
                  </div>
                  {referralValid && (
                    <p className="text-[10px] font-bold text-emerald-600 mt-1">✓ Linked to: {referralValid.referrer_name}</p>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1">Ask your gym owner for their referral code</p>
                </div>
              )}

              {/* Basic Details */}
              {[
                { name: "name", label: "Full Name", type: "text", required: true },
                { name: "email", label: "Email Address", type: "email", required: true },
                { name: "mobile", label: "Mobile Number", type: "tel", required: true },
                { name: "address", label: "Address", type: "text" },
                { name: "bank_details", label: "Bank Details (UPI / Account)", type: "text" },
                { name: "certification_name", label: "Certification Name", type: "text" },
                { name: "certificate_number", label: "Certificate Number", type: "text" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">
                    {field.label} {field.required && <span className="text-red-400">*</span>}
                  </label>
                  <input name={field.name} type={field.type} value={form[field.name]} onChange={handleChange} required={field.required}
                    className="w-full h-12 rounded-xl border-2 border-gray-200 bg-[#FAFAFA] px-4 text-sm font-bold text-gray-900 outline-none transition-all focus:bg-white focus:border-[#F4B000] focus:shadow-sm" />
                </div>
              ))}

              <button type="submit" disabled={submitting}
                className="w-full py-4 text-xs font-black tracking-widest uppercase bg-[#2B1D12] hover:bg-[#F4B000] hover:text-[#2B1D12] text-white rounded-full transition-colors shadow-sm disabled:opacity-50">
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
