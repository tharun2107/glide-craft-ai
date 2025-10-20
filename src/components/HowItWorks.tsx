import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Wand2, Edit, Download } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    title: "1. Describe Your Vision",
    description: "Tell our AI what you need in natural language. 'Create a pitch deck for my startup' or 'Make slides about climate change.'",
    color: "from-purple-500 to-blue-500"
  },
  {
    icon: Wand2,
    title: "2. AI Generates Instantly",
    description: "Watch as AI creates professional slides in seconds. Complete with content, layouts, and stunning visuals powered by advanced AI.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Edit,
    title: "3. Perfect with Manual Editing",
    description: "Click to edit text, drag elements, customize colors. Full control with direct manipulation - no prompting needed.",
    color: "from-cyan-500 to-green-500"
  },
  {
    icon: Download,
    title: "4. Export & Share",
    description: "Download as PowerPoint, PDF, or share online. Full compatibility with all platforms and perfect formatting preserved.",
    color: "from-green-500 to-emerald-500"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gradient-subtle" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            From Idea to Presentation
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              In 4 Simple Steps
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            The perfect workflow combining AI speed with manual precision
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className="relative overflow-hidden group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 animate-fade-in border-border"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              
              <CardContent className="p-6 space-y-4 relative">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
            <span className="font-medium">Average time: 3 minutes from start to final presentation</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
