"use client";

import { QRCodeSVG } from "qrcode.react";
import { Card } from "@/components/ui/card";

export default function Home() {
  const bookingUrl = "https://parkeaze.vercel.app/unauth-registration";
  //   const bookingUrl = "http://localhost:3000/unauthbookings";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-6">Scan to Book Parking</h1>
        <div className="bg-white p-4 rounded-lg inline-block">
          <QRCodeSVG value={bookingUrl} size={200} />
        </div>
        <p className="mt-4 text-gray-600">
          Scan the QR code to make a parking reservation
        </p>
      </Card>
    </div>
  );
}
