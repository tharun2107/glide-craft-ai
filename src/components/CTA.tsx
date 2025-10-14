import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-primary opacity-95" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-full text-white text-sm font-medium">
            <Zap className="w-4 h-4" />
            <span>Start Creating in Seconds</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
            Ready to Create Your
            <span className="block">Best Presentation Yet?</span>
          </h2>

          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals, educators, and creators who are making stunning presentations 
            faster than ever with SliderMaker AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-glow group">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
              Schedule a Demo
            </Button>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">Free Forever</div>
              <div className="text-white/80 text-sm">No credit card required</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">Unlimited</div>
              <div className="text-white/80 text-sm">Presentations & exports</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-white/80 text-sm">AI assistant support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
