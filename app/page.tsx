import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { VideoSection } from "@/components/VideoSection";
import { CTASection } from "@/components/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <VideoSection />
      <CTASection />
    </div>
  );
}
