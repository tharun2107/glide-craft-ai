import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Loader2, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

interface Template {
  id: string;
  name: string;
  description: string;
  theme_config: any;
}

const CreatePresentation = () => {
  const [prompt, setPrompt] = useState("");
  const [slideCount, setSlideCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
    });

    loadTemplates();
  }, [navigate]);

  const loadTemplates = async () => {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at');
    
    if (!error && data) {
      setTemplates(data);
      setSelectedTemplate(data[0]?.id || null);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for your presentation");
      return;
    }

    if (!selectedTemplate) {
      toast.error("Please select a template");
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-slides', {
        body: { 
          prompt, 
          slideCount,
          templateId: selectedTemplate
        }
      });

      if (error) throw error;

      toast.success(`Presentation created with ${data.slideCount} slides!`);
      navigate(`/editor/${data.presentationId}`);
    } catch (error) {
      console.error('Error generating slides:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate presentation');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="container max-w-4xl">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Slide Generation</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Create Your Presentation
            <span className="block bg-gradient-primary bg-clip-text text-transparent mt-2">
              With AI
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Describe what you need, and AI will create professional slides instantly
          </p>
        </div>

        <Card className="p-8 shadow-elegant border-border animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="space-y-6">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Choose a Template
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === template.id
                        ? 'ring-2 ring-primary shadow-elegant'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="relative">
                      {selectedTemplate === template.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      <div 
                        className="w-full h-20 rounded mb-2"
                        style={{ 
                          background: template.theme_config.backgroundColor,
                          border: `2px solid ${template.theme_config.primaryColor}`
                        }}
                      />
                      <h4 className="font-semibold text-sm">{template.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Describe your presentation
              </label>
              <Textarea
                placeholder="e.g., Create a 10-slide pitch deck for my sustainable fashion startup called EcoThreads that makes clothing from recycled ocean plastic..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Be specific about your topic, audience, and key points you want to cover
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Number of slides: {slideCount}
              </label>
              <input
                type="range"
                min="3"
                max="15"
                value={slideCount}
                onChange={(e) => setSlideCount(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>3 slides</span>
                <span>15 slides</span>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Generating Your Presentation...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 w-5 h-5" />
                  Generate Presentation
                </>
              )}
            </Button>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">~30s</div>
                <div className="text-xs text-muted-foreground mt-1">Generation time</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">AI</div>
                <div className="text-xs text-muted-foreground mt-1">Gemini 2.0 Flash</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">100%</div>
                <div className="text-xs text-muted-foreground mt-1">Editable</div>
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>After generation, you'll be able to edit every element manually</p>
        </div>
      </div>
    </div>
  );
};

export default CreatePresentation;
