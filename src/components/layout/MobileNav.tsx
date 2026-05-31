"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, BookOpen, GraduationCap, BarChart2, Trophy, Settings } from "lucide-react";
import { useNav, type NavSection } from "@/lib/NavContext";

const navItems: { id: NavSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard",    label: "Home",     icon: LayoutDashboard },
  { id: "courses",      label: "Enrolled",  icon: BookOpen },
  { id: "all_courses",  label: "Catalog",  icon: GraduationCap },
  { id: "analytics",    label: "Stats",    icon: BarChart2 },
  { id: "achievements", label: "Wins",     icon: Trophy },
  { id: "settings",     label: "Settings", icon: Settings },
];

export default function MobileNav() {
  const { activeId, scrollToSection } = useNav();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe"
      style={{
        backgroundColor: "rgba(15,22,36,0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border-subtle)",
      }}
      aria-label="Mobile navigation"
    >
      <ul className="flex items-center justify-around py-2 list-none" role="list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;

          return (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className="flex flex-col items-center gap-1 px-3 py-2 relative"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "rgba(108,99,255,0.15)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <Icon
                  className="relative z-10 w-5 h-5"
                  style={{ color: isActive ? "var(--accent-primary)" : "var(--text-muted)" }}
                />
                <span
                  className="relative z-10 text-xs font-medium"
                  style={{ color: isActive ? "var(--accent-primary)" : "var(--text-muted)" }}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
