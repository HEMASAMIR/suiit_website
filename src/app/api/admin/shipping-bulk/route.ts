import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { mutateDB } from "@/lib/db";
import { isAdmin, unauthorized } from "@/lib/admin-guard";

/** Set one shipping fee (and optionally delivery time) for every governorate at once. */
export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  const { fee, days } = (await req.json().catch(() => ({}))) as { fee?: number; days?: string };
  const n = Number(fee);
  if (!Number.isFinite(n) || n < 0) return NextResponse.json({ error: "اكتب سعر شحن صحيح" }, { status: 400 });

  const shipping = await mutateDB((db) => {
    db.shipping = db.shipping.map((z) => ({ ...z, fee: Math.round(n), ...(days?.trim() ? { days: days.trim() } : {}) }));
    return db.shipping;
  });
  revalidatePath("/", "layout");
  return NextResponse.json(shipping);
}
