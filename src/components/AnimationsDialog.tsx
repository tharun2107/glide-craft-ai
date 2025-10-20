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
  { id: 'none', name: 'None', description: 'No animation', preview: 'opacity-100' },
  { id: 'fade-in', name: 'Fade In', description: 'Smooth fade in effect', preview: 'animate-fade-in' },
  { id: 'slide-in-right', name: 'Slide In Right', description: 'Slide from right', preview: 'animate-slide-in-right' },
  { id: 'scale-in', name: 'Scale In', description: 'Zoom in effect', preview: 'animate-scale-in' },
  { id: 'slide-in-left', name: 'Slide In Left', description: 'Slide from left', preview: 'animate-slide-in-right' },
  { id: 'slide-in-up', name: 'Slide In Up', description: 'Slide from bottom', preview: 'animate-fade-in' },
  { id: 'enter', name: 'Combined Enter', description: 'Fade + Scale combo', preview: 'animate-enter' },
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
              <div className="mt-4 h-24 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                <div className={`w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-lg shadow-lg ${anim.preview}`}
                     key={selected === anim.id ? `${anim.id}-active` : anim.id} />
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
