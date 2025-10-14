import { Card } from "@/components/ui/card";
import { MousePointer2, Type, Image, Palette, Layout } from "lucide-react";

const EditorPreview = () => {
  const tools = [
    { icon: MousePointer2, label: "Select" },
    { icon: Type, label: "Text" },
    { icon: Image, label: "Image" },
    { icon: Palette, label: "Colors" },
    { icon: Layout, label: "Layout" }
  ];

  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Description */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Edit3Icon className="w-4 h-4" />
              <span>Professional Editing</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold">
              Edit Like a Pro
              <span className="block bg-gradient-primary bg-clip-text text-transparent mt-2">
                Direct Control
              </span>
            </h2>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Click to edit, drag to move, customize everything. Professional editing tools that respond instantly—
              no waiting for AI, just pure creative control at your fingertips.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-secondary flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Pixel-Perfect Positioning</h4>
                  <p className="text-muted-foreground text-sm">Drag elements with smart guides and snap-to-grid for perfect alignment</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-secondary flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Rich Text Formatting</h4>
                  <p className="text-muted-foreground text-sm">Full typography controls with font management and style presets</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-secondary flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Layer Management</h4>
                  <p className="text-muted-foreground text-sm">Organize complex slides with layer system and grouping</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Editor Interface Preview */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Card className="shadow-elegant border-border overflow-hidden">
              {/* Toolbar */}
              <div className="bg-card border-b border-border p-3 flex items-center gap-2">
                {tools.map((tool, index) => (
                  <button 
                    key={index}
                    className={`p-2 rounded-lg hover:bg-accent transition-colors ${
                      index === 0 ? 'bg-primary text-primary-foreground' : ''
                    }`}
                  >
                    <tool.icon className="w-4 h-4" />
                  </button>
                ))}
                <div className="flex-1" />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>100%</span>
                </div>
              </div>

              {/* Canvas */}
              <div className="p-8 bg-muted/30 min-h-96 relative">
                {/* Slide preview */}
                <div className="bg-white rounded-lg shadow-card p-8 max-w-2xl mx-auto relative group">
                  <div className="space-y-6">
                    <div className="relative">
                      <h1 className="text-3xl font-bold text-gray-900">
                        EcoThreads
                      </h1>
                      <p className="text-lg text-gray-600 mt-2">
                        Sustainable Fashion from Ocean Plastic
                      </p>
                      
                      {/* Editing handles */}
                      <div className="absolute -top-2 -left-2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute -top-2 -right-2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i}
                          className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg relative group/item"
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Image className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded w-full" />
                      <div className="h-2 bg-gray-200 rounded w-5/6" />
                      <div className="h-2 bg-gray-200 rounded w-4/6" />
                    </div>
                  </div>

                  {/* Selection indicator */}
                  <div className="absolute inset-0 border-2 border-primary rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

                {/* Floating property panel */}
                <div className="absolute bottom-8 right-8 bg-card border border-border rounded-xl shadow-elegant p-4 space-y-3 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <div className="text-xs font-semibold text-muted-foreground">Properties</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Font Size</span>
                      <span className="font-medium">24px</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Color</span>
                      <div className="w-4 h-4 rounded bg-gradient-primary" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Opacity</span>
                      <span className="font-medium">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

const Edit3Icon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

export default EditorPreview;
