import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'github.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
    ],
  },
};

export default nextConfig;
