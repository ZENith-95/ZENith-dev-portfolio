/** @type {import('next').NextConfig} */
const supabaseDomain = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "encrypted-tbn0.gstatic.com",
      ...(supabaseDomain ? [supabaseDomain] : []),
    ],
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


