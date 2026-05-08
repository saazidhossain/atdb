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
      <RevealOnScroll><EquipmentCategories /></RevealOnScroll>
      <SectionDivider />
      <RevealOnScroll><FeaturedEquipment /></RevealOnScroll>
      <SectionDivider />
      <RevealOnScroll><LiveFleetPhotos /></RevealOnScroll>
      <SectionDivider />
      <RevealOnScroll><WhyATDB /></RevealOnScroll>
      <SectionDivider />
      <RevealOnScroll><ProjectHighlights /></RevealOnScroll>
      <SectionDivider />
      <RevealOnScroll className="block w-full max-w-full overflow-hidden"><StandardsStrip /></RevealOnScroll>
      <SectionDivider />
      <RevealOnScroll><CTASection /></RevealOnScroll>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
