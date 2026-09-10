/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Project site (kieran-murphy.github.io/momentum/) lives under a subpath,
  // so every asset and route needs to know about it.
  basePath: "/momentum",
  assetPrefix: "/momentum/",
  trailingSlash: true,
};

export default nextConfig;
