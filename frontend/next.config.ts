import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["114.207.245.126"],

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8010/api/:path*",
      },
    ];
  },
};

export default nextConfig;
