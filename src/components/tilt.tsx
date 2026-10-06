"use client";

import { useEffect, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Gentle 3D tilt + soft glare that follows the mouse.
 * Only on devices with a real mouse; on phones it renders flat.
 */
export function Tilt({ children, className = "", max = 6 }: { children: React.ReactNode; className?: string; max?: number }) {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(window.matchMedia("(hover: hover) and (pointer: fine)").matches), []);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 140, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 140, damping: 18 });
  const gx = useTransform(mx, (v) => `${v * 100}%`);
  const gy = useTransform(my, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,.22), transparent 50%)`;

  return (
    <motion.div
      className={`group/tilt ${className}`}
      style={on ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
      onMouseMove={(e) => {
        if (!on) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
    >
      {children}
      {on && (
        <motion.div
          style={{ background: glare }}
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition duration-500 group-hover/tilt:opacity-100"
        />
      )}
    </motion.div>
  );
}
