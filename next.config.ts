import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "prthmgx3-3000.brs.devtunnels.ms"],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io", // El dominio de UploadThing
      },
      {
        protocol: "https",
        hostname: "img.clerk.com", // Por si usas avatares de Clerk
      },
      {
        protocol: "https",
        hostname: "1nur9kntg1.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com"
      }
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
