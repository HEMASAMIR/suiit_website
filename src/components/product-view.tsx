"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Check, Minus, Plus, RefreshCcw, ShieldCheck, ShoppingBag, Sparkles, Truck, Zap } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "./cart-context";
import { egp, fmtRentDate } from "@/lib/format";
import type { PublicProduct } from "@/lib/store";

/** YYYY-MM-DD in local time, `days` from today. */
const isoDay = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export function ProductView({ p, categoryName, whatsapp, returnDays, returnShippingFee = 0, rentDays = 3 }: { p: PublicProduct; categoryName: string; whatsapp: string; returnDays: number; returnShippingFee?: number; rentDays?: number }) {
  const { add } = useCart();
  const router = useRouter();
  const rentable = (p.rentPrice ?? 0) > 0;
  const [mode, setMode] = useState<"buy" | "rent">(rentable && p.categoryId === "cat-rent" ? "rent" : "buy");
  const [rentDate, setRentDate] = useState("");
  const [img, setImg] = useState(0);
  const [color, setColor] = useState(p.colors[0]?.name);
  const [size, setSize] = useState(p.sizes.length === 1 ? p.sizes[0] : undefined);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });
  const renting = mode === "rent" && rentable;
  const price = renting ? p.rentPrice! : p.price;
  const off = !renting && p.comparePrice && p.comparePrice > p.price ? Math.round((1 - p.price / p.comparePrice) * 100) : 0;
  const out = p.stock <= 0;

  const line = () => {
    if (p.sizes.length && !size) {
      toast.error("اختار المقاس الأول 📏");
      return false;
    }
    if (renting && !rentDate) {
      toast.error("اختار ميعاد المناسبة 📅");
      return false;
    }
    add({
      productId: p.id, slug: p.slug, name: p.name, image: p.images[0], price, qty, stock: p.stock, color, size,
      mode: renting ? "rent" : "buy", rentDate: renting ? rentDate : undefined, deposit: renting ? p.deposit ?? 0 : undefined,
    }, true);
    return true;
  };

  const waText = encodeURIComponent(
    `مرحبًا، عايز ${renting ? "أأجّر" : "أشتري"}: ${p.name} (موديل ${p.model})${color ? ` - اللون: ${color}` : ""}${size ? ` - المقاس: ${size}` : ""}${renting && rentDate ? ` - ميعاد المناسبة: ${fmtRentDate(rentDate)}` : ""} - الكمية: ${qty}`,
  );

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-[2rem] bg-surface-2"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}
          onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={img}
              src={p.images[img]}
              alt={p.name}
              initial={{ opacity: 0, rotateY: -35, scale: 1.05 }}
              animate={{ opacity: 1, rotateY: 0, scale: zoom.on ? 1.8 : 1 }}
              exit={{ opacity: 0, rotateY: 35 }}
              transition={{ duration: zoom.on ? 0.2 : 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: zoom.on ? `${zoom.x}% ${zoom.y}%` : "50% 50%", transformPerspective: 1200 }}
              className="absolute inset-0 size-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute right-4 top-4 flex flex-col gap-2">
            {p.isNew && <span className="chip bg-ink text-bg">جديد</span>}
            {off > 0 && <span className="chip bg-primary text-white">وفّر {off}%</span>}
          </div>
        </motion.div>
        {p.images.length > 1 && (
          <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto">
            {p.images.map((s, k) => (
              <button key={s + k} onClick={() => setImg(k)} className={`relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition ${k === img ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
        <p className="text-sm font-bold text-primary">{categoryName}</p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">{p.name}</h1>
        <p className="mt-2 flex flex-wrap items-center gap-2 font-serif text-sm text-muted">
          Model No. {p.model}
          {p.fit && <span className="chip bg-primary-soft font-sans text-xs font-bold text-primary"><Sparkles className="size-3" /> {p.fit}</span>}
        </p>

        {rentable && (
          <div className="mt-6 grid grid-cols-2 gap-1 rounded-2xl border-2 border-line bg-surface-2 p-1" role="tablist" aria-label="شراء أو إيجار">
            {(["buy", "rent"] as const).map((m) => (
              <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className={`relative rounded-xl py-3 text-sm font-extrabold transition ${mode === m ? "text-white" : "text-muted hover:text-ink"}`}>
                {mode === m && <motion.span layoutId="mode-pill" className="absolute inset-0 rounded-xl bg-gradient-to-l from-primary to-[#0e2c4e] shadow-lg" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="relative">{m === "buy" ? `شراء — ${egp(p.price)}` : `إيجار — ${egp(p.rentPrice!)}`}</span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-baseline gap-3">
          <AnimatePresence mode="wait">
            <motion.span key={mode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-4xl font-extrabold text-primary">
              {egp(price)}
            </motion.span>
          </AnimatePresence>
          {renting ? <span className="text-sm font-bold text-muted">لمدة {rentDays} أيام</span> : off > 0 && <span className="text-lg text-muted line-through">{egp(p.comparePrice!)}</span>}
        </div>

        <AnimatePresence>
          {renting && (
            <motion.div key="rent" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="mt-5 rounded-3xl border-2 border-dashed border-primary/40 bg-primary-soft/50 p-5">
                <label className="label flex items-center gap-2 text-sm"><CalendarDays className="size-4 text-primary" /> ميعاد المناسبة *</label>
                <input type="date" value={rentDate} min={isoDay(1)} max={isoDay(180)} onChange={(e) => setRentDate(e.target.value)} className="input" />
                {rentDate && <p className="mt-2 text-xs font-bold text-primary">📅 {fmtRentDate(rentDate)} — البدلة توصلك قبلها بيوم مكوية ومتغلفة</p>}
                <ul className="mt-4 grid gap-2 text-xs leading-6 text-muted">
                  <li>✔️ الإيجار لمدة <b className="text-ink">{rentDays} أيام</b> شامل الكي والتغليف</li>
                  {(p.deposit ?? 0) > 0 && <li>✔️ تأمين مسترد <b className="text-ink">{egp(p.deposit!)}</b> — بيرجعلك كامل لما البدلة ترجع سليمة</li>}
                  <li>✔️ تقدر تقيس البدلة وقت الاستلام قبل ما تدفع</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-6 leading-8 text-muted">{p.description}</p>

        {p.colors.length > 0 && (
          <div className="mt-8">
            <p className="label text-sm">اللون: <span className="text-ink">{color}</span></p>
            <div className="flex flex-wrap gap-3">
              {p.colors.map((c) => (
                <button key={c.name} onClick={() => setColor(c.name)} title={c.name} className={`relative grid size-11 place-items-center rounded-full border-2 transition ${color === c.name ? "scale-110 border-primary" : "border-line"}`}>
                  <span className="size-8 rounded-full shadow-inner" style={{ background: c.hex }} />
                  {color === c.name && <Check className="absolute size-4 text-white mix-blend-difference" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {p.sizes.length > 0 && (
          <div className="mt-6">
            <p className="label text-sm">المقاس</p>
            <div className="flex flex-wrap gap-2">
              {p.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`min-w-14 rounded-2xl border-2 px-4 py-2.5 text-sm font-bold transition ${size === s ? "border-primary bg-primary text-white" : "border-line hover:border-primary"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center rounded-full border-2 border-line">
            <button onClick={() => setQty((q) => Math.min(p.stock, q + 1))} className="grid size-11 place-items-center hover:text-primary"><Plus className="size-4" /></button>
            <span className="w-8 text-center font-extrabold">{qty}</span>
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-11 place-items-center hover:text-primary"><Minus className="size-4" /></button>
          </div>
          <span className={`text-sm font-bold ${out ? "text-rose-500" : p.stock <= 5 ? "text-amber-600" : "text-emerald"}`}>
            {out ? "نفدت الكمية" : p.stock <= 5 ? `باقي ${p.stock} قطع بس!` : "متوفر"}
          </span>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button disabled={out} onClick={() => line() && toast.success("اتضافت للسلة 🛍️", { description: p.name })} className="btn-ghost py-4 text-base">
            <ShoppingBag className="size-5" /> أضف للسلة
          </button>
          <button disabled={out} onClick={() => line() && router.push("/checkout")} className="btn-primary py-4 text-base">
            <Zap className="size-5" /> {renting ? "احجز الإيجار" : "اشتري الآن"}
          </button>
        </div>
        {whatsapp && (
          <a href={`https://wa.me/${whatsapp}?text=${waText}`} target="_blank" rel="noreferrer" className="btn mt-3 w-full border-2 border-[#25D366] py-3.5 text-[#1da851] hover:bg-[#25D366] hover:text-white">
            {renting ? "احجز على واتساب" : "اطلب على واتساب"}
          </a>
        )}

        <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs">
          {[
            [Truck, "شحن لكل المحافظات"],
            [ShieldCheck, "الدفع عند الاستلام"],
            [RefreshCcw, `استبدال خلال ${returnDays} يوم`],
          ].map(([Icon, t]) => {
            const I = Icon as typeof Truck;
            return (
              <div key={t as string} className="card p-4">
                <I className="mx-auto mb-2 size-5 text-primary" />
                <p className="font-bold">{t as string}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-3 flex items-start gap-2 rounded-2xl border border-dashed border-primary/40 bg-primary-soft/60 px-4 py-3 text-xs leading-6">
          <RefreshCcw className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>
            <b>افحص قبل ما تدفع:</b> لو القطعة معجبتكش وقت الاستلام، رجّعها مع المندوب وادفع{" "}
            <b className="text-primary">{returnShippingFee > 0 ? egp(returnShippingFee) : "مصاريف الشحن"}</b> بس.
          </span>
        </p>
      </motion.div>
    </div>
  );
}
