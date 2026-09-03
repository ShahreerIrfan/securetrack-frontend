import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
        // no `search` restriction - our URLs carry ?w=...&q=... query
        // strings, and an empty search pattern requires an EXACT match
        // (i.e. no query string at all), which would reject them.
      },
    ],
  },
};

export default nextConfig;
