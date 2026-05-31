"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Settings, Check, Moon, Sun, Monitor, X, Shield, Bell, Sliders } from "lucide-react";
import { useNav } from "@/lib/NavContext";
import { useUser } from "@/lib/UserContext";

export default function SettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen } = useNav();
  const {
    weeklyGoal: savedWeeklyGoal,
    theme: savedTheme,
    notifications: savedNotifications,
    saveWeeklyGoal,
    saveTheme,
    saveNotifications,
    resetAll,
  } = useUser();

  const modalRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState(savedTheme);
  const [weeklyGoal, setWeeklyGoal] = useState(savedWeeklyGoal);
  const [notifications, setNotifications] = useState(savedNotifications);

  const [showToast, setShowToast] = useState(false);

  // Sync settings when modal opens or store changes
  useEffect(() => {
    if (isSettingsOpen) {
      setTheme(savedTheme);
      setWeeklyGoal(savedWeeklyGoal);
      setNotifications(savedNotifications);
    }
  }, [isSettingsOpen, savedWeeklyGoal, savedTheme, savedNotifications]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSettingsOpen(false);
      }
    };
    if (isSettingsOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSettingsOpen, setIsSettingsOpen]);

  const handleSavePreferences = () => {
    saveWeeklyGoal(weeklyGoal);
    saveTheme(theme);
    saveNotifications(notifications);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setIsSettingsOpen(false);
    }, 1200);
  };

  const handleResetPreferences = () => {
    setTheme(savedTheme);
    setWeeklyGoal(savedWeeklyGoal);
    setNotifications(savedNotifications);
  };

  const handleRestoreDefaults = () => {
    resetAll();
    // Force local state resets
    setTheme("dark");
    setWeeklyGoal(8);
    setNotifications({ email: true, weeklyDigest: true, browser: false });
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1200);
  };

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-modal-title"
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSettingsOpen(false)}
            className="absolute inset-0 bg-[#080C14]/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            ref={modalRef}
            className="relative w-full max-w-2xl rounded-3xl p-6 card-border overflow-y-auto max-h-[85vh] shadow-2xl"
            style={{
              backgroundColor: "var(--bg-card)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 50px rgba(34, 211, 238, 0.15)",
            }}
          >
            {/* Glowing Accent Ring */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, var(--accent-cyan), rgba(34,211,238,0.2))",
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
                    background: "rgba(34,211,238,0.95)",
                    color: "black",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <Check className="w-4 h-4 stroke-[3px]" />
                  <span className="text-xs font-bold">Preferences saved successfully! ✨</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(34, 211, 238, 0.1)" }}
                >
                  <Settings className="w-4 h-4 animate-spin-slow" style={{ color: "var(--accent-cyan)" }} />
                </div>
                <h2 id="settings-modal-title" className="text-base font-bold text-gradient-cyan">
                  Academy Preferences
                </h2>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                style={{ border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
                aria-label="Close settings"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content layout */}
            <div className="grid gap-5 md:grid-cols-2 mt-5">
              {/* Settings Form Column */}
              <div className="rounded-2xl p-4.5 card-border flex flex-col justify-between" style={{ backgroundColor: "rgba(0,0,0,0.12)" }}>
                <div className="flex flex-col gap-4">
                  {/* Accent Theme Picker */}
                  <div>
                    <label className="text-[10px] font-bold block mb-2 text-[#8B97B3] uppercase tracking-wider">
                      Theme Accent Mode
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "dark", label: "Dark Space", icon: Moon },
                        { id: "light", label: "Light Mode", icon: Sun },
                        { id: "system", label: "Use System", icon: Monitor },
                      ].map((t) => {
                        const Icon = t.icon;
                        const isSelected = theme === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => setTheme(t.id as "dark" | "light" | "system")}
                            className="flex flex-col items-center gap-1.5 p-2 rounded-xl card-border relative transition-all cursor-pointer"
                            style={{
                              backgroundColor: isSelected ? "rgba(34,211,238,0.06)" : "rgba(0,0,0,0.15)",
                              borderColor: isSelected ? "var(--accent-cyan)" : "var(--border-subtle)",
                            }}
                          >
                            <Icon className="w-4 h-4" style={{ color: isSelected ? "var(--accent-cyan)" : "var(--text-secondary)" }} />
                            <span className="text-[9px] font-bold" style={{ color: isSelected ? "var(--text-primary)" : "var(--text-secondary)" }}>
                              {t.label}
                            </span>
                            {isSelected && (
                              <div
                                className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: "var(--accent-cyan)" }}
                              >
                                <Check className="w-1.5 h-1.5 text-black" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Range Weekly Target Hours Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[10px] font-bold text-[#8B97B3] uppercase tracking-wider">
                        Weekly Study Goal
                      </label>
                      <span className="text-xs font-extrabold" style={{ color: "var(--accent-cyan)" }}>
                        {weeklyGoal} hours
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>2h</span>
                      <input
                        type="range"
                        min="2"
                        max="20"
                        value={weeklyGoal}
                        onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                        className="flex-1 accent-cyan"
                        style={{ cursor: "pointer" }}
                      />
                      <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>20h</span>
                    </div>
                  </div>
                </div>

                {/* Discard & Save */}
                <div className="mt-5 flex justify-end gap-2 pt-3 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                  <button
                    onClick={handleResetPreferences}
                    className="text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                    style={{ border: "none", background: "none", color: "var(--text-secondary)" }}
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="text-xs font-bold py-1.5 px-3.5 rounded-lg active:scale-95 transition-all cursor-pointer"
                    style={{
                      border: "none",
                      background: "linear-gradient(135deg, var(--accent-cyan), rgba(34,211,238,0.8))",
                      color: "black",
                      boxShadow: "0 4px 10px rgba(34,211,238,0.15)",
                    }}
                  >
                    Save Preferences
                  </button>
                </div>
              </div>

              {/* Notifications & System Resets Column */}
              <div className="rounded-2xl p-4.5 card-border flex flex-col justify-between" style={{ backgroundColor: "rgba(0,0,0,0.12)" }}>
                <div>
                  {/* Notification Digests Toggles */}
                  <div>
                    <label className="text-[10px] font-bold block mb-2 text-[#8B97B3] uppercase tracking-wider">
                      Notification Subscriptions
                    </label>
                    <div className="flex flex-col gap-2">
                      {[
                        { key: "email", label: "Email digests", desc: "For digests & cert awards" },
                        { key: "weeklyDigest", label: "Weekly progress updates", desc: "Peer reports" },
                      ].map((n) => {
                        const isChecked = notifications[n.key as keyof typeof notifications];
                        return (
                          <div
                            key={n.key}
                            onClick={() =>
                              setNotifications((prev) => ({
                                ...prev,
                                [n.key]: !prev[n.key as keyof typeof notifications],
                              }))
                            }
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                                {n.label}
                              </p>
                              <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                                {n.desc}
                              </p>
                            </div>
                            <div
                              className="w-7 h-4 rounded-full p-0.5 transition-colors relative shrink-0"
                              style={{
                                backgroundColor: isChecked ? "var(--accent-cyan)" : "rgba(255,255,255,0.06)",
                              }}
                            >
                              <motion.div
                                layout
                                className="w-3 h-3 rounded-full bg-white"
                                animate={{ x: isChecked ? 12 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reset to Factory Defaults */}
                  <div className="mt-4 pt-3.5 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                    <label className="text-[10px] font-bold block mb-1 text-rose-500 uppercase tracking-wider">
                      Danger Zone
                    </label>
                    <p className="text-[9px] mb-2" style={{ color: "var(--text-muted)" }}>
                      Resets all configurations, preferences, custom avatar settings, and dynamic course scores back to default scholar status.
                    </p>
                    <button
                      onClick={handleRestoreDefaults}
                      className="text-[10px] font-bold py-1.5 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                    >
                      Reset to Dashboard Defaults
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t text-center" style={{ borderColor: "var(--border-subtle)" }}>
                  <p className="text-[9px] flex items-center justify-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                    <Shield className="w-3.5 h-3.5" /> Security configurations are stored on your local system.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
