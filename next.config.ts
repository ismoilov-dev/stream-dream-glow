import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "16.170.235.75",
      },
    ],
  },
};

export default nextConfig;