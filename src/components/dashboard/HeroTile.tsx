"use client";

import { motion } from "framer-motion";
import { Flame, Clock, Target, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/UserContext";

function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HeroTile() {
  const { profile, stats: studentStats } = useUser();
  // Start with null to avoid SSR/client mismatch — populated after mount
  const [greeting, setGreeting] = useState<string | null>(null);
  const [today, setToday] = useState<string | null>(null);

  const stats = [
    {
      id: "streak",
      icon: Flame,
      value: studentStats.streakDays,
      label: "Day Streak",
      unit: "🔥",
      color: "#F97316",
      glow: "rgba(249,115,22,0.3)",
    },
    {
      id: "hours",
      icon: Clock,
      value: studentStats.totalHours,
      label: "Hours This Month",
      unit: "h",
      color: "var(--accent-cyan)",
      glow: "rgba(34,211,238,0.25)",
    },
    {
      id: "goals",
      icon: Target,
      value: studentStats.goalsMet,
      label: "Goals Met",
      unit: "",
      color: "var(--accent-emerald)",
      glow: "rgba(16,185,129,0.25)",
    },
    {
      id: "rank",
      icon: TrendingUp,
      value: studentStats.totalXP >= 4000 ? "Top 5%" : studentStats.totalXP >= 1000 ? "Top 25%" : "Top 80%",
      label: "Class Rank",
      unit: "",
      color: "var(--accent-primary)",
      glow: "rgba(108,99,255,0.3)",
    },
  ];

  useEffect(() => {
    const now = new Date();
    setGreeting(getGreeting(now.getHours()));
    setToday(
      now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  return (
    <article
      className="relative rounded-2xl p-6 overflow-hidden card-border h-full"
      style={{ backgroundColor: "var(--bg-card)", minHeight: 220 }}
    >
      {/* Abstract background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 80% 20%, rgba(108,99,255,0.12) 0%, transparent 60%),
            radial-gradient(ellipse at 20% 80%, rgba(34,211,238,0.06) 0%, transparent 60%)
          `,
        }}
      />

      {/* Animated orb */}
      <motion.div
        className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10">
        {/* Date — suppressed during SSR, filled after hydration */}
        <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
          {today ?? <span className="opacity-0">Loading…</span>}
        </p>

        {/* Greeting */}
        <motion.h1
          className="text-2xl font-bold mb-1 leading-tight"
          style={{ color: "var(--text-primary)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {greeting ?? "Welcome"},{" "}
          <span
            style={{
              background: "linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {profile.displayName.split(" ")[0]}
          </span>{" "}
          👋
        </motion.h1>

        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          You&apos;re on a{" "}
          <span className="font-semibold streak-icon inline-block" style={{ color: "#F97316" }}>
            🔥 {studentStats.streakDays}-day
          </span>{" "}
          learning streak. Keep it up!
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                className="rounded-xl p-3 flex flex-col gap-1"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Icon className="w-4 h-4" style={{ color: stat.color }} />
                <div>
                  <p className="text-lg font-bold leading-none" style={{ color: "var(--text-primary)" }}>
                    {stat.value}
                    {stat.unit && (
                      <span className="text-xs ml-0.5" style={{ color: stat.color }}>
                        {stat.unit}
                      </span>
                    )}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
