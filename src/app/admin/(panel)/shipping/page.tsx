"use client";

import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { CrudPage } from "@/components/admin/crud-page";
import { ActiveChip, StatCard, api } from "@/components/admin/ui";
import { egp } from "@/lib/format";
import type { ShippingZone } from "@/lib/types";

/** One fee for every governorate in a single click. */
function BulkFee({ count }: { count: number }) {
  const [fee, setFee] = useState("");
  const [days, setDays] = useState("");
  const [busy, setBusy] = useState(false);

  const apply = async () => {
    if (fee === "" || +fee < 0) return toast.error("اكتب سعر الشحن الأول");
    setBusy(true);
    try {
      await api("/api/admin/shipping-bulk", "POST", { fee: +fee, days });
      toast.success(`تم تحديث الشحن لـ ${count} محافظة 🚚`, { description: `السعر بقى ${egp(+fee)} لكل المحافظات` });
      setTimeout(() => window.location.reload(), 700);
    } catch (e) {
      toast.error((e as Error).message);
      setBusy(false);
    }
  };

  return (
    <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-end">
      <div className="flex-1">
        <p className="flex items-center gap-2 font-extrabold"><Wand2 className="size-4 text-primary" /> سعر واحد لكل المحافظات</p>
        <p className="mt-1 text-xs text-muted">اكتب السعر ودوس تطبيق — وبعدها تقدر تعدّل أي محافظة لوحدها من الجدول</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:w-[26rem]">
        <input type="number" min={0} value={fee} onChange={(e) => setFee(e.target.value)} placeholder="السعر (ج.م)" className="input" />
        <input value={days} onChange={(e) => setDays(e.target.value)} placeholder="المدة (اختياري)" className="input" />
      </div>
      <button onClick={apply} disabled={busy} className="btn-primary px-6 py-3">
        {busy ? <Loader2 className="size-4 animate-spin" /> : "تطبيق على الكل"}
      </button>
    </div>
  );
}

export default function ShippingPage() {
  return (
    <CrudPage<ShippingZone>
      collection="shipping"
      title="الشحن والمحافظات"
      sub="حدد سعر الشحن ومدة التوصيل لكل محافظة — بيتحسب تلقائي في صفحة الدفع"
      singular="محافظة"
      defaults={{ governorate: "", fee: 60, days: "2-3 أيام", active: true }}
      searchKeys={["governorate"]}
      fields={[
        { key: "governorate", label: "المحافظة", required: true },
        { key: "fee", label: "سعر الشحن (ج.م)", type: "number", required: true },
        { key: "days", label: "مدة التوصيل", placeholder: "2-3 أيام" },
        { key: "active", label: "متاح للشحن", type: "toggle" },
      ]}
      summary={(items) => {
        const fees = items.map((i) => i.fee);
        return (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-3">
              <StatCard label="عدد المحافظات" value={String(items.length)} />
              <StatCard label="أقل سعر شحن" value={egp(fees.length ? Math.min(...fees) : 0)} />
              <StatCard label="أعلى سعر شحن" value={egp(fees.length ? Math.max(...fees) : 0)} />
            </div>
            <BulkFee count={items.length} />
          </div>
        );
      }}
      columns={[
        { label: "المحافظة", render: (z) => <b>{z.governorate}</b> },
        { label: "سعر الشحن", render: (z) => <b className="text-primary">{egp(z.fee)}</b> },
        { label: "مدة التوصيل", render: (z) => z.days },
        { label: "الحالة", render: (z) => <ActiveChip on={z.active} yes="متاح" no="متوقف" /> },
      ]}
    />
  );
}
