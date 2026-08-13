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

export const metadata: Metadata = {
  metadataBase: new URL(PUBLIC_SITE_URL),
  title: "Sang Ho & Steph · Our Story",
  description:
    "Sang Ho and Steph's family story, from Vancouver to a traditional wedding in Seoul.",
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
