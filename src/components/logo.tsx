import Link from "next/link";

/** VESTRO mark: a slim eastern arch holding a golden four-point star. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 48" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="vestro-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset=".5" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <path d="M6 46V20a14 14 0 0 1 28 0v26" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M12 46V21a8 8 0 0 1 16 0v25" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity=".4" />
      <path
        d="M20 18l1.6 4.4 4.4 1.6-4.4 1.6L20 30l-1.6-4.4-4.4-1.6 4.4-1.6z"
        fill="url(#vestro-gold)"
        className="origin-[20px_24px] transition-transform duration-700 group-hover:rotate-90"
      />
      <path d="M3 46h34" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ name = "VESTRO", className = "" }: { name?: string; className?: string }) {
  return (
    <Link href="/" dir="ltr" aria-label={name} className={`group inline-flex shrink-0 items-center gap-2 leading-none sm:gap-2.5 ${className}`}>
      <LogoMark className="h-8 w-auto text-primary transition-transform duration-500 group-hover:-translate-y-0.5 sm:h-10" />
      <span className="flex flex-col items-start">
        <span className="font-serif text-xl font-semibold tracking-[.16em] text-ink transition group-hover:text-primary sm:text-[1.65rem] sm:tracking-[.22em]">
          {name}
        </span>
        {name.toUpperCase() === "VESTRO" && <span className="mt-1 hidden text-[11px] font-bold text-muted sm:block">فيسترو</span>}
      </span>
    </Link>
  );
}
