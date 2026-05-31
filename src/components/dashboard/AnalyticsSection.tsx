"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, Clock, BookOpen, Target, Award, Zap } from "lucide-react";
import { useUser } from "@/lib/UserContext";
import type { Course } from "@/lib/types";

// ── Helpers ────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

// Build SVG polyline points for area chart
function buildLinePath(data: number[], w: number, h: number, pad = 16) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const xs = data.map((_, i) => pad + (i / (data.length - 1)) * (w - pad * 2));
  const ys = data.map((v) => h - pad - ((v - min) / range) * (h - pad * 2));
  return { points: xs.map((x, i) => `${x},${ys[i]}`).join(" "), xs, ys };
}

// ── Sub-components ─────────────────────────────────────────────────────────

/** Animated bar chart — weekly study hours */
function WeeklyBarChart() {
  const { stats } = useUser();
  const weeklyHours = stats.weeklyHours;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const max = Math.max(...weeklyHours.map((d) => d.hours)) || 1;

  return (
    <div ref={ref} className="flex flex-col h-full">
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
        Weekly Study Hours
      </h3>
      <div className="flex items-end gap-2 flex-1 min-h-0" style={{ minHeight: 100 }}>
        {weeklyHours.map((d, i) => {
          const pct = (d.hours / max) * 100;
          return (
            <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
              {/* Value label */}
              <motion.span
                className="text-xs font-bold"
                style={{ color: "var(--accent-primary)", fontSize: 9 }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
              >
                {d.hours}h
              </motion.span>
              {/* Bar */}
              <div className="w-full rounded-t-lg relative overflow-hidden" style={{ height: 80, backgroundColor: "rgba(108,99,255,0.08)" }}>
                <motion.div
                  className="absolute bottom-0 w-full rounded-t-lg"
                  style={{
                    background: i === weeklyHours.length - 2
                      ? "linear-gradient(to top, #6C63FF, #A78BFA)"
                      : "linear-gradient(to top, rgba(108,99,255,0.5), rgba(108,99,255,0.25))",
                  }}
                  initial={{ height: "0%" }}
                  animate={inView ? { height: `${pct}%` } : { height: "0%" }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                />
              </div>
              {/* Label */}
              <span className="text-center leading-tight" style={{ color: "var(--text-muted)", fontSize: 8 }}>
                {d.week.split(" ")[0]}<br />{d.week.split(" ")[1]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Animated line/area chart — daily minutes */
function DailyLineChart() {
  const { stats } = useUser();
  const dailyMinutes = stats.dailyMinutes;
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });
  const W = 320, H = 100;
  const data = dailyMinutes.map((d) => d.minutes);
  const { points, xs, ys } = buildLinePath(data, W, H);

  // Area fill path
  const areaPath = `M ${xs[0] || 0},${H} L ${points ? points.split(" ").join(" L ") : `0,${H}`} L ${xs[xs.length - 1] || 0},${H} Z`;

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
        Daily Study Minutes (This Week)
      </h3>
      <div className="flex-1 min-h-0 relative" style={{ minHeight: 110 }}>
        <svg
          ref={ref}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: 90 }}
        >
          <defs>
            <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6C63FF" stopOpacity="0" />
            </linearGradient>
            <clipPath id="line-clip">
              <motion.rect
                x="0" y="0" height={H}
                initial={{ width: 0 }}
                animate={inView ? { width: W } : { width: 0 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              />
            </clipPath>
          </defs>

          {/* Grid lines */}
          {[25, 50, 75].map((pct) => (
            <line
              key={pct}
              x1={0} y1={H * (pct / 100)}
              x2={W} y2={H * (pct / 100)}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          ))}

          {/* Area fill */}
          <motion.path
            d={areaPath}
            fill="url(#area-grad)"
            clipPath="url(#line-clip)"
          />

          {/* Line */}
          <polyline
            points={points || ""}
            fill="none"
            stroke="#6C63FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            clipPath="url(#line-clip)"
          />

          {/* Dots */}
          {xs.map((x, i) => (
            <motion.circle
              key={i}
              cx={x} cy={ys[i] || 0} r={3}
              fill="#6C63FF"
              stroke="var(--bg-card)"
              strokeWidth={2}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 400, damping: 20 }}
            />
          ))}
        </svg>

        {/* Day labels */}
        <div className="flex justify-between mt-1" style={{ paddingLeft: 8, paddingRight: 8 }}>
          {dailyMinutes.map((d) => (
            <span key={d.day} className="text-xs" style={{ color: "var(--text-muted)", fontSize: 9 }}>
              {d.day}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Subject breakdown — animated donut chart */
interface SubjectDonutProps {
  subjects: { label: string; pct: number; color: string }[];
}

function SubjectDonut({ subjects }: SubjectDonutProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const size = 120;
  const cx = size / 2;
  const cy = size / 2;
  const r = 44;
  const circ = 2 * Math.PI * r;

  // Build stroke-dasharray segments
  let cumulative = 0;
  const segments = subjects.map((s) => {
    const start = cumulative;
    cumulative += s.pct;
    return { ...s, start };
  });

  return (
    <div ref={ref} className="flex flex-col h-full">
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
        Subject Breakdown
      </h3>
      <div className="flex items-center gap-4 flex-1">
        {/* Donut */}
        <div className="shrink-0 relative" style={{ width: size, height: size }}>
          <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size, transform: "rotate(-90deg)" }}>
            {segments.map((s, i) => {
              const dash = (s.pct / 100) * circ;
              const gap = circ - dash;
              const offset = -(s.start / 100) * circ;
              return (
                <motion.circle
                  key={s.label}
                  cx={cx} cy={cy} r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={12}
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.1 + i * 0.12, duration: 0.5 }}
                />
              );
            })}
          </svg>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{subjects.length}</span>
            <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: 9 }}>subjects</span>
          </div>
        </div>

        {/* Legend */}
        <ul className="flex-1 flex flex-col gap-1.5 list-none">
          {subjects.map((s, i) => (
            <motion.li
              key={s.label}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-xs flex-1 truncate" style={{ color: "var(--text-secondary)" }}>
                {s.label}
              </span>
              <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
                {s.pct}%
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** KPI metric cards */
function KpiGrid() {
  const { stats } = useUser();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const kpis = [
    { id: "total-hours", icon: Clock,     label: "Total Hours",       value: `${stats.totalHours}h`,  sub: "this month",   color: "#6C63FF" },
    { id: "courses-done",icon: BookOpen,  label: "Courses Completed", value: String(stats.coursesCompleted),    sub: "all time",     color: "#10B981" },
    { id: "goals",        icon: Target,   label: "Goals Met",         value: `${stats.goalsMet}/${stats.coursesCompleted + 2}`,  sub: "this month",   color: "#22D3EE" },
    { id: "streak",       icon: Zap,      label: "Best Streak",       value: `${stats.bestStreak}d`,  sub: "current",      color: "#F59E0B" },
    { id: "certs",        icon: Award,    label: "Certificates",      value: String(stats.certificates),    sub: "earned",       color: "#F43F5E" },
    { id: "trend",        icon: TrendingUp,label: "Weekly Growth",    value: stats.totalHours > 0 ? "+21%" : "+0%", sub: "vs last week", color: "#A78BFA" },
  ];

  return (
    <div ref={ref}>
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
        Key Metrics
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.id}
              className="rounded-xl p-3 flex items-center gap-3"
              style={{
                backgroundColor: `${kpi.color}12`,
                border: `1px solid ${kpi.color}25`,
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ delay: 0.05 + i * 0.07, type: "spring", stiffness: 260, damping: 22 }}
            >
              <div
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${kpi.color}20` }}
              >
                <Icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold leading-none" style={{ color: "var(--text-primary)" }}>
                  {kpi.value}
                </p>
                <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                  {kpi.label}
                </p>
                <p className="text-xs" style={{ color: `${kpi.color}cc`, fontSize: 9 }}>
                  {kpi.sub}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/** Learning pace — horizontal progress bars */
function LearningPace() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { weeklyGoal, stats } = useUser();

  const dailyMinutesLogged = stats.dailyMinutes[stats.dailyMinutes.length - 1]?.minutes || 0;
  const weeklyHoursLogged = stats.weeklyHours[stats.weeklyHours.length - 1]?.hours || 0;

  const goals = [
    { label: "Daily goal (2h)", done: Math.round((dailyMinutesLogged / 60) * 10) / 10,  total: 2,   color: "#6C63FF" },
    { label: "Weekly target",   done: weeklyHoursLogged,    total: weeklyGoal,  color: "#22D3EE" },
    { label: "Monthly quota",   done: stats.totalHours,   total: 60,  color: "#10B981" },
    { label: "Course finish",   done: stats.coursesCompleted,    total: stats.coursesCompleted + 1,   color: "#F59E0B" },
  ];

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        Learning Pace vs Goals
      </h3>
      {goals.map((g, i) => {
        const pct = Math.round((g.done / g.total) * 100);
        return (
          <div key={g.label}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{g.label}</span>
              <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
                {g.done} / {g.total}
              </span>
            </div>
            <div className="relative h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{ backgroundColor: g.color }}
                initial={{ width: "0%" }}
                animate={inView ? { width: `${pct}%` } : { width: "0%" }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.7, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-end mt-0.5">
              <span style={{ color: g.color, fontSize: 9 }} className="font-semibold">{pct}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1, y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 24 },
  },
};

interface AnalyticsSectionProps {
  courses?: Course[];
}

export default function AnalyticsSection({ courses = [] }: AnalyticsSectionProps) {
  const { stats } = useUser();
  
  const enrolledIds = stats.enrolledCourses || [];
  const enrolledCourses = courses.filter((c) => enrolledIds.includes(c.id));

  // Category counts and total progress
  const categoryWeights: Record<string, number> = {};
  const hasEnrollments = enrolledCourses.length > 0;

  if (hasEnrollments) {
    enrolledCourses.forEach((c) => {
      const progress = stats.courseProgress?.[c.id] || 0;
      // Weight is a combination of enrollment base weight (10) and actual progress (0-100)
      const weight = 10 + progress;
      const category = c.category || "Other";
      categoryWeights[category] = (categoryWeights[category] || 0) + weight;
    });
  }

  const defaultSubjects = [
    { label: "Web Development",      pct: 30, color: "#6C63FF" },
    { label: "Software Development", pct: 25, color: "#22D3EE" },
    { label: "Data Analysis",        pct: 20, color: "#10B981" },
    { label: "AI & Gen AI",          pct: 15, color: "#F59E0B" },
    { label: "Android Development",  pct: 10, color: "#A855F7" },
  ];

  let computedSubjects = defaultSubjects;

  if (hasEnrollments) {
    const totalWeight = Object.values(categoryWeights).reduce((a, b) => a + b, 0);
    const categoryColors: Record<string, string> = {
      "Web Development":      "#6C63FF",
      "Software Development": "#22D3EE",
      "Data Analysis":        "#10B981",
      "AI & Gen AI":          "#F59E0B",
      "Android Development":  "#A855F7",
      "Design":               "#F43F5E",
    };

    const rawSubjects = Object.entries(categoryWeights).map(([category, weight]) => {
      const pct = Math.round((weight / totalWeight) * 100);
      return {
        label: category,
        pct,
        color: categoryColors[category] || "#F43F5E",
      };
    });

    rawSubjects.sort((a, b) => b.pct - a.pct);

    const sum = rawSubjects.reduce((a, b) => a + b.pct, 0);
    if (sum !== 100 && rawSubjects.length > 0) {
      const diff = 100 - sum;
      rawSubjects[0].pct += diff;
    }

    computedSubjects = rawSubjects;
  }

  return (
    <section id="section-analytics" aria-label="Analytics">
      {/* Section header */}
      <motion.div variants={sectionVariants} className="mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
        <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Analytics
        </h2>
      </motion.div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(12, 1fr)" }}
      >
        {/* KPI cards — full width */}
        <motion.div variants={sectionVariants} style={{ gridColumn: "span 12 / span 12" }}>
          <div
            className="rounded-2xl p-5 card-border"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <KpiGrid />
          </div>
        </motion.div>

        {/* Weekly Bar Chart */}
        <motion.div
          variants={sectionVariants}
          style={{ gridColumn: "span 12 / span 12" }}
          className="md:[grid-column:span_7_/_span_7]"
        >
          <div className="rounded-2xl p-5 card-border h-full" style={{ backgroundColor: "var(--bg-card)" }}>
            <WeeklyBarChart />
          </div>
        </motion.div>

        {/* Subject Donut */}
        <motion.div
          variants={sectionVariants}
          style={{ gridColumn: "span 12 / span 12" }}
          className="md:[grid-column:span_5_/_span_5]"
        >
          <div className="rounded-2xl p-5 card-border h-full" style={{ backgroundColor: "var(--bg-card)" }}>
            <SubjectDonut subjects={computedSubjects} />
          </div>
        </motion.div>

        {/* Daily Line Chart */}
        <motion.div
          variants={sectionVariants}
          style={{ gridColumn: "span 12 / span 12" }}
          className="md:[grid-column:span_7_/_span_7]"
        >
          <div className="rounded-2xl p-5 card-border h-full" style={{ backgroundColor: "var(--bg-card)" }}>
            <DailyLineChart />
          </div>
        </motion.div>

        {/* Learning Pace */}
        <motion.div
          variants={sectionVariants}
          style={{ gridColumn: "span 12 / span 12" }}
          className="md:[grid-column:span_5_/_span_5]"
        >
          <div className="rounded-2xl p-5 card-border h-full" style={{ backgroundColor: "var(--bg-card)" }}>
            <LearningPace />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
