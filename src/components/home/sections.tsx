"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "../motion";
import type { Category } from "@/lib/types";

function Ribbon({ words, className, reverse, arabic }: { words: string[]; className: string; reverse?: boolean; arabic?: boolean }) {
  return (
    <div dir="ltr" className={`absolute inset-x-[-5%] overflow-hidden py-3.5 shadow-xl ${className}`}>
      <div className={`flex w-max animate-marquee whitespace-nowrap [animation-duration:38s] ${reverse ? "[animation-direction:reverse]" : ""}`}>
        {[...words, ...words, ...words, ...words].map((w, i) => (
          <span key={i} className={`flex items-center px-6 ${arabic ? "text-xl font-extrabold" : "font-serif text-2xl italic tracking-widest"}`}>
            {w}
            <span className="mx-6 inline-block size-2 rotate-45 bg-[#d4b483]" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** A slim woven "garment label" strip — one calm line, not RAYA's crossing ribbons. */
export function WordMarquee() {
  return (
    <div className="relative border-y border-[#d4b483]/30 bg-surface">
      <Ribbon words={["TAILORED SUITS", "بدل للبيع", "SUIT RENTAL", "بدل للإيجار", "BOX FIT 2026", "سموكن عرسان", "SLIM FIT"]} className="relative inset-x-0 py-4 text-ink shadow-none" />
    </div>
  );
}

/** Suits on a rail: hovering a panel widens it and reveals its story. */
export function Categories({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  return (
    <Reveal>
      <div className="flex h-[34rem] flex-col gap-3 sm:h-[30rem] sm:flex-row">
        {categories.map((c, i) => (
          <Link
            key={c.id}
            href={`/shop?category=${c.slug}`}
            className="group relative min-h-0 flex-1 overflow-hidden rounded-md border border-line transition-[flex-grow] duration-700 ease-[cubic-bezier(.22,1,.36,1)] hover:flex-[2.2] sm:min-w-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.image} alt={c.name} className="absolute inset-0 size-full object-cover grayscale-[35%] transition duration-[1.2s] group-hover:scale-105 group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#16130f] via-[#16130f]/30 to-transparent" />
            <span className="absolute inset-y-6 right-5 w-px bg-[#d4b483]/40 transition-all duration-700 group-hover:bg-[#d4b483]" />
            <span dir="ltr" className="absolute left-5 top-5 font-serif text-sm italic tracking-[.3em] text-[#d4b483]">N° 0{i + 1}</span>
            <div className="absolute inset-x-0 bottom-0 p-6 pr-10 text-[#f7f3ec]">
              <p className="text-xs font-bold text-[#d4b483]">{counts[c.id] ?? 0} بدلة</p>
              <h3 className="mt-1 text-3xl">{c.name}</h3>
              <p className="mt-2 max-h-0 overflow-hidden text-sm leading-6 text-[#cfc6b8] opacity-0 transition-all duration-700 group-hover:max-h-20 group-hover:opacity-100">{c.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 border-b border-[#d4b483] pb-1 text-sm font-bold text-[#f1dfb8] transition-all group-hover:gap-4">
                اكتشف القسم <ArrowLeft className="size-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Reveal>
  );
}

export function VideoReels({ videos }: { videos: string[] }) {
  if (!videos.length) return null;
  return (
    <div className="no-scrollbar container-z flex snap-x gap-4 overflow-x-auto pb-4">
      {videos.map((v, i) => (
        <Reveal key={v} delay={i * 0.1} className="w-[70%] shrink-0 snap-center sm:w-[45%] lg:w-[calc(25%-.75rem)]">
          <div className="group relative aspect-[9/16] overflow-hidden rounded-xl border-4 border-surface bg-ink shadow-xl">
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
