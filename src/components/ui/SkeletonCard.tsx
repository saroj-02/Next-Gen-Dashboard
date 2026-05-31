export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`skeleton rounded-2xl ${className}`}
      style={{ minHeight: 160 }}
      aria-hidden="true"
    />
  );
}

export function SkeletonHeroTile() {
  return (
    <div
      className="rounded-2xl p-6 card-border"
      style={{ backgroundColor: "var(--bg-card)", minHeight: 200 }}
      aria-hidden="true"
    >
      <div className="skeleton rounded-lg h-6 w-48 mb-4" />
      <div className="skeleton rounded-lg h-4 w-64 mb-8" />
      <div className="flex gap-3">
        <div className="skeleton rounded-xl h-16 w-24" />
        <div className="skeleton rounded-xl h-16 w-24" />
        <div className="skeleton rounded-xl h-16 w-24" />
      </div>
    </div>
  );
}

export function SkeletonCourseCard() {
  return (
    <div
      className="rounded-2xl p-5 card-border"
      style={{ backgroundColor: "var(--bg-card)", minHeight: 180 }}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="skeleton rounded-xl h-10 w-10 shrink-0" />
        <div className="flex-1">
          <div className="skeleton rounded h-4 w-3/4 mb-2" />
          <div className="skeleton rounded h-3 w-1/2" />
        </div>
      </div>
      <div className="skeleton rounded h-1.5 w-full mb-2" />
      <div className="skeleton rounded h-3 w-12 ml-auto" />
    </div>
  );
}

export function SkeletonActivityTile() {
  return (
    <div
      className="rounded-2xl p-5 card-border"
      style={{ backgroundColor: "var(--bg-card)", minHeight: 200 }}
      aria-hidden="true"
    >
      <div className="skeleton rounded h-4 w-32 mb-4" />
      <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(26, 1fr)" }}>
        {Array.from({ length: 182 }).map((_, i) => (
          <div key={i} className="skeleton rounded-sm aspect-square" />
        ))}
      </div>
    </div>
  );
}
