import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: '/Tech-Stack-Demos',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
