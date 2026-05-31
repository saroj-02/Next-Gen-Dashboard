"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glowColor?: string;
  onClick?: () => void;
  as?: "article" | "section" | "div" | "li";
}

export default function GlowCard({
  children,
  className = "",
  style,
  glowColor = "rgba(108,99,255,0.2)",
  onClick,
  as: Tag = "article",
}: GlowCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.015,
        boxShadow: `0 0 32px ${glowColor}, 0 8px 32px rgba(0,0,0,0.4)`,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`relative overflow-hidden card-border grain rounded-2xl ${className}`}
      style={{
        backgroundColor: "var(--bg-card)",
        willChange: "transform",
        ...style,
      }}
    >
      {/* Gradient border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${glowColor} 0%, transparent 70%)`,
          zIndex: 1,
        }}
      />
      <Tag className="relative z-10 h-full">{children}</Tag>
    </motion.div>
  );
}
