"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, CalendarDays, Scissors, ShoppingBag, Sparkles } from "lucide-react";

// Tape-measure ticks along the mirror frame (deterministic, no random during render).
const TICKS = Array.from({ length: 41 }, (_, i) => i);

const PATHS = [
  { href: "/shop?category=buy", icon: ShoppingBag, t: "شراء", s: "بدل كلاسيك وسليم فيت", n: "01" },
  { href: "/shop?category=rent", icon: CalendarDays, t: "إيجار", s: "سموكن العريس والمناسبات", n: "02" },
  { href: "/shop?category=boxfit", icon: Sparkles, t: "بوكس فيت", s: "قَصّة 2026 الواسعة", n: "03" },
];

export function Hero({ title, subtitle, images }: { title: string; subtitle: string; images: string[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % images.length), 4600);
    return () => clearInterval(t);
  }, [images.length]);

  const words = title.split(" ");

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#16130f] text-[#f3ede3]">
      {/* pinstripe cloth + champagne light */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(212,180,131,.07)_0_1px,transparent_1px_26px)]" />
      <div className="pointer-events-none absolute -left-40 top-0 size-[38rem] rounded-full bg-[#c9a96e]/15 blur-[140px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0d0c0b] to-transparent" />
      <motion.p
        initial={{ opacity: 0, letterSpacing: "0.6em" }}
        animate={{ opacity: 1, letterSpacing: "0.32em" }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        dir="ltr"
        className="pointer-events-none absolute inset-x-0 bottom-6 select-none text-center font-serif text-[15vw] leading-none text-[#d4b483]/[.06]"
      >
        VESTRO
      </motion.p>

      <div className="container-z relative grid min-h-[calc(100dvh-8.5rem)] items-center gap-12 py-14 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div style={{ opacity: fade }} className="relative z-10 text-center lg:text-right">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 font-serif text-sm italic tracking-[.3em] text-[#d4b483]"
          >
            <span className="h-px w-10 bg-[#d4b483]/60" /> MAISON DU COSTUME <span className="h-px w-10 bg-[#d4b483]/60" />
          </motion.p>

          <h1 className="mt-6 text-5xl leading-[1.25] sm:text-6xl lg:text-[4.6rem]">
            {words.map((w, k) => (
              <motion.span
                key={k}
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.15 + k * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className={`inline-block ${k === words.length - 1 ? "text-gold-shimmer" : "text-[#f7f3ec]"}`}
              >
                {w}&nbsp;
              </motion.span>
            ))}
          </h1>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 1 }} className="gold-rule mx-auto mt-6 w-48 origin-center lg:mr-0 lg:origin-right" />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="mx-auto mt-6 max-w-lg text-lg leading-8 text-[#cfc6b8] lg:mx-0"
          >
            {subtitle}
          </motion.p>

          {/* three ways to dress — the signature of this store */}
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {PATHS.map((p, k) => (
              <motion.div key={p.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + k * 0.12 }}>
                <Link
                  href={p.href}
                  className="group relative flex h-full flex-col items-start gap-2 overflow-hidden rounded-md border border-[#d4b483]/25 bg-white/[.03] p-4 text-right backdrop-blur transition duration-500 hover:-translate-y-1 hover:border-[#d4b483] hover:bg-[#d4b483]/10"
                >
                  <span className="absolute left-3 top-2 font-serif text-3xl italic text-[#d4b483]/20 transition group-hover:text-[#d4b483]/50">{p.n}</span>
                  <p.icon className="size-5 text-[#d4b483]" />
                  <span className="font-display text-lg font-bold text-[#f7f3ec]">{p.t}</span>
                  <span className="text-xs leading-5 text-[#a39a8d]">{p.s}</span>
                  <ArrowLeft className="mt-auto size-4 text-[#d4b483] transition group-hover:-translate-x-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* fitting-room mirror */}
        <motion.div style={{ y: yImg }} className="relative mx-auto w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.3, delay: 0.25, ease: [0.76, 0, 0.24, 1] }}
            className="relative aspect-[3/4] overflow-hidden rounded-t-[12rem] rounded-b-md border border-[#d4b483]/60 p-2"
          >
            <div className="relative size-full overflow-hidden rounded-t-[11.4rem] rounded-b-sm">
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={images[i]}
                  src={images[i]}
                  alt="VESTRO"
                  initial={{ opacity: 0, scale: 1.12 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 size-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#16130f]/70 via-transparent to-transparent" />
              {/* mirror sheen */}
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgba(255,255,255,.18)_50%,transparent_60%)] bg-[length:250%_100%] animate-shimmer" />
              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                {images.map((_, k) => (
                  <button key={k} onClick={() => setI(k)} aria-label={`صورة ${k + 1}`} className={`h-0.5 transition-all ${k === i ? "w-8 bg-[#d4b483]" : "w-4 bg-white/40"}`} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* tape measure along the side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            dir="ltr"
            className="absolute -right-7 top-14 bottom-6 hidden w-5 flex-col justify-between rounded-sm bg-[#e2c48f] py-1 shadow-lg sm:flex"
          >
            {TICKS.map((t) => (
              <span key={t} className={`block h-px bg-[#16130f] ${t % 5 === 0 ? "w-3.5" : "w-2"}`} />
            ))}
          </motion.div>

          {/* tailor's note */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            transition={{ delay: 1.3, type: "spring" }}
            className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-sm bg-[#f7f3ec] px-4 py-3 text-[#16130f] shadow-2xl sm:-left-10"
          >
            <Scissors className="size-5 text-[#8a6a3f]" />
            <span>
              <span className="block font-display text-sm font-bold">بدل مكوية وجاهزة</span>
              <span className="block text-[11px] text-[#6f665b]">مقاسات 46 — 58 • شحن لـ 27 محافظة</span>
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
