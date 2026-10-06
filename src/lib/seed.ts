import type { Category, DB, Product, ShippingZone } from "./types";

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1000&q=80`;

// Suit photos (Unsplash, free to use) — replace with your own from the admin panel any time.
const P = {
  blackMan: img("1617127365659-c47fa864d8bc"),
  navyFull: img("1617137968427-85924c800a22"),
  navyButton: img("1507679799987-c73779587ccf"),
  blueCheck3pc: img("1594938298603-c8148c4dae35"),
  tuxMannequin: img("1598808503746-f34c53b9323e"),
  navyCheck: img("1592878904946-b3cd8ae243d0"),
  rack: img("1600091166971-7f9faad6c1e2"),
  tweed: img("1505022610485-0249ba5b3675"),
  tweedMannequins: img("1580657018950-c7f7d6a6d990"),
  darkRedTie: img("1519085360753-af0119f7cbe7"),
  green: img("1593032465175-481ac7f401a0"),
  blueMan: img("1617137984095-74e4e5e3613f"),
  doubleBreasted: img("1592878849122-facb97520f9e"),
  shirtTie: img("1594938291221-94f18cbb5660"),
  greyCheck: img("1621335829175-95f437384d7c"),
  tailor: img("1584184924103-e310d9dc82fc"),
  flatlay: img("1593030761757-71fae45fa0e7"),
};

const C = {
  black: { name: "أسود", hex: "#141414" },
  navy: { name: "كحلي", hex: "#1F2A44" },
  royal: { name: "أزرق رويال", hex: "#24408E" },
  charcoal: { name: "فحمي", hex: "#3A3D42" },
  grey: { name: "رمادي", hex: "#8A8F98" },
  green: { name: "زيتي غامق", hex: "#2F4A35" },
  brown: { name: "بني", hex: "#6B4A33" },
  beige: { name: "بيج", hex: "#CDB892" },
  wine: { name: "نبيتي", hex: "#5C1A26" },
  white: { name: "أبيض", hex: "#F4F1EA" },
};

const SUIT = ["46", "48", "50", "52", "54", "56", "58"];

export const categories: Category[] = [
  { id: "cat-buy", slug: "buy", name: "بدل للبيع", description: "بدل كلاسيك وسليم فيت بخامات مستوردة — تفصيل جاهز ومقاسات لحد 58", image: P.navyButton, order: 1, active: true },
  { id: "cat-rent", slug: "rent", name: "بدل للإيجار", description: "شيك ليلة الفرح والخطوبة والمناسبات — من غير ما تدفع تمن بدلة كاملة", image: P.tuxMannequin, order: 2, active: true },
  { id: "cat-boxfit", slug: "boxfit", name: "بوكس فيت 2026", description: "القَصّة الجديدة الواسعة بكتف عريض — ترند الموسم بخامات تقيلة", image: P.green, order: 3, active: true },
];

type Seed = Omit<Product, "id" | "slug" | "createdAt" | "active" | "stock"> & { stock?: number };

const seeds: Seed[] = [
  // ───────── للبيع ─────────
  { name: "بدلة كحلي سليم فيت كلاسيك", model: "VS-101", categoryId: "cat-buy", fit: "سليم فيت", price: 4500, comparePrice: 5200, rentPrice: 900, deposit: 1500, cost: 2600, images: [P.navyButton, P.navyFull, P.blueMan], colors: [C.navy, C.black], sizes: SUIT, description: "بدلة قطعتين بقَصّة سليم فيت وخامة صوف مخلوط مبتتكرمش. الجاكيت بزرارين وبنطلون بقَصّة مستقيمة — الاختيار الآمن للشغل والمناسبات.", featured: true, isNew: true },
  { name: "بدلة سوداء فاخرة بقميص أسود", model: "VS-102", categoryId: "cat-buy", fit: "سليم فيت", price: 4900, rentPrice: 1000, deposit: 1500, cost: 2850, images: [P.blackMan, P.darkRedTie], colors: [C.black], sizes: SUIT, description: "بدلة سوداء بخامة ناعمة ولمعة خفيفة، بتتلبس بقميص أسود للوك سهرة أو قميص أبيض للوك كلاسيك.", featured: true, isNew: false },
  { name: "بدلة 3 قطع كاروهات أزرق", model: "VS-103", categoryId: "cat-buy", fit: "كلاسيك", price: 5600, comparePrice: 6400, rentPrice: 1100, deposit: 2000, cost: 3300, images: [P.blueCheck3pc, P.navyCheck], colors: [C.royal, C.grey], sizes: SUIT, description: "بدلة 3 قطع (جاكيت + صديري + بنطلون) بنقشة كاروهات هادية. شياكة بريطاني لكتب الكتاب والمناسبات الكبيرة.", featured: true, isNew: true },
  { name: "بدلة دبل بريست سوداء", model: "VS-104", categoryId: "cat-buy", fit: "كلاسيك", price: 5200, rentPrice: 1050, deposit: 1800, cost: 3000, images: [P.doubleBreasted, P.blackMan], colors: [C.black, C.charcoal], sizes: SUIT, description: "جاكيت دبل بريست بستة زراير دهبي وكتف مظبوط. حضور قوي في أي مناسبة.", featured: false, isNew: true },
  { name: "بليزر كاروهات رمادي", model: "VS-105", categoryId: "cat-buy", fit: "سليم فيت", price: 2900, comparePrice: 3400, cost: 1600, images: [P.greyCheck, P.navyCheck], colors: [C.grey], sizes: SUIT, description: "بليزر منفرد بنقشة كاروهات يتلبس على بنطلون أسود أو جينز غامق. شياكة كاجوال للشغل والخروج.", featured: true, isNew: false },
  { name: "بدلة تويد بني شتوي", model: "VS-106", categoryId: "cat-buy", fit: "كلاسيك", price: 5400, rentPrice: 1000, deposit: 1800, cost: 3150, images: [P.tweed, P.tweedMannequins], colors: [C.brown, C.beige], sizes: SUIT, description: "بدلة تويد صوف تقيل بلمسة إنجليزي، دافية ومناسبة لمناسبات الشتا.", featured: false, isNew: false },

  // ───────── للإيجار ─────────
  { name: "بدلة سموكن عريس سوداء", model: "VR-201", categoryId: "cat-rent", fit: "سليم فيت", price: 6800, rentPrice: 1500, deposit: 2500, cost: 3900, images: [P.tuxMannequin, P.blackMan], colors: [C.black], sizes: SUIT, description: "سموكن بياقة ستان لامعة وبنطلون بشريط جانبي. البدلة اللي تليق بليلة العمر — تتأجر مكوية ومتغلفة.", featured: true, isNew: true },
  { name: "بدلة سموكن بيضاء للفرح", model: "VR-202", categoryId: "cat-rent", fit: "كلاسيك", price: 6500, rentPrice: 1400, deposit: 2500, cost: 3700, images: [P.rack, P.tuxMannequin], colors: [C.white, C.black], sizes: SUIT, description: "جاكيت سموكن أبيض مع بنطلون أسود — لوك هوليوود للفرح والحفلات الصيفي.", featured: true, isNew: false },
  { name: "بدلة كحلي للخطوبة وكتب الكتاب", model: "VR-203", categoryId: "cat-rent", fit: "سليم فيت", price: 4500, rentPrice: 850, deposit: 1500, cost: 2600, images: [P.navyFull, P.navyButton], colors: [C.navy], sizes: SUIT, description: "بدلة كحلي أنيقة بقميص أبيض وكرافتة — تتأجر للخطوبة وكتب الكتاب والمناسبات العائلية.", featured: true, isNew: false },
  { name: "بدلة رمادي فحمي للمناسبات", model: "VR-204", categoryId: "cat-rent", fit: "كلاسيك", price: 4300, rentPrice: 800, deposit: 1500, cost: 2500, images: [P.darkRedTie, P.shirtTie], colors: [C.charcoal], sizes: SUIT, description: "بدلة فحمي بقميص أبيض وكرافتة نبيتي. اختيار رسمي ومحترم لأي مناسبة.", featured: false, isNew: false },
  { name: "بدلة 3 قطع تويد للتصوير", model: "VR-205", categoryId: "cat-rent", fit: "كلاسيك", price: 5800, rentPrice: 1100, deposit: 2000, cost: 3400, images: [P.tweedMannequins, P.tweed], colors: [C.brown], sizes: SUIT, description: "بدلة 3 قطع تويد بلمسة فينتاج — مثالية لسيشن التصوير وحفلات التخرج.", featured: false, isNew: true },

  // ───────── بوكس فيت ─────────
  { name: "بدلة بوكس فيت زيتي غامق", model: "VB-301", categoryId: "cat-boxfit", fit: "بوكس فيت", price: 5300, comparePrice: 5900, rentPrice: 1100, deposit: 1800, cost: 3050, images: [P.green, P.rack], colors: [C.green, C.black], sizes: SUIT, description: "القَصّة الجديدة: جاكيت واسع بكتف عريض وبنطلون واسع بكسرة. لون زيتي غامق جريء — ترند 2026.", featured: true, isNew: true },
  { name: "بدلة بوكس فيت أزرق رويال", model: "VB-302", categoryId: "cat-boxfit", fit: "بوكس فيت", price: 5100, rentPrice: 1000, deposit: 1800, cost: 2950, images: [P.blueMan, P.navyFull], colors: [C.royal, C.navy], sizes: SUIT, description: "بوكس فيت بلون رويال لافت، جاكيت مريح وطويل شوية وبنطلون بوسط عالي. شياكة من غير تكلّف.", featured: true, isNew: true },
  { name: "بليزر بوكس فيت أسود أوفر سايز", model: "VB-303", categoryId: "cat-boxfit", fit: "بوكس فيت", price: 3200, cost: 1800, images: [P.doubleBreasted, P.blackMan], colors: [C.black], sizes: SUIT, description: "بليزر أوفر سايز بقَصّة بوكسي يتلبس على تيشيرت أو قميص — لوك عصري للخروجات.", featured: false, isNew: true },
  { name: "بدلة بوكس فيت نبيتي سهرة", model: "VB-304", categoryId: "cat-boxfit", fit: "بوكس فيت", price: 5500, rentPrice: 1150, deposit: 1800, cost: 3200, images: [P.darkRedTie, P.rack], colors: [C.wine, C.black], sizes: SUIT, description: "بدلة سهرة بوكس فيت بلون نبيتي غامق وخامة فيلفيت خفيفة — هتلفت الأنظار في أي حفلة.", featured: true, isNew: false },
];

const slugify = (s: string, i: number) => `vestro-${s.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${i}`;

export const products: Product[] = seeds.map((s, i) => ({
  ...s,
  id: `p-${i + 1}`,
  slug: slugify(s.model, i + 1),
  stock: s.stock ?? 8,
  active: true,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

const govs: [string, number, string][] = [
  ["القاهرة", 60, "1-2 يوم"], ["الجيزة", 60, "1-2 يوم"], ["القليوبية", 70, "2-3 أيام"],
  ["الإسكندرية", 75, "2-3 أيام"], ["الشرقية", 75, "2-3 أيام"], ["الدقهلية", 75, "2-3 أيام"],
  ["الغربية", 75, "2-3 أيام"], ["المنوفية", 75, "2-3 أيام"], ["البحيرة", 80, "2-4 أيام"],
  ["كفر الشيخ", 80, "2-4 أيام"], ["دمياط", 80, "2-4 أيام"], ["بورسعيد", 80, "2-4 أيام"],
  ["الإسماعيلية", 80, "2-4 أيام"], ["السويس", 80, "2-4 أيام"], ["الفيوم", 85, "3-4 أيام"],
  ["بني سويف", 85, "3-4 أيام"], ["المنيا", 90, "3-5 أيام"], ["أسيوط", 95, "3-5 أيام"],
  ["سوهاج", 100, "3-5 أيام"], ["قنا", 100, "4-6 أيام"], ["الأقصر", 105, "4-6 أيام"],
  ["أسوان", 110, "4-6 أيام"], ["البحر الأحمر", 120, "4-7 أيام"], ["مطروح", 120, "4-7 أيام"],
  ["الوادي الجديد", 130, "5-7 أيام"], ["شمال سيناء", 130, "5-7 أيام"], ["جنوب سيناء", 130, "5-7 أيام"],
];

export const shipping: ShippingZone[] = govs.map(([governorate, fee, days], i) => ({
  id: `sh-${i + 1}`,
  governorate,
  fee,
  days,
  active: true,
}));

export function createSeed(): DB {
  return {
    products,
    categories,
    shipping,
    orders: [],
    customers: [],
    coupons: [
      { id: "cp-1", code: "VESTRO10", type: "percent", value: 10, minOrder: 1000, usageLimit: 500, used: 0, active: true },
      { id: "cp-2", code: "GROOM300", type: "fixed", value: 300, minOrder: 1200, usageLimit: 200, used: 0, active: true },
    ],
    testimonials: [],
    expenses: [],
    settings: {
      storeName: "VESTRO",
      tagline: "بدل رجالي — شراء وإيجار وبوكس فيت",
      announcement: "بدل للبيع والإيجار 🤵 • البوكس فيت الجديد وصل • شحن لكل المحافظات • خصم 10% بكود VESTRO10",
      heroTitle: "شياكتك تبدأ من فيسترو",
      heroSubtitle: "بدل للبيع والإيجار وأحدث قَصّات البوكس فيت — لفرحك وشغلك وكل مناسبة.",
      heroImages: [P.navyButton, P.tuxMannequin, P.green, P.blueCheck3pc],
      aboutText: "VESTRO متجر بدل رجالي مصري. بنبيع بدل كلاسيك وسليم فيت وبوكس فيت بخامات مختارة، وبنأجّر بدل العرسان والمناسبات مكوية ومتغلفة وجاهزة للبس — مع شحن لكل محافظات مصر.",
      whatsapp: "201055673184",
      phone: "01055673184",
      email: "01055673184hs@gmail.com",
      instagram: "https://instagram.com/",
      facebook: "https://facebook.com/",
      tiktok: "https://tiktok.com/",
      freeShippingThreshold: 4000,
      instapay: "",
      vodafoneCash: "",
      returnDays: 14,
      returnShippingFee: 0,
      rentDays: 3,
      videos: [],
    },
  };
}
