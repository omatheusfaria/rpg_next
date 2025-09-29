/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/rpg-next',
  assetPrefix: '/rpg-next/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;