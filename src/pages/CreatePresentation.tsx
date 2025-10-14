import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CreatePresentation = () => {
  const [prompt, setPrompt] = useState("");
  const [slideCount, setSlideCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for your presentation");
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-slides', {
        body: { prompt, slideCount }
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
