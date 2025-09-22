/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "encrypted-tbn0.gstatic.com"],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "shiki/wasm": "shiki/dist/index.js",
    };
    return config;
  },
};

export default nextConfig;


