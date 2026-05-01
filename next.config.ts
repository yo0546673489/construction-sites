import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ===== Image Optimization =====
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },

  // ===== Bundle optimization =====
  experimental: {
    // Tree-shake lucide-react properly — חוסך ~70% מגודל ה-icon bundle.
    optimizePackageImports: ["lucide-react"],
  },

  // ===== URL rewrites =====
  // הדומיין הראשי `/` יציג ישירות את התוכן של /sites/demo (ללא redirect).
  // ה-URL בדפדפן יישאר `pro-digital.org/`.
  // beforeFiles רץ לפני בדיקת file-system, אז Next.js מתעלם מ-app/page.tsx.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          destination: "/sites/demo",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },

  // ===== Compression =====
  compress: true,

  // ===== Performance hints =====
  poweredByHeader: false,
};

export default nextConfig;
