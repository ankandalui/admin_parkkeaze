"use client";

import { Button } from "@/components/ui/button";
import {
  BarChart,
  Users,
  ParkingCircle,
  CreditCard,
  LogOut,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navItems = [
    { id: "overview", icon: BarChart, label: "Overview" },
    { id: "users", icon: Users, label: "Users" },
    { id: "parking", icon: ParkingCircle, label: "Parking Spaces" },
    { id: "payments", icon: CreditCard, label: "Payments" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md h-screen p-4 fixed top-0 left-0">
      <div className="space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-2 p-2 rounded ${
                activeTab === item.id
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
