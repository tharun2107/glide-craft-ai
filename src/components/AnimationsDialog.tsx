import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";

interface AnimationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAnimation: string;
  onAnimationApply: (animation: string) => void;
}

const animations = [
  { id: 'none', name: 'None', description: 'No animation', preview: '' },
  { id: 'fade-in', name: 'Fade In', description: 'Smooth fade in effect', preview: 'animate-fade-in' },
  { id: 'fade-in-up', name: 'Fade In Up', description: 'Fade with upward motion', preview: 'animate-fade-in-up' },
  { id: 'slide-in-right', name: 'Slide In Right', description: 'Slide from right', preview: 'animate-slide-in-right' },
  { id: 'scale-in', name: 'Scale In', description: 'Zoom in effect', preview: 'animate-scale-in' },
  { id: 'float', name: 'Float', description: 'Floating effect', preview: 'animate-float' },
  { id: 'pulse-glow', name: 'Pulse Glow', description: 'Pulsing opacity', preview: 'animate-pulse-glow' },
  { id: 'gradient-shift', name: 'Gradient Shift', description: 'Animated gradient', preview: 'animate-gradient-shift bg-gradient-to-r from-primary via-accent to-secondary bg-[length:200%_200%]' },
];

export const AnimationsDialog = ({
  open,
  onOpenChange,
  currentAnimation,
  onAnimationApply,
}: AnimationsDialogProps) => {
  const [selected, setSelected] = useState(currentAnimation || 'none');

  const handleApply = () => {
    onAnimationApply(selected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Choose Entry Animation
          </DialogTitle>
          <DialogDescription>
            Select an animation for elements to appear when the slide loads
          </DialogDescription>
        </DialogHeader>

        {currentAnimation && currentAnimation !== 'none' && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">
              Current: <span className="text-primary">{animations.find(a => a.id === currentAnimation)?.name}</span>
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-4">
          {animations.map((anim) => (
            <Card
              key={anim.id}
              className={`p-5 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                selected === anim.id ? 'border-primary border-2 bg-primary/5' : 'hover:border-primary/50'
              }`}
              onClick={() => setSelected(anim.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold mb-1">{anim.name}</h3>
                  <p className="text-xs text-muted-foreground">{anim.description}</p>
                </div>
                {selected === anim.id && (
                  <div className="bg-primary text-primary-foreground rounded-full p-1.5">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="mt-4 h-24 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center overflow-hidden relative">
                {anim.id === 'none' ? (
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-lg shadow-lg" />
                ) : (
                  <div 
                    className={`w-16 h-16 rounded-lg shadow-lg ${anim.preview}`}
                    style={{ 
                      background: anim.id === 'gradient-shift' ? undefined : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))'
                    }}
                    key={`${anim.id}-${Date.now()}`}
                  />
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply Animation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
