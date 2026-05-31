"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { User, Check, X, Flame, Zap, Trophy, Award, Lock, Sparkles, Mail } from "lucide-react";
import { useNav } from "@/lib/NavContext";
import { useUser } from "@/lib/UserContext";

export default function ProfileModal() {
  const { isProfileOpen, setIsProfileOpen } = useNav();
  const {
    profile,
    stats,
    saveProfile,
    logStudySession,
    completeCourseModule,
  } = useUser();

  const modalRef = useRef<HTMLDivElement>(null);

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [email, setEmail] = useState(profile.email);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Sync profile when modal opens or context updates
  useEffect(() => {
    if (isProfileOpen) {
      setDisplayName(profile.displayName);
      setEmail(profile.email);
      setAvatar(profile.avatar);
      setShowAvatarPicker(false);
    }
  }, [isProfileOpen, profile]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileOpen, setIsProfileOpen]);

  const handleSaveProfile = () => {
    saveProfile({ displayName, email, avatar });
    triggerToast("Profile changes saved successfully! ✨");
    setTimeout(() => {
      setIsProfileOpen(false);
    }, 1200);
  };

  const handleDiscardChanges = () => {
    setDisplayName(profile.displayName);
    setEmail(profile.email);
    setAvatar(profile.avatar);
    setShowAvatarPicker(false);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const avatarOptions = ["⚡", "🚀", "🎓", "💻", "🧠", "🔥", "🎨", "🌟", "👾", "🎯", "📚", "🏆"];

  return (
    <AnimatePresence>
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-modal-title"
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsProfileOpen(false)}
            className="absolute inset-0 bg-[#080C14]/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            ref={modalRef}
            className="relative w-full max-w-4xl rounded-3xl p-6 card-border overflow-y-auto max-h-[90vh] shadow-2xl"
            style={{
              backgroundColor: "var(--bg-card)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 50px rgba(108, 99, 255, 0.15)",
            }}
          >
            {/* Glowing Accent Ring */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, var(--accent-primary), var(--accent-cyan))",
              }}
            />

            {/* Dynamic Success Toast */}
            <AnimatePresence>
              {showToast && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-xl z-50 flex items-center gap-2 shadow-lg"
                  style={{
                    background: "rgba(108,99,255,0.95)",
                    color: "white",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <Check className="w-4 h-4 stroke-[3px]" />
                  <span className="text-xs font-bold">{toastMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(108, 99, 255, 0.12)" }}
                >
                  <User className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                </div>
                <h2 id="profile-modal-title" className="text-base font-bold text-gradient-primary">
                  Student Identity Portfolio
                </h2>
              </div>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                style={{ border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
                aria-label="Close profile modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main content grid */}
            <div className="grid gap-6 md:grid-cols-12 mt-5">
              {/* Left Pane: Glassmorphic ID Card Badge & Dynamic Achievements */}
              <div className="md:col-span-5 flex flex-col gap-4">
                {/* Stunning Digital Student Card */}
                <div
                  className="rounded-3xl p-5 card-border relative overflow-hidden flex flex-col items-center justify-center text-center group"
                  style={{
                    background: "linear-gradient(135deg, rgba(108,99,255,0.06), rgba(34,211,238,0.03))",
                    border: "1px solid rgba(108,99,255,0.15)",
                  }}
                >
                  {/* Subtle pulsing background glow behind avatar */}
                  <div
                    className="absolute top-10 w-24 h-24 rounded-full filter blur-2xl pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity"
                    style={{ background: "radial-gradient(var(--accent-primary), transparent 70%)" }}
                  />

                  {/* Large Badge Avatar */}
                  <motion.div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl font-bold relative overflow-hidden mb-3.5 select-none"
                    style={{
                      background: "linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))",
                      boxShadow: "0 8px 24px rgba(108,99,255,0.25)",
                    }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                  >
                    {avatar}
                  </motion.div>

                  <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                    {displayName || "Saroj Padhi"}
                  </h3>
                  <p className="text-xs mb-2 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                    <Mail className="w-3.5 h-3.5 text-muted" /> {email || "saroj@example.com"}
                  </p>

                  {/* Level Tag Badge */}
                  <span
                    className="text-[10px] font-bold py-1 px-3.5 rounded-full"
                    style={{
                      backgroundColor: "rgba(108,99,255,0.12)",
                      color: "var(--accent-primary)",
                      border: "1px solid rgba(108,99,255,0.1)",
                    }}
                  >
                    Level {stats.level} • Active Scholar
                  </span>
                </div>

                {/* Scorecards */}
                <div
                  className="rounded-2xl p-4 card-border flex flex-col gap-3"
                  style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                >
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-gradient">
                    Academic Stats
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      className="p-2.5 rounded-xl border flex items-center gap-2"
                      style={{ borderColor: "var(--border-subtle)", backgroundColor: "rgba(0,0,0,0.15)" }}
                    >
                      <Flame className="w-4 h-4 shrink-0" style={{ color: "#F97316" }} />
                      <div>
                        <p className="text-xs font-bold leading-none">{stats.streakDays} Days</p>
                        <span className="text-[8px] block mt-0.5" style={{ color: "var(--text-muted)" }}>Day Streak</span>
                      </div>
                    </div>
                    <div
                      className="p-2.5 rounded-xl border flex items-center gap-2"
                      style={{ borderColor: "var(--border-subtle)", backgroundColor: "rgba(0,0,0,0.15)" }}
                    >
                      <Zap className="w-4 h-4 shrink-0" style={{ color: "var(--accent-cyan)" }} />
                      <div>
                        <p className="text-xs font-bold leading-none">{stats.totalXP.toLocaleString()}</p>
                        <span className="text-[8px] block mt-0.5" style={{ color: "var(--text-muted)" }}>Accumulated XP</span>
                      </div>
                    </div>
                    <div
                      className="p-2.5 rounded-xl border flex items-center gap-2"
                      style={{ borderColor: "var(--border-subtle)", backgroundColor: "rgba(0,0,0,0.15)" }}
                    >
                      <Trophy className="w-4 h-4 shrink-0" style={{ color: "#F59E0B" }} />
                      <div>
                        <p className="text-xs font-bold leading-none">{stats.coursesCompleted} Modules</p>
                        <span className="text-[8px] block mt-0.5" style={{ color: "var(--text-muted)" }}>Completed</span>
                      </div>
                    </div>
                    <div
                      className="p-2.5 rounded-xl border flex items-center gap-2"
                      style={{ borderColor: "var(--border-subtle)", backgroundColor: "rgba(0,0,0,0.15)" }}
                    >
                      <Award className="w-4 h-4 shrink-0" style={{ color: "var(--accent-emerald)" }} />
                      <div>
                        <p className="text-xs font-bold leading-none">{stats.certificates} Certs</p>
                        <span className="text-[8px] block mt-0.5" style={{ color: "var(--text-muted)" }}>Earned</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Pane: Info Settings & Study Simulator */}
              <div className="md:col-span-7 flex flex-col justify-between gap-5">
                <div
                  className="rounded-2xl p-4 card-border flex flex-col gap-4 relative"
                  style={{ backgroundColor: "rgba(0,0,0,0.12)" }}
                >
                  <div className="flex justify-between items-center relative">
                    <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Personal Profile Details
                    </h3>
                    <button
                      onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                      className="text-[10px] font-bold py-1 px-2.5 rounded-lg hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                      style={{ border: "1px solid var(--border-subtle)", color: "var(--accent-cyan)" }}
                    >
                      {showAvatarPicker ? "Close Emoji Grid" : "Change Emoji Avatar"}
                    </button>
                  </div>

                  {/* Dynamic Inline Avatar Picker */}
                  <AnimatePresence>
                    {showAvatarPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute left-0 right-0 top-10 p-3 rounded-xl border z-30 shadow-xl grid grid-cols-6 gap-2"
                        style={{
                          backgroundColor: "var(--bg-elevated)",
                          borderColor: "var(--border-subtle)",
                        }}
                      >
                        {avatarOptions.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => {
                              setAvatar(opt);
                              setShowAvatarPicker(false);
                            }}
                            className={`text-2xl p-2 rounded-lg hover:bg-white/10 active:scale-90 transition-all cursor-pointer ${
                              avatar === opt ? "bg-white/10 scale-105 border border-cyan-400/30" : ""
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Input Fields */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-[#8B97B3]">
                        Scholar Display Name
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full text-xs rounded-xl p-2.5 card-border outline-none focus:border-primary/50"
                        style={{ backgroundColor: "rgba(0,0,0,0.2)", color: "var(--text-primary)" }}
                        placeholder="Enter display name"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-[#8B97B3]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs rounded-xl p-2.5 card-border outline-none focus:border-primary/50"
                        style={{ backgroundColor: "rgba(0,0,0,0.2)", color: "var(--text-primary)" }}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  {/* Dynamic Badges Cabinet Cabinet */}
                  <div className="pt-3.5 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                      Badges Showcase Cabinet
                    </h4>
                    <div className="flex gap-2">
                      {[
                        { id: "streak-7", label: "7-Day Streak", icon: Flame, color: "#F97316" },
                        { id: "react-master", label: "React Expert", icon: Zap, color: "#6C63FF" },
                        { id: "system-design", label: "System Design Explorer", icon: Award, color: "#22D3EE" },
                      ].map((b) => {
                        const Icon = b.icon;
                        const unlocked = stats.unlockedBadges.includes(b.id);
                        return (
                          <div
                            key={b.id}
                            title={`${b.label} (${unlocked ? "Unlocked!" : "Locked"})`}
                            className="w-10 h-10 rounded-xl flex items-center justify-center relative border border-white/5"
                            style={{
                              backgroundColor: unlocked ? `${b.color}15` : "rgba(0,0,0,0.3)",
                            }}
                          >
                            {!unlocked && <Lock className="absolute top-1 right-1 w-2 h-2 text-white/20" />}
                            <Icon
                              className="w-5 h-5"
                              style={{ color: unlocked ? b.color : "rgba(255,255,255,0.15)" }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action buttons for changing credentials */}
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={handleDiscardChanges}
                      className="text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                      style={{ border: "none", background: "none", color: "var(--text-secondary)" }}
                    >
                      Discard Edits
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="text-xs font-bold py-1.5 px-3.5 rounded-lg active:scale-95 transition-all cursor-pointer"
                      style={{
                        border: "none",
                        background: "linear-gradient(135deg, var(--accent-primary), rgba(108,99,255,0.85))",
                        color: "white",
                        boxShadow: "0 4px 12px rgba(108,99,255,0.15)",
                      }}
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </div>

                {/* Immersive Game-styled Study Simulator Panel */}
                <div
                  className="rounded-2xl p-4 card-border flex flex-col gap-3"
                  style={{
                    background: "linear-gradient(135deg, rgba(34,211,238,0.06), rgba(0,0,0,0.25))",
                    border: "1px solid rgba(34,211,238,0.15)",
                  }}
                >
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: "var(--accent-cyan)" }}>
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Academy study simulator
                  </h4>
                  <p className="text-[10px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    Interact here to simulate dynamic academy study hours and modules. Watch stats, learning charts, course cards, and leaderboard ranks update live on the dashboard without pre-filled credits!
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => {
                        logStudySession(45);
                        triggerToast("Logged 45 min session! +150 XP gained & course progress advanced ⚡");
                      }}
                      className="text-[10px] py-2 px-3 rounded-xl border border-cyan-400/20 bg-cyan-400/5 hover:bg-cyan-400/10 active:scale-[0.97] transition-all flex items-center justify-center gap-1.5 font-bold cursor-pointer text-cyan-300"
                    >
                      <Zap className="w-3.5 h-3.5 text-cyan-400" /> Log 45 Min Session
                    </button>
                    <button
                      onClick={() => {
                        completeCourseModule();
                        triggerToast("Completed module! +500 XP earned & course marked 100% completed 🎓");
                      }}
                      className="text-[10px] py-2 px-3 rounded-xl border border-amber-400/20 bg-amber-400/5 hover:bg-amber-400/10 active:scale-[0.97] transition-all flex items-center justify-center gap-1.5 font-bold cursor-pointer text-amber-300"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-400" /> Complete Course Module
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
