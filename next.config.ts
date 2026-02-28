import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    localPatterns: [
      { pathname: "/media/**", search: "?v=2" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/projects/reimagining-3d-product-exploration-at-ikea",
        destination: "/projects/rotera",
        permanent: true,
      },
    ];
  },
  // Cache: public assets are NOT content-hashed → revalidate to avoid stale after deploy
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
