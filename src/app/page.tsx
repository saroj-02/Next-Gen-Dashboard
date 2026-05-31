import { Suspense } from "react";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import CoursesSection from "@/components/dashboard/CoursesSection";
import SearchBar from "@/components/ui/SearchBar";
import { NotificationButton, AvatarButton } from "@/components/ui/HeaderActions";
import {
  SkeletonHeroTile,
  SkeletonCourseCard,
  SkeletonActivityTile,
} from "@/components/ui/SkeletonCard";
import Providers from "@/components/Providers";
import SettingsModal from "@/components/dashboard/SettingsModal";
import ProfileModal from "@/components/dashboard/ProfileModal";
import LoginOverlay from "@/components/ui/LoginOverlay";

// Force dynamic rendering because CoursesSection uses cookies() via Supabase SSR
export const dynamic = "force-dynamic";

function DashboardSkeleton() {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
      {/* Hero skeleton */}
      <div style={{ gridColumn: "span 12" }} className="md:[grid-column:span_8_/_span_8]">
        <SkeletonHeroTile />
      </div>
      {/* Activity skeleton */}
      <div style={{ gridColumn: "span 12" }} className="md:[grid-column:span_4_/_span_4]">
        <SkeletonActivityTile />
      </div>
      {/* Stats skeleton */}
      <div style={{ gridColumn: "span 12" }}>
        <div className="skeleton rounded-2xl h-20" />
      </div>
      {/* Course label skeleton */}
      <div style={{ gridColumn: "span 12" }}>
        <div className="skeleton rounded h-4 w-32 mb-3" />
      </div>
      {/* Course card skeletons */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{ gridColumn: "span 12" }}
          className="sm:[grid-column:span_6_/_span_6] lg:[grid-column:span_3_/_span_3]"
        >
          <SkeletonCourseCard />
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Providers>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header
            className="shrink-0 flex items-center justify-between px-6 h-16 gap-4"
            style={{
              borderBottom: "1px solid var(--border-subtle)",
              backgroundColor: "var(--bg-surface)",
            }}
          >
            <SearchBar />

            <div className="flex items-center gap-3">
              <NotificationButton />
              <AvatarButton />
            </div>
          </header>

          {/* Scrollable dashboard content */}
          <main
            id="main-content"
            className="flex-1 overflow-y-auto px-4 md:px-6 py-6 pb-24 md:pb-6 gradient-mesh"
            style={{ backgroundColor: "var(--bg-base)" }}
          >
            <Suspense fallback={<DashboardSkeleton />}>
              <CoursesSection />
            </Suspense>
          </main>
        </div>

        {/* Mobile bottom nav */}
        <MobileNav />

        {/* Floating Settings Modal */}
        <SettingsModal />

        {/* Floating Profile Modal */}
        <ProfileModal />

        {/* Visual Auth & Logout Overlays */}
        <LoginOverlay />
      </div>
    </Providers>
  );
}
