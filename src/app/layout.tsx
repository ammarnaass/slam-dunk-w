import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

import fs from "fs";
import path from "path";

const cairo = Cairo({ subsets: ["arabic", "latin"] });

function getSettings() {
  try {
    const settingsPath = path.join(process.cwd(), "src/data/settings.json");
    if (fs.existsSync(settingsPath)) {
      const jsonData = fs.readFileSync(settingsPath, "utf8");
      return JSON.parse(jsonData);
    }
  } catch (error) {
    console.error("Failed to load settings", error);
  }
  return {
    siteName: "سلام دانك - Slam Dunk Streaming",
    siteDescription: "شاهد جميع حلقات أنمي سلام دانك بجودة عالية",
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return {
    title: settings.siteName,
    description: settings.siteDescription,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>{children}</body>
    </html>
  );
}
