import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, Wand2, Maximize2, Minimize2, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <Card className="p-4 space-y-4 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Sparkles className="w-4 h-4 text-primary" />
        AI Assistant
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAIAction('improve')}
          disabled={loading}
          className="w-full"
        >
          <Wand2 className="w-3 h-3 mr-1" />
          Improve
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAIAction('expand')}
          disabled={loading}
          className="w-full"
        >
          <Maximize2 className="w-3 h-3 mr-1" />
          Expand
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAIAction('summarize')}
          disabled={loading}
          className="w-full"
        >
          <Minimize2 className="w-3 h-3 mr-1" />
          Summarize
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAIAction('suggest')}
          disabled={loading}
          className="w-full"
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
        <div className="space-y-3 animate-fade-in">
          <div className="text-xs font-semibold text-primary flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI Suggestion
          </div>
          <ScrollArea className="h-[300px]">
            <Card className="p-4 bg-card border-primary/30">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {suggestion.split('\n').map((paragraph, idx) => {
                  // Check if it's a header (starts with ##)
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={idx} className="text-lg font-bold mt-4 mb-2 text-foreground">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  // Check if it's a bullet point
                  if (paragraph.trim().startsWith('*') || paragraph.trim().startsWith('-')) {
                    return (
                      <li key={idx} className="ml-4 text-sm text-foreground/90 leading-relaxed">
                        {paragraph.replace(/^[\*\-]\s*/, '')}
                      </li>
                    );
                  }
                  // Check if it's bold text (between **)
                  if (paragraph.includes('**')) {
                    const parts = paragraph.split('**');
                    return (
                      <p key={idx} className="text-sm leading-relaxed mb-2 text-foreground/80">
                        {parts.map((part, i) => 
                          i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                        )}
                      </p>
                    );
                  }
                  // Regular paragraph
                  if (paragraph.trim()) {
                    return (
                      <p key={idx} className="text-sm leading-relaxed mb-2 text-foreground/80">
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </Card>
          </ScrollArea>
          <Button
            size="sm"
            onClick={() => {
              onApply(suggestion);
              setSuggestion("");
              toast.success("Applied AI suggestion!");
            }}
            className="w-full"
          >
            <Wand2 className="w-3 h-3 mr-2" />
            Apply Suggestion
          </Button>
        </div>
      )}
    </Card>
  );
};
