"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

interface ProgressBarProps {
  value: number;          // 0-100
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
}

export default function ProgressBar({
  value,
  color = "var(--accent-primary)",
  height = 6,
  showLabel = true,
  label,
}: ProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          {label && (
            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              {label}
            </span>
          )}
          <AnimatedNumber value={isInView ? value : 0} />
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{
          height,
          backgroundColor: "rgba(255,255,255,0.06)",
        }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${value}%` : 0 }}
          transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}99)`,
          }}
        >
          {/* Shimmer effect on progress bar */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPosition: ["200% center", "-200% center"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1.5 }}
          />
        </motion.div>
      </div>
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 100, damping: 20 });
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = `${Math.round(v)}%`;
      }
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <span
      ref={ref}
      className="text-xs font-bold tabular-nums"
      style={{ color: "var(--accent-primary)" }}
    >
      0%
    </span>
  );
}
