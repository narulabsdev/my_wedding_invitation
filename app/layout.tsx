import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "@fontsource/gowun-batang/400.css";
import "@fontsource/gowun-batang/700.css";
import "@fontsource-variable/noto-sans-kr";
import { PUBLIC_SITE_URL } from "./lib/site-url";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const weddingShareTitle = "윤상호 · 스테프 퓌제서리의 혼례에 초대합니다";
const weddingShareDescription =
  "윤재관 · 김정수의 장남 윤상호와 피터 퓌제서리 · 메기 퓌제서리의 차녀 스테프 퓌제서리의 혼례에 초대합니다.";
const weddingShareImage = "/wedding/seals/metadata-seal-transparent.png";

export const metadata: Metadata = {
  metadataBase: new URL(PUBLIC_SITE_URL),
  title: weddingShareTitle,
  description: weddingShareDescription,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "윤상호 · 스테프 퓌제서리 혼례",
    title: weddingShareTitle,
    description: weddingShareDescription,
    images: [
      {
        url: weddingShareImage,
        width: 1294,
        height: 835,
        alt: "윤상호와 스테프 퓌제서리의 혼례 안내 인장",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: weddingShareTitle,
    description: weddingShareDescription,
    images: [weddingShareImage],
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
