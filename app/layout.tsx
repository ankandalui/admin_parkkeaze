import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ParkEaze - Smart Parking Management",
  description: "Revolutionizing parking management with smart solutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        {/* <Navbar /> */}
        <main>{children}</main>
        {/* <Footer /> */}
        <Toaster />
      </body>
    </html>
  );
}
