"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Users, Target, Rocket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function About() {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1607286966263-af9fed5a735c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Modern office"
            fill
            className="object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-5xl font-bold mb-6">About ParkEaze</h1>
          <p className="text-xl max-w-2xl">
            Revolutionizing parking management through innovation and technology
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6">
                ParkEaze was born from a vision to transform the way people
                think about and interact with parking spaces. In an increasingly
                urban world, we recognized the need for smarter, more efficient
                parking solutions.
              </p>
              <p className="text-gray-600 mb-6">
                Our journey began with a simple idea: make parking hassle-free
                for everyone. Today, we're proud to be at the forefront of
                parking innovation, serving communities and businesses across
                the globe.
              </p>
              <div className="text-2xl font-bold mb-4">
                Proudly created by{" "}
                <Link
                  href="https://spartans.vercel.app"
                  target="_blank"
                  className="relative group"
                >
                  <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse hover:from-purple-500 hover:to-blue-500 transition-all duration-2000 ease-in-out">
                    ZeroTech
                  </span>
                  <span className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 group-hover:opacity-50 blur-lg transition-all duration-2000 ease-in-out"></span>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">10K+</h3>
                <p className="text-gray-600">Happy Users</p>
              </Card>
              <Card className="p-6 text-center">
                <Car className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">50+</h3>
                <p className="text-gray-600">Parking Locations</p>
              </Card>
              <Card className="p-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">99%</h3>
                <p className="text-gray-600">Satisfaction Rate</p>
              </Card>
              <Card className="p-6 text-center">
                <Rocket className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">24/7</h3>
                <p className="text-gray-600">Support</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Innovation</h3>
              <p className="text-gray-600">
                We continuously push the boundaries of what's possible in
                parking management technology.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Reliability</h3>
              <p className="text-gray-600">
                Our systems are built to be dependable, ensuring seamless
                parking experiences every time.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Sustainability</h3>
              <p className="text-gray-600">
                We're committed to creating eco-friendly parking solutions for a
                better future.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
          <p className="text-xl mb-8">Be part of the parking revolution</p>
          <Link href="/contact">
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
