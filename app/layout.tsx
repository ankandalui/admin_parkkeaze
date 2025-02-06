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
      <body>
        {/* <Navbar /> */}
        <main>{children}</main>
        {/* <Footer /> */}
        <Toaster />
      </body>
    </html>
  );
}
