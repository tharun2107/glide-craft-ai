import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Slide {
  id: string;
  slide_number: number;
  title: string | null;
  content: any;
}

interface SlideThumbnailsProps {
  slides: Slide[];
  currentIndex: number;
  onSlideSelect: (index: number) => void;
  onAddSlide: () => void;
}

export const SlideThumbnails = ({
  slides,
  currentIndex,
  onSlideSelect,
  onAddSlide,
}: SlideThumbnailsProps) => {
  return (
    <div className="w-64 border-l bg-card flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold mb-3">Slides</h3>
        <Button 
          onClick={onAddSlide}
          className="w-full bg-foreground text-background hover:opacity-90"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Slide
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {slides.map((slide, index) => (
            <Card
              key={slide.id}
              onClick={() => onSlideSelect(index)}
              className={`
                p-3 cursor-pointer transition-all hover:shadow-md
                ${index === currentIndex ? 'ring-2 ring-primary shadow-lg' : 'opacity-70'}
              `}
            >
              <div className="text-xs font-semibold mb-2 text-muted-foreground">
                Slide {index + 1}
              </div>
              <div 
                className="bg-white rounded border aspect-video flex items-center justify-center p-2"
              >
                <div className="text-[8px] leading-tight space-y-1">
                  <div className="font-bold truncate">
                    {slide.title || 'Untitled'}
                  </div>
                  {slide.content?.heading && (
                    <div className="text-gray-600 truncate">
                      {slide.content.heading}
                    </div>
                  )}
                  {slide.content?.bullets && slide.content.bullets.length > 0 && (
                    <div className="text-gray-500 text-[6px]">
                      • {slide.content.bullets[0]}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};