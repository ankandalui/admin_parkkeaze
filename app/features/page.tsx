"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Car,
  Shield,
  CreditCard,
  Users,
  Smartphone,
  Bell,
  BarChart,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Features() {
  const features = [
    {
      icon: <Car className="h-8 w-8" />,
      title: "Smart Parking Detection",
      description:
        "Real-time monitoring of parking spaces using IoT sensors for accurate availability tracking.",
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile App Integration",
      description:
        "Book and manage parking spots directly from your smartphone with our user-friendly app.",
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Contactless Payments",
      description:
        "Secure and convenient digital payment options for hassle-free transactions.",
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: "Smart Notifications",
      description:
        "Get real-time alerts about your parking status, expiration times, and available spots.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enhanced Security",
      description:
        "24/7 surveillance and secure access control for peace of mind.",
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: "Analytics Dashboard",
      description:
        "Comprehensive insights into parking patterns and usage statistics.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "User Management",
      description:
        "Efficient handling of user accounts, permissions, and preferences.",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Automated Scheduling",
      description:
        "Advanced booking system with recurring reservation options.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1610030181087-540017dc9d61?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Smart parking technology"
            fill
            className="object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-5xl font-bold mb-6">
            Cutting-Edge Parking Features
          </h1>
          <p className="text-xl max-w-2xl">
            Discover how our smart parking solutions revolutionize the way you
            park
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the future of parking management with our comprehensive
              suite of features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Transform your parking experience with our innovative solutions
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              variant="outline"
              className="text-black border-white hover:bg-white/10"
            >
              Request Demo
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
