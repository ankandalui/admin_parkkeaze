"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Car, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAxQCp83uUp9HGl0XezV4KSynuzaDP-x8g",
  authDomain: "parking-ba468.firebaseapp.com",
  projectId: "parking-ba468",
  storageBucket: "parking-ba468.firebasestorage.app",
  messagingSenderId: "969164155593",
  appId: "1:969164155593:web:f0a9783ed55db86288bb18",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const carTypeOptions = [
  { label: "Sedan", value: "sedan" },
  { label: "SUV", value: "suv" },
  { label: "Coupe", value: "coupe" },
];

const paymentMethods = [
  {
    id: "upi",
    name: "UPI Payment",
    description: "Pay using any UPI app",
  },
  {
    id: "card",
    name: "Credit/Debit Card",
    description: "Pay using your card",
  },
  {
    id: "netbanking",
    name: "Net Banking",
    description: "Pay using net banking",
  },
];

export default function UnAuthBookings() {
  const [form, setForm] = useState({
    userId: "",
    userName: "",
    userEmail: "",
    phoneNumber: "",
    carType: "sedan",
    carName: "",
    carNumber: "",
    hours: "1",
    minutes: "0",
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("upi");
  const [loading, setLoading] = useState(false);

  const basePrice = 40; // Base price per hour
  const totalHours = Number(form.hours) + Number(form.minutes) / 60;
  const totalAmount =
    totalHours <= 1 ? basePrice : basePrice + basePrice * (totalHours - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.userName ||
      !form.userEmail ||
      !form.phoneNumber ||
      !form.carName ||
      !form.carNumber
    ) {
      alert("Please fill all fields");
      return;
    }

    if (!/^\d{10}$/.test(form.phoneNumber)) {
      alert("Please enter a valid phone number");
      return;
    }

    const totalHours = Number(form.hours) + Number(form.minutes) / 60;
    if (totalHours < 5 / 60) {
      alert("Minimum booking duration is 5 minutes");
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const startTime = new Date();
      const endTime = new Date(
        startTime.getTime() + totalHours * 60 * 60 * 1000
      );
      const transactionId = `TXN${Date.now()}`;

      // Save booking to Firestore
      const bookingData = {
        userId: form.userId,
        userName: form.userName,
        userEmail: form.userEmail,
        phoneNumber: form.phoneNumber,
        carType: form.carType,
        carName: form.carName,
        carNumber: form.carNumber,
        startTime,
        endTime,
        duration: totalHours,
        amount: totalAmount,
        paymentMethod: selectedPaymentMethod,
        transactionId,
        bookingStatus: "confirmed",
        paymentStatus: "paid",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "bookings"), bookingData);

      alert(`Payment successful! Booking confirmed. Booking ID: ${docRef.id}`);
      setShowPaymentModal(false);

      // Reset form
      setForm({
        userId: "",
        userName: "",
        userEmail: "",
        phoneNumber: "",
        carType: "sedan",
        carName: "",
        carNumber: "",
        hours: "1",
        minutes: "0",
      });
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto space-y-8">
        {/* <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-6">Scan to Share Booking</h1>
          <div className="bg-white p-4 rounded-lg inline-block"></div>
          <p className="mt-4 text-gray-600">
            Share this QR code to let others make parking reservations
          </p>
        </Card> */}

        <Card className="p-6">
          <h1 className="text-2xl font-bold text-center mb-6">ParkEaze</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">User Name</Label>
              <Input
                id="userName"
                type="text"
                value={form.userName}
                onChange={(e) => setForm({ ...form, userName: e.target.value })}
                placeholder="Enter your name"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Email</Label>
              <Input
                id="userEmail"
                type="email"
                value={form.userEmail}
                onChange={(e) =>
                  setForm({ ...form, userEmail: e.target.value })
                }
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
                placeholder="Enter your phone number"
                maxLength={10}
              />
            </div>

            <div className="space-y-2">
              <Label>Car Type</Label>
              <Select
                value={form.carType}
                onValueChange={(value) => setForm({ ...form, carType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select car type" />
                </SelectTrigger>
                <SelectContent>
                  {carTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="carName">Car Name</Label>
              <div className="relative">
                <Input
                  id="carName"
                  value={form.carName}
                  onChange={(e) =>
                    setForm({ ...form, carName: e.target.value })
                  }
                  placeholder="Enter car name"
                  className="pl-10"
                />
                <Car className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="carNumber">Car Number</Label>
              <Input
                id="carNumber"
                value={form.carNumber}
                onChange={(e) =>
                  setForm({ ...form, carNumber: e.target.value.toUpperCase() })
                }
                placeholder="Enter car number"
                className="uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hours">Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  max="24"
                  value={form.hours}
                  onChange={(e) => setForm({ ...form, hours: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minutes">Minutes</Label>
                <Input
                  id="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={form.minutes}
                  onChange={(e) =>
                    setForm({ ...form, minutes: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Base price (first hour)</span>
                <span>₹{basePrice}</span>
              </div>
              {totalHours > 1 && (
                <div className="flex justify-between mb-2">
                  <span>Additional time</span>
                  <span>₹{(totalAmount - basePrice).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold">
                <span>Total Amount</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Continue to Payment
            </Button>
          </form>
        </Card>

        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
            </DialogHeader>

            <div className="bg-primary/5 p-4 rounded-lg text-center mb-4">
              <div className="text-sm">Amount to Pay</div>
              <div className="text-2xl font-bold text-primary">
                ₹{totalAmount.toFixed(2)}
              </div>
            </div>

            <RadioGroup
              value={selectedPaymentMethod}
              onValueChange={setSelectedPaymentMethod}
              className="gap-4"
            >
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer ${
                    selectedPaymentMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-200"
                  }`}
                >
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-gray-500">
                      {method.description}
                    </div>
                  </Label>
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </RadioGroup>

            <Button
              onClick={handlePayment}
              disabled={loading}
              className="w-full mt-4"
            >
              {loading ? "Processing..." : "Pay Now"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
