import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.wordtemplatesonline.net",
        pathname: "/wp-content/uploads/2019/12/Restaurant-Receipt-Format.jpg",
      }
    ]
  }
};

export default nextConfig;
