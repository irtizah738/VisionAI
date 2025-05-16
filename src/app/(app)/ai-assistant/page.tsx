
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2, AlertTriangle, Search, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
// For now, we'll use the existing chat action. This can be expanded later.
// import { chatAssistantAction } from "./actions"; 
// import type { ChatAssistantInput } from "@/ai/flows/chat-assistant";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "suggestion" | "generatedAdCopy";
}

const exampleSuggestions = [
  { id: "s1", text: "How is our latest campaign performing?" },
  { id: "s2", text: "Consider updating targeting captions to improve performance." },
  { id: "s3", text: "What are some ad copy ideas for a new eco-friendly product?" },
];

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if(scrollViewport) {
           scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = async (query?: string) => {
    const currentInput = query || input;
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentInput,
    };
    setMessages((prev) => [...prev, userMessage]);
    if (!query) setInput(""); // Clear input if not from a suggestion
    setIsLoading(true);
    setError(null);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    let aiResponseContent = "";
    let responseType: Message['type'] = "text";

    if (currentInput.toLowerCase().includes("campaign performing")) {
      aiResponseContent = "Your latest campaign 'Summer Sale' has a CTR of 3.5% and 50 conversions so far. This is 20% above average for similar campaigns. Suggestion: Clicky increased by 20%? (This seems like a typo in the mockup, rephrasing)";
    } else if (currentInput.toLowerCase().includes("ad copy") || currentInput.toLowerCase().includes("eco-friendly product")) {
      responseType = "generatedAdCopy";
      aiResponseContent = `Headline: Unlock Huge Savings on Our Top Eco Picks!
Body: Discover our latest range of sustainable products. Treted baras tiles eet onesies aqe, snop! (Mockup had placeholder text, replaced with more generic copy). Limited time offer!
CTA: Shop Green Now`;
    } else if (currentInput.toLowerCase().includes("targeting captions")) {
      aiResponseContent = "To improve performance, try these caption variations:\n1. Emphasize benefits for users aged 25-34.\n2. Highlight free shipping for your target location.";
    } else {
      aiResponseContent = `I can help with ad copy, campaign performance, and targeting suggestions. What would you like to know? For example: "${exampleSuggestions[0].text}"`;
    }
    
    const assistantMessage: Message = {
      id: Date.now().toString() + "-ai",
      role: "assistant",
      content: aiResponseContent,
      type: responseType,
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem)-2*theme(spacing.8))]">
      <PageHeader
        title="AI Assistant"
        description="Your AI-powered marketing co-pilot for insights and generation."
        actions={<Input type="search" placeholder="Search AI capabilities..." className="w-64" icon={<Search className="h-4 w-4 text-muted-foreground"/>} />}
      />
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {/* Left panel for suggestions / saved items - Mockup has a mini-sidebar */}
        <Card className="md:col-span-1 hidden md:flex flex-col shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg">Quick Actions & History</CardTitle>
                <CardDescription>Common queries and past interactions.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-3 overflow-y-auto">
                <Button variant="outline" className="w-full justify-start" onClick={() => handleSendMessage("Generate ad copy for a new product.")}>
                    <Wand2 className="mr-2 h-4 w-4"/> Generate Ad Copy
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleSendMessage("How is my latest campaign performing?")}>
                    <Search className="mr-2 h-4 w-4"/> Latest Campaign Performance
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleSendMessage("Suggest improvements for targeting.")}>
                    <Bot className="mr-2 h-4 w-4"/> Improve Targeting
                </Button>
                <p className="text-sm text-muted-foreground pt-4">History (coming soon)...</p>
            </CardContent>
        </Card>

        {/* Main Chat Area */}
        <Card className="md:col-span-2 flex flex-col shadow-lg h-full">
          <CardHeader>
            <CardTitle>AI Assistant Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
              {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
                  <Bot size={48} className="mb-2" />
                  <p className="text-center mb-4">Ask me about campaign performance, ad copy, or targeting.</p>
                  <div className="space-y-2 w-full max-w-md">
                    {exampleSuggestions.map(sugg => (
                        <Button key={sugg.id} variant="outline" size="sm" className="w-full" onClick={() => handleSendMessage(sugg.text)}>
                            {sugg.text}
                        </Button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3 p-3 my-2 rounded-lg",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] p-3 rounded-xl shadow",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted rounded-tl-none",
                      message.content.startsWith("Error:") ? "bg-destructive text-destructive-foreground" : ""
                    )}
                  >
                    {message.content.startsWith("Error:") && <AlertTriangle className="inline mr-2 h-4 w-4" />}
                    {message.type === "generatedAdCopy" ? (
                        <div className="whitespace-pre-wrap font-mono text-sm">
                            {message.content}
                        </div>
                    ) : (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                    )}
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8">
                       <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3 p-3 my-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg rounded-tl-none shadow flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Ask the AI Assistant..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 text-base"
                disabled={isLoading}
              />
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Helper for Input component to accept icon prop
declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    icon?: React.ReactNode;
  }
}
