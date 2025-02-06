// Type 2 for next js admin code

import { Firestore, Timestamp } from "firebase/firestore";

import React, { ReactNode } from "react";
export type accountOptionType = {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  routeName?: any;
};

export type TransactionType = {
  id?: string;
  type: string;
  amount: number;
  category?: string;
  date: Date | Timestamp | string;
  description?: string;
  image?: any;
  uid?: string;
  walletId: string;
};

export type TransactionListType = {
  data: TransactionType[];
  title?: string;
  loading?: boolean;
  emptyListMessage?: string;
};

export type TransactionItemProps = {
  item: TransactionType;
  index: number;
  handleClick: Function;
};

export type UserType = {
  uid?: string;
  email?: string | null;
  name: string | null;
  image?: any;
} | null;

export type UserDataType = {
  name: string;
  image?: any;
};

export type AuthContextType = {
  user: UserType;
  setUser: Function;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; msg?: string }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; msg?: string }>;
  updateUserData: (userId: string) => Promise<void>;
};

export type ResponseType = {
  success: boolean;
  data?: any;
  msg?: string;
};

// export type WalletType = {
//   id?: string;
//   name: string;
//   amount?: number;
//   totalIncome?: number;
//   totalExpenses?: number;
//   image: any;
//   uid?: string;
//   created?: Date;
// };

export interface FloorType {
  floorNumber: string; // e.g., "G", "1", "2", etc.
  floorName: string; // e.g., "Ground Floor", "First Floor"
  slots: SlotType[];
}

export interface SlotType {
  id: string; // e.g., "A01", "B02"
  slotNumber: string; // Display name for the slot
}

export type ParkingSpotType = {
  id: string;
  locationName: string; // Name of the location (e.g., "Central Mall")
  parkingName: string; // Name of the specific parking (e.g., "West Wing Parking")
  latitude: number;
  longitude: number;
  type: "public" | "private";
  price: number | null; // null or 0 means free
  totalSpots: number;
  floors: FloorType[];
  description?: string;
  features?: string[];
  operatingHours: {
    open: string;
    close: string;
  };
  address: string;
  rating?: number;
  reviews?: number;
};

export type ParkingSearchFilters = {
  type?: "public" | "private" | "all";
  maxPrice?: number;
  minAvailableSpots?: number;
  features?: string[];
  radius?: number; // in kilometers
};

export type CarType = "suv" | "sedan" | "coupe";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type BookingType = {
  id?: string;
  // User Details (from auth)
  userId: string;
  userName: string;
  userEmail: string;

  // Additional User Input
  phoneNumber: string;

  // Car Details
  carType: CarType;
  carName: string;
  carNumber: string;

  // Parking & Payment Details
  parkingSpotId: string;
  parkingSpotDetails: ParkingSpotType;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  amount: number;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Optional fields for future use
  specialRequests?: string;
  cancellationReason?: string;
};

export type PaymentDetailsType = {
  bookingId: string;
  amount: number;
  parkingName: string;
  transactionId?: string; // Generated after successful payment
  paymentTime?: Timestamp;
  status: PaymentStatus;
};

export type BookingResponseType = ResponseType & {
  bookingId?: string;
  paymentDetails?: PaymentDetailsType;
};
export interface LatLng {
  lat: number;
  lng: number;
}

export interface ParkingFormData {
  locationName: string;
  parkingName: string;
  type: "public" | "private";
  totalSpots: string;
  price: string;
  address: string;
  openTime: string;
  closeTime: string;
  features: string;
  description: string;
  floors: FloorType[];
}
