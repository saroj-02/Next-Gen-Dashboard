"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  BarChart2,
  Trophy,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useNav, type NavSection } from "@/lib/NavContext";
import { useState } from "react";

const navItems: { id: NavSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { id: "courses",      label: "My Courses",   icon: BookOpen },
  { id: "all_courses",  label: "All Courses",  icon: GraduationCap },
  { id: "analytics",    label: "Analytics",    icon: BarChart2 },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "settings",     label: "Settings",     icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { activeId, scrollToSection } = useNav();

  return (
    <motion.nav
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="hidden md:flex flex-col shrink-0 relative z-20"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderRight: "1px solid var(--border-subtle)",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 p-4 overflow-hidden"
        style={{ borderBottom: "1px solid var(--border-subtle)", height: 64 }}
      >
        <div
          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))" }}
        >
          <Zap className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="font-bold text-sm whitespace-nowrap"
              style={{ color: "var(--text-primary)" }}
            >
              Next-Gen Learning
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <ul className="flex-1 flex flex-col gap-1 p-3 list-none" role="list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;

          return (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className="relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 group text-left"
                style={{
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Animated background highlight */}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-xl nav-glow"
                    style={{ background: "rgba(108,99,255,0.15)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}

                {/* Hover background for non-active */}
                {!isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                    transition={{ duration: 0.15 }}
                  />
                )}

                <Icon
                  className="relative z-10 shrink-0 w-5 h-5"
                  style={{ color: isActive ? "var(--accent-primary)" : "inherit" }}
                />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      className="relative z-10 text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Collapse Toggle */}
      <div className="p-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center rounded-xl p-2.5 transition-colors duration-150 hover:bg-white/5"
          style={{ color: "var(--text-muted)" }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="ml-2 text-xs"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.nav>
  );
}
