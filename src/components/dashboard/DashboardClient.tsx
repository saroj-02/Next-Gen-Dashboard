"use client";

import { useMemo } from "react";
import BentoGrid from "@/components/dashboard/BentoGrid";
import type { Course } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/lib/SearchContext";

interface DashboardClientProps {
  courses: Course[];
}

export default function DashboardClient({ courses }: DashboardClientProps) {
  const { query } = useSearch();

  const filtered = useMemo(() => {
    if (!query.trim()) return courses;
    const q = query.toLowerCase();
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.icon_name.toLowerCase().includes(q)
    );
  }, [courses, query]);

  return (
    <>
      {/* No results state */}
      <AnimatePresence>
        {query.trim() && filtered.length === 0 && (
          <motion.div
            key="no-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl p-8 text-center card-border mb-4"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              No courses found
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              No results for &ldquo;{query}&rdquo;. Try a different search term.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <BentoGrid courses={filtered} searchQuery={query} />
    </>
  );
}
