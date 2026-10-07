"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { ArrowLeft, ArrowRight, Hand } from "lucide-react";
import { egp } from "@/lib/format";
import type { PublicProduct } from "@/lib/store";

/**
 * 3D collection ring: the cards orbit like garments on a turning rack.
 * Spins on its own, can be dragged (mouse or finger) with inertia, and
 * snaps to the next/previous piece with the arrow buttons.
 */
export function CollectionRing({ products }: { products: PublicProduct[] }) {
  const items = products.slice(0, 12);
  const n = items.length;
  const step = 360 / Math.max(n, 1);

  const rot = useMotionValue(0);
  const [card, setCard] = useState({ w: 230, h: 320 });
  const [front, setFront] = useState(0);
  const frontRef = useRef(0);
  const drag = useRef({ active: false, x: 0, v: 0, moved: 0 });
  const hovering = useRef(false);
  const snapping = useRef(false);

  useEffect(() => {
    const fit = () => {
      const w = window.innerWidth;
      setCard(w < 640 ? { w: 150, h: 210 } : w < 1024 ? { w: 190, h: 265 } : { w: 230, h: 320 });
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const radius = Math.round(card.w / 2 / Math.tan(Math.PI / Math.max(n, 3))) + 36;

  useAnimationFrame((_, delta) => {
    const d = drag.current;
    if (!d.active && !snapping.current) {
      const idle = hovering.current ? 0 : -0.007; // deg per ms
      d.v += (idle - d.v) * 0.04;
      rot.set(rot.get() + d.v * Math.min(delta, 40));
    }
    const idx = (((Math.round(-rot.get() / step) % n) + n) % n) || 0;
    if (idx !== frontRef.current) {
      frontRef.current = idx;
      setFront(idx);
    }
  });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.active) return;
      const dx = e.clientX - d.x;
      d.x = e.clientX;
      d.moved += Math.abs(dx);
      rot.set(rot.get() + dx * 0.3);
      d.v = (dx * 0.3) / 16;
    };
    const up = () => (drag.current.active = false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [rot]);

  const go = (dir: 1 | -1) => {
    snapping.current = true;
    drag.current.v = 0;
    const target = Math.round(rot.get() / step) * step - dir * step;
    animate(rot, target, { type: "spring", stiffness: 70, damping: 16, onComplete: () => (snapping.current = false) });
  };

  if (!n) return null;
  const p = items[front];

  return (
    <div className="relative">
      <div
        className="relative mx-auto flex cursor-grab select-none items-center justify-center active:cursor-grabbing [touch-action:pan-y]"
        style={{ height: card.h + 180, perspective: 1500 }}
        onPointerDown={(e) => {
          drag.current = { active: true, x: e.clientX, v: 0, moved: 0 };
        }}
        onMouseEnter={() => (hovering.current = true)}
        onMouseLeave={() => (hovering.current = false)}
      >
        {/* floor glow + reflection */}
        <div className="pointer-events-none absolute bottom-2 left-1/2 h-24 w-[min(90%,900px)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,.45),transparent_70%)] blur-xl" />
        <div className="pointer-events-none absolute bottom-10 left-1/2 h-px w-[min(80%,800px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#d4b483]/70 to-transparent" />

        <div style={{ transform: "rotateX(-7deg)", transformStyle: "preserve-3d" }} className="relative">
          <motion.div
            style={{ rotateY: rot, transformStyle: "preserve-3d", width: card.w, height: card.h }}
            className="relative"
          >
            {items.map((it, i) => {
              const isFront = i === front;
              return (
                <div
                  key={it.id}
                  className="absolute inset-0"
                  style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)`, transformStyle: "preserve-3d" }}
                >
                  <Link
                    href={`/product/${it.slug}`}
                    draggable={false}
                    onClick={(e) => drag.current.moved > 8 && e.preventDefault()}
                    className={`group relative block size-full overflow-hidden rounded-[1.6rem] border-[3px] bg-surface-2 shadow-[0_30px_60px_-25px_rgba(0,0,0,.7)] transition duration-700 ${
                      isFront ? "border-[#d4b483] brightness-100" : "border-white/70 brightness-[.62] saturate-[.8]"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.images[0]} alt={it.name} draggable={false} className="absolute inset-0 size-full object-cover transition duration-[1.2s] group-hover:scale-110" />
                    <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,.45)_50%,transparent_65%)] transition duration-[1.1s] group-hover:translate-x-full" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white [backface-visibility:hidden]">
                      <p className="line-clamp-1 text-xs font-bold sm:text-sm">{it.name}</p>
                      <p className="text-[11px] font-extrabold text-[#f1dfb8] sm:text-xs">{egp(it.price)}</p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* front piece details + controls */}
      <div className="relative z-10 mt-10 sm:mt-16 flex flex-col items-center gap-6 px-4">
        <div className="flex items-center justify-center gap-4 sm:gap-6 w-full max-w-xl">
          <button
            onClick={() => go(-1)}
            aria-label="السابق"
            className="grid size-12 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-[#16130f] active:scale-95"
          >
            <ArrowRight className="size-5" />
          </button>
          <div className="min-w-[240px] sm:min-w-[320px] min-h-[96px] flex flex-col items-center justify-center text-center px-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <p className="font-serif text-xs italic tracking-[.3em] text-[#e2c48f]">#{p.model}</p>
                <h3 className="mt-1 text-xl sm:text-2xl font-black text-white drop-shadow-md">{p.name}</h3>
                <p className="mt-1 text-lg sm:text-xl font-extrabold text-[#d4b483]">{egp(p.price)}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <button
            onClick={() => go(1)}
            aria-label="التالي"
            className="grid size-12 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-[#16130f] active:scale-95"
          >
            <ArrowLeft className="size-5" />
          </button>
        </div>
        <Link href={`/product/${p.slug}`} className="btn-primary px-9 py-3.5 text-base shadow-xl hover:scale-105 transition-all">
          شوف القطعة <ArrowLeft className="size-4" />
        </Link>
        <p className="flex items-center gap-2 text-xs sm:text-sm text-white/60 pb-2">
          <Hand className="size-4 animate-float text-[#d4b483]" /> اسحب يمين وشمال عشان تقلّب في الكوليكشن
        </p>
      </div>
    </div>
  );
}
