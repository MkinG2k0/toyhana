import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wedding-cloud.storage.yandexcloud.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
