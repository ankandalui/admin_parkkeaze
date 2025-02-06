"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Car, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">ParkEaze</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary">Home</Link>
            <Link href="/features" className="text-gray-700 hover:text-primary">Features</Link>
            <Link href="/pricing" className="text-gray-700 hover:text-primary">Pricing</Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary">Contact</Link>
            <Link href="/admin">
              <Button variant="default">Admin Dashboard</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-primary">Home</Link>
              <Link href="/features" className="block px-3 py-2 text-gray-700 hover:text-primary">Features</Link>
              <Link href="/pricing" className="block px-3 py-2 text-gray-700 hover:text-primary">Pricing</Link>
              <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-primary">Contact</Link>
              <Link href="/admin" className="block px-3 py-2">
                <Button variant="default" className="w-full">Admin Dashboard</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}