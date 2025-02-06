import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Transform Your Parking Management?
        </h2>
        <p className="text-xl mb-8">
          Join thousands of satisfied customers who trust ParkEaze
        </p>
        <Link href="/contact">
          <Button
            size="lg"
            variant="outline"
            className="text-black border-white hover:text-white hover:bg-white/10"
          >
            Contact Sales
          </Button>
        </Link>
      </div>
    </section>
  );
}
