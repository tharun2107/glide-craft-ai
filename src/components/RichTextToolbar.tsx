import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Type
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RichTextToolbarProps {
  onFormatChange: (format: string, value?: string) => void;
}

export const RichTextToolbar = ({ onFormatChange }: RichTextToolbarProps) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-card border-b">
      {/* Font Family */}
      <Select onValueChange={(value) => onFormatChange('fontFamily', value)}>
        <SelectTrigger className="w-[160px] h-8">
          <SelectValue placeholder="Font" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="'Montserrat', sans-serif">Montserrat</SelectItem>
          <SelectItem value="'Poppins', sans-serif">Poppins</SelectItem>
          <SelectItem value="'Playfair Display', serif">Playfair Display</SelectItem>
          <SelectItem value="'Lora', serif">Lora</SelectItem>
          <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
          <SelectItem value="'Inter', sans-serif">Inter</SelectItem>
          <SelectItem value="'Merriweather', serif">Merriweather</SelectItem>
          <SelectItem value="'Open Sans', sans-serif">Open Sans</SelectItem>
          <SelectItem value="Arial, sans-serif">Arial</SelectItem>
          <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
          <SelectItem value="Georgia, serif">Georgia</SelectItem>
          <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
        </SelectContent>
      </Select>

      {/* Font Size */}
      <Select onValueChange={(value) => onFormatChange('fontSize', value)}>
        <SelectTrigger className="w-[80px] h-8">
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="12px">12</SelectItem>
          <SelectItem value="14px">14</SelectItem>
          <SelectItem value="16px">16</SelectItem>
          <SelectItem value="18px">18</SelectItem>
          <SelectItem value="24px">24</SelectItem>
          <SelectItem value="32px">32</SelectItem>
          <SelectItem value="48px">48</SelectItem>
        </SelectContent>
      </Select>

      <div className="h-6 w-px bg-border mx-1" />

      {/* Text Formatting */}
      <Button variant="ghost" size="sm" onClick={() => onFormatChange('bold')}>
        <Bold className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onFormatChange('italic')}>
        <Italic className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onFormatChange('underline')}>
        <Underline className="w-4 h-4" />
      </Button>

      <div className="h-6 w-px bg-border mx-1" />

      {/* Alignment */}
      <Button variant="ghost" size="sm" onClick={() => onFormatChange('align', 'left')}>
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onFormatChange('align', 'center')}>
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onFormatChange('align', 'right')}>
        <AlignRight className="w-4 h-4" />
      </Button>

      <div className="h-6 w-px bg-border mx-1" />

      {/* Lists */}
      <Button variant="ghost" size="sm" onClick={() => onFormatChange('bulletList')}>
        <List className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onFormatChange('numberList')}>
        <ListOrdered className="w-4 h-4" />
      </Button>
    </div>
  );
};
