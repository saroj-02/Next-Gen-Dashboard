"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Course } from "@/lib/types";
import HeroTile from "./HeroTile";
import CourseCard from "./CourseCard";
import ActivityTile from "./ActivityTile";
import StatsBar from "./StatsBar";
import AnalyticsSection from "./AnalyticsSection";
import AchievementsSection from "./AchievementsSection";
import { useUser } from "@/lib/UserContext";
import { useState, useMemo } from "react";
import CourseDetailsModal from "./CourseDetailsModal";
import { useNav } from "@/lib/NavContext";

interface BentoGridProps {
  courses: Course[];
  searchQuery?: string;
}

export default function BentoGrid({ courses, searchQuery = "" }: BentoGridProps) {
  const { stats } = useUser();
  const { activeId, scrollToSection } = useNav();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const enrolledCourses = stats?.enrolledCourses ?? [];
  const enrolled = courses.filter((c) => enrolledCourses.includes(c.id));

  // Category filter for the catalog (All Courses tab)
  const filteredCatalog = useMemo(() => {
    let result = courses;
    if (selectedCategory !== "All") {
      result = result.filter((c) => c.category === selectedCategory);
    }
    return result;
  }, [courses, selectedCategory]);

  return (
    <div className="h-full min-h-[70vh]">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="h-full"
        >
          {/* 1. DASHBOARD VIEW (HOME) */}
          {activeId === "dashboard" && (
            <div
              className="grid gap-4 h-full"
              style={{
                gridTemplateColumns: "repeat(12, 1fr)",
                gridAutoRows: "auto",
              }}
            >
              {/* Hero Tile — spans full width on mobile, 8 cols on desktop */}
              <div
                style={{ gridColumn: "span 12 / span 12" }}
                className="md:[grid-column:span_8_/_span_8] lg:[grid-column:span_8_/_span_8]"
                id="section-dashboard"
              >
                <HeroTile />
              </div>

              {/* Activity Tile — right side of hero row */}
              <div
                style={{ gridColumn: "span 12 / span 12" }}
                className="md:[grid-column:span_4_/_span_4]"
              >
                <ActivityTile />
              </div>

              {/* Stats Bar — full width */}
              <div style={{ gridColumn: "span 12 / span 12" }}>
                <StatsBar />
              </div>

              {/* Active Courses Row */}
              <div style={{ gridColumn: "span 12 / span 12" }} className="mt-2">
                <h2
                  className="text-sm font-semibold uppercase tracking-wider mb-2.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Active Enrolled Courses
                </h2>

                {enrolled.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin">
                    {enrolled.map((course, i) => (
                      <div key={course.id} className="min-w-[280px] w-[280px] shrink-0">
                        <CourseCard course={course} index={i} onClick={() => setSelectedCourse(course)} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="rounded-2xl p-8 text-center card-border"
                    style={{ backgroundColor: "var(--bg-card)" }}
                  >
                    <p className="text-2xl mb-2">📚</p>
                    <p className="text-sm font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                      No enrolled courses yet
                    </p>
                    <p className="text-xs max-w-sm mx-auto mb-4" style={{ color: "var(--text-muted)" }}>
                      You are not enrolled in any courses yet. Browse the full Academy Catalog to select and enroll in 26+ premium modules!
                    </p>
                    <button
                      onClick={() => scrollToSection("all_courses")}
                      className="px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer hover:opacity-90 active:scale-95 transition-all text-white"
                      style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))" }}
                    >
                      Browse Catalog
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. MY ENROLLED COURSES VIEW */}
          {activeId === "courses" && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                  My Enrolled Courses
                </h1>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Manage and continue your active study paths.
                </p>
              </div>

              {enrolled.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {enrolled.map((course, i) => (
                    <CourseCard key={course.id} course={course} index={i} onClick={() => setSelectedCourse(course)} />
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-2xl p-12 text-center card-border max-w-lg mx-auto mt-6"
                  style={{ backgroundColor: "var(--bg-card)" }}
                >
                  <p className="text-4xl mb-4">🎓</p>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                    No Active Enrollments
                  </h3>
                  <p className="text-xs mb-6 max-w-md mx-auto" style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    Your learning timeline is ready! Jump into our 26+ curriculum pathways spanning Web Dev, Software Dev, Android Compose, Data Analysis, and AI & Gen AI.
                  </p>
                  <button
                    onClick={() => scrollToSection("all_courses")}
                    className="px-5 py-2.5 text-xs font-bold rounded-xl cursor-pointer transition-all shadow-md text-white hover:opacity-90 active:scale-95"
                    style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))" }}
                  >
                    Browse All Courses
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3. ALL COURSES CATALOG VIEW */}
          {activeId === "all_courses" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Academy Course Catalog
                </h1>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Explore and enroll in 60+ high-fidelity software engineering, design, and AI specialties.
                </p>
              </div>

              {/* Custom Horizontal Category Pills */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none shrink-0">
                {["All", "Web Development", "Software Development", "Data Analysis", "AI & Gen AI", "Android Development", "Design"].map((category) => {
                  const isSelected = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border"
                      style={{
                        backgroundColor: isSelected ? "var(--accent-primary)" : "transparent",
                        borderColor: isSelected ? "var(--accent-primary)" : "var(--border-subtle)",
                        color: isSelected ? "white" : "var(--text-secondary)",
                      }}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* Course Directory Grid */}
              {filteredCatalog.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredCatalog.map((course, i) => {
                    const isEnrolled = enrolledCourses.includes(course.id);
                    return (
                      <CourseCard
                        key={course.id}
                        course={course}
                        index={i}
                        isCatalog={!isEnrolled}
                        onClick={() => setSelectedCourse(course)}
                      />
                    );
                  })}
                </div>
              ) : (
                <div
                  className="rounded-2xl p-12 text-center card-border"
                  style={{ backgroundColor: "var(--bg-card)" }}
                >
                  <p className="text-2xl mb-2">🔍</p>
                  <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                    No matching catalog courses
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    No results for category &ldquo;{selectedCategory}&rdquo; matching your search input.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 4. ANALYTICS VIEW */}
          {activeId === "analytics" && (
            <div className="flex flex-col gap-6" id="section-analytics">
              <div>
                <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                  Learning Metrics & Analytics
                </h1>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Examine your weekly study logs, progress trackers, and domain coverage.
                </p>
              </div>
              <AnalyticsSection courses={courses} />
            </div>
          )}

          {/* 5. ACHIEVEMENTS VIEW */}
          {activeId === "achievements" && (
            <div className="flex flex-col gap-6" id="section-achievements">
              <div>
                <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                  Scholastic Milestones
                </h1>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Inspect your completed badges, study streaks, and earned credentials.
                </p>
              </div>
              <AchievementsSection />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Course Details Modal Overlay */}
      <CourseDetailsModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </div>
  );
}
