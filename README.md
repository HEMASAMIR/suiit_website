<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=230&color=0:0e2c4e,55:0f766e,100:fbbf24&text=VESTRO&fontColor=ffffff&fontSize=90&fontAlignY=38&desc=Suits%20%E2%80%A2%20Rental%20%E2%80%A2%20Box%20Fit&descAlignY=60&descSize=20&animation=fadeIn" alt="VESTRO" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-0e2c4e?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-0f766e?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-v4-0d9488?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer%20Motion-3D%20animations-f59e0b?style=for-the-badge&logo=framer&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-strict-0e2c4e?style=for-the-badge&logo=typescript&logoColor=white" />
</p>

<p align="center">
  <img src="docs/screenshots/hero.png" width="900" alt="VESTRO home" />
</p>

<div dir="rtl">

## 🤵 عن المشروع

**VESTRO — فيسترو** متجر أونلاين لبدل رجالي: **بيع • إيجار • بوكس فيت**. نفس تجربة وتصميم متجر RAYA (عربي RTL، لايت / دارك، أنيميشن 3D، لوحة تحكم كاملة بالأرباح) — ومعاه نظام **إيجار البدل** للعرسان والمناسبات.

| | |
|---|---|
| 🛍️ **شراء أو إيجار** | في صفحة البدلة تختار شراء أو إيجار بضغطة، والسعر بيتغيّر بأنيميشن |
| 📅 **ميعاد المناسبة** | في الإيجار العميل بيختار يوم المناسبة (من بكرة لحد 6 شهور) |
| 🔐 **تأمين مسترد** | كل بدلة إيجار ليها تأمين بيتضاف للإجمالي وبيرجع للعميل لما البدلة ترجع |
| ✨ **بوكس فيت 2026** | قسم للقَصّة الجديدة الواسعة + علامة BOX FIT على الكروت |
| 🎠 **كوليكشن 3D** | حلقة بدل بتلف زي الشماعة — بالماوس أو بالصباع |
| 🚚 **شحن ودفع** | 27 محافظة • الدفع عند الاستلام • "افحص وقيس قبل ما تدفع" |
| 🧑‍💼 **لوحة التحكم** | سعر البيع + سعر الإيجار + التأمين + القَصّة لكل بدلة، والطلبات بتوضّح الإيجار وميعاده |

## 📸 لقطات

| 🌙 الوضع الليلي | 🛍️ المتجر |
|---|---|
| <img src="docs/screenshots/hero-dark.png" width="440" /> | <img src="docs/screenshots/shop.png" width="440" /> |
| **🤵 الإيجار — ميعاد المناسبة والتأمين** | **✨ البوكس فيت — شراء أو إيجار** |
| <img src="docs/screenshots/rent.png" width="440" /> | <img src="docs/screenshots/boxfit.png" width="440" /> |
| **🧾 الدفع — الإيجار والتأمين المسترد** | **🧑‍💼 لوحة التحكم — سعر الإيجار والتأمين والقَصّة** |
| <img src="docs/screenshots/checkout.png" width="440" /> | <img src="docs/screenshots/admin-product.png" width="440" /> |

<p align="center"><b>📱 موبايل</b><br/><img src="docs/screenshots/mobile.png" width="260" /></p>

## ⚙️ إزاي الإيجار شغال

- البدلة تبقى **متاحة للإيجار** لو ليها `سعر إيجار` في لوحة التحكم (0 = بيع بس).
- الإيجار **مش بيخصم من المخزون** (البدلة بترجع)، والشراء بيخصم.
- مدة الإيجار (افتراضي 3 أيام) من `settings.rentDays`.
- السيرفر بيتحقق من السعر والتأمين والميعاد بنفسه — العميل مايقدرش يغيّرهم.

## 🚀 التشغيل

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

- لوحة التحكم: `/admin` — اعمل `.env.local` فيه `ADMIN_EMAIL` و `ADMIN_PASSWORD` و `ADMIN_SECRET` (**لازم تتغير قبل النشر**).
- البيانات في `data/db.json` وبتتعمل تلقائي أول تشغيل. على Vercel بتتحفظ في `/tmp` (ديمو — بتتمسح كل فترة)؛ للمتجر الحقيقي استخدم سيرفر Node بديسك ثابت.
- الصور الحالية صور مؤقتة مجانية من Unsplash — بدّلها بصور البدل الحقيقية من لوحة التحكم.

## 📞 التواصل

**المهندس إبراهيم سمير** — واتساب [01055673184](https://wa.me/201055673184) • [01055673184hs@gmail.com](mailto:01055673184hs@gmail.com)

</div>
