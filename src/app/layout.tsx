import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import AuthSession from "./_component/AuthSession";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KatsuMap",
  description: "돈가스의 모든것",
  icons: {
    icon: "/logoIcon.png",
  },
  openGraph: {
    title: ` KatsuMap`,
    description: `돈가스의 모든것`,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    images: [
      {
        url: "/logoIcon.png", // 썸네일 이미지 URL
        alt: `카츠맵 아이콘`, // 이미지 대체 텍스트
      },
    ],
    siteName: "KatsuMap", // 사이트 이름
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAOJSKEY}&libraries=services&autoload=false`}
          strategy="beforeInteractive"
        />
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      </head>
      <body className={inter.className}>
        <AuthSession>{children}</AuthSession>
      </body>
    </html>
  );
}
