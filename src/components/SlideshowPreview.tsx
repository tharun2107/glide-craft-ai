import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";

interface Slide {
  id: string;
  title: string | null;
  content: any;
  background_color: string;
  animations?: any;
}

interface SlideshowPreviewProps {
  slides: Slide[];
  initialSlide?: number;
  onClose: () => void;
}

export const SlideshowPreview = ({ slides, initialSlide = 0, onClose }: SlideshowPreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialSlide);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex]);

  const nextSlide = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentSlide = slides[currentIndex];
  const images = currentSlide?.content?.images || [];

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-white text-sm font-medium">
            Slide {currentIndex + 1} of {slides.length}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Slide Content - PowerPoint-style layout */}
      <div 
        key={currentIndex}
        className={`flex-1 flex items-start justify-center px-20 py-16 ${
          currentSlide?.animations?.entry && currentSlide.animations.entry !== 'none' 
            ? `animate-${currentSlide.animations.entry}` 
            : 'animate-fade-in'
        }`}
        style={{ background: currentSlide?.background_color || '#ffffff' }}
      >
        <div className={`w-full h-full flex ${images.length > 0 ? 'gap-12' : 'justify-start'}`}>
          {/* Text Content - 55% width when images present */}
          <div className={`flex flex-col justify-start ${images.length > 0 ? 'w-[55%]' : 'w-full max-w-5xl'}`}>
            {currentSlide?.title && (
              <h1 className="text-5xl font-bold mb-6 text-foreground leading-tight">
                {currentSlide.title}
              </h1>
            )}
            {currentSlide?.content?.heading && (
              <h2 className="text-3xl font-semibold mb-5 text-foreground/90 leading-snug">
                {currentSlide.content.heading}
              </h2>
            )}
            {currentSlide?.content?.bullets && currentSlide.content.bullets.length > 0 && (
              <ul className="space-y-3 text-xl text-foreground/80 leading-relaxed">
                {currentSlide.content.bullets.map((bullet: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-3 text-primary mt-1">•</span>
                    <span className="flex-1">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Images - 40% width */}
          {images.length > 0 && (
            <div className="w-[40%] flex items-center justify-center">
              <div className="space-y-4 w-full">
                {images.map((img: any, idx: number) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={img.alt || 'Slide image'}
                    className="w-full h-auto max-h-[700px] object-cover rounded-lg shadow-2xl"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            size="lg"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={nextSlide}
            disabled={currentIndex === slides.length - 1}
            className="rounded-full"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};
