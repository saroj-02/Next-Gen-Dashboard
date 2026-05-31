"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Course } from "@/lib/types";
import DynamicIcon from "@/components/icons/DynamicIcon";
import ProgressBar from "@/components/ui/ProgressBar";
import { useUser } from "@/lib/UserContext";
import { useState } from "react";
import CourseLearningModal from "./CourseLearningModal";

// Deterministic color palette based on index
const cardAccents = [
  { color: "var(--accent-primary)", glow: "rgba(108,99,255,0.2)", bg: "rgba(108,99,255,0.08)" },
  { color: "var(--accent-cyan)",    glow: "rgba(34,211,238,0.2)",  bg: "rgba(34,211,238,0.07)" },
  { color: "var(--accent-emerald)", glow: "rgba(16,185,129,0.2)",  bg: "rgba(16,185,129,0.07)" },
  { color: "var(--accent-amber)",   glow: "rgba(245,158,11,0.2)",  bg: "rgba(245,158,11,0.07)" },
  { color: "var(--accent-rose)",    glow: "rgba(244,63,94,0.2)",   bg: "rgba(244,63,94,0.07)" },
];

interface CourseCardProps {
  course: Course;
  index: number;
  isCatalog?: boolean;
  onClick?: () => void;
}

function getProgressLabel(progress: number): string {
  if (progress >= 90) return "Almost done!";
  if (progress >= 70) return "Great progress";
  if (progress >= 40) return "Keep going";
  if (progress >= 10) return "Just started";
  return "Not started";
}

export default function CourseCard({ course, index, isCatalog = false, onClick }: CourseCardProps) {
  const { stats, enrollInCourse } = useUser();
  const [learningOpen, setLearningOpen] = useState(false);
  const dynamicProgress = stats.courseProgress && stats.courseProgress[course.id] !== undefined
    ? stats.courseProgress[course.id]
    : course.progress;
  const accent = cardAccents[index % cardAccents.length];

  return (
    <motion.article
      onClick={onClick}
      whileHover={{
        scale: 1.015,
        boxShadow: `0 0 32px ${accent.glow}, 0 8px 32px rgba(0,0,0,0.4)`,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative rounded-2xl p-5 overflow-hidden card-border h-full group cursor-pointer"
      style={{
        backgroundColor: "var(--bg-card)",
        willChange: "transform",
      }}
    >
      {/* Gradient mesh background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 100% 0%, ${accent.bg} 0%, transparent 65%)`,
        }}
      />

      {/* Top border accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent.color}, transparent)` }}
      />

      <div className="relative z-10 flex flex-col h-full gap-4">
        {/* Header */}
        <header className="flex items-start gap-3">
          {/* Icon */}
          <motion.div
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: accent.bg, border: `1px solid ${accent.color}30` }}
            whileHover={{ rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <DynamicIcon
              name={course.icon_name}
              className="w-5 h-5"
              style={{ color: accent.color }}
            />
          </motion.div>

          <div className="flex-1 min-w-0">
            <h2
              className="font-semibold text-sm leading-tight line-clamp-2"
              style={{ color: "var(--text-primary)" }}
            >
              {course.title}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {isCatalog ? "Available Course" : getProgressLabel(dynamicProgress)}
            </p>
          </div>
        </header>

        {/* Progress / Enrollment */}
        <div className="mt-auto flex flex-col gap-3">
          {isCatalog ? (
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: `0 0 16px ${accent.glow}` }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-black"
              style={{
                background: `linear-gradient(135deg, ${accent.color}, var(--bg-card))`,
                backgroundBlendMode: "screen",
                backgroundColor: accent.color,
                cursor: "pointer",
                boxShadow: `0 4px 12px ${accent.glow}`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                enrollInCourse(course.id);
              }}
              aria-label={`Enroll in ${course.title}`}
            >
              Enroll in Course
            </motion.button>
          ) : (
            <>
              <ProgressBar
                value={dynamicProgress}
                color={accent.color}
                height={5}
                showLabel={true}
              />

              {/* Continue button — slides up on hover */}
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                whileHover={{ scale: 1.02 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{
                  backgroundColor: accent.bg,
                  border: `1px solid ${accent.color}40`,
                  color: accent.color,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setLearningOpen(true);
                }}
                aria-label={`Continue ${course.title}`}
              >
                Continue
                <ArrowRight className="w-3 h-3" />
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Learning Modal */}
      <CourseLearningModal
        course={learningOpen ? course : null}
        onClose={() => setLearningOpen(false)}
      />
    </motion.article>
  );
}
