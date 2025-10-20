import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AIAssistant } from "@/components/AIAssistant";
import { EditorToolbar } from "@/components/EditorToolbar";
import { SlideCanvas } from "@/components/SlideCanvas";
import { SlideThumbnails } from "@/components/SlideThumbnails";
import { ImageGeneratorDialog } from "@/components/ImageGeneratorDialog";
import { ThemesDialog } from "@/components/ThemesDialog";
import { AnimationsDialog } from "@/components/AnimationsDialog";
import { SlideshowPreview } from "@/components/SlideshowPreview";
import type { Session } from "@supabase/supabase-js";

interface Slide {
  id: string;
  slide_number: number;
  title: string | null;
  content: any;
  layout: string;
  background_color: string;
  custom_styles: any;
  animations: any;
}

interface Presentation {
  id: string;
  title: string;
  description: string | null;
  template_id: string | null;
}

interface Template {
  id: string;
  name: string;
  theme_config: any;
}

const SlideEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showImageGen, setShowImageGen] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [showAnimations, setShowAnimations] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [showAI, setShowAI] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      } else {
        loadPresentation();
      }
    });
  }, [id, navigate]);

  const loadPresentation = async () => {
    try {
      const { data: presentationData, error: presentationError } = await supabase
        .from('presentations')
        .select('*')
        .eq('id', id)
        .single();

      if (presentationError) throw presentationError;

      const { data: slidesData, error: slidesError } = await supabase
        .from('slides')
        .select('*')
        .eq('presentation_id', id)
        .order('slide_number');

      if (slidesError) throw slidesError;

      if (presentationData.template_id) {
        const { data: templateData } = await supabase
          .from('templates')
          .select('*')
          .eq('id', presentationData.template_id)
          .single();
        setTemplate(templateData);
      }

      setPresentation(presentationData);
      setSlides(slidesData || []);
    } catch (error) {
      console.error('Error loading presentation:', error);
      toast.error('Failed to load presentation');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const currentSlide = slides[currentSlideIndex];

  const handleSlideUpdate = (updates: Partial<Slide>) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex] = {
      ...updatedSlides[currentSlideIndex],
      ...updates
    };
    setSlides(updatedSlides);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const slide of slides) {
        const { error } = await supabase
          .from('slides')
          .update({
            title: slide.title,
            content: slide.content,
            layout: slide.layout,
            background_color: slide.background_color,
            custom_styles: slide.custom_styles,
            animations: slide.animations
          })
          .eq('id', slide.id);

        if (error) throw error;
      }

      toast.success('Presentation saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save presentation');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSlide = async () => {
    try {
      const { data, error } = await supabase
        .from('slides')
        .insert({
          presentation_id: id,
          slide_number: slides.length + 1,
          title: 'New Slide',
          content: { heading: '', bullets: [] },
          layout: 'title-content'
        })
        .select()
        .single();

      if (error) throw error;

      setSlides([...slides, data]);
      setCurrentSlideIndex(slides.length);
      toast.success('Slide added');
    } catch (error) {
      console.error('Error adding slide:', error);
      toast.error('Failed to add slide');
    }
  };

  const handleAddText = () => {
    toast.info("Click 'Add Text' button on the canvas to add a new text box");
  };

  const handleAddImage = () => {
    setShowImageGen(true);
  };

  const handleImageGenerated = (imageUrl: string) => {
    const updatedContent = {
      ...currentSlide.content,
      images: [...(currentSlide.content.images || []), { url: imageUrl, alt: 'Generated image' }]
    };
    handleSlideUpdate({ content: updatedContent });
    toast.success("Image added to slide!");
  };

  const handleThemeApply = async (newTemplate: Template) => {
    setTemplate(newTemplate);
    
    // Update presentation template
    try {
      await supabase
        .from('presentations')
        .update({ template_id: newTemplate.id })
        .eq('id', id);
      
      toast.success(`Theme "${newTemplate.name}" applied!`);
    } catch (error) {
      toast.error("Failed to apply theme");
    }
  };

  const handleApplyAISuggestion = (content: string) => {
    // Apply AI suggestion to current slide's heading
    handleSlideUpdate({
      content: { ...currentSlide.content, heading: content }
    });
  };

  const handleAnimationApply = (animation: string) => {
    handleSlideUpdate({
      animations: { entry: animation }
    });
    toast.success("Animation applied!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading presentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">{presentation?.title}</h1>
              <p className="text-xs text-muted-foreground">
                Slide {currentSlideIndex + 1} of {slides.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAI(!showAI)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Assistant
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <EditorToolbar
        onAddText={handleAddText}
        onAddImage={handleAddImage}
        onOpenThemes={() => setShowThemes(true)}
        onOpenAnimations={() => setShowAnimations(true)}
        onOpenSlideshow={() => setShowSlideshow(true)}
        slides={slides}
        presentationTitle={presentation?.title || 'Presentation'}
      />

      {/* Main Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - AI Assistant */}
        {showAI && (
          <div className="w-80 border-r bg-card p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Assistant
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Powered by Gemini 2.5 Flash
            </p>
            <AIAssistant
              content={currentSlide?.content?.heading || ''}
              context={presentation?.title}
              onApply={handleApplyAISuggestion}
            />
          </div>
        )}

        {/* Center - Canvas */}
        <div className="flex-1 p-8 overflow-y-auto bg-muted/20">
          <div className="max-w-5xl mx-auto">
            <SlideCanvas
              slide={currentSlide}
              template={template}
              onUpdate={handleSlideUpdate}
            />
          </div>
        </div>

        {/* Right Sidebar - Thumbnails */}
        <SlideThumbnails
          slides={slides}
          currentIndex={currentSlideIndex}
          onSlideSelect={setCurrentSlideIndex}
          onAddSlide={handleAddSlide}
        />
      </div>

      {/* Dialogs */}
      <ImageGeneratorDialog
        open={showImageGen}
        onOpenChange={setShowImageGen}
        onImageGenerated={handleImageGenerated}
      />

      <ThemesDialog
        open={showThemes}
        onOpenChange={setShowThemes}
        currentTemplateId={presentation?.template_id || null}
        onThemeApply={handleThemeApply}
      />

      <AnimationsDialog
        open={showAnimations}
        onOpenChange={setShowAnimations}
        currentAnimation={currentSlide?.animations?.entry || 'none'}
        onAnimationApply={handleAnimationApply}
      />

      {/* Slideshow */}
      {showSlideshow && (
        <SlideshowPreview
          slides={slides}
          initialSlide={currentSlideIndex}
          onClose={() => setShowSlideshow(false)}
        />
      )}
    </div>
  );
};

export default SlideEditor;