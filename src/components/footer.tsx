import { FooterMark } from "./footer-mark";
import { FooterColumns } from "./footer-columns";
import { MessageCircle, RefreshCcw, ShieldCheck, Truck, Wallet } from "lucide-react";
import type { Category, Settings } from "@/lib/types";

const TRUST = [
  { icon: Truck, t: "شحن لكل المحافظات", d: "توصيل سريع لباب البيت" },
  { icon: Wallet, t: "الدفع عند الاستلام", d: "افحص طلبك الأول" },
  { icon: RefreshCcw, t: "استبدال سهل", d: "خلال أيام من الاستلام" },
  { icon: ShieldCheck, t: "تغليف أنيق", d: "كل طلب متغلف بعناية" },
];

export function Footer({ settings, categories }: { settings: Settings; categories: Category[] }) {
  const pays = ["الدفع عند الاستلام", settings.instapay && "InstaPay", settings.vodafoneCash && "فودافون كاش"].filter(Boolean) as string[];
  return (
    <footer className="relative mt-28 overflow-hidden bg-[#1a1612] text-white dark:bg-[#05111f]">
      <div className="brand-stripe"><span /><span /><span /></div>
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.04)_1px,transparent_1px)]" />
      <div className="pointer-events-none absolute -top-40 right-1/4 size-[30rem] rounded-full bg-primary/30 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 left-0 size-[26rem] rounded-full bg-[#d4b483]/10 blur-[120px]" />

      <div className="container-z relative pt-14">
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[.06] p-6 backdrop-blur-xl sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,.08)_50%,transparent_65%)] bg-[length:250%_100%] animate-shimmer" />
          <div className="relative flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-right">
            <div>
              <p className="font-serif text-sm italic tracking-[.3em] text-[#e2c48f]">STAY CLOSE</p>
              <h3 className="mt-1 text-2xl font-extrabold sm:text-3xl">خليك أول واحد يعرف <span className="text-gradient animate-shimmer">بالكوليكشن الجديد</span></h3>
              <p className="mt-2 text-sm text-white/60">عروض حصرية وخصومات بتنزل لمتابعنا الأول</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {settings.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="btn-primary px-7 py-3.5">
                  <MessageCircle className="size-4" /> تابعنا على واتساب
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noreferrer" className="btn border border-white/20 bg-white/5 px-7 py-3.5 text-white hover:-translate-y-0.5 hover:border-[#d4b483] hover:text-[#d4b483]">
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TRUST.map((x) => (
            <div key={x.t} className="group flex items-center gap-3 rounded-lg border border-white/5 bg-white/[.03] p-4 transition duration-500 hover:-translate-y-1 hover:border-[#e2c48f]/30 hover:bg-white/[.06]">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#c9a96e] to-[#16130f] shadow-lg shadow-black/20 transition duration-500 group-hover:rotate-[8deg]">
                <x.icon className="size-5 text-[#d4b483]" />
              </span>
              <span>
                <b className="block text-sm">{x.t}</b>
                <span className="text-xs text-white/50">{x.d}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <FooterColumns settings={settings} categories={categories} />

      <FooterMark name={settings.storeName} />

      <div className="relative border-t border-white/10 bg-black/10">
        <div className="container-z flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {settings.storeName}. جميع الحقوق محفوظة.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {pays.map((p) => <span key={p} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-bold text-white/70">{p}</span>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
