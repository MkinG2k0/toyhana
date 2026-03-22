import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone",
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
