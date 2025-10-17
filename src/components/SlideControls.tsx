import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Palette, Type, Sparkles } from "lucide-react";

interface SlideControlsProps {
  customStyles: any;
  onStyleChange: (key: string, value: any) => void;
}

const fontSizes = ['14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '64px'];
const fontFamilies = [
  'Inter, sans-serif',
  'Roboto, sans-serif',
  'Poppins, sans-serif',
  'Playfair Display, serif',
  'Merriweather, serif',
  'Lato, sans-serif'
];

const animations = [
  { value: 'none', label: 'None' },
  { value: 'fade-in', label: 'Fade In' },
  { value: 'slide-up', label: 'Slide Up' },
  { value: 'slide-left', label: 'Slide Left' },
  { value: 'scale-in', label: 'Scale In' },
  { value: 'bounce', label: 'Bounce' }
];

export const SlideControls = ({ customStyles, onStyleChange }: SlideControlsProps) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold border-b pb-2">
        <Palette className="w-4 h-4 text-primary" />
        Slide Styling
      </div>

      {/* Text Color */}
      <div className="space-y-2">
        <Label className="text-xs">Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={customStyles?.textColor || '#000000'}
            onChange={(e) => onStyleChange('textColor', e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={customStyles?.textColor || '#000000'}
            onChange={(e) => onStyleChange('textColor', e.target.value)}
            placeholder="#000000"
            className="flex-1"
          />
        </div>
      </div>

      {/* Background Color */}
      <div className="space-y-2">
        <Label className="text-xs">Background Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={customStyles?.backgroundColor || '#ffffff'}
            onChange={(e) => onStyleChange('backgroundColor', e.target.value)}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={customStyles?.backgroundColor || '#ffffff'}
            onChange={(e) => onStyleChange('backgroundColor', e.target.value)}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      {/* Font Family */}
      <div className="space-y-2">
        <Label className="text-xs flex items-center gap-1">
          <Type className="w-3 h-3" />
          Font Family
        </Label>
        <Select
          value={customStyles?.fontFamily || fontFamilies[0]}
          onValueChange={(value) => onStyleChange('fontFamily', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            {fontFamilies.map((font) => (
              <SelectItem key={font} value={font}>{font.split(',')[0]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <Label className="text-xs">Font Size</Label>
        <Select
          value={customStyles?.fontSize || '16px'}
          onValueChange={(value) => onStyleChange('fontSize', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            {fontSizes.map((size) => (
              <SelectItem key={size} value={size}>{size}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Animation */}
      <div className="space-y-2">
        <Label className="text-xs flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Entry Animation
        </Label>
        <Select
          value={customStyles?.animation || 'none'}
          onValueChange={(value) => onStyleChange('animation', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            {animations.map((anim) => (
              <SelectItem key={anim.value} value={anim.value}>{anim.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};