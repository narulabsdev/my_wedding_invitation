import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/invite-builder",
  },
};

export default function InviteBuilderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
