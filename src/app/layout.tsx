import type { Metadata } from "next";
import "./globals.css";
import { AppLayout } from "@/components/Layout/AppLayout";

export const metadata: Metadata = {
  title: "Meridian — Capital Intelligence",
  description: "Institutional-grade financial oversight and capital flow analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Newsreader:ital,opsz,wght@0,6..72,300..800;1,6..72,300..800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
