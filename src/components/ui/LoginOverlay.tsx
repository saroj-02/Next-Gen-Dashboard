"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/lib/UserContext";
import { LogIn, Loader2, Sparkles, User, Mail } from "lucide-react";

export default function LoginOverlay() {
  const { isLoggedIn, isSigningOut, signIn } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Beautiful loading transition
    setTimeout(() => {
      signIn(name, email);
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {/* 1. SECURE SIGNING OUT STATE */}
      {isSigningOut && (
        <motion.div
          key="signing-out"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#080C14]/80 backdrop-blur-xl"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="mb-4"
          >
            <Loader2 className="w-10 h-10 text-cyan-400" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold tracking-wider uppercase text-cyan-400"
          >
            Signing out securely...
          </motion.p>
        </motion.div>
      )}

      {/* 2. GLASSMORPHIC SIGN IN PORTAL */}
      {!isLoggedIn && !isSigningOut && (
        <motion.div
          key="sign-in-portal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-[#05070c]"
          style={{
            backgroundImage: `
              radial-gradient(at 0% 0%, rgba(108, 99, 255, 0.15) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(34, 211, 238, 0.1) 0px, transparent 50%)
            `,
          }}
        >
          {/* Subtle animated light orbs */}
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%)",
              top: "10%",
              left: "15%",
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.1 }}
            className="relative w-full max-w-md rounded-3xl p-8 shadow-2xl border border-white/5 overflow-hidden"
            style={{
              backgroundColor: "rgba(13, 21, 38, 0.6)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8), 0 0 60px rgba(108,99,255,0.05)",
            }}
          >
            {/* Top Glowing Strip */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{
                background: "linear-gradient(90deg, var(--accent-primary), var(--accent-cyan))",
              }}
            />

            {/* Header */}
            <div className="text-center mb-8">
              <div
                className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-white/10"
                style={{
                  background: "linear-gradient(135deg, rgba(108,99,255,0.2), rgba(34,211,238,0.2))",
                }}
              >
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Welcome to Next-Gen Academy</h2>
              <p className="text-xs text-[#8B97B3] mt-2">
                Enter your details below to access your learning portal
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Display Name Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-[#8B97B3] uppercase tracking-wider pl-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saroj Padhi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-sm rounded-2xl py-3 pl-11 pr-4 bg-black/30 border border-white/5 text-white placeholder-white/20 outline-none transition-all focus:border-[#6C63FF]/50 focus:bg-black/50"
                  />
                </div>
              </div>

              {/* Email Address Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-[#8B97B3] uppercase tracking-wider pl-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568]" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. saroj@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm rounded-2xl py-3 pl-11 pr-4 bg-black/30 border border-white/5 text-white placeholder-white/20 outline-none transition-all focus:border-[#6C63FF]/50 focus:bg-black/50"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 active:scale-[0.98] hover:scale-[1.01] transition-all cursor-pointer relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, var(--accent-primary), rgba(108,99,255,0.85))",
                  boxShadow: "0 6px 20px rgba(108,99,255,0.25)",
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synchronizing Portal...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Access Dashboard</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer lock statement */}
            <div className="text-center mt-6 pt-4 border-t border-white/5 text-[9px] text-[#4A5568]">
              🔒 Locked securely with localStorage credentials.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
