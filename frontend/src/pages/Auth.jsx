import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles } from "lucide-react";
import { AnnouncementBar, Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { getSocialAuthUrl } from "@/services/api";

// ─── SVG Brand Icons ────────────────────────────────────────
function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}



export default function Auth() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null); // "google" | "facebook" | null
  const [error, setError] = useState("");

  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect
  if (user) {
    navigate("/shop", { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register({ first_name: firstName, last_name: lastName, email, password });
      }
      navigate("/shop");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(provider);
    setError("");
    try {
      // Medusa's OAuth endpoint returns a JSON response containing the location to redirect to
      const response = await fetch(getSocialAuthUrl(provider));
      if (!response.ok) {
        throw new Error("Failed to initialize social login");
      }
      const data = await response.json();
      if (data.location) {
        window.location.href = data.location;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(err.message || "Failed to connect to authentication provider");
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-body">
      <AnnouncementBar />
      <Navbar />

      <main className="flex items-center justify-center px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-[#FFF8E8] to-amber-100 flex items-center justify-center mb-4 shadow-sm border border-[#F4B000]/15">
              <Sparkles className="h-8 w-8 text-[#F4B000]" />
            </div>
            <h1 className="text-3xl font-black text-[#2B1D12] font-display">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              {mode === "login"
                ? "Sign in to your SPOOWA account"
                : "Join SPOOWA for premium honey"}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-8">
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-extrabold transition-all ${
                  mode === m
                    ? "bg-white text-[#2B1D12] shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* ── Social Login Buttons ─────────────────────────── */}
          <div className="space-y-3 mb-6">
            {/* Google */}
            <button
              type="button"
              id="login-google"
              onClick={() => handleSocialLogin("google")}
              disabled={socialLoading !== null}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3.5 px-4 text-sm font-bold text-[#2B1D12] shadow-sm hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {socialLoading === "google" ? (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-[#4285F4] animate-spin" />
              ) : (
                <>
                  <GoogleIcon className="h-5 w-5" />
                  <span>Continue with Google</span>
                </>
              )}
            </button>


          </div>

          {/* ── Divider ──────────────────────────────────────── */}
          <div className="relative flex items-center mb-6">
            <div className="flex-1 border-t border-gray-200" />
            <span className="mx-4 text-xs font-bold text-gray-300 uppercase tracking-widest">or</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div
                  key="name-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                      <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3.5 text-sm font-semibold text-[#2B1D12] placeholder:text-gray-300 focus:border-[#F4B000] focus:outline-none focus:ring-2 focus:ring-[#F4B000]/15 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3.5 text-sm font-semibold text-[#2B1D12] placeholder:text-gray-300 focus:border-[#F4B000] focus:outline-none focus:ring-2 focus:ring-[#F4B000]/15 transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3.5 text-sm font-semibold text-[#2B1D12] placeholder:text-gray-300 focus:border-[#F4B000] focus:outline-none focus:ring-2 focus:ring-[#F4B000]/15 transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-12 py-3.5 text-sm font-semibold text-[#2B1D12] placeholder:text-gray-300 focus:border-[#F4B000] focus:outline-none focus:ring-2 focus:ring-[#F4B000]/15 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-semibold text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F4B000] to-[#E59700] py-4 text-sm font-extrabold text-white shadow-[0_8px_30px_rgba(244,176,0,0.35)] hover:shadow-[0_12px_40px_rgba(244,176,0,0.45)] hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Trust badges */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Secure
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
              <Lock className="h-3.5 w-3.5" /> Encrypted
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
