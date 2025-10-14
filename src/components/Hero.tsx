import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-presentation.png";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-subtle">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Presentation Creation</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Create Stunning
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Presentations
              </span>
              in Minutes
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl">
              Revolutionary presentation maker combining AI-powered generation with professional manual editing. 
              Get the best of both worlds: AI speed with complete creative control.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-elegant group"
                onClick={() => navigate('/create')}
              >
                Start Creating Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-2">
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">10K+</p>
                <p className="text-sm text-muted-foreground">Presentations Created</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">4.9/5</p>
                <p className="text-sm text-muted-foreground">User Rating</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">50%</p>
                <p className="text-sm text-muted-foreground">Faster Creation</p>
              </div>
            </div>
          </div>

          {/* Right column - Hero Image */}
          <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative rounded-2xl overflow-hidden shadow-elegant">
              <img 
                src={heroImage} 
                alt="SliderMaker AI presentation interface showing AI chat and slide editor"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Floating cards */}
            <div className="absolute -top-6 -right-6 bg-card p-4 rounded-xl shadow-card animate-float border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-primary" />
                <div>
                  <p className="text-sm font-semibold">AI Generated</p>
                  <p className="text-xs text-muted-foreground">In 30 seconds</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-card animate-float border border-border" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-accent" />
                <div>
                  <p className="text-sm font-semibold">Manual Editing</p>
                  <p className="text-xs text-muted-foreground">Full control</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
