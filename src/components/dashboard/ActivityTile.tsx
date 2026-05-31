"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Activity } from "lucide-react";
import { useUser } from "@/lib/UserContext";

// Seeded pseudo-random number generator (LCG) — deterministic on server & client
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// Generate a mock 6-month activity grid (26 weeks × 7 days)
// Uses a fixed seed so SSR and client produce identical values (no hydration mismatch)
function generateActivityData() {
  const rand = seededRandom(42);
  const weeks: number[][] = [];

  for (let w = 25; w >= 0; w--) {
    const week: number[] = [];
    for (let d = 0; d < 7; d++) {
      // More activity recently, simulating learning ramp-up
      const recencyBonus = Math.max(0, (26 - w) / 26);
      const r = rand();
      const activity =
        r < 0.25 ? 0 :
        r < 0.50 ? 1 :
        r < 0.70 ? 2 :
        r < 0.88 ? 3 : 4;
      week.push(Math.min(4, Math.floor(activity * (0.5 + recencyBonus * 0.7))));
    }
    weeks.push(week);
  }
  return weeks;
}

// Computed once at module load — same value on server and client (no hydration mismatch)
const ACTIVITY_DATA = generateActivityData();

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Compute visible month labels once — deterministic, no Date.now() drift
const VISIBLE_MONTHS = (() => {
  const result: { weekIdx: number; label: string }[] = [];
  // Use a fixed reference date based on ISO week to avoid locale/timezone drift
  const fixedNow = new Date("2025-05-30T00:00:00Z");
  let lastMonth = -1;
  for (let w = 0; w < 26; w++) {
    const date = new Date(fixedNow);
    date.setUTCDate(date.getUTCDate() - (25 - w) * 7);
    const month = date.getUTCMonth();
    if (month !== lastMonth) {
      result.push({ weekIdx: w, label: MONTH_LABELS[month] });
      lastMonth = month;
    }
  }
  return result;
})();

const intensityColors = [
  "rgba(255,255,255,0.04)",  // 0 — empty
  "rgba(108,99,255,0.2)",    // 1 — low
  "rgba(108,99,255,0.4)",    // 2 — medium
  "rgba(108,99,255,0.65)",   // 3 — high
  "rgba(108,99,255,0.9)",    // 4 — max
];

const intensityGlow = [
  "none",
  "none",
  "0 0 6px rgba(108,99,255,0.3)",
  "0 0 8px rgba(108,99,255,0.5)",
  "0 0 12px rgba(108,99,255,0.7)",
];

export default function ActivityTile() {
  const { stats, profile } = useUser();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const isDefaultUser = profile.displayName === "Saroj Padhi";

  // Build the dynamic grid data
  const gridData = isDefaultUser 
    ? ACTIVITY_DATA 
    : ACTIVITY_DATA.map((week) => week.map(() => 0));

  // If new user has logged study time, light up the today slot (very last cell)
  if (!isDefaultUser && stats.totalHours > 0) {
    const lastWeekIdx = gridData.length - 1;
    const lastDayIdx = gridData[lastWeekIdx].length - 1;
    gridData[lastWeekIdx][lastDayIdx] = Math.min(4, Math.max(1, Math.round(stats.xpGainedToday / 150)));
  }

  const totalContributions = isDefaultUser 
    ? ACTIVITY_DATA.flat().filter((v) => v > 0).length 
    : (stats.totalHours > 0 ? 1 : 0);

  const currentStreak = stats.streakDays;
  const visibleMonths = VISIBLE_MONTHS;

  return (
    <article
      ref={ref}
      className="relative rounded-2xl p-5 overflow-hidden card-border h-full"
      style={{ backgroundColor: "var(--bg-card)" }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 0% 100%, rgba(108,99,255,0.07) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Learning Activity
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
            <span>
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>
                {totalContributions}
              </span>{" "}
              active days
            </span>
            <span>
              <span className="font-bold" style={{ color: "var(--accent-emerald)" }}>
                {currentStreak}
              </span>{" "}
              day streak
            </span>
          </div>
        </header>

        {/* Month labels */}
        <div className="relative mb-1" style={{ paddingLeft: 32 }}>
          <div className="flex" style={{ gap: 3 }}>
            {Array.from({ length: 26 }).map((_, wIdx) => {
              const monthEntry = visibleMonths.find((m) => m.weekIdx === wIdx);
              return (
                <div
                  key={wIdx}
                  className="flex-1 text-center text-xs leading-none"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 9,
                    minWidth: 0,
                    overflow: "hidden",
                  }}
                >
                  {monthEntry ? monthEntry.label : ""}
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Grid */}
        <div className="flex gap-1">
          {/* Day labels */}
          <div
            className="flex flex-col justify-between shrink-0"
            style={{ gap: 3, width: 28, paddingTop: 2, paddingBottom: 2 }}
          >
            {DAY_LABELS.map((d, i) => (
              <span
                key={d}
                className="text-right"
                style={{
                  color: "var(--text-muted)",
                  fontSize: 9,
                  lineHeight: "12px",
                  visibility: i % 2 === 0 ? "visible" : "hidden",
                }}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex flex-1 gap-0.5 overflow-hidden">
            {gridData.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-0.5 flex-1">
                {week.map((count, dIdx) => (
                  <motion.div
                    key={dIdx}
                    className="rounded-sm flex-1"
                    style={{
                      minHeight: 10,
                      backgroundColor: intensityColors[count],
                      boxShadow: count >= 3 ? intensityGlow[count] : "none",
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={
                      isInView
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.5 }
                    }
                    transition={{
                      delay: (wIdx * 7 + dIdx) * 0.002,
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    }}
                    title={count > 0 ? `${count} session${count !== 1 ? "s" : ""} logged` : "No activity"}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: 10 }}>
            Less
          </span>
          {intensityColors.map((color, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
          <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: 10 }}>
            More
          </span>
        </div>
      </div>
    </article>
  );
}
