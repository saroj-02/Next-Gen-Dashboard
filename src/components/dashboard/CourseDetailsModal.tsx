"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { X, BookOpen, Clock, Award, Star, CheckCircle, Plus } from "lucide-react";
import type { Course } from "@/lib/types";
import { useUser } from "@/lib/UserContext";
import DynamicIcon from "@/components/icons/DynamicIcon";
import ProgressBar from "@/components/ui/ProgressBar";
import CourseLearningModal from "./CourseLearningModal";

interface CourseDetailsModalProps {
  course: Course | null;
  onClose: () => void;
}

export default function CourseDetailsModal({ course, onClose }: CourseDetailsModalProps) {
  const { stats, enrollInCourse } = useUser();
  const modalRef = useRef<HTMLDivElement>(null);
  const [learningOpen, setLearningOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (course) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [course, onClose]);

  const isEnrolled = course ? stats.enrolledCourses.includes(course.id) : false;
  const dynamicProgress = isEnrolled && course && stats.courseProgress && stats.courseProgress[course.id] !== undefined
    ? stats.courseProgress[course.id]
    : 0;

  // Determine difficulty color
  const difficultyColors = {
    Beginner: { text: "var(--accent-emerald)", bg: "rgba(16,185,129,0.12)" },
    Intermediate: { text: "var(--accent-cyan)", bg: "rgba(34,211,238,0.12)" },
    Expert: { text: "var(--accent-primary)", bg: "rgba(108,99,255,0.12)" },
  };
  const diffStyle = difficultyColors[course?.difficulty || "Beginner"];

  // Default syllabus backfill if not specified in type
  const fallbackChapters = [
    "1. Fundamental Concepts & Environment Setup",
    "2. Developing Base Building Blocks & Modules",
    "3. Managing States & Data Pipelines",
    "4. Component Architecture & Scalable Scoping",
    "5. Secure Authentication & Middleware APIs",
    "6. Real-world Deployment & Performance optimization"
  ];
  const chapters = course?.chapters || fallbackChapters;

  // Dynamic checked statuses for chapters based on percentage progress
  const completedChaptersCount = Math.floor((dynamicProgress / 100) * chapters.length);

  // Reset learning state when modal is closed / course changes
  useEffect(() => {
    if (!course) {
      setLearningOpen(false);
    }
  }, [course]);

  return (
    <AnimatePresence>
      {course && (
        <div
          key="course-details-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="course-details-title"
        >
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#080C14]/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            ref={modalRef}
            className="relative w-full max-w-2xl rounded-3xl p-6 card-border overflow-y-auto max-h-[85vh] shadow-2xl z-10"
            style={{
              backgroundColor: "var(--bg-card)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 50px rgba(108, 99, 255, 0.12)",
            }}
          >
            {/* Glowing Top Decorator */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5 pointer-events-none"
              style={{
                background: `linear-gradient(90deg, ${diffStyle.text}, transparent)`,
              }}
            />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              <span
                className="text-[10px] font-bold py-1 px-3.5 rounded-full"
                style={{ backgroundColor: diffStyle.bg, color: diffStyle.text }}
              >
                {course.category || "General Scopes"} • {course.difficulty || "Beginner"}
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                style={{ border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}
                aria-label="Close course details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-5 flex flex-col gap-5">
              {/* Title & Icon Header block */}
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)" }}
                >
                  <DynamicIcon name={course.icon_name} className="w-6 h-6" style={{ color: diffStyle.text }} />
                </div>
                <div>
                  <h3 id="course-details-title" className="text-lg font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                    {course.title}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    Instructed by: <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>{course.instructor || "Academy Staff"}</span>
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {course.description || "Master the theoretical architecture and hands-on production code blocks required to deploy professional services in this topic catalog."}
              </p>

              {/* Syllabus / Chapters list */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-muted)" }}>
                  Curriculum Syllabus
                </h4>
                <ul className="flex flex-col gap-2 list-none p-0 m-0">
                  {chapters.map((chap, index) => {
                    const isChecked = isEnrolled && index < completedChaptersCount;
                    return (
                      <li
                        key={index}
                        className="p-2.5 rounded-xl border flex items-center gap-3 transition-colors"
                        style={{
                          borderColor: isChecked ? "rgba(16,185,129,0.15)" : "var(--border-subtle)",
                          backgroundColor: isChecked ? "rgba(16,185,129,0.02)" : "rgba(0,0,0,0.12)",
                        }}
                      >
                        <CheckCircle
                          className="w-4.5 h-4.5 shrink-0"
                          style={{ color: isChecked ? "var(--accent-emerald)" : "rgba(255,255,255,0.15)" }}
                        />
                        <span className="text-xs font-medium truncate" style={{ color: isChecked ? "var(--text-primary)" : "var(--text-secondary)" }}>
                          {chap}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "rgba(255,255,255,0.01)" }}>
                <div className="text-center">
                  <span className="text-[10px] block" style={{ color: "var(--text-muted)" }}>Duration</span>
                  <span className="text-xs font-extrabold flex items-center justify-center gap-1 mt-0.5" style={{ color: "var(--text-primary)" }}>
                    <Clock className="w-3.5 h-3.5" style={{ color: diffStyle.text }} /> {course.duration || "12 hours"}
                  </span>
                </div>
                <div className="text-center border-x" style={{ borderColor: "var(--border-subtle)" }}>
                  <span className="text-[10px] block" style={{ color: "var(--text-muted)" }}>Lessons</span>
                  <span className="text-xs font-extrabold flex items-center justify-center gap-1 mt-0.5" style={{ color: "var(--text-primary)" }}>
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> {chapters.length} Units
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] block" style={{ color: "var(--text-muted)" }}>Certification</span>
                  <span className="text-xs font-extrabold flex items-center justify-center gap-1 mt-0.5" style={{ color: "var(--text-primary)" }}>
                    <Award className="w-3.5 h-3.5 text-amber-400" /> Verified
                  </span>
                </div>
              </div>

              {/* Progress indicator or Enrollment Action */}
              <div className="pt-3.5 border-t flex items-center justify-between gap-5" style={{ borderColor: "var(--border-subtle)" }}>
                {isEnrolled ? (
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-xs font-bold mb-1.5" style={{ color: "var(--text-primary)" }}>
                      <span>Your Learning Progress</span>
                      <span style={{ color: "var(--accent-emerald)" }}>{dynamicProgress}% Completed</span>
                    </div>
                    <ProgressBar value={dynamicProgress} color="var(--accent-emerald)" height={6} showLabel={false} />
                  </div>
                ) : (
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    You are not yet enrolled in this course. Join the academy class to begin!
                  </p>
                )}

                {isEnrolled ? (
                  <button
                    onClick={() => setLearningOpen(true)}
                    className="py-2 px-5 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 text-white shrink-0"
                    style={{
                      background: "linear-gradient(135deg, var(--accent-emerald), rgba(16,185,129,0.85))",
                      border: "none",
                    }}
                  >
                    Continue Studying
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      enrollInCourse(course.id);
                      onClose();
                    }}
                    className="py-2.5 px-5 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 text-black shrink-0 flex items-center gap-1.5"
                    style={{
                      background: `linear-gradient(135deg, ${diffStyle.text}, var(--bg-card))`,
                      backgroundBlendMode: "screen",
                      backgroundColor: diffStyle.text,
                      border: "none",
                      boxShadow: `0 4px 12px ${diffStyle.bg}`,
                    }}
                  >
                    <Plus className="w-4 h-4 text-black" strokeWidth={3} /> Enroll Now
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {learningOpen && course && (
        <CourseLearningModal
          key="course-learning-modal"
          course={course}
          onClose={() => setLearningOpen(false)}
        />
      )}
    </AnimatePresence>
  );
}
