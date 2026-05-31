"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Award, Star, ShieldAlert, Sparkles, Flame, CheckCircle, ChevronRight, Lock } from "lucide-react";

// Dynamic achievements data
import { useUser } from "@/lib/UserContext";

const certificates = [
  { id: "cert-1", title: "Advanced React Patterns", date: "May 12, 2026", grade: "94%", credentialId: "NGL-9821A" },
  { id: "cert-2", title: "TypeScript Deep Dive", date: "Apr 28, 2026", grade: "98%", credentialId: "NGL-4318B" },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 24 },
  },
};

export default function AchievementsSection() {
  const { profile, stats, classmates } = useUser();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const isDefaultUser = profile.displayName === "Saroj Padhi";
  const visibleCertificates = isDefaultUser 
    ? certificates 
    : certificates.slice(0, Math.min(certificates.length, stats.certificates));

  const badges = [
    {
      id: "streak-7",
      title: "7-Day Streak",
      desc: "Maintained a study streak for 7 consecutive days.",
      icon: Flame,
      color: "#F59E0B",
      progress: Math.min(100, Math.round((stats.streakDays / 7) * 100)),
      unlocked: stats.unlockedBadges.includes("streak-7"),
      tier: "Gold",
    },
    {
      id: "react-master",
      title: "React Specialist",
      desc: "Completed all React core path courses.",
      icon: Sparkles,
      color: "#6C63FF",
      progress: Math.min(100, Math.round((stats.coursesCompleted / 1) * 100)),
      unlocked: stats.unlockedBadges.includes("react-master"),
      tier: "Silver",
    },
    {
      id: "system-design",
      title: "Architect",
      desc: "Score above 90% in the System Design evaluation.",
      icon: Award,
      color: "#22D3EE",
      progress: Math.min(100, Math.round((stats.totalXP / 5000) * 100)),
      unlocked: stats.unlockedBadges.includes("system-design"),
      tier: "Silver",
    },
    {
      id: "ml-explorer",
      title: "AI Explorer",
      desc: "Complete the ML foundation track modules.",
      icon: Star,
      color: "#10B981",
      progress: Math.min(100, Math.round((stats.totalHours / 15) * 100)),
      unlocked: stats.unlockedBadges.includes("ml-explorer") || stats.totalHours >= 15,
      tier: "Bronze",
    },
  ];

  return (
    <section id="section-achievements" aria-label="Achievements" className="scroll-mt-6">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.4 }}
        className="mb-4 flex items-center gap-2"
      >
        <Trophy className="w-4 h-4" style={{ color: "var(--accent-amber)" }} />
        <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Achievements & Milestones
        </h2>
      </motion.div>

      <div
        ref={ref}
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(12, 1fr)" }}
      >
        {/* XP Level Card */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          style={{ gridColumn: "span 12 / span 12" }}
          className="lg:[grid-column:span_8_/_span_8]"
        >
          <div
            className="rounded-2xl p-5 card-border h-full relative overflow-hidden flex flex-col justify-between"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                background: "radial-gradient(circle at 100% 0%, var(--accent-amber) 0%, transparent 60%)",
              }}
            />
            <div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--accent-amber)" }}>
                    Current Progress
                  </span>
                  <h3 className="text-xl font-bold mt-1" style={{ color: "var(--text-primary)" }}>
                    Level {stats.level} • Scholar
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                    {stats.totalXP} / {stats.level * 1000} XP
                  </span>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {(stats.level * 1000) - stats.totalXP} XP to Level {stats.level + 1}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-3 rounded-full relative overflow-hidden mb-6" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    background: "linear-gradient(to right, var(--accent-primary), var(--accent-cyan))",
                    boxShadow: "0 0 12px rgba(108,99,255,0.5)",
                  }}
                  initial={{ width: "0%" }}
                  animate={inView ? { width: `${Math.max(2, Math.round(((stats.totalXP % 1000) / 1000) * 100))}%` } : { width: "0%" }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Sub stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
              <div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>XP Gained Today</span>
                <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>+{stats.xpGainedToday} XP</p>
              </div>
              <div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Rank in Class</span>
                <p className="text-lg font-bold" style={{ color: "var(--accent-cyan)" }}>
                  #{classmates.find((c) => c.active)?.rank || 6} of {classmates.length}
                </p>
              </div>
              <div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Daily Multiplier</span>
                <p className="text-lg font-bold flex items-center gap-1" style={{ color: "var(--accent-emerald)" }}>
                  {stats.streakDays >= 7 ? "1.5x" : stats.streakDays >= 3 ? "1.2x" : "1.0x"}{" "}
                  <Flame className="w-4 h-4 streak-icon" style={{ fill: "var(--accent-amber)", color: "var(--accent-amber)" }} />
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Weekly Leaderboard */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          style={{ gridColumn: "span 12 / span 12" }}
          className="md:[grid-column:span_6_/_span_6] lg:[grid-column:span_4_/_span_4]"
        >
          <div
            className="rounded-2xl p-5 card-border h-full flex flex-col justify-between"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                Weekly Leaderboard
              </h3>
              <ul className="flex flex-col gap-2 list-none p-0 m-0">
                {classmates.map((student) => {
                  const name = student.active ? `You (${profile.displayName})` : student.name;
                  const avatar = student.active ? profile.avatar : student.avatar;
                  return (
                    <li
                      key={student.rank}
                      className="flex items-center gap-3 p-2 rounded-xl"
                      style={{
                        backgroundColor: student.active ? "rgba(108,99,255,0.08)" : "transparent",
                        border: student.active ? "1px solid rgba(108,99,255,0.15)" : "1px solid transparent",
                      }}
                    >
                      <span
                        className="w-5 text-center text-xs font-extrabold"
                        style={{
                          color:
                            student.rank === 1 ? "var(--accent-amber)" :
                            student.rank === 2 ? "var(--text-secondary)" :
                            student.rank === 3 ? "var(--accent-cyan)" :
                            "var(--text-muted)",
                        }}
                      >
                        {student.rank}
                      </span>
                      <span className="text-lg shrink-0">{avatar}</span>
                      <span
                        className="text-xs font-medium flex-1 truncate"
                        style={{ color: student.active ? "var(--text-primary)" : "var(--text-secondary)" }}
                      >
                        {name}
                      </span>
                      <span className="text-xs font-bold" style={{ color: student.active ? "var(--accent-primary)" : "var(--text-muted)" }}>
                        {student.xp} XP
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Learning Badges Grid */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          style={{ gridColumn: "span 12 / span 12" }}
          className="md:[grid-column:span_6_/_span_6] lg:[grid-column:span_7_/_span_7]"
        >
          <div
            className="rounded-2xl p-5 card-border h-full flex flex-col justify-between"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
                Learning Badges
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {badges.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={badge.id}
                      className="p-3 rounded-xl card-border relative flex flex-col justify-between"
                      style={{
                        backgroundColor: badge.unlocked ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.2)",
                        borderColor: badge.unlocked ? "var(--border-subtle)" : "rgba(255,255,255,0.02)",
                      }}
                    >
                      {!badge.unlocked && (
                        <Lock className="w-3.5 h-3.5 absolute top-2 right-2" style={{ color: "var(--text-muted)" }} />
                      )}
                      <div className="flex items-center gap-2.5 mb-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: badge.unlocked ? `${badge.color}15` : "rgba(255,255,255,0.04)",
                          }}
                        >
                          <Icon
                            className={`w-4 h-4 ${badge.id === "streak-7" ? "streak-icon" : ""}`}
                            style={{
                              color: badge.unlocked ? badge.color : "var(--text-muted)",
                              fill: badge.id === "streak-7" && badge.unlocked ? badge.color : "none",
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-xs font-bold leading-tight truncate"
                            style={{ color: badge.unlocked ? "var(--text-primary)" : "var(--text-secondary)" }}
                          >
                            {badge.title}
                          </p>
                          <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: badge.color }}>
                            {badge.tier}
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] leading-snug mb-3 flex-1" style={{ color: "var(--text-secondary)" }}>
                        {badge.desc}
                      </p>
                      <div>
                        <div className="flex justify-between items-center text-[9px] font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                          <span>Completion</span>
                          <span style={{ color: badge.unlocked ? "var(--accent-emerald)" : "var(--text-muted)" }}>
                            {badge.progress}%
                          </span>
                        </div>
                        <div className="h-1 rounded-full relative overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                          <motion.div
                            className="absolute left-0 top-0 h-full rounded-full"
                            style={{ backgroundColor: badge.unlocked ? badge.color : "var(--text-muted)" }}
                            initial={{ width: "0%" }}
                            animate={inView ? { width: `${badge.progress}%` } : { width: "0%" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Certificates Card */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          style={{ gridColumn: "span 12 / span 12" }}
          className="lg:[grid-column:span_5_/_span_5]"
        >
          <div
            className="rounded-2xl p-5 card-border h-full flex flex-col justify-between"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
                Verified Certificates
              </h3>
              <div className="flex flex-col gap-3">
                {visibleCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all duration-200 hover:bg-white/[0.02]"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--accent-emerald)" }} />
                        <h4 className="text-xs font-bold leading-tight truncate" style={{ color: "var(--text-primary)" }}>
                          {cert.title}
                        </h4>
                      </div>
                      <p className="text-[10px] mt-1" style={{ color: "var(--text-secondary)" }}>
                        Issued: {cert.date} • Grade: {cert.grade}
                      </p>
                      <span className="text-[9px] font-mono mt-0.5 block" style={{ color: "var(--text-muted)" }}>
                        ID: {cert.credentialId}
                      </span>
                    </div>
                    <button
                      className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 active:scale-95 transition-all"
                      style={{ border: "1px solid var(--border-subtle)", cursor: "pointer" }}
                      aria-label="View credential details"
                    >
                      <ChevronRight className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
                    </button>
                  </div>
                ))}
                {visibleCertificates.length === 0 && (
                  <div className="py-8 px-4 text-center border border-dashed rounded-xl" style={{ borderColor: "var(--border-subtle)", backgroundColor: "rgba(0,0,0,0.1)" }}>
                    <Award className="w-8 h-8 mx-auto opacity-20 mb-2" style={{ color: "var(--text-secondary)" }} />
                    <p className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                      No verified certificates earned yet
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                      Enroll in courses and complete active modules to earn credentials!
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t text-center" style={{ borderColor: "var(--border-subtle)" }}>
              <button
                className="text-xs font-semibold flex items-center justify-center gap-1 mx-auto py-1 px-3 rounded-lg hover:bg-white/5 transition-all"
                style={{ color: "var(--accent-cyan)", border: "none", background: "none", cursor: "pointer" }}
              >
                Go to Credentials Center <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
