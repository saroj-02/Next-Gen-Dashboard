# Next-Gen Learning — Student Dashboard

A futuristic, dark-mode student dashboard built with **Next.js 14 App Router**, **Supabase**, **Tailwind CSS**, **Framer Motion**, and **Lucide React**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/next-gen-dashboard)

---

## 🚀 Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 16.x | App Router, SSR, RSC |
| Supabase | 2.x + SSR | PostgreSQL database, server-side client |
| Tailwind CSS | 4.x | Utility-first styling |
| Framer Motion | 12.x | All animations |
| Lucide React | Latest | Icon library |
| TypeScript | 5.x | Type safety |

---

## 🏗️ Architecture

### Server / Client Component Split

The dashboard is carefully split to maximize performance:

| Component | Type | Reason |
|---|---|---|
| `app/page.tsx` | **Server** | Shell layout, triggers Suspense |
| `CoursesSection.tsx` | **Server** | Fetches Supabase data server-side — no API key exposed to browser |
| `BentoGrid.tsx` | **Client** | Drives Framer Motion stagger animations |
| `HeroTile.tsx` | **Client** | Time-based greeting, animated counters |
| `CourseCard.tsx` | **Client** | Animated progress bar, spring hover |
| `ActivityTile.tsx` | **Client** | Canvas-less SVG contribution grid |
| `Sidebar.tsx` | **Client** | `layoutId` nav highlight, collapse state |

### Data Flow

```
Browser → Next.js Server → Supabase PostgreSQL
                ↓
        React Server Component (CoursesSection)
                ↓
        Passed as props to Client Components
                ↓
        Framer Motion animations fire client-side
```

### Supabase Security

- Credentials are **only used on the server** via `@supabase/ssr`'s `createServerClient`
- The anon key is safe to use in `NEXT_PUBLIC_*` — Supabase Row Level Security (RLS) protects data
- `.env.local` is gitignored; never committed

---

## 🎬 Animation Architecture

All animations use **`transform` and `opacity` exclusively** — no layout-triggering properties — ensuring zero Cumulative Layout Shift (CLS).

| Interaction | Implementation |
|---|---|
| Tile entrance | `motion.div` with stagger via `containerVariants.staggerChildren: 0.1` |
| Card hover | `whileHover: { scale: 1.015 }` + `spring { stiffness: 300, damping: 20 }` |
| Sidebar nav | Shared `layoutId="nav-indicator"` — Framer Motion auto-animates position |
| Progress bar | `useInView` triggers fill from 0 → value with spring-eased width |
| Activity grid | Per-cell stagger `delay: index * 0.002` with spring physics |

---

## 🗄️ Database Setup

### 1. Create a Supabase Project

Go to [supabase.com](https://supabase.com) → New project → Copy your Project URL and Anon Key.

### 2. Run the SQL Schema

In your Supabase SQL Editor, run:

```sql
-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  progress integer NOT NULL DEFAULT 0,
  icon_name text NOT NULL DEFAULT 'BookOpen',
  created_at timestamptz DEFAULT now()
);

-- Seed data
INSERT INTO courses (title, progress, icon_name) VALUES
  ('Advanced React Patterns', 75, 'Code2'),
  ('System Design Mastery', 42, 'Server'),
  ('TypeScript Deep Dive', 91, 'FileCode'),
  ('Machine Learning Basics', 28, 'Brain');

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Allow public read (adjust based on your auth requirements)
CREATE POLICY "Public read access"
  ON courses FOR SELECT
  TO anon
  USING (true);
```

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Supported `icon_name` values

The following Lucide icon names are recognized by `DynamicIcon`:

`Code2` · `Server` · `FileCode` · `Brain` · `BookOpen` · `Cpu` · `Database` · `Globe` · `Layers` · `Zap` · `Star` · `Rocket` · `Shield` · `Terminal` · `Cloud` · `GitBranch` · `Activity`

---

## 🖥️ Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note**: Without Supabase credentials, the dashboard automatically falls back to mock course data so the UI is always functional.

---

## 📱 Responsive Layout

| Breakpoint | Sidebar | Grid |
|---|---|---|
| `>= 1024px` (lg) | Full sidebar with labels | 4-column bento |
| `768–1024px` (md) | Icon-only collapsed sidebar | 2-column bento |
| `< 768px` (sm) | Bottom navigation bar | Single column |

---

## 🚀 Deploying to Vercel

1. Push your code to GitHub
2. Connect the repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel Dashboard → Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Dashboard page (Server Component)
│   ├── loading.tsx         # Skeleton fallback
│   └── globals.css         # Design tokens, animations
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx     # Collapsible nav (layoutId animations)
│   │   └── MobileNav.tsx   # Bottom navigation
│   ├── dashboard/
│   │   ├── BentoGrid.tsx   # Grid + stagger orchestrator (Client)
│   │   ├── CoursesSection.tsx  # Supabase fetch (Server)
│   │   ├── HeroTile.tsx    # Welcome + stats
│   │   ├── CourseCard.tsx  # Course tile with progress
│   │   ├── ActivityTile.tsx # Contribution graph
│   │   └── StatsBar.tsx    # KPI quick stats
│   ├── ui/
│   │   ├── GlowCard.tsx    # Hover glow wrapper
│   │   ├── ProgressBar.tsx # Animated bar
│   │   └── SkeletonCard.tsx # Loading skeletons
│   └── icons/
│       └── DynamicIcon.tsx # icon_name → Lucide map
│
└── lib/
    ├── types.ts            # TypeScript interfaces
    └── supabase/
        ├── server.ts       # SSR Supabase client
        └── client.ts       # Browser Supabase client
```

---

## ⚡ Challenges & Solutions

| Challenge | Solution |
|---|---|
| Avoiding layout shifts on hover | Used `transform: scale()` exclusively, never `width`/`height` |
| Framer Motion + Server Components | Strictly kept motion components in `"use client"` files; passed data as props from Server Components |
| Icon_name dynamic rendering | Map from string → Lucide component with safe fallback |
| Supabase SSR in Next.js 14 | Used `@supabase/ssr` `createServerClient` with `cookies()` from `next/headers` |
| Progress bar animating from 0 | Combined `useInView` + `useAnimation` to trigger on scroll entry |
