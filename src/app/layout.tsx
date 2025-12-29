import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/db";
import AdmobProvider from "@/components/AdmobProvider";
import BottomNav from "@/components/BottomNav";

const cairo = Cairo({ subsets: ["arabic", "latin"] });

export const viewport: Viewport = {
  themeColor: "#dc2626",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return {
    title: settings.siteName,
    description: settings.siteDescription,
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: settings.siteName,
    },
    icons: {
      icon: settings.faviconUrl || "/favicon.ico",
      apple: "/icon-192x192.png",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = getSettings();

  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-slate-950 text-slate-200 antialiased`}>
        <AdmobProvider>
          {children}
          <BottomNav />
        </AdmobProvider>
      </body>
    </html>
  );
}
