import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, ChefHat, ShoppingCart, Calendar } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AIChatPanelProps {
  onSendMessage?: (message: string) => void;
}

export function AIChatPanel({ onSendMessage }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your AI kitchen assistant. Ask me what you can cook with your ingredients, or let me help plan your meals for the week!",
    },
  ]);
  const [input, setInput] = useState("");

  const quickActions = [
    { icon: ChefHat, label: "What can I cook today?", query: "What can I cook with my current ingredients?" },
    { icon: ShoppingCart, label: "Suggest shopping list", query: "What should I buy this week based on my usual meals?" },
    { icon: Calendar, label: "Plan my week", query: "Help me plan healthy meals for this week" },
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    onSendMessage?.(input);
    setInput("");

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Based on your pantry, I suggest making a delicious Creamy Garlic Pasta! You have pasta, garlic, cream, and parmesan - all the essentials. Would you like the full recipe?",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleQuickAction = (query: string) => {
    setInput(query);
    handleSend();
  };

  return (
    <Card className="h-full flex flex-col" data-testid="ai-chat-panel">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Kitchen Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0 p-4 pt-0">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {quickActions.map((action, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.query)}
                className="text-xs"
              >
                <action.icon className="h-3 w-3 mr-1" />
                {action.label}
              </Button>
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            data-testid="input-ai-message"
          />
          <Button size="icon" onClick={handleSend} data-testid="button-send-ai">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
