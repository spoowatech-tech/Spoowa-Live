const fs = require('fs');

let code = fs.readFileSync('c:/SPOOWA/frontend/src/pages/Auth.jsx', 'utf8');

// 1. Imports
code = code.replace(/import \{ useState \} from "react";[\s\S]*?import logo from "@\/assets\/logo\.png";/, 
`import { useState, useEffect } from "react";
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
import { forgotPasswordRequest, forgotPasswordVerify, resetPassword } from "@/services/api";`);

// 2. AuthTabs
code = code.replace(/function AuthTabs\(\{\s*mode,\s*setMode\s*\}\) \{/, 
`function AuthTabs({ mode, setMode }) {
  if (mode === 'forgot') return null;`);

// 3. InputField
code = code.replace(/function InputField\(\{\s*icon: Icon,[\s\S]*?\}\) \{[\s\S]*?<\/motion\.div>\s*\);\s*\}/, 
`function InputField({
  icon: Icon,
  type = "text",
  placeholder,
  autoComplete,
  isPassword,
  showValue,
  onToggle,
  value,
  onChange,
  index,
  error
}) {
  return (
    <motion.div variants={fieldVariants} custom={index} className="relative group pb-6">
      <div className={\`pointer-events-none absolute inset-y-0 top-0 h-14 left-0 flex items-center pl-4 transition-colors \${error ? 'text-red-500' : 'text-[#8C93A3] group-focus-within:text-[#F4B000]'}\`}>
        <Icon className="h-5 w-5" />
      </div>
      <input
        type={isPassword ? (showValue ? "text" : "password") : type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        className={\`h-14 w-full rounded-[18px] border-2 bg-[#FAFAFA] pl-[46px] pr-12 text-[15px] font-bold text-[#111827] shadow-sm outline-none transition-all placeholder:text-[#9DA3B0] placeholder:font-medium focus:bg-white \${error ? 'border-red-500 focus:border-red-500 focus:shadow-[0_4px_16px_rgba(239,68,68,0.12)]' : 'border-[#E9E3D6] hover:border-[#D6CFBF] focus:border-[#F4B000] focus:shadow-[0_4px_16px_rgba(244,176,0,0.12)]'}\`}
      />
        {isPassword && (
          <button
            type="button"
            aria-label={showValue ? "Hide password" : "Show password"}
            onPointerDown={(e) => { e.preventDefault(); onToggle(); }}
            className="absolute right-5 top-3 grid h-8 w-8 place-items-center rounded-full text-[#777D8E] transition hover:bg-[#FFF8E8] hover:text-[#2B1D12]"
          >
            {showValue ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      {error && (
        <span className="absolute bottom-1 left-2 text-xs font-semibold text-red-500">{error}</span>
      )}
    </motion.div>
  );
}`);

// 4. GradientButton
code = code.replace(/function GradientButton\(\{\s*children,\s*disabled\s*\}\) \{[\s\S]*?<\/motion\.button>\s*\);\s*\}/,
`function GradientButton({ children, disabled, onClick, type = "submit" }) {
  return (
    <motion.button
      variants={fieldVariants}
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? {} : { y: -1 }}
      whileTap={disabled ? {} : { scale: 0.985 }}
      className={\`h-16 w-full min-w-0 rounded-2xl bg-gradient-to-r from-[#EFA300] via-[#F4B000] to-[#FFC83D] px-5 text-base font-extrabold text-white transition duration-300 \${disabled ? 'opacity-50 cursor-not-allowed shadow-none' : 'shadow-[0_22px_44px_rgba(244,176,0,0.32)] hover:shadow-[0_26px_52px_rgba(244,176,0,0.40)]'}\`}
    >
      {children}
    </motion.button>
  );
}`);

// 5. LoginForm
code = code.replace(/function LoginForm\(\{\s*setMode\s*\}\) \{[\s\S]*?<\/motion\.form>\s*\);\s*\}/, 
`function LoginForm({ setMode }) {
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
    else if (!/^\\S+@\\S+\\.\\S+$/.test(email)) newErrors.email = "Please enter a valid email address";
    
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
      if (error.message?.toLowerCase().includes("user") || error.message?.toLowerCase().includes("account")) {
        setErrors({ email: "No account found with this email" });
      } else if (error.message?.toLowerCase().includes("password") || error.message?.toLowerCase().includes("credentials")) {
        setErrors({ password: "Incorrect password" });
      } else {
        toast.error(error.message || "Failed to login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      key="login"
      custom={-1}
      variants={contentVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      onSubmit={handleSubmit}
      className="mt-8"
      noValidate
    >
      <motion.div initial="hidden" animate="show" className="grid gap-2">
        <InputField
          icon={Mail}
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({...prev, email: ''})); }}
          index={0}
          error={errors.email}
        />
        <InputField
          icon={LockKeyhole}
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          isPassword
          showValue={showPassword}
          onToggle={() => setShowPassword((value) => !value)}
          value={password}
          onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({...prev, password: ''})); }}
          index={1}
          error={errors.password}
        />

        <motion.div variants={fieldVariants} custom={2} className="flex justify-end mb-2">
          <button
            type="button"
            onClick={() => setMode('forgot')}
            className="text-sm font-bold text-[#D88A00] transition hover:text-[#2B1D12]"
          >
            Forgot Password?
          </button>
        </motion.div>

        <GradientButton disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </GradientButton>
        <div className="mt-4"><Divider /></div>
        <div className="mt-4"><GoogleButton /></div>

        <motion.p
          variants={fieldVariants}
          custom={6}
          className="text-center text-sm font-medium text-[#6F7685] mt-6"
        >
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => setMode("signup")}
            className="font-extrabold text-[#D88A00] transition hover:text-[#2B1D12]"
          >
            Sign Up
          </button>
        </motion.p>
      </motion.div>
    </motion.form>
  );
}`);

// 6. Inject ForgotPasswordForm before FormPanel
code = code.replace(/function FormPanel\(/, 
`function ForgotPasswordForm({ setMode }) {
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
    if (code.length !== 6 || !/^\\d+$/.test(code)) { setError("Invalid OTP"); return; }
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
    <motion.div
      key="forgot"
      custom={1}
      variants={contentVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="mt-8"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-black text-[#0F1117] mb-2">
          {step === 1 && "Account Recovery"}
          {step === 2 && "Enter OTP"}
          {step === 3 && "Create New Password"}
        </h3>
        <p className="text-sm font-medium text-[#697184]">
          {step === 1 && "Complete the steps below to securely reset your password."}
          {step === 2 && \`We've sent a 6-digit code to \${identifier}\`}
          {step === 3 && "Enter your new password below."}
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={reqOtp} className="grid gap-2">
          <InputField
            icon={UserRound}
            placeholder="Email Address or Phone Number"
            value={identifier}
            onChange={(e) => { setIdentifier(e.target.value); setError(""); }}
            error={error}
          />
          <GradientButton disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send OTP"}
          </GradientButton>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifyOtp} className="grid gap-2">
          <InputField
            icon={KeyRound}
            placeholder="6-digit verification code"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(""); }}
            error={error}
          />
          <GradientButton disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </GradientButton>
          
          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={() => { setStep(1); setCode(""); }}
              className="text-sm font-bold text-[#7A7482] hover:text-[#2B1D12] flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Change Email
            </button>
            <button
              type="button"
              onClick={reqOtp}
              disabled={timeLeft > 0 || isSubmitting}
              className={\`text-sm font-bold flex items-center gap-1 \${timeLeft > 0 ? 'text-[#A09CA6] cursor-not-allowed' : 'text-[#D88A00] hover:text-[#2B1D12]'}\`}
            >
              <Timer className="w-4 h-4" />
              {timeLeft > 0 ? \`Resend in \${timeLeft}s\` : "Resend OTP"}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={resetPass} className="grid gap-2">
          <InputField
            icon={LockKeyhole}
            type="password"
            placeholder="New Password"
            isPassword
            showValue={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            value={newPassword}
            onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
          />
          <InputField
            icon={LockKeyhole}
            type="password"
            placeholder="Confirm Password"
            isPassword
            showValue={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
            error={error}
          />
          
          <div className="bg-[#FFF8E8] p-4 rounded-xl border border-[#F4B000]/20 mb-4 mt-2">
            <p className="text-xs font-bold text-[#4B3A2A] mb-2">Password must contain:</p>
            <ul className="space-y-1 text-xs font-medium">
              <li className={\`flex items-center gap-2 \${newPassword.length >= 8 ? 'text-green-600' : 'text-[#7A7482]'}\`}>
                {newPassword.length >= 8 ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} Minimum 8 characters
              </li>
              <li className={\`flex items-center gap-2 \${/(?=.*[A-Z])/.test(newPassword) ? 'text-green-600' : 'text-[#7A7482]'}\`}>
                {/(?=.*[A-Z])/.test(newPassword) ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} 1 uppercase letter
              </li>
              <li className={\`flex items-center gap-2 \${/(?=.*[a-z])/.test(newPassword) ? 'text-green-600' : 'text-[#7A7482]'}\`}>
                {/(?=.*[a-z])/.test(newPassword) ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} 1 lowercase letter
              </li>
              <li className={\`flex items-center gap-2 \${/(?=.*[0-9])/.test(newPassword) ? 'text-green-600' : 'text-[#7A7482]'}\`}>
                {/(?=.*[0-9])/.test(newPassword) ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} 1 number
              </li>
              <li className={\`flex items-center gap-2 \${/(?=.*[!@#$%^&*])/.test(newPassword) ? 'text-green-600' : 'text-[#7A7482]'}\`}>
                {/(?=.*[!@#$%^&*])/.test(newPassword) ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} 1 special character
              </li>
            </ul>
          </div>

          <GradientButton disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </GradientButton>
        </form>
      )}

      <div className="mt-8 text-center">
        <p className="text-sm font-medium text-[#6F7685]">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => setMode("login")}
            className="font-extrabold text-[#D88A00] transition hover:text-[#2B1D12]"
          >
            Login
          </button>
        </p>
      </div>
    </motion.div>
  );
}

function FormPanel(`);

// 7. Update FormPanel rendering
code = code.replace(/<AnimatePresence mode="wait" custom=\{direction\}>[\s\S]*?<\/AnimatePresence>/,
`<AnimatePresence mode="wait" custom={direction}>
          {mode === 'forgot' ? (
            <ForgotPasswordForm key="forgot-form" setMode={setMode} />
          ) : isSignup ? (
            <SignupForm key="signup-form" setMode={setMode} />
          ) : (
            <LoginForm key="login-form" setMode={setMode} />
          )}
        </AnimatePresence>`);
        
// 8. Update Language Button
code = code.replace(/<Globe2 className="h-4 w-4" \/>\s*English\s*<ChevronDown className="h-4 w-4 text-\[\#7B8191\]" \/>/,
`<Globe2 className="h-4 w-4" />
          English`);

fs.writeFileSync('c:/SPOOWA/frontend/src/pages/Auth.jsx', code);
console.log('Successfully patched Auth.jsx');
