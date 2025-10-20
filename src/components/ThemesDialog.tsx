import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, Palette, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Template {
  id: string;
  name: string;
  description: string;
  theme_config: any;
}

interface ThemesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTemplateId: string | null;
  onThemeApply: (template: Template) => void;
}

// Premium built-in themes
const premiumThemes = [
  {
    id: 'modern-gradient',
    name: 'Modern Gradient',
    description: 'Bold gradients with vibrant colors',
    theme_config: {
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: '#ffffff',
      accentColor: '#ffd700'
    }
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Cool ocean-inspired palette',
    theme_config: {
      backgroundColor: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)',
      textColor: '#ffffff',
      accentColor: '#00ffd5'
    }
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    description: 'Warm sunset colors',
    theme_config: {
      backgroundColor: 'linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)',
      textColor: '#1a1a1a',
      accentColor: '#ff6b6b'
    }
  },
  {
    id: 'dark-elegance',
    name: 'Dark Elegance',
    description: 'Sophisticated dark theme',
    theme_config: {
      backgroundColor: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      textColor: '#ffffff',
      accentColor: '#4fd1c5'
    }
  },
  {
    id: 'mint-fresh',
    name: 'Mint Fresh',
    description: 'Clean mint green palette',
    theme_config: {
      backgroundColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      textColor: '#1a1a1a',
      accentColor: '#4ecdc4'
    }
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Luxurious purple tones',
    theme_config: {
      backgroundColor: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
      textColor: '#ffffff',
      accentColor: '#ffd700'
    }
  },
  {
    id: 'coral-reef',
    name: 'Coral Reef',
    description: 'Vibrant coral and blue',
    theme_config: {
      backgroundColor: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
      textColor: '#ffffff',
      accentColor: '#ffe66d'
    }
  },
  {
    id: 'midnight-sky',
    name: 'Midnight Sky',
    description: 'Deep night sky colors',
    theme_config: {
      backgroundColor: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      textColor: '#ffffff',
      accentColor: '#00d4ff'
    }
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Warm golden tones',
    theme_config: {
      backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      textColor: '#ffffff',
      accentColor: '#ffd700'
    }
  },
  {
    id: 'forest-mist',
    name: 'Forest Mist',
    description: 'Natural green palette',
    theme_config: {
      backgroundColor: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)',
      textColor: '#ffffff',
      accentColor: '#95e1d3'
    }
  }
];

export const ThemesDialog = ({
  open,
  onOpenChange,
  currentTemplateId,
  onThemeApply,
}: ThemesDialogProps) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open]);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at');

      if (error) throw error;
      
      // Combine premium themes with user templates
      const allThemes = [...premiumThemes, ...(data || [])];
      setTemplates(allThemes);
    } catch (error) {
      console.error('Error loading templates:', error);
      // If there's an error, just show premium themes
      setTemplates(premiumThemes);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Palette className="w-5 h-5 text-primary" />
            Choose a Theme
          </DialogTitle>
          <DialogDescription>
            Select from our premium collection or create your own custom theme
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mt-4">
          {loading ? (
            <div className="col-span-3 text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Loading themes...</p>
            </div>
          ) : (
            templates.map((template) => (
              <Card
                key={template.id}
                className={`
                  relative p-4 cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] group
                  ${currentTemplateId === template.id ? 'border-primary border-2 shadow-lg' : 'border-border hover:border-primary/50'}
                `}
                onClick={() => {
                  onThemeApply(template);
                  onOpenChange(false);
                  toast.success(`Applied ${template.name} theme!`);
                }}
              >
                {currentTemplateId === template.id && (
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg z-10">
                    <Check className="w-4 h-4" />
                  </div>
                )}
                
                {premiumThemes.some(t => t.id === template.id) && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full px-2 py-0.5 text-xs font-semibold flex items-center gap-1 z-10">
                    <Sparkles className="w-3 h-3" />
                    Premium
                  </div>
                )}
                
                <div 
                  className="w-full h-36 rounded-lg mb-3 flex items-center justify-center text-sm font-semibold shadow-md group-hover:shadow-lg transition-shadow"
                  style={{
                    background: template.theme_config.backgroundColor || '#ffffff',
                    color: template.theme_config.textColor || '#000000',
                  }}
                >
                  <div className="text-center p-4">
                    <div className="text-2xl mb-2 font-bold">Aa</div>
                    <div className="text-xs opacity-80">Preview Text</div>
                    {template.theme_config.accentColor && (
                      <div 
                        className="mt-2 w-12 h-1 mx-auto rounded-full"
                        style={{ background: template.theme_config.accentColor }}
                      />
                    )}
                  </div>
                </div>
                
                <h3 className="font-semibold mb-1 text-sm">{template.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
              </Card>
            ))
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
