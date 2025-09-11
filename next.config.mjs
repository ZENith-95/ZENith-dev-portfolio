/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "shiki/wasm": "shiki/dist/index.js",
    };
    return config;
  },
};

export default nextConfig;
