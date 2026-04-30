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

  // ===== Compression =====
  compress: true,

  // ===== Performance hints =====
  poweredByHeader: false,
};

export default nextConfig;
