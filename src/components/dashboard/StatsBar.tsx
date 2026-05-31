"use client";

import { motion } from "framer-motion";
import { BookMarked, Award, Clock3, Cpu } from "lucide-react";
import { useUser } from "@/lib/UserContext";

export default function StatsBar() {
  const { stats, profile } = useUser();
  const isDefaultUser = profile.displayName === "Saroj Padhi";

  const avgTime = stats.totalHours === 0 
    ? "0h" 
    : (isDefaultUser ? "1.5h" : `${Math.round((stats.totalHours / Math.max(1, stats.streakDays)) * 10) / 10}h`);

  const quickStats = [
    {
      id: "completed",
      icon: BookMarked,
      value: stats.coursesCompleted,
      label: "Courses Completed",
      color: "var(--accent-emerald)",
      bg: "rgba(16,185,129,0.08)",
    },
    {
      id: "certificates",
      icon: Award,
      value: stats.certificates,
      label: "Certificates Earned",
      color: "var(--accent-amber)",
      bg: "rgba(245,158,11,0.08)",
    },
    {
      id: "avgTime",
      icon: Clock3,
      value: avgTime,
      label: "Avg Daily Study",
      color: "var(--accent-cyan)",
      bg: "rgba(34,211,238,0.08)",
    },
    {
      id: "xp",
      icon: Cpu,
      value: stats.totalXP.toLocaleString(),
      label: "XP Points",
      color: "var(--accent-primary)",
      bg: "rgba(108,99,255,0.08)",
    },
  ];

  return (
    <section
      className="relative rounded-2xl p-4 overflow-hidden card-border"
      style={{ backgroundColor: "var(--bg-card)" }}
      aria-label="Quick statistics"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, rgba(108,99,255,0.05) 0%, transparent 70%)",
        }}
      />
      <ul
        className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 list-none"
        role="list"
      >
        {quickStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.li
              key={stat.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="flex items-center gap-3 rounded-xl p-3"
              style={{
                backgroundColor: stat.bg,
                border: `1px solid ${stat.color}15`,
              }}
            >
              <div
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.bg}` }}
              >
                <Icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-base font-bold leading-none" style={{ color: "var(--text-primary)" }}>
                  {stat.value}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {stat.label}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
