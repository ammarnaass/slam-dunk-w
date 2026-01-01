import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { prisma } from "@/lib/prismadb";
import AdmobProvider from "@/components/AdmobProvider";
import BottomNav from "@/components/BottomNav";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/providers/AuthProvider";

const cairo = Cairo({ subsets: ["arabic", "latin"] });

export const viewport: Viewport = {
  themeColor: "#dc2626",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.settings.findUnique({ where: { id: "global" } });

  const siteName = settings?.siteName || "سلام دانك";

  return {
    title: siteName,
    description: "الموقع الرسمي لمشاهدة حلقات سلام دانك بجودة عالية",
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
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
  const settings = await prisma.settings.findUnique({ where: { id: "global" } });

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.className} bg-slate-950 text-slate-200 antialiased`}>
        <AuthProvider>
          <AdmobProvider>
            <NextTopLoader color="#dc2626" showSpinner={false} />
            <Navbar settings={settings || {}} />
            <div className="min-h-screen">
              {children}
            </div>
            <Footer settings={settings || {}} />
            <BottomNav />
            <script src="https://accounts.google.com/gsi/client" async defer></script>
          </AdmobProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
