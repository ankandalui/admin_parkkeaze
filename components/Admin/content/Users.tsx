// components/admin/content/Users.tsx
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { UserType, BookingType } from "@/types";

interface ExtendedUserType {
  uid: string;
  email: string | null;
  name: string | null;
  image?: any;
  bookings?: BookingType[];
  latestBooking?: BookingType;
}

export function Users() {
  const [users, setUsers] = useState<ExtendedUserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateUserData = async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          uid: docSnap.id,
          email: data.email || null,
          name: data.name || null,
          image: data.image || null,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  const fetchUsers = async () => {
    try {
      // Get all users
      const usersQuery = query(collection(db, "users"));
      const userSnapshots = await getDocs(usersQuery);
      const usersData: ExtendedUserType[] = [];

      // Fetch each user's data and bookings
      for (const userDoc of userSnapshots.docs) {
        const userData = await updateUserData(userDoc.id);
        if (userData) {
          // Get user's bookings
          const bookingsQuery = query(collection(db, "bookings"));
          const bookingSnapshots = await getDocs(bookingsQuery);
          const bookings = bookingSnapshots.docs
            .map(
              (doc) =>
                ({
                  id: doc.id,
                  ...doc.data(),
                } as BookingType)
            )
            .filter(
              (booking) => booking.userId === userDoc.id
            ) as BookingType[];

          // Add bookings to user data
          usersData.push({
            ...userData,
            bookings,
            latestBooking: bookings[0],
          });
        }
      }

      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch user data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <Card className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Latest Booking</TableHead>
            <TableHead>Car Details</TableHead>
            <TableHead>Total Bookings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.uid}>
              <TableCell>{user.name || "N/A"}</TableCell>
              <TableCell>{user.email || "N/A"}</TableCell>
              <TableCell>{user.latestBooking?.phoneNumber || "N/A"}</TableCell>
              <TableCell>
                {user.latestBooking
                  ? new Date(
                      user.latestBooking.createdAt.toDate()
                    ).toLocaleDateString()
                  : "No bookings"}
              </TableCell>
              <TableCell>
                {user.latestBooking ? (
                  <div>
                    <div>{user.latestBooking.carName}</div>
                    <div className="text-sm text-gray-500">
                      {user.latestBooking.carNumber}
                    </div>
                  </div>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>{user.bookings?.length || 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
