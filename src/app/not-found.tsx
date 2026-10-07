import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grain relative grid min-h-dvh place-items-center overflow-hidden bg-gradient-to-b from-[#f6efe3] via-white to-[#fbf7f0] dark:from-[#1a1612] dark:via-[#0d0c0b] dark:to-[#110f0d] p-6 text-center">
      <div>
        <p className="font-serif text-[8rem] leading-none text-primary sm:text-[12rem]">404</p>
        <h1 className="mt-2 text-2xl font-extrabold">الصفحة دي مش موجودة</h1>
        <p className="mt-2 text-muted">يمكن المنتج اتشال أو الرابط غلط</p>
        <Link href="/" className="btn-primary mt-8">ارجع للرئيسية</Link>
      </div>
    </div>
  );
}
