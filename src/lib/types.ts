export interface CourseMCQ {
  question: string;
  options: string[];
  answer: number; // zero-based index
}

export interface CourseTopic {
  title: string;
  description: string;
  mcqs: CourseMCQ[];
}

export interface Course {
  id: string;
  title: string;
  progress: number;
  icon_name: string;
  created_at: string;
  category?: string;
  description?: string;
  instructor?: string;
  duration?: string;
  difficulty?: "Beginner" | "Intermediate" | "Expert";
  chapters?: string[];
  topics?: CourseTopic[];
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

export interface ActivityDay {
  date: string;
  count: number;
}

export interface StatItem {
  label: string;
  value: string | number;
  unit?: string;
  icon: string;
  color: string;
}
