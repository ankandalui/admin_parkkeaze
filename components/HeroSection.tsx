import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative h-[90vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
          alt="Parking lot"
          fill
          className="object-cover brightness-50"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Smart Parking Management <br />
          Made Simple
        </h1>
        <p className="text-xl mb-8 max-w-2xl">
          Transform your parking operations with ParkEaze. Real-time monitoring,
          automated payments, and seamless user experience.
        </p>
        <div className="space-x-4">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-black border-white hover:text-white hover:bg-white/10"
          >
            Watch Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
