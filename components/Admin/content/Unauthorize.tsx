"use client";

import React, { useState, ChangeEvent, FormEvent, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Share2,
  Download,
  QrCode,
  Car,
  User,
  Phone,
} from "lucide-react";
import html2canvas from "html2canvas";

interface FormData {
  carNumber: string;
  userName: string;
  phoneNumber: string;
}

interface QRCodeData extends FormData {
  id: string;
  status: string;
  createdAt: Timestamp;
}

const Unauthorize: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    carNumber: "",
    userName: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [generatingImage, setGeneratingImage] = useState<boolean>(false);
  const [qrImageUrl, setQrImageUrl] = useState<string>("");
  const qrCardRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const generateQRCode = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      if (!formData.carNumber || !formData.userName || !formData.phoneNumber) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill all required fields",
        });
        setLoading(false);
        return;
      }

      // Basic phone validation (10 digits)
      if (!/^\d{10}$/.test(formData.phoneNumber)) {
        toast({
          variant: "destructive",
          title: "Invalid Phone Number",
          description:
            "Please enter a valid 10-digit number (without country code)",
        });
        setLoading(false);
        return;
      }

      // Create booking data (store with +91 prefix)
      const bookingData = {
        carNumber: formData.carNumber,
        userName: formData.userName,
        phoneNumber: `+91${formData.phoneNumber}`, // Add +91 prefix for storage
        status: "unauthorized",
        createdAt: Timestamp.now(),
      };

      // Save to Firebase
      const docRef = await addDoc(
        collection(db, "unauthorizedBookings"),
        bookingData
      );

      // Generate QR code data and URL
      const qrData: QRCodeData = {
        id: docRef.id,
        ...bookingData,
      };

      // Create a URL for the QR code viewer page
      const qrCodeUrl = `${window.location.origin}/qr-viewer?id=${docRef.id}`;
      setQrCodeUrl(qrCodeUrl);
      setQrCodeData(qrData);

      // Pre-generate the QR image for faster sharing
      if (qrCardRef.current) {
        try {
          const canvas = await html2canvas(qrCardRef.current, {
            scale: 2,
            backgroundColor: "#ffffff",
            logging: false,
          });
          const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
          setQrImageUrl(dataUrl);
        } catch (err) {
          console.error("Error pre-generating QR image:", err);
        }
      }

      toast({
        title: "Success!",
        description: "QR Code generated successfully",
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate QR code",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadQRImage = async (): Promise<void> => {
    // Get or generate QR image
    let imageUrl = qrImageUrl;

    if (!imageUrl && qrCardRef.current) {
      try {
        setGeneratingImage(true);
        const canvas = await html2canvas(qrCardRef.current, {
          scale: 2,
          backgroundColor: "#ffffff",
        });
        imageUrl = canvas.toDataURL("image/jpeg", 0.95);
        setQrImageUrl(imageUrl);
      } catch (error) {
        console.error("Error generating QR image:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not generate QR image",
        });
        setGeneratingImage(false);
        return;
      } finally {
        setGeneratingImage(false);
      }
    }

    if (imageUrl) {
      // Create and trigger download
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `parking-qr-${qrCodeData?.carNumber || "code"}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "QR Code Downloaded",
        description: "QR image has been downloaded successfully",
      });
    }
  };

  const openWhatsAppWithLink = (): void => {
    if (!qrCodeData) return;

    // Prepare message with formatting and link
    const whatsappText = `🅿️ *Parking QR Code for ${qrCodeData.carNumber}*

👤 *Driver:* ${qrCodeData.userName}

🔗 *Click here to view your QR code:*
${qrCodeUrl}

⚠️ Please present this QR at entrance`;

    // Open WhatsApp with the formatted message
    const whatsappUrl = `https://wa.me/${
      qrCodeData.phoneNumber
    }?text=${encodeURIComponent(whatsappText)}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareToWhatsApp = async (): Promise<void> => {
    if (!qrCodeUrl || !qrCodeData) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "QR code not available for sharing",
      });
      return;
    }

    try {
      setGeneratingImage(true);

      // Ensure we have the QR image
      if (!qrImageUrl && qrCardRef.current) {
        const canvas = await html2canvas(qrCardRef.current, {
          scale: 2,
          backgroundColor: "#ffffff",
        });
        const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
        setQrImageUrl(dataUrl);
      }

      // First download the image
      await downloadQRImage();

      // Show toast with instructions
      toast({
        title: "QR Code Downloaded",
        description:
          "Now opening WhatsApp. Please attach the downloaded image when sending the message.",
      });

      // Then open WhatsApp with link (after short delay to ensure download has started)
      setTimeout(() => {
        openWhatsAppWithLink();
      }, 500);
    } catch (error) {
      console.error("Error in WhatsApp sharing process:", error);
      toast({
        variant: "destructive",
        title: "Sharing Error",
        description:
          "Failed to prepare sharing. Please try downloading separately.",
      });
    } finally {
      setGeneratingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Toaster />

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Unauthorized Parking
          </CardTitle>
        </CardHeader>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate QR</TabsTrigger>
            <TabsTrigger value="result" disabled={!qrCodeData}>
              QR Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <CardContent className="space-y-4 pt-6">
              <form onSubmit={generateQRCode} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="carNumber"
                    className="flex items-center gap-2"
                  >
                    <Car className="h-4 w-4" />
                    Car Number
                  </Label>
                  <Input
                    id="carNumber"
                    name="carNumber"
                    value={formData.carNumber}
                    onChange={handleChange}
                    placeholder="e.g., KA01AB1234"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Driver Name
                  </Label>
                  <Input
                    id="userName"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phoneNumber"
                    className="flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    WhatsApp Number
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">+91</span>
                    </div>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="pl-12"
                      placeholder="10-digit number"
                      type="tel"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <QrCode className="h-4 w-4" />
                      Generate QR Code
                    </span>
                  )}
                </Button>
              </form>

              <Alert className="mt-4 bg-blue-50 border-blue-200 text-blue-800 border">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Note</AlertTitle>
                <AlertDescription>
                  This will create an unauthorized parking record and generate a
                  QR code that can be shared via WhatsApp.
                </AlertDescription>
              </Alert>
            </CardContent>
          </TabsContent>

          <TabsContent value="result">
            <CardContent className="pt-6 flex flex-col items-center">
              {qrCodeData && (
                <>
                  {/* This div will be captured as an image for sharing */}
                  <div
                    ref={qrCardRef}
                    className="bg-white p-5 rounded-lg shadow-sm mb-6 border w-full max-w-[280px]"
                  >
                    <div className="text-center mb-3">
                      <h3 className="font-semibold text-lg">
                        {qrCodeData.carNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {qrCodeData.userName}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <QRCodeSVG
                        value={qrCodeUrl}
                        size={200}
                        level="H"
                        includeMargin={true}
                      />
                    </div>

                    <div className="mt-3 text-center">
                      <div className="text-xs text-gray-500">
                        Scan to verify unauthorized parking
                      </div>
                      <div className="mt-1 text-sm font-medium">
                        {new Date(
                          qrCodeData.createdAt.toDate()
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 w-full">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-sm text-gray-500">
                          Car Number
                        </span>
                        <p className="font-medium">{qrCodeData.carNumber}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Driver</span>
                        <p className="font-medium">{qrCodeData.userName}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-gray-500">WhatsApp</span>
                      <p className="font-medium">{qrCodeData.phoneNumber}</p>
                    </div>

                    <Alert className="mt-2 p-3 bg-amber-50 border-amber-200 text-amber-800 border">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        To share with QR image, first tap Share to WhatsApp.
                        Download the image when prompted, then attach it to the
                        WhatsApp message.
                      </AlertDescription>
                    </Alert>

                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={shareToWhatsApp}
                        className="flex-1"
                        variant="default"
                        disabled={generatingImage}
                      >
                        {generatingImage ? (
                          <span className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                            Processing...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share to WhatsApp
                          </span>
                        )}
                      </Button>

                      <Button
                        onClick={downloadQRImage}
                        className="flex-1"
                        variant="outline"
                        disabled={generatingImage}
                      >
                        {generatingImage ? (
                          <span className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                            Processing...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Download className="h-4 w-4 mr-2" />
                            Download QR
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Unauthorize;
