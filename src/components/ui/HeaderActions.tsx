"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, X, User, LogOut, Settings, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Notification dropdown ──────────────────────────────────────────────────
interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  color: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "New lesson available",
    desc: "Advanced React Patterns — Chapter 9 is live",
    time: "2m ago",
    unread: true,
    color: "var(--accent-primary)",
  },
  {
    id: "2",
    title: "🔥 Streak milestone!",
    desc: "You've hit a 12-day learning streak",
    time: "1h ago",
    unread: true,
    color: "#F97316",
  },
  {
    id: "3",
    title: "Certificate ready",
    desc: "TypeScript Deep Dive certificate is ready to download",
    time: "3h ago",
    unread: false,
    color: "var(--accent-emerald)",
  },
  {
    id: "4",
    title: "Weekly summary",
    desc: "You studied 6.5 hours this week — great work!",
    time: "Yesterday",
    unread: false,
    color: "var(--accent-cyan)",
  },
];

export function NotificationButton() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const ref = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  const dismiss = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <div ref={ref} className="relative">
      <button
        id="notifications-btn"
        onClick={() => setOpen((o) => !o)}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-white/5"
        style={{ color: "var(--text-muted)" }}
        aria-label={`Notifications${unreadCount ? ` — ${unreadCount} unread` : ""}`}
        aria-expanded={open}
      >
        <Bell className="w-4 h-4" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--accent-rose)" }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute right-0 top-12 w-80 rounded-2xl overflow-hidden z-50"
            style={{
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.1)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Notifications
                {unreadCount > 0 && (
                  <span
                    className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: "var(--accent-primary)", color: "white" }}
                  >
                    {unreadCount}
                  </span>
                )}
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs transition-colors hover:underline"
                  style={{ color: "var(--accent-primary)", background: "none", border: "none", cursor: "pointer" }}
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <ul className="divide-y list-none" style={{ borderColor: "var(--border-subtle)" }}>
              {notifications.map((n) => (
                <motion.li
                  key={n.id}
                  layout
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-start gap-3 px-4 py-3 group relative"
                  style={{ backgroundColor: n.unread ? "rgba(108,99,255,0.04)" : "transparent" }}
                >
                  <span
                    className="mt-1 shrink-0 w-2 h-2 rounded-full"
                    style={{ backgroundColor: n.unread ? n.color : "transparent", marginTop: 6 }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                      {n.title}
                    </p>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {n.desc}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      {n.time}
                    </p>
                  </div>
                  <button
                    onClick={() => dismiss(n.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-0.5 rounded hover:bg-white/10"
                    style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
                    aria-label={`Dismiss notification: ${n.title}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.li>
              ))}
              {notifications.length === 0 && (
                <li className="px-4 py-8 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                  All caught up! 🎉
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Avatar / Profile dropdown ──────────────────────────────────────────────
import { useUser } from "@/lib/UserContext";
import { useNav } from "@/lib/NavContext";

export function AvatarButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { profile, signOut } = useUser();
  const { setIsSettingsOpen, setIsProfileOpen } = useNav();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const menuItems = [
    { icon: User, label: "View Profile", id: "profile" },
    { icon: Settings, label: "Account Settings", id: "settings" },
    { icon: LogOut, label: "Sign Out", id: "signout", danger: true },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        id="user-avatar-btn"
        onClick={() => setOpen((o) => !o)}
        className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base transition-transform hover:scale-105"
        style={{
          background: "linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))",
          color: "white",
        }}
        aria-label="User profile"
        aria-expanded={open}
      >
        {profile.avatar}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute right-0 top-12 w-56 rounded-2xl overflow-hidden z-50"
            style={{
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.1)",
            }}
          >
            {/* Profile summary */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base shrink-0"
                style={{
                  background: "linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))",
                  color: "white",
                }}
              >
                {profile.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                  {profile.displayName}
                </p>
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                  {profile.email}
                </p>
              </div>
            </div>

            {/* Menu items */}
            <ul className="p-1.5 list-none">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setOpen(false);
                        if (item.id === "profile") {
                          setIsProfileOpen(true);
                          setIsSettingsOpen(false);
                        } else if (item.id === "settings") {
                          setIsSettingsOpen(true);
                          setIsProfileOpen(false);
                        } else if (item.id === "signout") {
                          signOut();
                        }
                      }}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm transition-colors hover:bg-white/5 text-left"
                      style={{
                        color: item.danger ? "var(--accent-rose)" : "var(--text-secondary)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </span>
                      <ChevronRight className="w-3 h-3 opacity-40" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
