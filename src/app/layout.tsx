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
          http-equiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      </head>
      <body className={inter.className}>
        <AuthSession>{children}</AuthSession>
      </body>
    </html>
  );
}
