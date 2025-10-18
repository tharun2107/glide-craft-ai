import { Button } from "@/components/ui/button";
import { 
  Type, 
  Image as ImageIcon, 
  Palette, 
  Sparkles,
  Download,
  Layout
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EditorToolbarProps {
  onAddText: () => void;
  onAddImage: () => void;
  onOpenThemes: () => void;
  onOpenAnimations: () => void;
  onExport: (format: 'pdf' | 'pptx' | 'images') => void;
}

export const EditorToolbar = ({
  onAddText,
  onAddImage,
  onOpenThemes,
  onOpenAnimations,
  onExport,
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" size="sm" className="ml-auto">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onExport('pdf')}>
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport('pptx')}>
            Export as PPTX
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport('images')}>
            Export as Images
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};