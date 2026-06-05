import { useState, useEffect } from "react";
import {
  ChevronDown,
  Eye,
  EyeOff,
  Globe2,
  HeartHandshake,
  Leaf,
  LockKeyhole,
  Mail,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  UserRound,
  Phone,
  KeyRound,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Timer
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import honeyPanel from "@/assets/auth-honey-panel.png";
import logo from "@/assets/logo.png";
import toast from "react-hot-toast";
import { forgotPasswordRequest, forgotPasswordVerify, resetPassword } from "@/services/api";

const panelTransition = { duration: 0.5, ease: "easeInOut" };

const contentVariants = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 28 : -28, filter: "blur(4px)" }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: (direction) => ({ opacity: 0, x: direction > 0 ? -28 : 28, filter: "blur(4px)" }),
};

const fieldVariants = {
  hidden: { opacity: 0, y: 14 },
  show: (index = 0) => ({ opacity: 1, y: 0, transition: { delay: index * 0.045, duration: 0.34, ease: [0.16, 1, 0.3, 1] } }),
};

const honeycombBackground = { backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='104' height='90' viewBox='0 0 104 90' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23F4B000' stroke-opacity='.28' stroke-width='1.5'%3E%3Cpath d='M26 1 51 15.5v29L26 59 1 44.5v-29L26 1Z'/%3E%3Cpath d='M78 1 103 15.5v29L78 59 53 44.5v-29L78 1Z'/%3E%3Cpath d='M52 31 77 45.5v29L52 89 27 74.5v-29L52 31Z'/%3E%3C/g%3E%3C/svg%3E\")" };

const loginBenefits = [
  { icon: Leaf, title: "100% Natural", description: "Pure & Unfiltered Honey" },
  { icon: ShieldCheck, title: "Trusted Quality", description: "Lab Tested & Certified" },
  { icon: HeartHandshake, title: "Goodness You Can Trust", description: "For a healthier you, every day" },
];

const signupBenefits = [
  { icon: Sparkles, title: "Save Favorite Products", description: "Keep your wellness picks ready." },
  { icon: ShoppingBag, title: "Faster Checkout Experience", description: "Move from cart to delivery quickly." },
  { icon: Truck, title: "Track Orders in Real Time", description: "Follow every SPOOWA delivery." },
  { icon: PackageCheck, title: "Exclusive Rewards & Offers", description: "Unlock member-only honey drops." },
];

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06 0.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c0.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function PanelLogo() {
  return (
    <div className="inline-flex rounded-[22px] bg-transparent px-0 py-0 shadow-none backdrop-blur-0">
      <img src={logo} alt="SPOOWA Logo" className="h-10 w-auto max-w-[190px] object-contain" />
    </div>
  );
}

function MarketingFeature({ icon: Icon, title, description, index }) {
  return (
    <motion.div custom={index} variants={fieldVariants} className="flex items-center gap-4 rounded-[24px] border border-white/60 bg-white/65 p-4 shadow-[0_12px_36px_rgba(92,55,0,0.10)] backdrop-blur-2xl hover:bg-white/80 transition-all duration-300">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[18px] bg-gradient-to-br from-white to-[#FFF8E8] text-[#E79B00] shadow-[0_8px_24px_rgba(244,176,0,0.18)] border border-[#F4B000]/15"><Icon className="h-6 w-6" strokeWidth={2.2} /></span>
      <span>
        <span className="block text-[15px] font-extrabold leading-tight text-[#2B1D12]">{title}</span>
        <span className="mt-1 block text-sm leading-snug text-[#4B3A2A]/80">{description}</span>
      </span>
    </motion.div>
  );
}

function MarketingPanel({ mode }) {
  const isSignup = mode === "signup";
  const benefits = isSignup ? signupBenefits : loginBenefits;
  const direction = isSignup ? 1 : -1;

  return (
    <motion.section layout transition={panelTransition} className={`relative order-2 min-h-[520px] w-full min-w-0 overflow-hidden bg-gradient-to-br from-[#FFF8E8] via-[#FFFDF5] to-[#FFF3D0] p-7 text-[#2B1D12] sm:p-8 lg:min-h-0 lg:basis-[44%] lg:p-9 ${isSignup ? "lg:order-2" : "lg:order-1"}`}>
      <img src={honeyPanel} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(130deg,rgba(255,248,232,0.80),rgba(255,253,247,0.40)_50%,rgba(244,176,0,0.12))]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-16 top-28 h-64 w-56 opacity-55" style={honeycombBackground} />
      <div aria-hidden="true" className="pointer-events-none absolute -right-10 bottom-2 h-72 w-72 opacity-45" style={honeycombBackground} />

      <div className="relative z-10 flex h-full flex-col">
        <PanelLogo />
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={mode} custom={direction} variants={contentVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }} className="mt-12 max-w-[360px] sm:mt-16 lg:mt-20">
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-[#2B1D12] sm:text-[3.25rem] font-display">
              {mode === 'forgot' ? "Reset Password" : isSignup ? "Create Account" : "Welcome Back!"}
            </h1>
            <p className="mt-5 max-w-[360px] text-[17px] leading-8 text-[#2B1D12]/90">
              {mode === 'forgot' ? "Don't worry, it happens to the best of us. Let's get you back into your account." : isSignup ? "Join SPOOWA to save favorites, track orders, and checkout faster." : "Glad to see you again. Login to continue your wellness journey."}
            </p>
            {mode !== 'forgot' && (
              <motion.div initial="hidden" animate="show" className={`mt-8 grid gap-4 ${isSignup ? "sm:grid-cols-2 lg:grid-cols-1" : ""}`}>
                {benefits.map((benefit, index) => <MarketingFeature key={benefit.title} {...benefit} index={index} />)}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

function AuthTabs({ mode, setMode }) {
  if (mode === 'forgot') return null;
  const tabs = [{ label: "LOGIN", value: "login" }, { label: "SIGN UP", value: "signup" }];
  return (
    <div className="relative mt-4 grid w-full min-w-0 grid-cols-2 border-b border-[#E9E3D6]">
      {tabs.map((tab) => {
        const active = mode === tab.value;
        return (
          <button key={tab.value} type="button" aria-pressed={active} onClick={() => setMode(tab.value)} className={`relative h-12 text-sm font-extrabold cursor-pointer transition-colors duration-300 ${active ? "text-[#D88A00]" : "text-[#7A7482] hover:text-[#2B1D12]"}`}>
            {tab.label}
            {active && <motion.span layoutId="auth-active-tab" className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-gradient-to-r from-[#F4B000] to-[#FFC83D]" transition={panelTransition} />}
          </button>
        );
      })}
    </div>
  );
}

function InputField({ icon: Icon, type = "text", placeholder, autoComplete, isPassword, showValue, onToggle, value, onChange, index, error, prefix }) {
  return (
    <motion.div variants={fieldVariants} custom={index} className="relative group pb-6">
      <div className={`pointer-events-none absolute inset-y-0 top-0 h-14 left-0 flex items-center pl-4 transition-colors ${error ? 'text-red-500' : 'text-[#8C93A3] group-focus-within:text-[#F4B000]'}`}>
        <Icon className="h-5 w-5" />
      </div>
      {prefix && (
        <span className="absolute left-[46px] top-0 h-14 flex items-center text-[15px] font-bold text-[#4B3A2A] pointer-events-none select-none">{prefix}</span>
      )}
      <input
        type={isPassword ? (showValue ? "text" : "password") : type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        maxLength={prefix ? 10 : undefined}
        className={`h-14 w-full rounded-[18px] border-2 bg-[#FAFAFA] ${prefix ? 'pl-[90px]' : 'pl-[46px]'} pr-12 text-[15px] font-bold text-[#111827] shadow-sm outline-none transition-all placeholder:text-[#9DA3B0] placeholder:font-medium focus:bg-white ${error ? 'border-red-500 focus:border-red-500 focus:shadow-[0_4px_16px_rgba(239,68,68,0.12)]' : 'border-[#E9E3D6] hover:border-[#D6CFBF] focus:border-[#F4B000] focus:shadow-[0_4px_16px_rgba(244,176,0,0.12)]'}`}
      />
      {isPassword && (
        <button
          type="button"
          aria-label={showValue ? "Hide password" : "Show password"}
          onPointerDown={(e) => { e.preventDefault(); onToggle(); }}
          className="absolute right-5 top-3 grid h-8 w-8 place-items-center rounded-full text-[#777D8E] cursor-pointer transition hover:bg-[#FFF8E8] hover:text-[#2B1D12]"
        >
          {showValue ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      )}
      {error && <span className="absolute bottom-1 left-2 text-xs font-semibold text-red-500">{error}</span>}
    </motion.div>
  );
}

function GradientButton({ children, disabled, onClick, type = "submit" }) {
  return (
    <motion.button
      variants={fieldVariants}
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? {} : { y: -1 }}
      whileTap={disabled ? {} : { scale: 0.985 }}
      className={`h-[58px] w-full min-w-0 rounded-2xl bg-gradient-to-r from-[#EFA300] via-[#F4B000] to-[#FFC83D] px-5 text-[15px] font-extrabold text-white tracking-wide transition duration-300 ${disabled ? 'opacity-50 cursor-not-allowed shadow-none' : 'cursor-pointer shadow-[0_16px_40px_rgba(244,176,0,0.36)] hover:shadow-[0_20px_50px_rgba(244,176,0,0.44)] hover:-translate-y-0.5'}`}
    >
      {children}
    </motion.button>
  );
}

function Divider() {
  return (
    <motion.div variants={fieldVariants} className="flex items-center gap-4">
      <span className="h-px flex-1 bg-[#E9E3D6]" />
      <span className="text-sm font-medium text-[#707785]">or continue with</span>
      <span className="h-px flex-1 bg-[#E9E3D6]" />
    </motion.div>
  );
}

function GoogleButton() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        await loginWithGoogle(tokenResponse.credential || tokenResponse.access_token);
        navigate("/");
      } catch (err) { } 
      finally { setIsLoading(false); }
    },
    onError: () => {}
  });

  return (
    <motion.button variants={fieldVariants} type="button" onClick={() => googleLogin()} disabled={isLoading} whileHover={isLoading ? {} : { y: -1 }} whileTap={isLoading ? {} : { scale: 0.985 }} className={`flex h-16 w-full min-w-0 items-center justify-center gap-3 rounded-2xl border border-[#DDD8CF] bg-white px-4 text-base font-extrabold text-[#111827] transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer shadow-[0_16px_38px_rgba(43,29,18,0.04)] hover:border-[#CFC6B7] hover:bg-[#FFFDF7]'}`}>
      <GoogleIcon />{isLoading ? "Connecting..." : "Continue with Google"}
    </motion.button>
  );
}

function LoginForm({ setMode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Please enter a valid email address";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      const msg = error.message || "";
      if (msg.toLowerCase().includes("email") || msg.toLowerCase().includes("account") || msg.toLowerCase().includes("found") || msg.toLowerCase().includes("google")) {
        setErrors({ email: msg });
      } else if (msg.toLowerCase().includes("password") || msg.toLowerCase().includes("credentials")) {
        setErrors({ password: msg });
      } else {
        toast.error(msg || "Failed to login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form key="login" custom={-1} variants={contentVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }} onSubmit={handleSubmit} className="mt-8" noValidate>
      <motion.div initial="hidden" animate="show" className="grid gap-2">
        <InputField icon={Mail} type="email" placeholder="Enter your email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({...prev, email: ''})); }} index={0} error={errors.email} />
        <InputField icon={LockKeyhole} type="password" placeholder="Enter your password" autoComplete="current-password" isPassword showValue={showPassword} onToggle={() => setShowPassword((value) => !value)} value={password} onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({...prev, password: ''})); }} index={1} error={errors.password} />
        <motion.div variants={fieldVariants} custom={2} className="flex justify-end mb-2">
          <button type="button" onClick={() => setMode('forgot')} className="text-sm font-bold text-[#D88A00] cursor-pointer transition hover:text-[#2B1D12]">Forgot Password?</button>
        </motion.div>
        <GradientButton disabled={isSubmitting}>{isSubmitting ? "Logging in..." : "Login"}</GradientButton>
        <div className="mt-4"><Divider /></div>
        <div className="mt-4"><GoogleButton /></div>
        <motion.p variants={fieldVariants} custom={6} className="text-center text-sm font-medium text-[#6F7685] mt-6">
          Don't have an account? <button type="button" onClick={() => setMode("signup")} className="font-extrabold text-[#D88A00] cursor-pointer transition hover:text-[#2B1D12]">Sign Up</button>
        </motion.p>
      </motion.div>
    </motion.form>
  );
}

function SignupForm({ setMode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({});
  const [otpError, setOtpError] = useState("");
  const { requestSignup, verifySignup } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Full name is required";
    else if (name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Please enter a valid email address";
    if (!phone) e.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(phone)) e.phone = "Please enter a valid 10-digit mobile number";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Password must be at least 8 characters";
    else if (!/(?=.*[A-Z])/.test(password)) e.password = "Must include at least 1 uppercase letter";
    else if (!/(?=.*[a-z])/.test(password)) e.password = "Must include at least 1 lowercase letter";
    else if (!/(?=.*[0-9])/.test(password)) e.password = "Must include at least 1 number";
    else if (!/(?=.*[!@#$%^&*])/.test(password)) e.password = "Must include at least 1 special character (!@#$%^&*)";
    if (!confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await requestSignup(name, email, password, `+91${phone}`);
      setOtpStep(true);
    } catch (error) {
      const msg = error.message || "";
      if (msg.toLowerCase().includes("email")) setErrors(prev => ({ ...prev, email: msg }));
      else if (msg.toLowerCase().includes("phone")) setErrors(prev => ({ ...prev, phone: msg }));
      else toast.error(msg || "Failed to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      setOtpError("Please enter the 6-digit code sent to your phone");
      return;
    }
    setOtpError("");
    setIsSubmitting(true);
    try {
      await verifySignup(name, email, password, `+91${phone}`, code);
      toast.success("Account created successfully! Welcome to SPOOWA 🎉");
      navigate("/");
    } catch (error) {
      setOtpError(error.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = (field) => setErrors(prev => ({ ...prev, [field]: "" }));

  if (otpStep) {
    return (
      <motion.form key="verify-otp" custom={1} variants={contentVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }} onSubmit={handleVerifyOtp} className="mt-7">
        <motion.div initial="hidden" animate="show" className="grid gap-4">
          <p className="text-sm font-medium text-[#4B3A2A] mb-2 text-center">We've sent a 6-digit verification code to <span className="font-bold text-[#D88A00]">+91 {phone}</span></p>
          <InputField icon={KeyRound} placeholder="6-digit verification code" value={code} onChange={(e) => { setCode(e.target.value); setOtpError(""); }} index={0} error={otpError} />
          <GradientButton disabled={isSubmitting}>{isSubmitting ? "Verifying..." : "Verify & Create Account"}</GradientButton>
          <motion.p variants={fieldVariants} custom={2} className="text-center text-sm font-medium text-[#6F7685] mt-4">
            Didn't receive the code? <button type="button" onClick={handleRequestOtp} disabled={isSubmitting} className={`font-extrabold text-[#D88A00] transition hover:text-[#2B1D12] ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>Resend Code</button>
          </motion.p>
          <motion.p variants={fieldVariants} custom={3} className="text-center text-sm font-medium text-[#6F7685]">
            Wrong number? <button type="button" onClick={() => setOtpStep(false)} className="font-extrabold text-[#D88A00] cursor-pointer transition hover:text-[#2B1D12]">Go Back</button>
          </motion.p>
        </motion.div>
      </motion.form>
    );
  }

  return (
    <motion.form key="signup" custom={1} variants={contentVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }} onSubmit={handleRequestOtp} className="mt-4" noValidate>
      <motion.div initial="hidden" animate="show" className="grid gap-1">
        <InputField icon={UserRound} placeholder="Full Name" autoComplete="name" value={name} onChange={(e) => { setName(e.target.value); clearError("name"); }} index={0} error={errors.name} />
        <InputField icon={Mail} type="email" placeholder="Email Address" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); clearError("email"); }} index={1} error={errors.email} />
        <InputField icon={Phone} type="tel" placeholder="Enter 10-digit mobile number" prefix="+91" value={phone} onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 10); setPhone(v); clearError("phone"); }} index={2} error={errors.phone} />
        <InputField icon={LockKeyhole} type="password" placeholder="Password" autoComplete="new-password" isPassword showValue={showPassword} onToggle={() => setShowPassword(v => !v)} value={password} onChange={(e) => { setPassword(e.target.value); clearError("password"); }} index={3} error={errors.password} />
        <InputField icon={LockKeyhole} type="password" placeholder="Confirm Password" autoComplete="new-password" isPassword showValue={showConfirm} onToggle={() => setShowConfirm(v => !v)} value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); clearError("confirmPassword"); }} index={4} error={errors.confirmPassword} />
        <GradientButton disabled={isSubmitting}>{isSubmitting ? "Sending Code..." : "Continue"}</GradientButton>
        <div className="mt-3"><Divider /></div>
        <div className="mt-3"><GoogleButton /></div>
        <motion.p variants={fieldVariants} custom={7} className="text-center text-sm font-medium text-[#6F7685] mt-4">
          Already have an account? <button type="button" onClick={() => setMode("login")} className="font-extrabold text-[#D88A00] cursor-pointer transition hover:text-[#2B1D12]">Login</button>
        </motion.p>
      </motion.div>
    </motion.form>
  );
}

function ForgotPasswordForm({ setMode }) {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    let timer;
    if (step === 2 && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const reqOtp = async (e) => {
    if (e) e.preventDefault();
    if (!identifier) { setError("Email or Phone is required"); return; }
    setIsSubmitting(true);
    setError("");
    try {
      await forgotPasswordRequest(identifier);
      toast.success("OTP sent successfully. Please check your email or phone.");
      setStep(2);
      setTimeLeft(30);
    } catch (err) {
      setError(err.message || "Account not found");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (code.length !== 6 || !/^\d+$/.test(code)) { setError("Invalid OTP"); return; }
    setIsSubmitting(true);
    setError("");
    try {
      const res = await forgotPasswordVerify(identifier, code);
      toast.success("OTP verified successfully");
      setResetToken(res.resetToken);
      setStep(3);
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPass = async (e) => {
    e.preventDefault();
    if (!newPassword) { setError("Password is required"); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    if (!/(?=.*[a-z])/.test(newPassword) || !/(?=.*[A-Z])/.test(newPassword) || !/(?=.*[0-9])/.test(newPassword) || !/(?=.*[!@#$%^&*])/.test(newPassword) || newPassword.length < 8) {
      setError("Password does not meet requirements"); return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await resetPassword(resetToken, newPassword);
      toast.success("Your password has been reset. Please login with your new password.");
      setMode("login");
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div key="forgot" custom={1} variants={contentVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }} className="mt-8">
      <div className="mb-6">
        <h3 className="text-2xl font-black text-[#0F1117] mb-2">
          {step === 1 && "Account Recovery"}
          {step === 2 && "Enter OTP"}
          {step === 3 && "Create New Password"}
        </h3>
        <p className="text-sm font-medium text-[#697184]">
          {step === 1 && "Complete the steps below to securely reset your password."}
          {step === 2 && `We've sent a 6-digit code to ${identifier}`}
          {step === 3 && "Enter your new password below."}
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={reqOtp} className="grid gap-2">
          <InputField icon={UserRound} placeholder="Email Address or Phone Number" value={identifier} onChange={(e) => { setIdentifier(e.target.value); setError(""); }} error={error} />
          <GradientButton disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Send OTP"}</GradientButton>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifyOtp} className="grid gap-2">
          <InputField icon={KeyRound} placeholder="6-digit verification code" value={code} onChange={(e) => { setCode(e.target.value); setError(""); }} error={error} />
          <GradientButton disabled={isSubmitting}>{isSubmitting ? "Verifying..." : "Verify OTP"}</GradientButton>
          <div className="flex justify-between items-center mt-4">
            <button type="button" onClick={() => { setStep(1); setCode(""); }} className="text-sm font-bold text-[#7A7482] hover:text-[#2B1D12] cursor-pointer flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Change Email</button>
            <button type="button" onClick={reqOtp} disabled={timeLeft > 0 || isSubmitting} className={`text-sm font-bold flex items-center gap-1 ${timeLeft > 0 || isSubmitting ? 'text-[#A09CA6] cursor-not-allowed' : 'text-[#D88A00] hover:text-[#2B1D12] cursor-pointer'}`}>
              <Timer className="w-4 h-4" />{timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend OTP"}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={resetPass} className="grid gap-2">
          <InputField icon={LockKeyhole} type="password" placeholder="New Password" isPassword showValue={showPassword} onToggle={() => setShowPassword((v) => !v)} value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setError(""); }} />
          <InputField icon={LockKeyhole} type="password" placeholder="Confirm Password" isPassword showValue={showConfirm} onToggle={() => setShowConfirm((v) => !v)} value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }} error={error} />
          
          <div className="bg-[#FFF8E8] p-4 rounded-xl border border-[#F4B000]/20 mb-4 mt-2">
            <p className="text-xs font-bold text-[#4B3A2A] mb-2">Password must contain:</p>
            <ul className="space-y-1 text-xs font-medium">
              <li className={`flex items-center gap-2 ${newPassword.length >= 8 ? 'text-green-600' : 'text-[#7A7482]'}`}>{newPassword.length >= 8 ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} Minimum 8 characters</li>
              <li className={`flex items-center gap-2 ${/(?=.*[A-Z])/.test(newPassword) ? 'text-green-600' : 'text-[#7A7482]'}`}>{/(?=.*[A-Z])/.test(newPassword) ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} 1 uppercase letter</li>
              <li className={`flex items-center gap-2 ${/(?=.*[a-z])/.test(newPassword) ? 'text-green-600' : 'text-[#7A7482]'}`}>{/(?=.*[a-z])/.test(newPassword) ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} 1 lowercase letter</li>
              <li className={`flex items-center gap-2 ${/(?=.*[0-9])/.test(newPassword) ? 'text-green-600' : 'text-[#7A7482]'}`}>{/(?=.*[0-9])/.test(newPassword) ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} 1 number</li>
              <li className={`flex items-center gap-2 ${/(?=.*[!@#$%^&*])/.test(newPassword) ? 'text-green-600' : 'text-[#7A7482]'}`}>{/(?=.*[!@#$%^&*])/.test(newPassword) ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} 1 special character</li>
            </ul>
          </div>
          <GradientButton disabled={isSubmitting}>{isSubmitting ? "Resetting..." : "Reset Password"}</GradientButton>
        </form>
      )}

      <div className="mt-8 text-center">
        <p className="text-sm font-medium text-[#6F7685]">Remember your password? <button type="button" onClick={() => setMode("login")} className="font-extrabold text-[#D88A00] cursor-pointer transition hover:text-[#2B1D12]">Login</button></p>
      </div>
    </motion.div>
  );
}

function FormPanel({ mode, setMode }) {
  const isSignup = mode === "signup";
  const direction = mode === 'forgot' ? -1 : isSignup ? 1 : -1;

  return (
    <motion.section layout transition={panelTransition} className={`relative order-1 flex w-full min-w-0 items-center justify-center bg-white px-6 py-10 sm:px-8 lg:basis-[56%] lg:px-10 ${isSignup ? "lg:order-1" : "lg:order-2"}`}>

      <div className="w-full min-w-0 max-w-[520px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={`${mode}-heading`} custom={direction} variants={contentVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className={`text-center ${isSignup ? 'mt-6' : ''}`}>
            <h2 className={`font-black leading-tight tracking-normal text-[#0F1117] ${isSignup ? 'text-3xl' : 'text-4xl'}`}>
              {mode === 'forgot' ? "Account Recovery" : isSignup ? "Create Account" : "Login"}
            </h2>
            {!isSignup && (
              <p className="mt-3 text-base font-medium leading-7 text-[#697184]">
                {mode === 'forgot' ? "Forgot your password?" : "Access your SPOOWA account."}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        <AuthTabs mode={mode} setMode={setMode} />

        <AnimatePresence mode="wait" custom={direction}>
          {mode === 'forgot' ? (
            <ForgotPasswordForm key="forgot-form" setMode={setMode} />
          ) : isSignup ? (
            <SignupForm key="signup-form" setMode={setMode} />
          ) : (
            <LoginForm key="login-form" setMode={setMode} />
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

function Auth() {
  const [mode, setMode] = useState("login");
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#FFFDF7] font-body text-[#2B1D12]">
      {/* Background orbs — clipped by parent overflow-x-hidden, never affect vertical layout */}
      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-[#FFC83D]/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-40 bottom-40 h-[28rem] w-[28rem] rounded-full bg-[#F4B000]/15 blur-[120px]" />

      <Navbar />

      <main className="relative z-10 flex min-h-[calc(100vh-64px)] items-start justify-center px-4 py-6 sm:px-6 lg:items-center lg:px-8">
        {/* Subtle top/bottom gradient overlays */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(255,248,232,0.6),rgba(255,253,247,0))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,rgba(255,248,232,0.4),rgba(255,253,247,0))]" />

        {/* Auth card */}
        <motion.div
          layout
          transition={panelTransition}
          className="relative z-10 flex w-full min-w-0 max-w-[960px] flex-col overflow-hidden rounded-[28px] border border-white/90 bg-white shadow-[0_24px_64px_rgba(43,29,18,0.12),0_8px_32px_rgba(244,176,0,0.09)] lg:flex-row"
        >
          <MarketingPanel mode={mode} />
          <FormPanel mode={mode} setMode={setMode} />
        </motion.div>
      </main>
    </div>
  );
}

export default Auth;

