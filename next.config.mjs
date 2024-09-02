/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["d36dcj71lapw9d.cloudfront.net"], // 여기에 외부 도메인 추가
  },
};

export default nextConfig;
