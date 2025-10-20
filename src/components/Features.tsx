import { MessageSquare, Edit3, Download, Zap, Users, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import featureAiChat from "@/assets/feature-ai-chat.png";
import featureEditor from "@/assets/feature-editor.png";
import featureExport from "@/assets/feature-export.png";

const features = [
  {
    icon: MessageSquare,
    image: featureAiChat,
    title: "Conversational AI Generation",
    description: "Describe your presentation in natural language and watch as AI creates professional slides instantly. Powered by advanced AI for context-aware content.",
    color: "from-purple-500 to-blue-500"
  },
  {
    icon: Edit3,
    image: featureEditor,
    title: "Professional Manual Editing",
    description: "Click to edit text, drag to move elements, and customize every detail. Direct manipulation gives you pixel-perfect control over your presentation.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Download,
    image: featureExport,
    title: "Export Anywhere",
    description: "Export to PowerPoint (.pptx), PDF, or share online. Full compatibility with all major presentation platforms and formats.",
    color: "from-pink-500 to-purple-500"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate complete presentations in under 30 seconds. No waiting, no loading screens - just instant results with AI-powered efficiency.",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Users,
    title: "Real-Time Collaboration",
    description: "Work together with your team in real-time. See changes instantly, leave comments, and collaborate seamlessly on every slide.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Palette,
    title: "Smart Theming",
    description: "AI-powered brand consistency across all slides. Upload your brand assets and maintain perfect visual coherence automatically.",
    color: "from-indigo-500 to-violet-500"
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-background" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need to Create
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Amazing Presentations
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Hybrid approach combining AI power with manual precision for the perfect balance
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 animate-fade-in border-border"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 space-y-4">
                {feature.image ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                )}
                
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
