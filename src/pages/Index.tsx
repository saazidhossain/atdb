import { useEffect } from "react";
import Lenis from "lenis";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import HeroGallery from "@/components/home/HeroGallery";
import EquipmentCategories from "@/components/home/EquipmentCategories";
import FeaturedEquipment from "@/components/home/FeaturedEquipment";
import LiveFleetPhotos from "@/components/home/LiveFleetPhotos";
import ProjectHighlights from "@/components/home/ProjectHighlights";
import StandardsStrip from "@/components/home/StandardsStrip";
import ScrollProgress from "@/components/ScrollProgress";
import PagePreloader from "@/components/PagePreloader";
import SkeletonShimmer from "@/components/SkeletonShimmer";
import RevealOnScroll from "@/components/RevealOnScroll";
import SectionDivider from "@/components/SectionDivider";
import BrandMarquee from "@/components/home/BrandMarquee";
import WhyATDB from "@/components/home/WhyATDB";
import CTASection from "@/components/home/CTASection";
import WhatsAppFAB from "@/components/WhatsAppFAB";

export default function Index() {
  // Lenis smooth scroll — buttery 120fps momentum scrolling
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      infinite: false,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SkeletonShimmer />
      <PagePreloader />
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <RevealOnScroll><BrandMarquee /></RevealOnScroll>
      <SectionDivider />
      <RevealOnScroll><HeroGallery /></RevealOnScroll>
      <SectionDivider />
      <div className="cv-auto">
        <RevealOnScroll><EquipmentCategories /></RevealOnScroll>
        <SectionDivider />
        <RevealOnScroll><FeaturedEquipment /></RevealOnScroll>
      </div>
      <SectionDivider />
      <div className="cv-auto">
        <RevealOnScroll><LiveFleetPhotos /></RevealOnScroll>
        <SectionDivider />
        <RevealOnScroll><WhyATDB /></RevealOnScroll>
      </div>
      <SectionDivider />
      <div className="cv-auto">
        <RevealOnScroll><ProjectHighlights /></RevealOnScroll>
        <SectionDivider />
        <RevealOnScroll className="block w-full max-w-full overflow-hidden"><StandardsStrip /></RevealOnScroll>
      </div>
      <SectionDivider />
      <RevealOnScroll><CTASection /></RevealOnScroll>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
