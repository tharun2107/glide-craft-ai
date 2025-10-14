import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import ChatPreview from "@/components/ChatPreview";
import EditorPreview from "@/components/EditorPreview";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <ChatPreview />
        <EditorPreview />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
