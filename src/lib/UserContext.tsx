"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export type ThemeType = "dark" | "light" | "system";

export interface UserProfile {
  displayName: string;
  email: string;
  avatar: string;
}

export interface UserNotifications {
  email: boolean;
  weeklyDigest: boolean;
  browser: boolean;
}

export interface StudentStats {
  streakDays: number;
  totalXP: number;
  level: number;
  totalHours: number;
  coursesCompleted: number;
  goalsMet: number;
  certificates: number;
  bestStreak: number;
  xpGainedToday: number;
  weeklyHours: { week: string; hours: number }[];
  dailyMinutes: { day: string; minutes: number }[];
  unlockedBadges: string[];
  courseProgress: Record<string, number>;
  enrolledCourses: string[];
}

export interface Classmate {
  rank: number;
  name: string;
  xp: number;
  active: boolean;
  avatar: string;
}

interface UserContextValue {
  profile: UserProfile;
  weeklyGoal: number;
  theme: ThemeType;
  notifications: UserNotifications;
  stats: StudentStats;
  classmates: Classmate[];
  isLoggedIn: boolean;
  isSigningOut: boolean;
  
  saveProfile: (updates: Partial<UserProfile>) => void;
  saveWeeklyGoal: (hours: number) => void;
  saveTheme: (theme: ThemeType) => void;
  saveNotifications: (updates: Partial<UserNotifications>) => void;
  
  logStudySession: (minutes: number) => void;
  completeCourseModule: () => void;
  enrollInCourse: (courseId: string) => void;
  completeChapter: (courseId: string, chapterIndex: number, totalChapters: number) => void;
  getCompletedChapters: (courseId: string) => number[];
  
  signIn: (name: string, email: string) => void;
  signOut: () => void;
  resetAll: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

const DEFAULT_PROFILE: UserProfile = {
  displayName: "Saroj Padhi",
  email: "saroj@example.com",
  avatar: "⚡",
};

const DEFAULT_NOTIFICATIONS: UserNotifications = {
  email: true,
  weeklyDigest: true,
  browser: false,
};

const DEFAULT_STATS: StudentStats = {
  streakDays: 12,
  totalXP: 3240,
  level: 12,
  totalHours: 47,
  coursesCompleted: 8,
  goalsMet: 3,
  certificates: 2,
  bestStreak: 12,
  xpGainedToday: 320,
  weeklyHours: [
    { week: "Apr 7",  hours: 3.5 },
    { week: "Apr 14", hours: 5.0 },
    { week: "Apr 21", hours: 4.0 },
    { week: "Apr 28", hours: 6.5 },
    { week: "May 5",  hours: 5.5 },
    { week: "May 12", hours: 7.0 },
    { week: "May 19", hours: 8.5 },
    { week: "May 26", hours: 6.0 },
  ],
  dailyMinutes: [
    { day: "Mon", minutes: 45 },
    { day: "Tue", minutes: 90 },
    { day: "Wed", minutes: 30 },
    { day: "Thu", minutes: 120 },
    { day: "Fri", minutes: 75 },
    { day: "Sat", minutes: 105 },
    { day: "Sun", minutes: 60 },
  ],
  unlockedBadges: ["streak-7", "react-master"],
  courseProgress: { "1": 75, "2": 42, "3": 91, "4": 28 },
  enrolledCourses: ["1", "2", "3", "4"],
};

const ZERO_STATS: StudentStats = {
  streakDays: 0,
  totalXP: 0,
  level: 1,
  totalHours: 0,
  coursesCompleted: 0,
  goalsMet: 0,
  certificates: 0,
  bestStreak: 0,
  xpGainedToday: 0,
  weeklyHours: [
    { week: "Apr 7",  hours: 0 },
    { week: "Apr 14", hours: 0 },
    { week: "Apr 21", hours: 0 },
    { week: "Apr 28", hours: 0 },
    { week: "May 5",  hours: 0 },
    { week: "May 12", hours: 0 },
    { week: "May 19", hours: 0 },
    { week: "May 26", hours: 0 },
  ],
  dailyMinutes: [
    { day: "Mon", minutes: 0 },
    { day: "Tue", minutes: 0 },
    { day: "Wed", minutes: 0 },
    { day: "Thu", minutes: 0 },
    { day: "Fri", minutes: 0 },
    { day: "Sat", minutes: 0 },
    { day: "Sun", minutes: 0 },
  ],
  unlockedBadges: [],
  courseProgress: { "1": 0, "2": 0, "3": 0, "4": 0 },
  enrolledCourses: [],
};

// Base static classmates XP levels
const BASE_CLASSMATES = [
  { name: "Alex Mercer", xp: 120, active: false, avatar: "👨‍💻" },
  { name: "Sofia Chen", xp: 80, active: false, avatar: "👩‍💻" },
  { name: "Liam O'Connor", xp: 40, active: false, avatar: "👨‍🎓" },
  { name: "Emma Watson", xp: 10, active: false, avatar: "👩‍🎓" },
];

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [weeklyGoal, setWeeklyGoal] = useState<number>(8);
  const [theme, setTheme] = useState<ThemeType>("dark");
  const [notifications, setNotifications] = useState<UserNotifications>(DEFAULT_NOTIFICATIONS);
  const [stats, setStats] = useState<StudentStats>(DEFAULT_STATS);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("dashboard_profile");
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setProfile(parsedProfile);
      }

      const storedGoal = localStorage.getItem("dashboard_weekly_goal");
      if (storedGoal) setWeeklyGoal(Number(storedGoal));

      const storedTheme = localStorage.getItem("dashboard_theme");
      if (storedTheme) setTheme(storedTheme as ThemeType);

      const storedNotifications = localStorage.getItem("dashboard_notifications");
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));

      const storedLogin = localStorage.getItem("dashboard_is_logged_in");
      if (storedLogin) setIsLoggedIn(storedLogin === "true");

      const storedStats = localStorage.getItem("dashboard_stats");
      if (storedStats) {
        const parsed = JSON.parse(storedStats);
        const storedProfileName = storedProfile ? JSON.parse(storedProfile).displayName : "Saroj Padhi";
        // Dynamic migration for legacy localStorage structures
        if (!parsed.enrolledCourses) {
          parsed.enrolledCourses = storedProfileName === "Saroj Padhi" ? ["1", "2", "3", "4"] : [];
        }
        if (!parsed.courseProgress) {
          parsed.courseProgress = storedProfileName === "Saroj Padhi" 
            ? { "1": 75, "2": 42, "3": 91, "4": 28 } 
            : { "1": 0, "2": 0, "3": 0, "4": 0 };
        }
        setStats(parsed);
      } else {
        // If logged in first time as default, set DEFAULT_STATS. 
        // If custom user logged in first time, set ZERO_STATS.
        const storedProfileName = storedProfile ? JSON.parse(storedProfile).displayName : "Saroj Padhi";
        const initialStats = storedProfileName === "Saroj Padhi" ? DEFAULT_STATS : ZERO_STATS;
        setStats(initialStats);
        localStorage.setItem("dashboard_stats", JSON.stringify(initialStats));
      }

      // Self-healing mount-time synchronization for registered users database
      const storedUsers = localStorage.getItem("dashboard_registered_users");
      const usersList = storedUsers ? JSON.parse(storedUsers) : [];

      const currentProfile = storedProfile ? JSON.parse(storedProfile) : DEFAULT_PROFILE;
      const currentStats = storedStats 
        ? JSON.parse(storedStats) 
        : (currentProfile.displayName === "Saroj Padhi" ? DEFAULT_STATS : ZERO_STATS);

      const existingIndex = usersList.findIndex((u: any) => u.email === currentProfile.email);
      if (existingIndex === -1) {
        usersList.push({
          displayName: currentProfile.displayName,
          email: currentProfile.email,
          avatar: currentProfile.avatar,
          stats: currentStats,
        });
        localStorage.setItem("dashboard_registered_users", JSON.stringify(usersList));
      }
    } catch (e) {
      console.error("Failed to load user settings:", e);
    }
  }, []);

  // Update theme helper
  const applyTheme = useCallback((targetTheme: ThemeType) => {
    const root = document.documentElement;
    if (targetTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.setAttribute("data-theme", systemTheme);
      root.className = systemTheme;
    } else {
      root.setAttribute("data-theme", targetTheme);
      root.className = targetTheme;
    }
  }, []);

  // Sync theme changes
  useEffect(() => {
    applyTheme(theme);

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme, applyTheme]);

  const saveProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem("dashboard_profile", JSON.stringify(next));

      // Sync profile change to registered users list
      const storedUsers = localStorage.getItem("dashboard_registered_users");
      if (storedUsers) {
        const usersList = JSON.parse(storedUsers);
        const userIndex = usersList.findIndex((u: any) => u.email === prev.email);
        if (userIndex !== -1) {
          usersList[userIndex].displayName = next.displayName;
          usersList[userIndex].avatar = next.avatar;
          localStorage.setItem("dashboard_registered_users", JSON.stringify(usersList));
        }
      }
      return next;
    });
  };

  const saveWeeklyGoal = (hours: number) => {
    setWeeklyGoal(hours);
    localStorage.setItem("dashboard_weekly_goal", String(hours));
  };

  const saveTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem("dashboard_theme", newTheme);
  };

  const saveNotifications = (updates: Partial<UserNotifications>) => {
    setNotifications((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem("dashboard_notifications", JSON.stringify(next));
      return next;
    });
  };

  // ── Study Progression Actions ───────────────────────────────────────────
  const logStudySession = (minutes: number) => {
    setStats((prev) => {
      const newMinutes = minutes;
      const hoursLogged = Math.round((newMinutes / 60) * 10) / 10;
      
      // 1. Add to total study hours
      const nextHours = Math.round((prev.totalHours + hoursLogged) * 10) / 10;
      
      // 2. Add to daily minutes for today (last entry)
      const nextDaily = [...prev.dailyMinutes];
      if (nextDaily.length > 0) {
        nextDaily[nextDaily.length - 1] = {
          ...nextDaily[nextDaily.length - 1],
          minutes: nextDaily[nextDaily.length - 1].minutes + newMinutes
        };
      }

      // 3. Add to weekly hours for this week (last entry)
      const nextWeekly = [...prev.weeklyHours];
      if (nextWeekly.length > 0) {
        nextWeekly[nextWeekly.length - 1] = {
          ...nextWeekly[nextWeekly.length - 1],
          hours: Math.round((nextWeekly[nextWeekly.length - 1].hours + hoursLogged) * 10) / 10
        };
      }

      // 4. Calculate earned XP (+3.3 XP per minute, e.g. 30 min = +100 XP)
      const xpEarned = Math.round(newMinutes * 3.33);
      const nextXP = prev.totalXP + xpEarned;
      const nextXPToday = prev.xpGainedToday + xpEarned;
      
      // 5. Level calculation (every 1000 XP leads to level up)
      const nextLevel = Math.floor(nextXP / 1000) + 1;

      // 6. Day streak checks
      const nextStreak = prev.streakDays === 0 ? 1 : prev.streakDays;
      const nextBest = nextStreak > prev.bestStreak ? nextStreak : prev.bestStreak;

      // 7. Badge unlocks check
      const nextBadges = [...prev.unlockedBadges];
      if (nextStreak >= 7 && !nextBadges.includes("streak-7")) {
        nextBadges.push("streak-7");
      }
      if (nextXP >= 5000 && !nextBadges.includes("system-design")) {
        nextBadges.push("system-design");
      }

      // 8. Update dynamic course progress (+15% to first incomplete course)
      const nextCourseProgress: Record<string, number> = prev.courseProgress ? { ...prev.courseProgress } : {};
      const activeCourseId = prev.enrolledCourses.find((id) => (nextCourseProgress[id] ?? 0) < 100);
      if (activeCourseId) {
        nextCourseProgress[activeCourseId] = Math.min(100, (nextCourseProgress[activeCourseId] ?? 0) + 15);
      }

      const nextState = {
        ...prev,
        totalHours: nextHours,
        dailyMinutes: nextDaily,
        weeklyHours: nextWeekly,
        totalXP: nextXP,
        xpGainedToday: nextXPToday,
        level: nextLevel,
        streakDays: nextStreak,
        bestStreak: nextBest,
        unlockedBadges: nextBadges,
        courseProgress: nextCourseProgress,
      };

      localStorage.setItem("dashboard_stats", JSON.stringify(nextState));

      // Sync stats changes to registered users list
      const storedUsers = localStorage.getItem("dashboard_registered_users");
      const usersList = storedUsers ? JSON.parse(storedUsers) : [];
      const userIndex = usersList.findIndex((u: any) => u.email === profile.email);
      if (userIndex !== -1) {
        usersList[userIndex].stats = nextState;
      } else {
        usersList.push({
          displayName: profile.displayName,
          email: profile.email,
          avatar: profile.avatar,
          stats: nextState,
        });
      }
      localStorage.setItem("dashboard_registered_users", JSON.stringify(usersList));

      return nextState;
    });
  };

  const completeCourseModule = () => {
    setStats((prev) => {
      const nextCompleted = prev.coursesCompleted + 1;
      const xpEarned = 500; // course completes gives +500 XP
      const nextXP = prev.totalXP + xpEarned;
      const nextXPToday = prev.xpGainedToday + xpEarned;
      const nextLevel = Math.floor(nextXP / 1000) + 1;
      
      // Award certificate for courses completed
      const nextCertificates = Math.floor(nextCompleted / 2) || 1;

      // Check badges
      const nextBadges = [...prev.unlockedBadges];
      if (nextCompleted >= 1 && !nextBadges.includes("react-master")) {
        nextBadges.push("react-master");
      }

      // Check goals met
      const nextGoalsMet = prev.goalsMet + 1;

      // Update dynamic course progress (complete the first incomplete course to 100%)
      const nextCourseProgress: Record<string, number> = prev.courseProgress ? { ...prev.courseProgress } : {};
      const activeCourseId = prev.enrolledCourses.find((id) => (nextCourseProgress[id] ?? 0) < 100);
      if (activeCourseId) {
        nextCourseProgress[activeCourseId] = 100;
      }

      const nextState = {
        ...prev,
        coursesCompleted: nextCompleted,
        totalXP: nextXP,
        xpGainedToday: nextXPToday,
        level: nextLevel,
        certificates: nextCertificates,
        unlockedBadges: nextBadges,
        goalsMet: nextGoalsMet,
        courseProgress: nextCourseProgress,
      };

      localStorage.setItem("dashboard_stats", JSON.stringify(nextState));

      // Sync stats changes to registered users list
      const storedUsers = localStorage.getItem("dashboard_registered_users");
      const usersList = storedUsers ? JSON.parse(storedUsers) : [];
      const userIndex = usersList.findIndex((u: any) => u.email === profile.email);
      if (userIndex !== -1) {
        usersList[userIndex].stats = nextState;
      } else {
        usersList.push({
          displayName: profile.displayName,
          email: profile.email,
          avatar: profile.avatar,
          stats: nextState,
        });
      }
      localStorage.setItem("dashboard_registered_users", JSON.stringify(usersList));

      return nextState;
    });
  };

  const enrollInCourse = (courseId: string) => {
    setStats((prev) => {
      if (prev.enrolledCourses.includes(courseId)) return prev;

      const nextEnrolled = [...prev.enrolledCourses, courseId];
      const nextCourseProgress: Record<string, number> = prev.courseProgress ? { ...prev.courseProgress } : {};
      nextCourseProgress[courseId] = 0;

      const nextState = {
        ...prev,
        enrolledCourses: nextEnrolled,
        courseProgress: nextCourseProgress,
      };

      localStorage.setItem("dashboard_stats", JSON.stringify(nextState));

      // Sync stats changes to registered users list
      const storedUsers = localStorage.getItem("dashboard_registered_users");
      const usersList = storedUsers ? JSON.parse(storedUsers) : [];
      const userIndex = usersList.findIndex((u: any) => u.email === profile.email);
      if (userIndex !== -1) {
        usersList[userIndex].stats = nextState;
      } else {
        usersList.push({
          displayName: profile.displayName,
          email: profile.email,
          avatar: profile.avatar,
          stats: nextState,
        });
      }
      localStorage.setItem("dashboard_registered_users", JSON.stringify(usersList));

      return nextState;
    });
  };

  // ── Chapter Completion ────────────────────────────────────────────────────
  const completeChapter = (courseId: string, chapterIndex: number, totalChapters: number) => {
    // Track completed chapters in separate localStorage key
    const key = `dashboard_chapters_${profile.email || "guest"}`;
    const stored = localStorage.getItem(key);
    const completedMap: Record<string, number[]> = stored ? JSON.parse(stored) : {};
    const courseChapters = completedMap[courseId] || [];

    if (courseChapters.includes(chapterIndex)) return; // already completed

    const nextChapters = [...courseChapters, chapterIndex];
    completedMap[courseId] = nextChapters;
    localStorage.setItem(key, JSON.stringify(completedMap));

    // Calculate new progress percentage
    const newProgress = Math.round((nextChapters.length / totalChapters) * 100);
    const xpEarned = 120; // XP per completed chapter

    setStats((prev) => {
      const nextCourseProgress: Record<string, number> = prev.courseProgress ? { ...prev.courseProgress } : {};
      nextCourseProgress[courseId] = newProgress;

      const nextXP = prev.totalXP + xpEarned;
      const nextXPToday = prev.xpGainedToday + xpEarned;
      const nextLevel = Math.floor(nextXP / 1000) + 1;

      // Check if course is fully completed
      const courseCompleted = newProgress >= 100;
      const nextCompleted = courseCompleted ? prev.coursesCompleted + 1 : prev.coursesCompleted;
      const nextCertificates = courseCompleted ? prev.certificates + 1 : prev.certificates;

      // Badge checks
      const nextBadges = [...prev.unlockedBadges];
      if (nextCompleted >= 1 && !nextBadges.includes("react-master")) nextBadges.push("react-master");
      if (nextXP >= 5000 && !nextBadges.includes("system-design")) nextBadges.push("system-design");

      const nextState = {
        ...prev,
        totalXP: nextXP,
        xpGainedToday: nextXPToday,
        level: nextLevel,
        courseProgress: nextCourseProgress,
        coursesCompleted: nextCompleted,
        certificates: nextCertificates,
        unlockedBadges: nextBadges,
      };

      localStorage.setItem("dashboard_stats", JSON.stringify(nextState));

      // Sync to registered users list
      const storedUsers = localStorage.getItem("dashboard_registered_users");
      const usersList = storedUsers ? JSON.parse(storedUsers) : [];
      const userIndex = usersList.findIndex((u: any) => u.email === profile.email);
      if (userIndex !== -1) {
        usersList[userIndex].stats = nextState;
      } else {
        usersList.push({ displayName: profile.displayName, email: profile.email, avatar: profile.avatar, stats: nextState });
      }
      localStorage.setItem("dashboard_registered_users", JSON.stringify(usersList));

      return nextState;
    });
  };

  const getCompletedChapters = (courseId: string): number[] => {
    if (typeof window === "undefined") return [];
    const key = `dashboard_chapters_${profile.email || "guest"}`;
    const stored = localStorage.getItem(key);
    const completedMap: Record<string, number[]> = stored ? JSON.parse(stored) : {};
    return completedMap[courseId] || [];
  };


  // ── Calculate dynamic leaderboard standings ─────────────────────────────
  const getClassmatesStandings = useCallback((): Classmate[] => {
    if (typeof window === "undefined") {
      return BASE_CLASSMATES.map((item, idx) => ({
        rank: idx + 1,
        name: item.name,
        xp: item.xp,
        active: false,
        avatar: item.avatar,
      }));
    }

    const storedUsers = localStorage.getItem("dashboard_registered_users");
    const usersList = storedUsers ? JSON.parse(storedUsers) : [];

    // Map registered users to classmate structure
    const realClassmates = usersList.map((u: any) => ({
      name: u.email === profile.email ? `You (${profile.displayName})` : u.displayName,
      xp: u.stats.totalXP,
      active: u.email === profile.email,
      avatar: u.avatar,
    }));

    // Backfill current user if not stored yet
    const hasCurrent = realClassmates.some((c: any) => c.active);
    if (!hasCurrent) {
      realClassmates.push({
        name: `You (${profile.displayName})`,
        xp: stats.totalXP,
        active: true,
        avatar: profile.avatar,
      });
    }

    // Deduplicate classmates based on dynamic name
    const uniqueClassmates: any[] = [];
    const nameSet = new Set();
    for (const c of realClassmates) {
      if (!nameSet.has(c.name)) {
        nameSet.add(c.name);
        uniqueClassmates.push(c);
      }
    }

    // Backfill remaining spaces with base classmates up to at least 5 ranks
    const mergedList = [...uniqueClassmates];
    for (const mock of BASE_CLASSMATES) {
      if (mergedList.length >= 5) break;
      if (!mergedList.some((m: any) => m.name.includes(mock.name))) {
        mergedList.push(mock);
      }
    }

    // Sort descending by XP
    const sorted = mergedList.sort((a, b) => b.xp - a.xp);

    // Assign ranks
    return sorted.map((item, idx) => ({
      rank: idx + 1,
      name: item.name,
      xp: item.xp,
      active: item.active || false,
      avatar: item.avatar,
    }));
  }, [profile, stats.totalXP]);

  const signOut = () => {
    setIsSigningOut(true);
    setTimeout(() => {
      setIsLoggedIn(false);
      setIsSigningOut(false);
      localStorage.setItem("dashboard_is_logged_in", "false");
    }, 1500);
  };

  const signIn = (name: string, email: string) => {
    const updatedProfile = {
      displayName: name || "Guest Learner",
      email: email || "guest@example.com",
      avatar: "🎓",
    };
    setProfile(updatedProfile);

    // Load registered users from local storage
    const storedUsers = localStorage.getItem("dashboard_registered_users");
    const usersList = storedUsers ? JSON.parse(storedUsers) : [];

    let updatedStats = ZERO_STATS;
    const existingUser = usersList.find((u: any) => u.email === updatedProfile.email);

    if (existingUser) {
      updatedStats = existingUser.stats;
      updatedProfile.displayName = existingUser.displayName;
      updatedProfile.avatar = existingUser.avatar;
      setProfile(updatedProfile);
    } else {
      updatedStats = updatedProfile.displayName === "Saroj Padhi" ? DEFAULT_STATS : ZERO_STATS;
      usersList.push({
        displayName: updatedProfile.displayName,
        email: updatedProfile.email,
        avatar: updatedProfile.avatar,
        stats: updatedStats,
      });
      localStorage.setItem("dashboard_registered_users", JSON.stringify(usersList));
    }

    setStats(updatedStats);
    setIsLoggedIn(true);

    localStorage.setItem("dashboard_profile", JSON.stringify(updatedProfile));
    localStorage.setItem("dashboard_is_logged_in", "true");
    localStorage.setItem("dashboard_stats", JSON.stringify(updatedStats));
  };

  const resetAll = () => {
    setProfile(DEFAULT_PROFILE);
    setWeeklyGoal(8);
    setTheme("dark");
    setNotifications(DEFAULT_NOTIFICATIONS);
    setStats(DEFAULT_STATS);
    
    localStorage.setItem("dashboard_profile", JSON.stringify(DEFAULT_PROFILE));
    localStorage.setItem("dashboard_weekly_goal", "8");
    localStorage.setItem("dashboard_theme", "dark");
    localStorage.setItem("dashboard_notifications", JSON.stringify(DEFAULT_NOTIFICATIONS));
    localStorage.setItem("dashboard_stats", JSON.stringify(DEFAULT_STATS));

    // Reset local registered users database to default
    const usersList = [{
      displayName: DEFAULT_PROFILE.displayName,
      email: DEFAULT_PROFILE.email,
      avatar: DEFAULT_PROFILE.avatar,
      stats: DEFAULT_STATS
    }];
    localStorage.setItem("dashboard_registered_users", JSON.stringify(usersList));
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        weeklyGoal,
        theme,
        notifications,
        stats,
        classmates: getClassmatesStandings(),
        isLoggedIn,
        isSigningOut,
        saveProfile,
        saveWeeklyGoal,
        saveTheme,
        saveNotifications,
        logStudySession,
        completeCourseModule,
        enrollInCourse,
        completeChapter,
        getCompletedChapters,
        signIn,
        signOut,
        resetAll,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
