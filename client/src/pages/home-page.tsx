import { useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home/features-section";
import CarbonEstimatorSection from "@/components/home/carbon-estimator-section";
import GamificationSection from "@/components/home/gamification-section";
import DashboardPreviewSection from "@/components/home/dashboard-preview-section";

export default function HomePage() {
  // Scroll to section if URL contains hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        // Add a small delay to ensure all elements are loaded
        setTimeout(() => {
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY - 80, // Adjust for navbar height
            behavior: 'smooth'
          });
        }, 100);
      }
    } else {
      // Scroll to top if no hash
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <HeroSection />
        <FeaturesSection />
        <CarbonEstimatorSection />
        <GamificationSection />
        <DashboardPreviewSection />
      </main>
      <Footer />
    </div>
  );
}
