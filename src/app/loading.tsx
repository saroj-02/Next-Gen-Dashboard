import { SkeletonHeroTile, SkeletonCourseCard, SkeletonActivityTile } from "@/components/ui/SkeletonCard";

export default function Loading() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Skeleton sidebar */}
      <div
        className="hidden md:block shrink-0 w-60"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderRight: "1px solid var(--border-subtle)",
        }}
      >
        <div className="p-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="skeleton rounded-xl h-9 w-9 mb-0" />
        </div>
        <div className="p-3 flex flex-col gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton rounded-xl h-10 w-full" />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Skeleton topbar */}
        <div
          className="shrink-0 flex items-center justify-between px-6 h-16 gap-4"
          style={{
            borderBottom: "1px solid var(--border-subtle)",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <div className="skeleton rounded-xl h-9 flex-1 max-w-sm" />
          <div className="flex gap-3">
            <div className="skeleton rounded-xl w-9 h-9" />
            <div className="skeleton rounded-xl w-9 h-9" />
          </div>
        </div>

        {/* Skeleton grid */}
        <div
          className="flex-1 overflow-hidden px-4 md:px-6 py-6"
          style={{ backgroundColor: "var(--bg-base)" }}
        >
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
            <div style={{ gridColumn: "span 12" }} className="md:[grid-column:span_8_/_span_8]">
              <SkeletonHeroTile />
            </div>
            <div style={{ gridColumn: "span 12" }} className="md:[grid-column:span_4_/_span_4]">
              <SkeletonActivityTile />
            </div>
            <div style={{ gridColumn: "span 12" }}>
              <div className="skeleton rounded-2xl h-20" />
            </div>
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
        </div>
      </div>
    </div>
  );
}
