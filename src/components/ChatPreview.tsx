import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";

const ChatPreview = () => {
  const messages = [
    {
      role: "user",
      content: "Create a 10-slide pitch deck for my sustainable fashion startup"
    },
    {
      role: "assistant",
      content: "I'll create a compelling pitch deck for your sustainable fashion startup. What's your company name and main value proposition?"
    },
    {
      role: "user",
      content: "EcoThreads - we make stylish clothing from recycled ocean plastic"
    },
    {
      role: "assistant",
      content: "Perfect! I'm generating your pitch deck with slides covering: Problem, Solution, Market Size, Product Line, Impact Metrics, Business Model, Competition, Go-to-Market Strategy, Team, and Financial Projections. Give me a moment..."
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Chat Interface Preview */}
          <div className="order-2 lg:order-1 animate-fade-in">
            <Card className="shadow-elegant border-border overflow-hidden">
              <div className="bg-gradient-primary p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">AI Assistant</h3>
                  <p className="text-xs text-white/80">Powered by Gemini 2.5</p>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-glow" />
              </div>

              <div className="p-6 space-y-4 bg-muted/30 max-h-96 overflow-y-auto">
                {messages.map((message, index) => (
                  <div 
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div 
                      className={`max-w-[80%] rounded-xl p-4 ${
                        message.role === 'user' 
                          ? 'bg-gradient-primary text-white shadow-md' 
                          : 'bg-card border border-border shadow-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-start animate-fade-in" style={{ animationDelay: "0.8s" }}>
                  <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                      <span className="text-sm text-muted-foreground">Generating slides...</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border bg-background">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    disabled
                  />
                  <Button size="icon" className="bg-gradient-primary">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right - Description */}
          <div className="order-1 lg:order-2 space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <MessageCircle className="w-4 h-4" />
              <span>Conversational AI</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold">
              Just Talk to Create
              <span className="block bg-gradient-primary bg-clip-text text-transparent mt-2">
                No Complex Menus
              </span>
            </h2>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Describe what you need in natural language. Our AI understands context, maintains conversation flow, 
              and creates exactly what you envision—no technical knowledge required.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Context-Aware Generation</h4>
                  <p className="text-muted-foreground text-sm">AI remembers your conversation and refines presentations based on your feedback</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Multi-Modal Input</h4>
                  <p className="text-muted-foreground text-sm">Upload documents, images, or paste URLs—AI extracts and structures content automatically</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Industry-Specific Templates</h4>
                  <p className="text-muted-foreground text-sm">Optimized for business, education, creative, and technical presentations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MessageCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

export default ChatPreview;
