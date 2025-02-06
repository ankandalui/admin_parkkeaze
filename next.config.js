/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    // Disable undici and other problematic modules
    config.resolve.alias = {
      ...config.resolve.alias,
      'undici': false,
      'encoding': false,
      'node-fetch': false,
      'data-uri-to-buffer': false,
      'fetch-blob': false,
      'formdata-polyfill': false,
    };
    return config;
  },
};

module.exports = nextConfig;