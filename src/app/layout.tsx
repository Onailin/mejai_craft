import { I18nProvider } from "@/components/providers/I18nProvider";
import { rootSiteMetadata } from "@/lib/site-metadata";
import "./globals.css";

export const metadata = rootSiteMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
