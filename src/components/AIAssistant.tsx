import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, Wand2, Maximize2, Minimize2, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AIAssistantProps {
  content: string;
  context?: string;
  onApply: (newContent: string) => void;
}

export const AIAssistant = ({ content, context, onApply }: AIAssistantProps) => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  const handleAIAction = async (action: 'improve' | 'expand' | 'summarize' | 'suggest') => {
    if (!content.trim()) {
      toast.error("No content to process");
      return;
    }

    setLoading(true);
    setSuggestion("");

    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { action, content, context }
      });

      if (error) throw error;

      setSuggestion(data.result);
      toast.success("AI suggestion generated!");
    } catch (error) {
      console.error('AI assistant error:', error);
      toast.error("Failed to get AI suggestion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 space-y-4 border-primary/20">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Sparkles className="w-4 h-4 text-primary" />
        AI Assistant
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAIAction('improve')}
          disabled={loading}
        >
          <Wand2 className="w-3 h-3 mr-1" />
          Improve
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAIAction('expand')}
          disabled={loading}
        >
          <Maximize2 className="w-3 h-3 mr-1" />
          Expand
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAIAction('summarize')}
          disabled={loading}
        >
          <Minimize2 className="w-3 h-3 mr-1" />
          Summarize
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAIAction('suggest')}
          disabled={loading}
        >
          <Lightbulb className="w-3 h-3 mr-1" />
          Suggest
        </Button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          AI is thinking...
        </div>
      )}

      {suggestion && (
        <div className="space-y-2">
          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            {suggestion}
          </div>
          <Button
            size="sm"
            onClick={() => {
              onApply(suggestion);
              setSuggestion("");
              toast.success("Applied AI suggestion!");
            }}
            className="w-full"
          >
            Apply Suggestion
          </Button>
        </div>
      )}
    </Card>
  );
};