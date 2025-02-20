"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { QRCodeSVG } from "qrcode.react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, AlertTriangle, Download, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface BookingData {
  id: string;
  carNumber: string;
  userName: string;
  phoneNumber: string;
  status: string;
  createdAt: any;
}

const QRViewer: React.FC = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!bookingId) {
        setError("No booking ID provided");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "unauthorizedBookings", bookingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setBookingData({
            id: docSnap.id,
            carNumber: data.carNumber,
            userName: data.userName,
            phoneNumber: data.phoneNumber,
            status: data.status,
            createdAt: data.createdAt,
          });
        } else {
          setError("Booking not found");
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Failed to load booking information");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId]);

  const getCurrentUrl = (): string => {
    return window.location.href;
  };

  const downloadQRCode = (): void => {
    const canvas = document.getElementById("qr-code-svg")?.querySelector("svg");
    if (canvas) {
      // Create a canvas element
      const svgData = new XMLSerializer().serializeToString(canvas);
      const tempCanvas = document.createElement("canvas");
      const ctx = tempCanvas.getContext("2d");

      if (ctx) {
        // Set canvas dimensions
        tempCanvas.width = canvas.width.baseVal.value;
        tempCanvas.height = canvas.height.baseVal.value;

        // Create an image from SVG
        const img = new Image();
        const blob = new Blob([svgData], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);

        img.onload = function () {
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);

          // Get data URL
          const pngUrl = tempCanvas.toDataURL("image/png");

          // Create download link
          const downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          downloadLink.download = `parking-qr-${
            bookingData?.carNumber || "code"
          }.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        };

        img.src = url;
      }
    }
  };

  const shareQRCode = async (): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Parking QR for ${bookingData?.carNumber}`,
          text: "Your parking QR code",
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback for browsers that don't support sharing
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "QR code link copied to clipboard",
      });
    }
  };

  const getFormattedDate = (timestamp: any): string => {
    if (!timestamp) return "N/A";

    try {
      const date = timestamp.toDate();
      return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } catch (e) {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mx-auto" />
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <Skeleton className="h-52 w-52 rounded-lg" />
            <div className="space-y-4 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-red-600 flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Error Loading QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-700 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              Please check the URL and try again. If the problem persists,
              contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Toaster />

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Parking QR Code
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center">
          <div
            id="qr-code-svg"
            className="bg-white p-6 rounded-lg shadow-sm mb-6 border"
          >
            <QRCodeSVG
              value={getCurrentUrl()}
              size={220}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="w-full space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Status:</span>
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                  bookingData?.status === "unauthorized"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {bookingData?.status === "unauthorized" ? (
                  <>
                    <AlertTriangle className="h-3 w-3" />
                    <span>Unauthorized</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3 w-3" />
                    <span>Authorized</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3 border-t border-b py-3">
              <div>
                <h3 className="text-sm text-gray-500">Car Number</h3>
                <p className="font-semibold text-lg">
                  {bookingData?.carNumber}
                </p>
              </div>

              <div>
                <h3 className="text-sm text-gray-500">Driver Name</h3>
                <p className="font-semibold">{bookingData?.userName}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-500">Contact</h3>
                <p className="font-semibold">{bookingData?.phoneNumber}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-500">Created At</h3>
                <p className="font-medium text-sm">
                  {getFormattedDate(bookingData?.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={downloadQRCode}
                className="flex-1"
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Download QR
              </Button>

              <Button onClick={shareQRCode} className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="text-center text-sm text-gray-500 flex flex-col items-center">
          <p>Present this QR code at the parking entrance</p>
          <p className="text-xs mt-1">{bookingData?.id}</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QRViewer;
