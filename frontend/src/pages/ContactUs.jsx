import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar, AnnouncementBar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { submitContactMessage } from "@/services/api";
import { Send, MapPin, Phone, Mail, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitContactMessage(form);
      toast.success(res.message || "Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="bg-page min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#FFF8E8] to-[#FFFDF7] py-16 sm:py-20 border-b border-[#F4B000]/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F4B000]/15 border border-[#F4B000]/20 px-4 py-1.5 text-[11px] font-extrabold tracking-[0.15em] text-[#D88A00] uppercase mb-4">
                <Mail className="h-3.5 w-3.5" /> Get In Touch
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2B1D12] font-display leading-tight">
                Contact Us
              </h1>
              <p className="mt-3 text-base sm:text-lg text-gray-500 font-medium max-w-xl mx-auto">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-5">
              {/* Contact Info Cards */}
              <div className="lg:col-span-2 space-y-4">
                {[
                  { icon: MapPin, title: "Our Office", text: "207, DLF Tower, Galleria Mall, Delhi, 110091, DL, IN", color: "bg-blue-50 text-blue-600" },
                  { icon: Phone, title: "Phone", text: "011-40539409", color: "bg-emerald-50 text-emerald-600" },
                  { icon: Mail, title: "Email", text: "contact@spoowa.com", color: "bg-amber-50 text-amber-600" },
                  { icon: Clock, title: "Working Hours", text: "Mon - Fri: 9:00 AM - 6:00 PM IST", color: "bg-purple-50 text-purple-600" },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className={`h-11 w-11 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#2B1D12]">{item.title}</h3>
                      <p className="text-sm text-gray-500 font-medium mt-0.5">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="lg:col-span-3"
              >
                <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <h2 className="text-xl font-black text-[#2B1D12] font-display mb-1">Send Us a Message</h2>
                  <p className="text-sm text-gray-400 font-medium mb-6">Fill out the form below and we'll get back to you shortly.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Your Name *</label>
                        <input
                          type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-[#F4B000]/30 focus:border-[#F4B000] outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Email Address *</label>
                        <input
                          type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-[#F4B000]/30 focus:border-[#F4B000] outline-none transition-all"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Subject</label>
                      <input
                        type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-[#F4B000]/30 focus:border-[#F4B000] outline-none transition-all"
                        placeholder="What's this about?"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Message *</label>
                      <textarea
                        rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-[#F4B000]/30 focus:border-[#F4B000] outline-none transition-all resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>
                    <button
                      type="submit" disabled={submitting}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F4B000] to-[#E59700] px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(244,176,0,0.30)] hover:shadow-[0_12px_36px_rgba(244,176,0,0.42)] transition-all disabled:opacity-60"
                    >
                      {submitting ? "Sending…" : <><Send className="h-4 w-4" /> Send Message</>}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
