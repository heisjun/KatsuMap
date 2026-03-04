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
  async rewrites() {
    return [
      {
        source: "/api/catchtable/:path*",
        destination:
          "https://ct-api.catchtable.co.kr/reservation-api/v1/waiting-shops/:path*",
      },
    ];
  },
};

export default nextConfig;
