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
  // ה-`/` של כל subdomain מוצמד ל-tenant הנכון (URL נשאר נקי, ללא redirect).
  // beforeFiles רץ לפני בדיקת file-system, אז Next.js מתעלם מ-app/page.tsx.
  async rewrites() {
    return {
      beforeFiles: [
        // הדומיין הראשי + www → אתר השיפוצניק (demo)
        {
          source: "/",
          has: [{ type: "host", value: "(www\\.)?pro-digital\\.org" }],
          destination: "/sites/demo",
        },
        // Subdomain lp3 → tenant charity lp-3
        {
          source: "/",
          has: [{ type: "host", value: "lp3\\.pro-digital\\.org" }],
          destination: "/sites/lp-3",
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
