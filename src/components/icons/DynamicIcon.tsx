"use client";

import {
  Code2,
  Server,
  FileCode,
  Brain,
  BookOpen,
  Cpu,
  Database,
  Globe,
  Layers,
  Zap,
  Star,
  Rocket,
  Shield,
  Terminal,
  Cloud,
  GitBranch,
  Activity,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Server,
  FileCode,
  Brain,
  BookOpen,
  Cpu,
  Database,
  Globe,
  Layers,
  Zap,
  Star,
  Rocket,
  Shield,
  Terminal,
  Cloud,
  GitBranch,
  Activity,
};

interface DynamicIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function DynamicIcon({ name, className = "w-5 h-5", style }: DynamicIconProps) {
  const Icon = iconMap[name] ?? BookOpen;
  return <Icon className={className} style={style} aria-hidden="true" />;
}
