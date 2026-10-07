import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { CollectionRing } from "@/components/home/collection";
import { Categories, VideoReels, WordMarquee } from "@/components/home/sections";
import { BridalBanner, Features, Testimonials } from "@/components/home/showcase";
import { Reveal, SectionTitle, Stagger, StaggerItem } from "@/components/motion";
import { ProductCard } from "@/components/product-card";
import { getStore } from "@/lib/store";

export default async function Home() {
  const { settings, categories, products, testimonials } = await getStore();
  const counts = Object.fromEntries(categories.map((c) => [c.id, products.filter((p) => p.categoryId === c.id).length]));
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const fresh = products.filter((p) => p.isNew).slice(0, 8);
  const bridalCat = categories.find((c) => c.slug === "rent");
  const bridal = products.filter((p) => p.categoryId === bridalCat?.id);

  return (
    <>
      <Hero title={settings.heroTitle} subtitle={settings.heroSubtitle} images={settings.heroImages} />
      <WordMarquee />

      <section className="container-z py-24">
        <SectionTitle kicker="SHOP BY CATEGORY" title="تسوق حسب القسم" sub="شراء، إيجار، وأحدث قَصّات البوكس فيت — كل اللي محتاجه لشياكتك في مكان واحد" />
        <Categories categories={categories} counts={counts} />
      </section>

      <section className="relative mb-28 sm:mb-36 overflow-hidden bg-gradient-to-b from-[#0d0c0b] via-[#16130f] to-[#0d0c0b] py-28 sm:py-36">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute -right-32 top-10 size-[30rem] rounded-full bg-primary/25 blur-[130px]" />
        <div className="pointer-events-none absolute -left-32 bottom-0 size-[26rem] rounded-full bg-gold/15 blur-[130px]" />
        <p dir="ltr" className="pointer-events-none absolute inset-x-0 top-6 select-none text-center font-serif text-[16vw] font-bold leading-none text-white/[.04]">COLLECTION</p>
        <div className="relative text-center mb-8">
          <span className="text-gradient animate-shimmer font-serif text-sm italic tracking-[.3em]">THE COLLECTION</span>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-5xl">
            كوليكشن <span className="text-gold-shimmer">VESTRO 2026</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/70">قلّب في البدل كأنك واقف قدام الشماعة — كل بدلة بتلف قدامك</p>
        </div>
        <div className="relative mt-8 sm:mt-12">
          <CollectionRing products={featured.length >= 6 ? products.filter((p) => p.featured) : products} />
        </div>
      </section>

      <section className="container-z pb-24">
        <SectionTitle kicker="BEST SELLERS" title="الأكثر طلبًا" sub="البدل اللي عليها الطلب أكتر الموسم ده" />
        <Stagger className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <StaggerItem key={p.id}><ProductCard p={p} /></StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-12 text-center">
          <Link href="/shop" className="btn-dark px-8 py-4">شوف كل البدل <ArrowLeft className="size-4" /></Link>
        </Reveal>
      </section>

      <section className="pb-24">
        <BridalBanner image={bridal[0]?.images[0] ?? categories[0]?.image ?? ""} image2={bridal[1]?.images[0] ?? bridal[0]?.images[1] ?? categories[1]?.image ?? ""} />
      </section>

      {settings.videos.length > 0 && (
        <section className="pb-24">
          <SectionTitle kicker="VESTRO REELS" title="شوفها على الطبيعة" sub="فيديوهات حقيقية للبدل قبل ما تطلب" />
          <VideoReels videos={settings.videos} />
        </section>
      )}

      {fresh.length > 0 && (
        <section className="container-z pb-24">
          <SectionTitle kicker="NEW ARRIVALS" title="وصل حديثًا" />
          <Stagger className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {fresh.map((p) => (
              <StaggerItem key={p.id}><ProductCard p={p} /></StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      <section className="container-z pb-24">
        <SectionTitle kicker="WHY VESTRO" title="ليه تختار VESTRO؟" sub="تفاصيل صغيرة بتفرق في تجربتك من أول طلب لحد ما يوصلك" />
        <Features />
      </section>

      {testimonials.length > 0 && (
        <section className="soft-wash relative overflow-hidden py-24">
          <div className="grid-lines pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute -right-32 top-20 size-96 rounded-full bg-primary/15 blur-[120px]" />
          <div className="pointer-events-none absolute -left-32 bottom-10 size-96 rounded-full bg-gold/15 blur-[120px]" />
          <div className="relative">
            <Testimonials items={testimonials} />
          </div>
        </section>
      )}

      <section className="container-z py-24 sm:py-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-welcome p-10 text-center text-white sm:p-16 lg:p-20 shadow-2xl">
            <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-serif text-[18vw] font-black leading-none text-white/[0.04]">
              VESTRO
            </p>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl leading-tight">
                محتاج مساعدة في المقاس أو حجز إيجار؟
              </h2>
              <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed max-w-xl mx-auto">
                فريقنا موجود على واتساب يساعدك تختار المقاس والقَصّة المناسبة، ويحجزلك البدلة المناسبة
              </p>
              <div className="mt-8 sm:mt-10">
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-10 py-4.5 text-base font-bold text-primary shadow-2xl hover:bg-white/95 hover:scale-105 transition-all active:scale-95"
                >
                  كلمنا على واتساب
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
