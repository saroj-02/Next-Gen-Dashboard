"use client";

import { createContext, useContext, useState, useCallback } from "react";

export type NavSection = "dashboard" | "courses" | "all_courses" | "analytics" | "achievements" | "settings";
export type SettingsTab = "profile" | "preferences";

interface NavContextValue {
  activeId: NavSection;
  setActiveId: (id: NavSection) => void;
  scrollToSection: (id: NavSection) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  settingsTab: SettingsTab;
  setSettingsTab: (tab: SettingsTab) => void;
}

const NavContext = createContext<NavContextValue | null>(null);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = useState<NavSection>("dashboard");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("profile");

  const scrollToSection = useCallback((id: NavSection) => {
    if (id === "settings") {
      setIsSettingsOpen(true);
      return;
    }
    setActiveId(id);
  }, []);

  return (
    <NavContext.Provider
      value={{
        activeId,
        setActiveId,
        scrollToSection,
        isSettingsOpen,
        setIsSettingsOpen,
        isProfileOpen,
        setIsProfileOpen,
        settingsTab,
        setSettingsTab,
      }}
    >
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used inside NavProvider");
  return ctx;
}
