import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Rnd } from "react-rnd";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Type, Image as ImageIcon } from "lucide-react";
import { RichTextToolbar } from "./RichTextToolbar";

interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'heading' | 'textbox';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    textAlign?: 'left' | 'right' | 'center' | 'justify';
    color?: string;
  };
}

interface SlideCanvasProps {
  slide: any;
  template: any;
  onUpdate: (updates: any) => void;
}

export const SlideCanvas = ({ slide, template, onUpdate }: SlideCanvasProps) => {
  const [elements, setElements] = useState<SlideElement[]>(() => {
    // Initialize elements from slide content
    const initialElements: SlideElement[] = [];
    
    if (slide?.title) {
      initialElements.push({
        id: 'title',
        type: 'heading',
        content: slide.title,
        position: { x: 50, y: 50 },
        size: { width: 600, height: 80 },
        style: { fontSize: '36px', fontWeight: 'bold' }
      });
    }

    if (slide?.content?.heading) {
      initialElements.push({
        id: 'heading',
        type: 'heading',
        content: slide.content.heading,
        position: { x: 50, y: 150 },
        size: { width: 500, height: 60 },
        style: { fontSize: '24px', fontWeight: '600' }
      });
    }

    if (slide?.content?.bullets && slide.content.bullets.length > 0) {
      initialElements.push({
        id: 'bullets',
        type: 'textbox',
        content: slide.content.bullets.join('\n'),
        position: { x: 50, y: 230 },
        size: { width: 500, height: 200 },
        style: { fontSize: '18px' }
      });
    }

    if (slide?.content?.images && slide.content.images.length > 0) {
      slide.content.images.forEach((img: any, index: number) => {
        initialElements.push({
          id: `image-${index}`,
          type: 'image',
          content: img.url,
          position: { x: 600, y: 150 + (index * 220) },
          size: { width: 300, height: 200 },
          style: {}
        });
      });
    }

    return initialElements;
  });

  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const backgroundColor = slide?.custom_styles?.backgroundColor || 
    template?.theme_config?.backgroundColor || '#ffffff';
  
  const textColor = slide?.custom_styles?.textColor || 
    template?.theme_config?.textColor || '#1a1a1a';

  const handleElementUpdate = (id: string, updates: Partial<SlideElement>) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
    
    // Update slide data
    const updatedContent = { ...slide.content };
    const element = elements.find(el => el.id === id);
    
    if (element) {
      if (id === 'title') {
        onUpdate({ title: updates.content || element.content });
      } else if (id === 'heading') {
        updatedContent.heading = updates.content || element.content;
        onUpdate({ content: updatedContent });
      } else if (id === 'bullets') {
        updatedContent.bullets = (updates.content || element.content).split('\n').filter(Boolean);
        onUpdate({ content: updatedContent });
      }
    }
  };

  const handleDelete = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    setSelectedElement(null);
  };

  const handleAddTextBox = () => {
    const newElement: SlideElement = {
      id: `textbox-${Date.now()}`,
      type: 'textbox',
      content: 'New Text Box',
      position: { x: 100, y: 100 },
      size: { width: 300, height: 100 },
      style: { fontSize: '16px' }
    };
    setElements(prev => [...prev, newElement]);
  };

  const handleFormatChange = (format: string, value?: string) => {
    if (!selectedElement) return;
    
    setElements(prev => prev.map(el => {
      if (el.id !== selectedElement) return el;
      
      const newStyle = { ...el.style };
      
      switch (format) {
        case 'bold':
          newStyle.fontWeight = el.style.fontWeight === 'bold' ? 'normal' : 'bold';
          break;
        case 'italic':
          newStyle.fontStyle = el.style.fontStyle === 'italic' ? 'normal' : 'italic';
          break;
        case 'underline':
          newStyle.textDecoration = el.style.textDecoration === 'underline' ? 'none' : 'underline';
          break;
        case 'align':
          newStyle.textAlign = value as 'left' | 'right' | 'center' | 'justify';
          break;
        case 'fontSize':
          newStyle.fontSize = value;
          break;
        case 'fontFamily':
          newStyle.fontFamily = value;
          break;
      }
      
      return { ...el, style: newStyle };
    }));
  };

  return (
    <div className="relative">
      <RichTextToolbar onFormatChange={handleFormatChange} />
      
      <Card 
        ref={canvasRef}
        className="relative min-h-[600px] shadow-elegant overflow-hidden"
        style={{
          backgroundColor,
          aspectRatio: '16/9',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
        onClick={() => setSelectedElement(null)}
      >
        {elements.map((element) => (
          <Rnd
            key={element.id}
            position={element.position}
            size={element.size}
            onDragStop={(e, d) => {
              handleElementUpdate(element.id, {
                position: { x: d.x, y: d.y }
              });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              handleElementUpdate(element.id, {
                size: {
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height)
                },
                position
              });
            }}
            bounds="parent"
            className={`${selectedElement === element.id ? 'ring-2 ring-primary' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(element.id);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditing(element.id);
            }}
          >
            <div className="w-full h-full p-2 hover:bg-black/5 transition-colors relative group">
              {isEditing === element.id ? (
                element.type === 'image' ? (
                  <Input
                    value={element.content}
                    onChange={(e) => handleElementUpdate(element.id, { content: e.target.value })}
                    onBlur={() => setIsEditing(null)}
                    autoFocus
                    className="w-full h-full text-sm"
                    placeholder="Image URL"
                  />
                ) : (
                  <Textarea
                    value={element.content}
                    onChange={(e) => handleElementUpdate(element.id, { content: e.target.value })}
                    onBlur={() => setIsEditing(null)}
                    autoFocus
                    className="w-full h-full resize-none border-2 border-primary"
                    style={{
                      ...element.style,
                      color: textColor,
                      background: 'transparent'
                    }}
                  />
                )
              ) : element.type === 'image' ? (
                <img 
                  src={element.content} 
                  alt="Slide element"
                  className="w-full h-full object-cover rounded"
                  style={element.style}
                />
              ) : (
                <div 
                  className="w-full h-full overflow-hidden"
                  style={{
                    ...element.style,
                    color: textColor,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {element.content}
                </div>
              )}
              
              {selectedElement === element.id && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(element.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </Rnd>
        ))}

        {/* Add element buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddTextBox}
          >
            <Type className="w-4 h-4 mr-2" />
            Add Text
          </Button>
        </div>

        {/* Hint text */}
        <div className="absolute top-2 right-2 text-xs opacity-50 bg-background/80 px-2 py-1 rounded">
          Double-click to edit • Drag to move • Resize handles to scale
        </div>
      </Card>
    </div>
  );
};
