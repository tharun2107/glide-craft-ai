import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AddSlideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presentationId: string;
  slideNumber: number;
  onSlideAdded: (slide: any) => void;
}

export const AddSlideDialog = ({
  open,
  onOpenChange,
  presentationId,
  slideNumber,
  onSlideAdded,
}: AddSlideDialogProps) => {
  const [useAI, setUseAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [generateImages, setGenerateImages] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddBlankSlide = async () => {
    try {
      const { data, error } = await supabase
        .from('slides')
        .insert({
          presentation_id: presentationId,
          slide_number: slideNumber,
          title: 'New Slide',
          content: { heading: '', bullets: [] },
          layout: 'title-content'
        })
        .select()
        .single();

      if (error) throw error;

      onSlideAdded(data);
      onOpenChange(false);
      toast.success('Blank slide added');
    } catch (error) {
      console.error('Error adding slide:', error);
      toast.error('Failed to add slide');
    }
  };

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a prompt for the slide');
      return;
    }

    setIsGenerating(true);
    try {
      // Call AI to generate slide content
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message: `Generate a single slide about: ${aiPrompt}. Return ONLY valid JSON in this format: {"title": "Slide Title", "content": {"heading": "Main Heading", "bullets": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"]}}`,
          context: 'Generate slide content'
        }
      });

      if (error) throw error;

      let slideData;
      try {
        const cleanText = data.response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        slideData = JSON.parse(cleanText);
      } catch {
        // If parsing fails, create a basic structure
        slideData = {
          title: aiPrompt,
          content: {
            heading: aiPrompt,
            bullets: [
              'Key point about ' + aiPrompt,
              'Important detail to consider',
              'Supporting information',
              'Additional context',
              'Summary point'
            ]
          }
        };
      }

      // Generate image if requested
      if (generateImages) {
        try {
          const { data: imageData } = await supabase.functions.invoke('generate-image', {
            body: { 
              prompt: `Professional illustration for: ${slideData.title || aiPrompt}` 
            }
          });

          if (imageData?.imageUrl) {
            slideData.content.images = [{ url: imageData.imageUrl, alt: slideData.title }];
          }
        } catch (imgError) {
          console.error('Image generation failed:', imgError);
          // Continue without image
        }
      }

      // Insert the generated slide
      const { data: insertedSlide, error: insertError } = await supabase
        .from('slides')
        .insert({
          presentation_id: presentationId,
          slide_number: slideNumber,
          title: slideData.title || 'New Slide',
          content: slideData.content || { heading: '', bullets: [] },
          layout: generateImages ? 'image-right' : 'title-content'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      onSlideAdded(insertedSlide);
      onOpenChange(false);
      toast.success('AI-generated slide added');
    } catch (error) {
      console.error('Error generating slide:', error);
      toast.error('Failed to generate slide with AI');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Slide</DialogTitle>
          <DialogDescription>
            Choose to add a blank slide or generate one with AI
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* AI Generation Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="use-ai"
              checked={useAI}
              onCheckedChange={(checked) => setUseAI(checked as boolean)}
            />
            <Label
              htmlFor="use-ai"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              Generate with AI
            </Label>
          </div>

          {useAI && (
            <>
              <div className="space-y-2">
                <Label htmlFor="prompt">What should this slide be about?</Label>
                <Input
                  id="prompt"
                  placeholder="e.g., Benefits of renewable energy"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="generate-images"
                  checked={generateImages}
                  onCheckedChange={(checked) => setGenerateImages(checked as boolean)}
                />
                <Label
                  htmlFor="generate-images"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Generate image for slide
                </Label>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {useAI ? (
            <Button onClick={handleGenerateWithAI} disabled={isGenerating}>
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Slide'}
            </Button>
          ) : (
            <Button onClick={handleAddBlankSlide}>
              <Plus className="w-4 h-4 mr-2" />
              Add Blank Slide
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
