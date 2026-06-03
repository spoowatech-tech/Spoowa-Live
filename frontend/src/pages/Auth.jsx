import { useState } from "react";
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
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import honeyPanel from "@/assets/auth-honey-panel.png";
import logo from "@/assets/logo.png";

const panelTransition = {
  duration: 0.5,
  ease: "easeInOut",
};

const contentVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 28 : -28,
    filter: "blur(4px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -28 : 28,
    filter: "blur(4px)",
  }),
};

const fieldVariants = {
  hidden: { opacity: 0, y: 14 },
  show: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.045,
      duration: 0.34,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const honeycombBackground = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg width='104' height='90' viewBox='0 0 104 90' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23F4B000' stroke-opacity='.28' stroke-width='1.5'%3E%3Cpath d='M26 1 51 15.5v29L26 59 1 44.5v-29L26 1Z'/%3E%3Cpath d='M78 1 103 15.5v29L78 59 53 44.5v-29L78 1Z'/%3E%3Cpath d='M52 31 77 45.5v29L52 89 27 74.5v-29L52 31Z'/%3E%3C/g%3E%3C/svg%3E\")",
};

const loginBenefits = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "Pure & Unfiltered Honey",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Quality",
    description: "Lab Tested & Certified",
  },
  {
    icon: HeartHandshake,
    title: "Goodness You Can Trust",
    description: "For a healthier you, every day",
  },
];

const signupBenefits = [
  {
    icon: Sparkles,
    title: "Save Favorite Products",
    description: "Keep your wellness picks ready.",
  },
  {
    icon: ShoppingBag,
    title: "Faster Checkout Experience",
    description: "Move from cart to delivery quickly.",
  },
  {
    icon: Truck,
    title: "Track Orders in Real Time",
    description: "Follow every SPOOWA delivery.",
  },
  {
    icon: PackageCheck,
    title: "Exclusive Rewards & Offers",
    description: "Unlock member-only honey drops.",
  },
];

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06 0.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c0.87-2.6 3.3-4.53 6.16-4.53z"
      />
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
    <motion.div
      custom={index}
      variants={fieldVariants}
      className="flex items-center gap-4 rounded-[24px] border border-white/70 bg-white/60 p-3.5 shadow-[0_16px_45px_rgba(92,55,0,0.08)] backdrop-blur-xl"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[18px] bg-white text-[#E79B00] shadow-[0_12px_30px_rgba(244,176,0,0.15)]">
        <Icon className="h-6 w-6" strokeWidth={2.2} />
      </span>
      <span>
        <span className="block text-[15px] font-extrabold leading-tight text-[#2B1D12]">
          {title}
        </span>
        <span className="mt-1 block text-sm leading-snug text-[#4B3A2A]">
          {description}
        </span>
      </span>
    </motion.div>
  );
}

function MarketingPanel({ mode }) {
  const isSignup = mode === "signup";
  const benefits = isSignup ? signupBenefits : loginBenefits;
  const direction = isSignup ? 1 : -1;

  return (
    <motion.section
      layout
      transition={panelTransition}
      className={`relative order-2 min-h-[620px] w-full min-w-0 overflow-hidden bg-[#FFF8E8] p-7 text-[#2B1D12] sm:p-10 lg:min-h-0 lg:basis-[45%] lg:p-12 ${
        isSignup ? "lg:order-2" : "lg:order-1"
      }`}
    >
      <img
        src={honeyPanel}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-80"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(130deg,rgba(255,248,232,0.80),rgba(255,253,247,0.40)_50%,rgba(244,176,0,0.12))]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 top-28 h-64 w-56 opacity-55"
        style={honeycombBackground}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 bottom-2 h-72 w-72 opacity-45"
        style={honeycombBackground}
      />

      <div className="relative z-10 flex h-full min-h-[540px] flex-col">
        <PanelLogo />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={mode}
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 max-w-[390px] sm:mt-20 lg:mt-[118px]"
          >
            <h1 className="text-4xl font-black leading-[1.05] tracking-normal text-[#2B1D12] sm:text-5xl">
              {isSignup ? "Create Account" : "Welcome Back!"}
            </h1>
            <p className="mt-5 max-w-[360px] text-[17px] leading-8 text-[#2B1D12]/90">
              {isSignup
                ? "Join SPOOWA to save favorites, track orders, and checkout faster."
                : "Glad to see you again. Login to continue your wellness journey."}
            </p>

            <motion.div
              initial="hidden"
              animate="show"
              className={`mt-8 grid gap-4 ${isSignup ? "sm:grid-cols-2 lg:grid-cols-1" : ""}`}
            >
              {benefits.map((benefit, index) => (
                <MarketingFeature key={benefit.title} {...benefit} index={index} />
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

function AuthTabs({ mode, setMode }) {
  const tabs = [
    { label: "LOGIN", value: "login" },
    { label: "SIGN UP", value: "signup" },
  ];

  return (
    <div className="relative mt-10 grid w-full min-w-0 grid-cols-2 border-b border-[#E9E3D6]">
      {tabs.map((tab) => {
        const active = mode === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            aria-pressed={active}
            onClick={() => setMode(tab.value)}
            className={`relative h-12 text-sm font-extrabold transition-colors duration-300 ${
              active ? "text-[#D88A00]" : "text-[#7A7482] hover:text-[#2B1D12]"
            }`}
          >
            {tab.label}
            {active && (
              <motion.span
                layoutId="auth-active-tab"
                className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-gradient-to-r from-[#F4B000] to-[#FFC83D]"
                transition={panelTransition}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function InputField({
  icon: Icon,
  type = "text",
  placeholder,
  autoComplete,
  isPassword = false,
  showValue = false,
  onToggle,
  index,
}) {
  return (
    <motion.label custom={index} variants={fieldVariants} className="block">
      <span className="sr-only">{placeholder}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#858B9B]" />
        <input
          type={isPassword && showValue ? "text" : type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-16 w-full min-w-0 rounded-2xl border border-[#DDD8CF] bg-white/80 px-14 text-[15px] font-medium text-[#2B1D12] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_12px_35px_rgba(43,29,18,0.04)] outline-none transition-all duration-300 placeholder:text-[#8B90A0] focus:border-[#F4B000] focus:bg-white focus:ring-4 focus:ring-[#F4B000]/20"
        />
        {isPassword && (
          <button
            type="button"
            aria-label={showValue ? "Hide password" : "Show password"}
            onClick={onToggle}
            className="absolute right-5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-[#777D8E] transition hover:bg-[#FFF8E8] hover:text-[#2B1D12]"
          >
            {showValue ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </span>
    </motion.label>
  );
}

function GradientButton({ children }) {
  return (
    <motion.button
      variants={fieldVariants}
      type="submit"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
      className="h-16 w-full min-w-0 rounded-2xl bg-gradient-to-r from-[#EFA300] via-[#F4B000] to-[#FFC83D] px-5 text-base font-extrabold text-white shadow-[0_22px_44px_rgba(244,176,0,0.32)] transition duration-300 hover:shadow-[0_26px_52px_rgba(244,176,0,0.40)]"
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
  return (
    <motion.button
      variants={fieldVariants}
      type="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
      className="flex h-16 w-full min-w-0 items-center justify-center gap-3 rounded-2xl border border-[#DDD8CF] bg-white px-4 text-base font-extrabold text-[#111827] shadow-[0_16px_38px_rgba(43,29,18,0.04)] transition duration-300 hover:border-[#CFC6B7] hover:bg-[#FFFDF7]"
    >
      <GoogleIcon />
      Continue with Google
    </motion.button>
  );
}

function LoginForm({ setMode }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.form
      key="login"
      custom={-1}
      variants={contentVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      onSubmit={(event) => event.preventDefault()}
      className="mt-8"
    >
      <motion.div initial="hidden" animate="show" className="grid gap-5">
        <InputField
          icon={Mail}
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          index={0}
        />
        <InputField
          icon={LockKeyhole}
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          isPassword
          showValue={showPassword}
          onToggle={() => setShowPassword((value) => !value)}
          index={1}
        />

        <motion.div variants={fieldVariants} custom={2} className="flex justify-end">
          <button
            type="button"
            className="text-sm font-bold text-[#D88A00] transition hover:text-[#2B1D12]"
          >
            Forgot Password?
          </button>
        </motion.div>

        <GradientButton>Login</GradientButton>
        <Divider />
        <GoogleButton />

        <motion.p
          variants={fieldVariants}
          custom={6}
          className="text-center text-sm font-medium text-[#6F7685]"
        >
          Don&apos;t have an account?{" "}
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
}

function SignupForm({ setMode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <motion.form
      key="signup"
      custom={1}
      variants={contentVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      onSubmit={(event) => event.preventDefault()}
      className="mt-7"
    >
      <motion.div initial="hidden" animate="show" className="grid gap-4">
        <InputField
          icon={UserRound}
          placeholder="Full Name"
          autoComplete="name"
          index={0}
        />
        <InputField
          icon={Mail}
          type="email"
          placeholder="Email"
          autoComplete="email"
          index={1}
        />
        <InputField
          icon={LockKeyhole}
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          isPassword
          showValue={showPassword}
          onToggle={() => setShowPassword((value) => !value)}
          index={2}
        />
        <InputField
          icon={LockKeyhole}
          type="password"
          placeholder="Confirm Password"
          autoComplete="new-password"
          isPassword
          showValue={showConfirm}
          onToggle={() => setShowConfirm((value) => !value)}
          index={3}
        />

        <GradientButton>Create Account</GradientButton>
        <Divider />
        <GoogleButton />

        <motion.p
          variants={fieldVariants}
          custom={7}
          className="text-center text-sm font-medium text-[#6F7685]"
        >
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setMode("login")}
            className="font-extrabold text-[#D88A00] transition hover:text-[#2B1D12]"
          >
            Login
          </button>
        </motion.p>
      </motion.div>
    </motion.form>
  );
}

function FormPanel({ mode, setMode }) {
  const isSignup = mode === "signup";
  const direction = isSignup ? 1 : -1;

  return (
    <motion.section
      layout
      transition={panelTransition}
      className={`relative order-1 flex min-h-[720px] w-full min-w-0 items-center justify-center bg-white px-6 py-10 sm:px-10 lg:min-h-0 lg:basis-[55%] lg:px-16 ${
        isSignup ? "lg:order-1" : "lg:order-2"
      }`}
    >
      <div className="absolute right-6 top-6 hidden sm:block">
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-[#E6E1D8] bg-white/90 px-4 text-sm font-bold text-[#2B1D12] shadow-[0_14px_36px_rgba(43,29,18,0.05)] backdrop-blur-xl"
        >
          <Globe2 className="h-4 w-4" />
          English
          <ChevronDown className="h-4 w-4 text-[#7B8191]" />
        </button>
      </div>

      <div className="w-full min-w-0 max-w-[520px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${mode}-heading`}
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <h2 className="text-4xl font-black leading-tight tracking-normal text-[#0F1117]">
              {isSignup ? "Create Account" : "Login"}
            </h2>
            <p className="mt-3 text-base font-medium leading-7 text-[#697184]">
              {isSignup
                ? "Join SPOOWA to save favorites, track orders, and checkout faster."
                : "Access your SPOOWA account."}
            </p>
          </motion.div>
        </AnimatePresence>

        <AuthTabs mode={mode} setMode={setMode} />

        <AnimatePresence mode="wait" custom={direction}>
          {isSignup ? (
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
    <div className="min-h-screen bg-[#FFFDF7] font-body text-[#2B1D12]">
      <Navbar />

      <main className="relative isolate flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-32 top-12 h-80 w-80 rounded-full bg-[#FFC83D]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-36 bottom-8 h-96 w-96 rounded-full bg-[#F4B000]/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(255,248,232,0.9),rgba(255,253,247,0))]" />

        <motion.div
          layout
          transition={panelTransition}
          className="relative z-10 flex w-full min-w-0 max-w-[1200px] flex-col overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-[0_35px_90px_rgba(43,29,18,0.12),0_12px_40px_rgba(244,176,0,0.10)] lg:h-[750px] lg:flex-row"
        >
          <MarketingPanel mode={mode} />
          <FormPanel mode={mode} setMode={setMode} />
        </motion.div>
      </main>
    </div>
  );
}

export default Auth;
