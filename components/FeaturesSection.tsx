import { Car, Shield, CreditCard, Users } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose ParkEaze?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Car className="h-8 w-8" />}
            title="Smart Parking"
            description="Real-time parking space monitoring and allocation"
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8" />}
            title="Secure Access"
            description="Advanced security features for controlled access"
          />
          <FeatureCard
            icon={<CreditCard className="h-8 w-8" />}
            title="Easy Payments"
            description="Contactless and automated payment solutions"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="User Management"
            description="Comprehensive user management system"
          />
        </div>
      </div>
    </section>
  );
}
