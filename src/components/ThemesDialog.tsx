import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check } from "lucide-react";

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
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load themes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Choose a Theme</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="col-span-2 text-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading themes...</p>
            </div>
          ) : (
            templates.map((template) => (
              <div
                key={template.id}
                className={`
                  relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-lg
                  ${currentTemplateId === template.id ? 'border-primary' : 'border-border'}
                `}
                onClick={() => {
                  onThemeApply(template);
                  onOpenChange(false);
                }}
              >
                {currentTemplateId === template.id && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
                
                <div 
                  className="w-full h-32 rounded-lg mb-3 flex items-center justify-center text-sm font-semibold"
                  style={{
                    background: template.theme_config.backgroundColor || '#ffffff',
                    color: template.theme_config.textColor || '#000000',
                  }}
                >
                  <div className="text-center p-4">
                    <div className="text-lg mb-1">Sample Text</div>
                    <div className="text-xs opacity-70">Preview</div>
                  </div>
                </div>
                
                <h3 className="font-semibold mb-1">{template.name}</h3>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};