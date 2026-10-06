"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronDown, ChevronLeft, ExternalLink, LogOut, Menu, Plus, Sparkles, X } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import { NAV_GROUPS, navFor } from "./nav";
import { LogoMark } from "../logo";

function useGreeting() {
  const [g, setG] = useState<{ hello: string; date: string } | null>(null);
  useEffect(() => {
    const now = new Date();
    const h = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Africa/Cairo" }).format(now));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- time-of-day is only known on the client
    setG({
      hello: h < 12 ? "صباح الخير ☀️" : h < 18 ? "مساء النور 🌤️" : "مساء الخير 🌙",
      date: now.toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long", timeZone: "Africa/Cairo" }),
    });
  }, []);
  return g;
}

/** Fade/slide every admin card into view while scrolling (works for all pages). */
function useAutoReveal(pathname: string) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -40px 0px" },
    );
    const scan = () =>
      document.querySelectorAll("main .card:not(.reveal), main section:not(.reveal)").forEach((el, i) => {
        el.classList.add("reveal");
        (el as HTMLElement).style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
        io.observe(el);
      });
    scan();
    const mo = new MutationObserver(scan);
    const main = document.querySelector("main");
    if (main) mo.observe(main, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [pathname]);
}

/** Sidebar list: keeps the active page in view and shows a "more" hint while items are hidden below. */
function ScrollNav({ children, pathname }: { children: React.ReactNode; pathname: string }) {
  const ref = useRef<HTMLElement>(null);
  const [more, setMore] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setMore(el.scrollTop + el.clientHeight < el.scrollHeight - 8);
    const active = el.querySelector<HTMLElement>('[data-active="true"]');
    if (active) el.scrollTo({ top: Math.max(0, active.offsetTop - el.clientHeight / 2), behavior: "smooth" });
    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [pathname]);

  return (
    <div className="relative min-h-0 flex-1">
      <nav ref={ref} className="relative h-full space-y-2.5 overflow-y-auto px-3 pb-8 pt-1 [scrollbar-width:none]">
        {children}
      </nav>
      <AnimatePresence>
        {more && (
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            onClick={() => ref.current?.scrollBy({ top: 180, behavior: "smooth" })}
            className="absolute inset-x-0 bottom-0 flex h-14 items-end justify-center bg-gradient-to-t from-[#081a30] via-[#081a30]/85 to-transparent pb-2"
          >
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-[#5eead4] ring-1 ring-white/10 backdrop-blur transition hover:bg-white/20">
              أقسام كمان <ChevronDown className="size-3 animate-bounce" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AdminShell({ children, pending }: { children: React.ReactNode; pending: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const greet = useGreeting();
  const current = navFor(pathname);
  useAutoReveal(pathname);

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/login");
  };

  const Side = (
    <div className="admin-side relative flex h-full flex-col overflow-hidden text-white">
      <div className="bridal-orb pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[#14b8a6]/25 blur-[90px]" />
      <div className="bridal-orb pointer-events-none absolute -bottom-24 -left-20 size-64 rounded-full bg-[#fbbf24]/12 blur-[90px] [animation-delay:-6s]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="brand-stripe relative"><span /><span /><span /></div>

      <div className="relative px-3 pb-2 pt-3">
        <div className="flex items-center gap-3 rounded-2xl bg-white/[.05] p-2 ring-1 ring-white/10 backdrop-blur">
          <Link href="/admin" className="group flex flex-1 items-center gap-3 outline-none">
            <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[#fde68a]/15 to-[#14b8a6]/20 ring-1 ring-[#fbbf24]/30 transition duration-500 group-hover:-rotate-6 group-hover:scale-105">
              <LogoMark className="h-7 w-auto text-[#fde68a]" />
            </span>
            <span className="leading-none">
              <span className="text-gold-shimmer block font-serif text-xl tracking-[.25em]">VESTRO</span>
              <span className="mt-1.5 flex items-center gap-1 text-[9px] font-bold tracking-[.35em] text-[#5eead4]/80"><Sparkles className="size-2.5" /> ADMIN STUDIO</span>
            </span>
          </Link>
          <button onClick={() => setOpen(false)} className="grid size-8 place-items-center rounded-full bg-white/10 lg:hidden"><X className="size-4" /></button>
        </div>
      </div>

      <ScrollNav pathname={pathname}>
        {NAV_GROUPS.map((g, gi) => (
          <div key={g.title}>
            <p className="mb-1 flex items-center gap-2 px-3 text-[10px] font-extrabold tracking-wider text-white/35">
              {g.title}
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
            </p>
            <div className="space-y-0.5">
              {g.items.map((n, i) => {
                const active = current.href === n.href;
                return (
                  <motion.div key={n.href} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * (gi * 3 + i), ease: [0.22, 1, 0.36, 1] }}>
                    <Link href={n.href} data-active={active} onClick={() => setOpen(false)} className={`group relative flex items-center gap-3 rounded-xl px-2.5 py-[5px] text-sm font-bold outline-none transition duration-300 focus-visible:ring-2 focus-visible:ring-[#5eead4]/60 ${active ? "text-white" : "text-white/60 hover:bg-white/[.06] hover:text-white"}`}>
                      {active && (
                        <motion.span layoutId="admin-nav" className="absolute inset-0 overflow-hidden rounded-xl bg-gradient-to-l from-white/[.14] to-white/[.03] shadow-[0_8px_24px_-12px_rgba(20,184,166,.6)] ring-1 ring-[#fbbf24]/35" transition={{ type: "spring", stiffness: 420, damping: 34 }}>
                          <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_35%,rgba(253,230,138,.14)_50%,transparent_65%)] bg-[length:250%_100%] animate-shimmer" />
                          <span className="absolute inset-y-1.5 right-0 w-[3px] rounded-l-full bg-gradient-to-b from-[#fde68a] to-[#f59e0b] shadow-[0_0_12px_rgba(251,191,36,.8)]" />
                        </motion.span>
                      )}
                      <span className={`relative grid size-7 shrink-0 place-items-center rounded-lg transition duration-300 ${active ? "bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-[#0e2c4e] shadow-md shadow-[#f59e0b]/30" : "bg-white/[.05] text-[#5eead4]/80 ring-1 ring-white/10 group-hover:-rotate-6 group-hover:bg-[#14b8a6]/25 group-hover:text-[#5eead4]"}`}>
                        <n.icon className="size-4" />
                      </span>
                      <span className="relative flex-1 transition duration-300 group-hover:-translate-x-0.5">{n.label}</span>
                      {n.href === "/admin/orders" && pending > 0 ? (
                        <span className="relative grid min-w-5 place-items-center rounded-full bg-rose-500 px-1.5 text-[10px] font-extrabold text-white shadow-md shadow-rose-500/40">{pending}</span>
                      ) : (
                        <span className={`relative font-serif text-[8px] italic tracking-[.2em] transition duration-300 ${active ? "text-[#fde68a]/80" : "text-transparent group-hover:text-white/35"}`}>{n.kicker}</span>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </ScrollNav>

      <div className="relative border-t border-white/10 p-2.5">
        <div className="flex items-center gap-2.5 rounded-2xl bg-white/[.05] p-2.5 ring-1 ring-white/10">
          <span className="relative grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#fcd34d] to-[#f59e0b] font-extrabold text-[#0e2c4e]">
            A
            <span className="absolute -bottom-0.5 -left-0.5 size-2.5 animate-pulse rounded-full bg-emerald-400 ring-2 ring-[#0b2340]" />
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <b className="block text-[13px]">مدير المتجر</b>
            <span className="text-[10px] text-white/45">متصل الآن</span>
          </span>
          <Link href="/" target="_blank" title="عرض المتجر" className="grid size-8 place-items-center rounded-lg text-white/60 transition hover:bg-[#14b8a6]/20 hover:text-[#5eead4]"><ExternalLink className="size-4" /></Link>
          <button onClick={logout} title="تسجيل الخروج" className="grid size-8 place-items-center rounded-lg text-white/60 transition hover:bg-rose-500/20 hover:text-rose-300"><LogOut className="size-4" /></button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="soft-wash relative min-h-dvh">
      <div className="grid-lines pointer-events-none fixed inset-0 opacity-70" />
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-[17.5rem] lg:block">{Side}</aside>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 280 }} className="fixed inset-y-0 right-0 z-50 w-[17.5rem] lg:hidden">{Side}</motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="relative lg:mr-[17.5rem]">
        <header className="sticky top-0 z-30 border-b border-line bg-bg/75 backdrop-blur-xl">
          <div className="flex h-[4.5rem] items-center gap-3 px-4 sm:px-8">
            <button onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-2xl border border-line bg-surface lg:hidden"><Menu className="size-5" /></button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold">{greet?.hello ?? " "} <span className="font-bold text-muted">— أهلاً بيك في VESTRO</span></p>
              <p className="flex items-center gap-1 truncate text-xs text-muted">
                {greet?.date ?? " "}
                <ChevronLeft className="size-3" />
                <span className="font-bold text-primary">{current.label}</span>
              </p>
            </div>
            <Link href="/admin/products" className="btn-primary hidden px-4 py-2.5 text-xs md:inline-flex"><Plus className="size-4" /> منتج جديد</Link>
            <Link href="/admin/orders" title="طلبات جديدة" className="relative grid size-10 place-items-center rounded-2xl border border-line bg-surface transition hover:border-primary hover:text-primary">
              <Bell className={`size-[18px] ${pending ? "origin-top animate-[ring_2.5s_ease-in-out_infinite]" : ""}`} />
              {pending > 0 && (
                <span className="absolute -left-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-extrabold text-white ring-2 ring-bg">{pending}</span>
              )}
            </Link>
            <Link href="/" target="_blank" title="عرض المتجر" className="hidden size-10 place-items-center rounded-2xl border border-line bg-surface transition hover:border-primary hover:text-primary sm:grid"><ExternalLink className="size-[18px]" /></Link>
            <ThemeToggle />
          </div>
        </header>
        <motion.main key={pathname} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto max-w-[1400px] space-y-2 p-4 sm:p-8 lg:p-10">
          {children}
        </motion.main>
      </div>
    </div>
  );
}
