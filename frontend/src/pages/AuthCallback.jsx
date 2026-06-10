import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * AuthCallback — handles the OAuth redirect from the backend.
 * 
 * After a user completes Google login, the backend redirects here
 * with ?token=<jwt>. This component stores the token, fetches the user
 * profile, and redirects to /shop.
 */
export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleSocialCallback } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError("Social login failed. Please try again.");
      setTimeout(() => navigate("/auth", { replace: true }), 3000);
      return;
    }

    if (!token) {
      setError("No authentication token received.");
      setTimeout(() => navigate("/auth", { replace: true }), 3000);
      return;
    }

    // Process the social login
    handleSocialCallback(token)
      .then(() => {
        navigate("/shop", { replace: true });
      })
      .catch((err) => {
        console.error("Social auth callback error:", err);
        setError(err.message || "Authentication failed. Please try again.");
        setTimeout(() => navigate("/auth", { replace: true }), 3000);
      });
  }, [searchParams, navigate, handleSocialCallback]);

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-body flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {error ? (
          <>
            <div className="mx-auto h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4 border border-red-100">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-xl font-black text-[#2B1D12] font-display mb-2">
              Authentication Failed
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              {error}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Redirecting to login...
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-[#FFF8E8] to-amber-100 flex items-center justify-center mb-4 shadow-sm border border-[#F4B000]/15">
              <Sparkles className="h-8 w-8 text-[#F4B000] animate-pulse" />
            </div>
            <h2 className="text-xl font-black text-[#2B1D12] font-display mb-2">
              Signing you in...
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Completing authentication
            </p>
            {/* Animated progress bar */}
            <div className="mt-6 w-48 mx-auto h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#F4B000] to-[#E59700]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
