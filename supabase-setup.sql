-- ============================================
-- Next-Gen Learning — Supabase SQL Setup
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  progress integer NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  icon_name text NOT NULL DEFAULT 'BookOpen',
  created_at timestamptz DEFAULT now()
);

-- 2. Seed data
INSERT INTO courses (title, progress, icon_name) VALUES
  ('Advanced React Patterns', 75, 'Code2'),
  ('System Design Mastery',   42, 'Server'),
  ('TypeScript Deep Dive',    91, 'FileCode'),
  ('Machine Learning Basics', 28, 'Brain')
ON CONFLICT DO NOTHING;

-- 3. Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- 4. Allow public (anon) read access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'courses' AND policyname = 'Public read access'
  ) THEN
    CREATE POLICY "Public read access"
      ON courses
      FOR SELECT
      TO anon
      USING (true);
  END IF;
END $$;
