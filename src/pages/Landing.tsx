import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LabPreview } from "@/components/landing/LabPreview";

const Landing = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Hero />
      <HowItWorks />
      <LabPreview />
    </main>
  );
};

export default Landing;
