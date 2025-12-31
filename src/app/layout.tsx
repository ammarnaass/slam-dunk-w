import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prismadb";
import AdmobProvider from "@/components/AdmobProvider";
import BottomNav from "@/components/BottomNav";
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
            {children}
            <BottomNav />
          </AdmobProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
