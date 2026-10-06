"use client";

import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "../motion";
import type { Category } from "@/lib/types";

function Ribbon({ words, className, reverse, arabic }: { words: string[]; className: string; reverse?: boolean; arabic?: boolean }) {
  return (
    <div dir="ltr" className={`absolute inset-x-[-5%] overflow-hidden py-3.5 shadow-xl ${className}`}>
      <div className={`flex w-max animate-marquee whitespace-nowrap [animation-duration:38s] ${reverse ? "[animation-direction:reverse]" : ""}`}>
        {[...words, ...words, ...words, ...words].map((w, i) => (
          <span key={i} className={`flex items-center px-6 ${arabic ? "text-xl font-extrabold" : "font-serif text-2xl italic tracking-widest"}`}>
            {w}
            <span className="mx-6 inline-block size-2 rotate-45 bg-[#fbbf24]" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** Two ribbons crossing in an X, scrolling in opposite directions. */
export function WordMarquee() {
  return (
    <div className="relative h-32 overflow-hidden sm:h-36">
      <Ribbon words={["بدل للبيع", "بدل للإيجار", "بوكس فيت", "سموكن عرسان", "سليم فيت", "شياكة كل مناسبة"]} arabic reverse className="top-10 rotate-2 bg-[#0e2c4e] text-white/90" />
      <Ribbon words={["TAILORED SUITS", "SUIT RENTAL", "BOX FIT", "TUXEDO", "SLIM FIT", "GENTLEMAN STYLE"]} className="top-10 z-10 -rotate-2 bg-primary text-white" />
    </div>
  );
}

function CategoryCard({ c, count, i }: { c: Category; count: number; i: number }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useSpring(useTransform(my, [0, 1], [9, -9]), { stiffness: 150, damping: 16 });
  const rotY = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 150, damping: 16 });
  const gx = useTransform(mx, (v) => `${v * 100}%`);
  const gy = useTransform(my, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,.35), transparent 45%)`;

  return (
    <motion.div
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1100 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => { mx.set(0.5); my.set(0.5); }}
      className={i === 1 ? "sm:mt-14" : ""}
    >
      <Link href={`/shop?category=${c.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-[2.25rem] shadow-[0_30px_60px_-30px_rgba(14,44,78,.6)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.image} alt={c.name} className="absolute inset-0 size-full object-cover transition duration-[1.4s] group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e2c4e]/90 via-black/10 to-transparent" />
        <motion.div style={{ background: glare }} className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100" />
        <span className="absolute left-5 top-4 font-serif text-6xl font-bold text-white/25 transition duration-500 group-hover:text-[#fbbf24]/80">0{i + 1}</span>
        <span className="absolute right-5 top-5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur">{count} منتج</span>
        <div className="absolute inset-x-0 bottom-0 p-7 text-white">
          <h3 className="text-4xl font-extrabold">{c.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-white/75">{c.description}</p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-[#0e2c4e] transition duration-500 group-hover:gap-4 group-hover:bg-[#fbbf24]">
            تسوق القسم <ArrowLeft className="size-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function Categories({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  return (
    <Stagger className="grid gap-6 sm:grid-cols-3">
      {categories.map((c, i) => (
        <StaggerItem key={c.id}>
          <CategoryCard c={c} count={counts[c.id] ?? 0} i={i} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function VideoReels({ videos }: { videos: string[] }) {
  if (!videos.length) return null;
  return (
    <div className="no-scrollbar container-z flex snap-x gap-4 overflow-x-auto pb-4">
      {videos.map((v, i) => (
        <Reveal key={v} delay={i * 0.1} className="w-[70%] shrink-0 snap-center sm:w-[45%] lg:w-[calc(25%-.75rem)]">
          <div className="group relative aspect-[9/16] overflow-hidden rounded-[2rem] border-4 border-surface bg-ink shadow-xl">
            <video src={v} autoPlay muted loop playsInline preload="metadata" className="size-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
              <p className="font-serif text-sm italic">VESTRO Reels</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
