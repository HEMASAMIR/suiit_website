import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, El_Messiri, IBM_Plex_Sans_Arabic } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const plex = IBM_Plex_Sans_Arabic({ subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-cairo" });
const messiri = El_Messiri({ subsets: ["arabic", "latin"], weight: ["500", "600", "700"], variable: "--font-display" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: { default: "VESTRO — فيسترو | بدل رجالي للبيع والإيجار", template: "%s | VESTRO" },
  description: "فيسترو — بدل رجالي للبيع والإيجار وأحدث قَصّات البوكس فيت. سموكن عرسان وبدل مناسبات مكوية وجاهزة، وشحن لكل محافظات مصر والدفع عند الاستلام.",
  // Stop Dark Reader & similar extensions from overriding our own light/dark themes.
  other: { "darkreader-lock": "lock" },
};

export const viewport: Viewport = { colorScheme: "light dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${plex.variable} ${messiri.variable} ${cormorant.variable}`}>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
