import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Slide {
  id: string;
  slide_number: number;
  title: string | null;
  content: any;
  layout: string;
  background_color: string;
}

interface Presentation {
  id: string;
  title: string;
  description: string | null;
}

const SlideEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPresentation();
  }, [id]);

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

      setPresentation(presentationData);
      setSlides(slidesData || []);
    } catch (error) {
      console.error('Error loading presentation:', error);
      toast.error('Failed to load presentation');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const currentSlide = slides[currentSlideIndex];

  const handleTitleChange = (value: string) => {
    const updated = [...slides];
    updated[currentSlideIndex] = { ...updated[currentSlideIndex], title: value };
    setSlides(updated);
  };

  const handleContentChange = (key: string, value: any) => {
    const updated = [...slides];
    updated[currentSlideIndex] = {
      ...updated[currentSlideIndex],
      content: { ...updated[currentSlideIndex].content, [key]: value }
    };
    setSlides(updated);
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
            background_color: slide.background_color
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
          content: { heading: '', bullets: [], notes: '' },
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

  const handleDeleteSlide = async () => {
    if (slides.length === 1) {
      toast.error('Cannot delete the last slide');
      return;
    }

    try {
      const slideToDelete = slides[currentSlideIndex];
      const { error } = await supabase
        .from('slides')
        .delete()
        .eq('id', slideToDelete.id);

      if (error) throw error;

      const updatedSlides = slides.filter((_, i) => i !== currentSlideIndex);
      setSlides(updatedSlides);
      setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
      toast.success('Slide deleted');
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Failed to delete slide');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading presentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">{presentation?.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Slide {currentSlideIndex + 1} of {slides.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleAddSlide}>
                <Plus className="w-4 h-4 mr-2" />
                Add Slide
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-primary">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor panel */}
          <Card className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Slide Title</label>
              <Input
                value={currentSlide?.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter slide title..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Main Heading</label>
              <Input
                value={currentSlide?.content?.heading || ''}
                onChange={(e) => handleContentChange('heading', e.target.value)}
                placeholder="Enter main heading..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Bullet Points</label>
              <Textarea
                value={(currentSlide?.content?.bullets || []).join('\n')}
                onChange={(e) => handleContentChange('bullets', e.target.value.split('\n'))}
                placeholder="Enter bullet points (one per line)..."
                rows={6}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Speaker Notes</label>
              <Textarea
                value={currentSlide?.content?.notes || ''}
                onChange={(e) => handleContentChange('notes', e.target.value)}
                placeholder="Add speaker notes..."
                rows={4}
              />
            </div>

            <Button
              variant="destructive"
              onClick={handleDeleteSlide}
              className="w-full"
              disabled={slides.length === 1}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Slide
            </Button>
          </Card>

          {/* Preview panel */}
          <div className="space-y-4">
            <Card className="p-8 min-h-96 bg-white shadow-elegant">
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentSlide?.title || 'Untitled Slide'}
                </h1>
                
                {currentSlide?.content?.heading && (
                  <h2 className="text-xl font-semibold text-gray-700">
                    {currentSlide.content.heading}
                  </h2>
                )}

                {currentSlide?.content?.bullets && currentSlide.content.bullets.length > 0 && (
                  <ul className="space-y-2 list-disc list-inside text-gray-700">
                    {currentSlide.content.bullets.map((bullet: string, index: number) => (
                      <li key={index}>{bullet}</li>
                    ))}
                  </ul>
                )}

                {currentSlide?.content?.notes && (
                  <div className="mt-8 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 italic">
                      Notes: {currentSlide.content.notes}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                disabled={currentSlideIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlideIndex(index)}
                    className={`w-8 h-8 rounded ${
                      index === currentSlideIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                disabled={currentSlideIndex === slides.length - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideEditor;
