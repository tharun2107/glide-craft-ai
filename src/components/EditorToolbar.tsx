import { Button } from "@/components/ui/button";
import { 
  Type, 
  Image as ImageIcon, 
  Palette, 
  Sparkles,
  Play
} from "lucide-react";
import { ExportMenu } from "./ExportMenu";

interface EditorToolbarProps {
  onAddText: () => void;
  onAddImage: () => void;
  onOpenThemes: () => void;
  onOpenAnimations: () => void;
  onOpenSlideshow: () => void;
  slides: any[];
  presentationTitle: string;
}

export const EditorToolbar = ({
  onAddText,
  onAddImage,
  onOpenThemes,
  onOpenAnimations,
  onOpenSlideshow,
  slides,
  presentationTitle,
}: EditorToolbarProps) => {
  return (
    <div className="flex items-center gap-2 p-2 border-b bg-card">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onAddText}
        className="flex items-center gap-2"
      >
        <Type className="w-4 h-4" />
        Add Text
      </Button>

      <Button 
        variant="ghost" 
        size="sm"
        onClick={onAddImage}
        className="flex items-center gap-2"
      >
        <ImageIcon className="w-4 h-4" />
        Add Image
      </Button>

      <Button 
        variant="ghost" 
        size="sm"
        onClick={onOpenThemes}
        className="flex items-center gap-2"
      >
        <Palette className="w-4 h-4" />
        Themes
      </Button>

      <Button 
        variant="ghost" 
        size="sm"
        onClick={onOpenAnimations}
        className="flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Animations
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <Button 
          variant="default" 
          size="sm"
          onClick={onOpenSlideshow}
          className="flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Slideshow
        </Button>
        
        <ExportMenu 
          presentationTitle={presentationTitle}
          slides={slides}
        />
      </div>
    </div>
  );
};