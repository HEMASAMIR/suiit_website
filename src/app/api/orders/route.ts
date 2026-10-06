import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CUSTOMER_COOKIE, verifyCustomerToken } from "@/lib/auth";
import { mutateDB, readDB, uid } from "@/lib/db";
import { couponDiscount, findCoupon } from "@/lib/orders";
import type { Order, PaymentMethod } from "@/lib/types";

type Body = {
  customer: Order["customer"];
  items: { productId: string; qty: number; color?: string; size?: string; mode?: "buy" | "rent"; rentDate?: string }[];
  couponCode?: string;
  paymentMethod: PaymentMethod;
};

const PHONE = /^01[0125]\d{8}$/;

/** Rental occasion must be a real date between tomorrow and ~6 months ahead. */
function isRentDate(d?: string) {
  if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
  const t = new Date(`${d}T12:00:00`).getTime();
  if (Number.isNaN(t)) return false;
  const day = 86400000;
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return t >= today.getTime() + day - 1000 && t <= today.getTime() + 183 * day;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body?.items?.length) return NextResponse.json({ error: "السلة فاضية" }, { status: 400 });
  const c = body.customer ?? ({} as Order["customer"]);
  if (!c.name?.trim() || !c.address?.trim() || !c.city?.trim() || !c.governorate)
    return NextResponse.json({ error: "من فضلك كمّل بيانات الشحن" }, { status: 400 });
  if (!PHONE.test(c.phone?.trim() ?? ""))
    return NextResponse.json({ error: "رقم الموبايل غير صحيح" }, { status: 400 });

  const jar = await cookies();
  const customerId = await verifyCustomerToken(jar.get(CUSTOMER_COOKIE)?.value);

  try {
    const order = await mutateDB((db) => {
      const zone = db.shipping.find((z) => z.governorate === c.governorate && z.active);
      if (!zone) throw new Error("المحافظة غير متاحة للشحن حاليًا");

      const items: Order["items"] = body.items.map((it) => {
        const p = db.products.find((x) => x.id === it.productId && x.active);
        if (!p) throw new Error("منتج غير متاح");
        const qty = Math.max(1, Math.floor(it.qty));
        if (p.stock < qty) throw new Error(`الكمية المتاحة من "${p.name}" هي ${p.stock} فقط`);
        const base = { productId: p.id, name: p.name, model: p.model, image: p.images[0] ?? "", qty, color: it.color, size: it.size };
        if (it.mode === "rent") {
          if (!p.rentPrice) throw new Error(`"${p.name}" مش متاحة للإيجار`);
          if (!isRentDate(it.rentDate)) throw new Error("اختار ميعاد المناسبة (من بكرة لحد 6 شهور قدام)");
          // Rentals earn the full rent (the suit comes back), and lock a refundable deposit.
          return { ...base, mode: "rent" as const, rentDate: it.rentDate, price: p.rentPrice, cost: 0, deposit: p.deposit ?? 0 };
        }
        return { ...base, mode: "buy" as const, price: p.price, cost: p.cost };
      });

      const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
      const depositTotal = items.reduce((s, i) => s + (i.mode === "rent" ? (i.deposit ?? 0) * i.qty : 0), 0);
      let discount = 0;
      let couponCode: string | undefined;
      if (body.couponCode) {
        const coupon = findCoupon(db, body.couponCode);
        const r = couponDiscount(coupon, subtotal);
        if (r.error) throw new Error(r.error);
        discount = r.discount;
        couponCode = coupon!.code;
        coupon!.used += 1;
      }
      const shippingFee =
        db.settings.freeShippingThreshold > 0 && subtotal - discount >= db.settings.freeShippingThreshold ? 0 : zone.fee;

      for (const it of items) if (it.mode !== "rent") db.products.find((p) => p.id === it.productId)!.stock -= it.qty;

      const now = new Date().toISOString();
      const last = db.orders.reduce((m, o) => Math.max(m, Number(o.number.slice(2)) || 0), 10000);
      const number = `VS${last + 1}`;
      const order: Order = {
        id: uid("o"), number,
        customer: {
          name: c.name.trim(), phone: c.phone.trim(), phone2: c.phone2?.trim() || undefined,
          governorate: c.governorate, city: c.city.trim(), address: c.address.trim(), notes: c.notes?.trim() || undefined,
        },
        items, subtotal, shippingFee, discount, depositTotal: depositTotal || undefined,
        total: subtotal - discount + shippingFee + depositTotal, couponCode,
        paymentMethod: ["cod", "instapay", "vodafone_cash"].includes(body.paymentMethod) ? body.paymentMethod : "cod",
        status: "pending", history: [{ status: "pending", at: now }], createdAt: now,
      };
      const acct = customerId ? db.customers.find((x) => x.id === customerId) : undefined;
      if (acct) {
        order.customerId = acct.id;
        acct.address = { governorate: order.customer.governorate, city: order.customer.city, address: order.customer.address };
      }
      db.orders.unshift(order);
      return order;
    });
    return NextResponse.json({ number: order.number, total: order.total });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

// Public order tracking: requires both the order number and the phone used.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const number = searchParams.get("number")?.trim().toUpperCase();
  const phone = searchParams.get("phone")?.trim();
  const db = await readDB();
  const o = db.orders.find((x) => x.number === number && x.customer.phone === phone);
  if (!o) return NextResponse.json({ error: "مفيش طلب بالبيانات دي" }, { status: 404 });
  return NextResponse.json({
    number: o.number, status: o.status, history: o.history, total: o.total,
    items: o.items.map(({ name, model, image, price, qty, color, size, mode, rentDate, deposit }) => ({ name, model, image, price, qty, color, size, mode, rentDate, deposit })), createdAt: o.createdAt,
    shippingFee: o.shippingFee, discount: o.discount, subtotal: o.subtotal, depositTotal: o.depositTotal, customer: { name: o.customer.name, governorate: o.customer.governorate },
  });
}
