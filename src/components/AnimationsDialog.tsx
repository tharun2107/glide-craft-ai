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
import { Check } from "lucide-react";

interface AnimationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAnimation: string;
  onAnimationApply: (animation: string) => void;
}

const animations = [
  { id: 'none', name: 'None', description: 'No animation' },
  { id: 'fade-in', name: 'Fade In', description: 'Smooth fade in effect' },
  { id: 'slide-in-right', name: 'Slide In Right', description: 'Slide from right' },
  { id: 'scale-in', name: 'Scale In', description: 'Zoom in effect' },
  { id: 'slide-in-left', name: 'Slide In Left', description: 'Slide from left' },
  { id: 'slide-in-up', name: 'Slide In Up', description: 'Slide from bottom' },
  { id: 'enter', name: 'Combined Enter', description: 'Fade + Scale combo' },
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Entry Animation</DialogTitle>
          <DialogDescription>
            Select an animation for slide elements to appear
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {animations.map((anim) => (
            <Card
              key={anim.id}
              className={`p-4 cursor-pointer transition-all hover:border-primary ${
                selected === anim.id ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => setSelected(anim.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold mb-1">{anim.name}</h3>
                  <p className="text-sm text-muted-foreground">{anim.description}</p>
                </div>
                {selected === anim.id && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="mt-3 h-12 bg-muted rounded flex items-center justify-center">
                <div className={`w-8 h-8 bg-primary rounded animate-${anim.id}`}>
                  {/* Preview animation */}
                </div>
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
