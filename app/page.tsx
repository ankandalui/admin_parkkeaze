import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { VideoSection } from "@/components/VideoSection";
import { CTASection } from "@/components/CTASection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { PresentationSlider } from "@/components/PresentationSlider";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PresentationSlider />
      <VideoSection />
      <CTASection />
      <Toaster />
      <Footer />
    </div>
  );
}
