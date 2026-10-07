import Link from "next/link";

/** VESTRO mark: two jacket lapels meeting in a "V", with a champagne pocket square. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 48" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="vestro-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1dfb8" />
          <stop offset=".55" stopColor="#c9a96e" />
          <stop offset="1" stopColor="#8a6a3f" />
        </linearGradient>
      </defs>
      {/* shoulders + lapels forming a V */}
      <path d="M4 10l10-6 8 22 8-22 10 6" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M14 4l-4 14 6 4M30 4l4 14-6 4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" opacity=".45" />
      <path d="M22 26v18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      {/* buttons */}
      <circle cx="22" cy="33" r="1.4" fill="currentColor" />
      <circle cx="22" cy="39" r="1.4" fill="currentColor" />
      {/* pocket square */}
      <path
        d="M31 30h7l-1.5 4h-4z"
        fill="url(#vestro-gold)"
        className="origin-[34px_32px] transition-transform duration-700 group-hover:-rotate-12"
      />
    </svg>
  );
}

export function Logo({ name = "VESTRO", className = "" }: { name?: string; className?: string }) {
  return (
    <Link href="/" dir="ltr" aria-label={name} className={`group inline-flex shrink-0 items-center gap-2 leading-none sm:gap-2.5 ${className}`}>
      <LogoMark className="h-8 w-auto text-ink transition-transform duration-500 group-hover:-translate-y-0.5 sm:h-10" />
      <span className="flex flex-col items-start">
        <span className="font-serif text-xl font-semibold tracking-[.18em] text-ink transition group-hover:text-primary sm:text-[1.7rem] sm:tracking-[.26em]">
          {name}
        </span>
        {name.toUpperCase() === "VESTRO" && <span className="mt-1 hidden font-serif text-[10px] italic tracking-[.3em] text-primary sm:block">MAISON DU COSTUME</span>}
      </span>
    </Link>
  );
}
