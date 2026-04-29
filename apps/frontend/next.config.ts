import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  productionBrowserSourceMaps: false,
  trailingSlash: true,
};

export default nextConfig;
