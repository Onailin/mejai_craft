import type { Metadata } from "next";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { SITE_LOGO_PATH } from "@/lib/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mejai Crafts | Jewelry & Workshop",
  description:
    "Mejai Crafts ร้านจิวเวลรี่และเวิร์คช็อปในจันทบุรี รวมข้อมูลอัญมณี เครื่องประดับ และบริการสั่งทำ",
  icons: {
    icon: SITE_LOGO_PATH,
    apple: SITE_LOGO_PATH,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <AuthProvider>
          <I18nProvider>{children}</I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
