import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "prthmgx3-3000.brs.devtunnels.ms"],
    },
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
