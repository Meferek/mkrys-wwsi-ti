import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'images.amazon.com',
      },
    ],
  },
};

export default nextConfig;
