import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'heading' | 'bullet';
  content: string;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  style?: any;
}

interface SlideCanvasProps {
  slide: any;
  template: any;
  onUpdate: (updates: any) => void;
}

export const SlideCanvas = ({ slide, template, onUpdate }: SlideCanvasProps) => {
  const [editingElement, setEditingElement] = useState<string | null>(null);

  const handleHeadingChange = (value: string) => {
    onUpdate({
      content: { ...slide.content, heading: value }
    });
  };

  const handleBulletsChange = (value: string) => {
    onUpdate({
      content: { ...slide.content, bullets: value.split('\n').filter((b: string) => b.trim()) }
    });
  };

  const backgroundColor = slide?.custom_styles?.backgroundColor || 
    template?.theme_config?.backgroundColor || '#ffffff';
  
  const textColor = slide?.custom_styles?.textColor || 
    template?.theme_config?.textColor || '#1a1a1a';
  
  const fontFamily = slide?.custom_styles?.fontFamily || 
    template?.theme_config?.fontFamily || 'Inter, sans-serif';

  return (
    <Card 
      className="relative p-12 min-h-[600px] shadow-elegant cursor-pointer transition-all hover:shadow-xl"
      style={{
        backgroundColor,
        color: textColor,
        fontFamily,
        aspectRatio: '16/9'
      }}
    >
      <div className="space-y-8 h-full flex flex-col">
        {/* Title Section */}
        <div 
          className="group relative"
          onClick={() => setEditingElement('title')}
        >
          {editingElement === 'title' ? (
            <Input
              value={slide?.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              onBlur={() => setEditingElement(null)}
              autoFocus
              className="text-4xl font-bold border-2 border-primary bg-transparent"
              style={{ color: textColor }}
            />
          ) : (
            <h1 
              className="text-4xl font-bold transition-opacity group-hover:opacity-70"
              style={{ color: textColor }}
            >
              {slide?.title || 'Click to add title'}
            </h1>
          )}
        </div>

        {/* Heading Section */}
        <div 
          className="group relative"
          onClick={() => setEditingElement('heading')}
        >
          {editingElement === 'heading' ? (
            <Input
              value={slide?.content?.heading || ''}
              onChange={(e) => handleHeadingChange(e.target.value)}
              onBlur={() => setEditingElement(null)}
              autoFocus
              className="text-2xl font-semibold border-2 border-primary bg-transparent"
              style={{ color: textColor }}
            />
          ) : (
            <h2 
              className="text-2xl font-semibold transition-opacity group-hover:opacity-70"
              style={{ color: textColor }}
            >
              {slide?.content?.heading || 'Click to add heading'}
            </h2>
          )}
        </div>

        {/* Bullets Section */}
        <div 
          className="group relative flex-1"
          onClick={() => setEditingElement('bullets')}
        >
          {editingElement === 'bullets' ? (
            <Textarea
              value={(slide?.content?.bullets || []).join('\n')}
              onChange={(e) => handleBulletsChange(e.target.value)}
              onBlur={() => setEditingElement(null)}
              autoFocus
              className="min-h-[200px] border-2 border-primary bg-transparent"
              style={{ color: textColor }}
              placeholder="Enter bullet points (one per line)"
            />
          ) : (
            <ul className="space-y-3 list-disc list-inside transition-opacity group-hover:opacity-70">
              {slide?.content?.bullets && slide.content.bullets.length > 0 ? (
                slide.content.bullets.map((bullet: string, index: number) => (
                  <li key={index} className="text-lg" style={{ color: textColor }}>
                    {bullet}
                  </li>
                ))
              ) : (
                <li className="text-lg opacity-50" style={{ color: textColor }}>
                  Click to add bullet points
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Images placeholder */}
        {slide?.content?.images && slide.content.images.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-auto">
            {slide.content.images.map((img: any, index: number) => (
              <img 
                key={index}
                src={img.url} 
                alt={img.alt || `Slide image ${index + 1}`}
                className="rounded-lg w-full h-auto object-cover"
              />
            ))}
          </div>
        )}
      </div>

      {/* Hover hint */}
      <div className="absolute top-2 right-2 text-xs opacity-0 group-hover:opacity-50 transition-opacity">
        Click to edit
      </div>
    </Card>
  );
};