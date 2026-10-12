import type { Metadata, Viewport } from "next";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { SettingsService } from "@/server/services/settings.service";
import AdmobProvider from "@/components/AdmobProvider";
import BottomNav from "@/components/BottomNav";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/providers/AuthProvider";
import { NotificationProvider } from "@/context/NotificationContext";
import NotificationBottomModal from "@/components/notifications/NotificationBottomModal";

export const viewport: Viewport = {
  themeColor: "#0b0b0f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await SettingsService.getSettings();

  const siteName = settings?.siteName || "أنمي دايز";

  return {
    title: {
      template: `%s | ${siteName}`,
      default: `${siteName} - منصة الأنمي وسبيستون الكلاسيكية`,
    },
    description: "المنصة العربية الأولى لمشاهدة وتحميل أفضل مسلسلات وأفلام الأنمي وكلاسيكيات سبيستون بدقة 4K فائقة وترجمة ودبلجة احترافية.",
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: siteName,
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/icon-192x192.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await SettingsService.getSettings();

  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800;900&family=Tajawal:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-tajawal bg-[#0e0e12] text-[#e4e1e7] min-h-screen antialiased selection:bg-[#dc2626] selection:text-[#fff6f5] pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0 overflow-x-hidden w-full relative"
      >
        <AuthProvider>
          <NotificationProvider>
            <AdmobProvider>
              <NextTopLoader color="#dc2626" showSpinner={false} />
              <Navbar settings={settings || {}} />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer settings={settings || {}} />
              <BottomNav />
              <NotificationBottomModal />
              <script src="https://accounts.google.com/gsi/client" async defer></script>
            </AdmobProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
