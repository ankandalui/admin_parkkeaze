"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DevelopmentPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 text-center">
        <div className="mb-8">
          <div className="text-9xl mb-6">😢</div>
          <Construction className="h-16 w-16 mx-auto mb-6 text-primary animate-bounce" />
          <h1 className="text-4xl font-bold mb-4">Under Development</h1>
          <p className="text-gray-600 text-lg mb-8">
            We're sorry, but this application is currently in the development
            phase and hasn't been published yet. Our team is working hard to
            bring you an amazing parking management experience soon!
          </p>
          <div className="text-sm text-gray-500 mb-8">
            Expected Launch Date: Coming Soon
          </div>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Homepage
            </Button>
          </Link>
          <Link href="/contact">
            <Button className="w-full">Get Notified When We Launch</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
