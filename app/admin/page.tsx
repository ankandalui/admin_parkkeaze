"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Admin/Sidebar";
// import { StatsGrid } from "@/components/Admin/StatsGrid";
import { ContentArea } from "@/components/Admin/ContentArea";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-8">
          {/* <StatsGrid /> */}
          <ContentArea activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
}
