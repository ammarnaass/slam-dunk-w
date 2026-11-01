import type { NextConfig } from "next";

const STANDALONE_BACKEND_URL =
  process.env.STANDALONE_BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://backend-anime-daze.vercel.app";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "clsx",
      "tailwind-merge",
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/v1/:path*",
          destination: `${STANDALONE_BACKEND_URL}/api/v1/:path*`,
        },
        {
          source: "/api/mobile/:path*",
          destination: `${STANDALONE_BACKEND_URL}/api/mobile/:path*`,
        },
        {
          source: "/api/backend/:path*",
          destination: `${STANDALONE_BACKEND_URL}/api/:path*`,
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
