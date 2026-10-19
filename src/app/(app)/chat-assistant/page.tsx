
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { chatAssistantAction } from "./actions";
import type { ChatAssistantInput } from "@/ai/flows/chat-assistant";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatAssistantPage() {
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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() && messages.length === 0) return; // Don't submit if input is empty unless it's a follow up to an error

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    const chatHistory = messages.map(msg => ({ role: msg.role, content: msg.content }));
    if (input.trim()) { // Only add current input to history if it's not empty (e.g. retrying after error)
        chatHistory.push({ role: 'user', content: input});
    }
    
    const result = await chatAssistantAction({ query: input, chatHistory });

    if ('error' in result) {
      setError(result.error);
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        role: "assistant",
        content: `Error: ${result.error}. Please try again or rephrase your query.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } else {
      const assistantMessage: Message = {
        id: Date.now().toString() + "-ai",
        role: "assistant",
        content: result.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem)-2*theme(spacing.8))]"> 
      <PageHeader
        title="Chat with VisionAI Assistant"
        description="Get real-time support and answers to your marketing questions."
      />
      <Card className="flex-1 flex flex-col shadow-lg">
        <CardHeader>
          <CardTitle>Chat with VisionAI Assistant</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Bot size={48} className="mb-2" />
                <p>Ask me anything about marketing!</p>
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
                    "max-w-[70%] p-3 rounded-xl shadow",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted rounded-tl-none",
                    message.content.startsWith("Error:") ? "bg-destructive text-destructive-foreground" : ""
                  )}
                >
                  {message.content.startsWith("Error:") && <AlertTriangle className="inline mr-2 h-4 w-4" />}
                  {message.content}
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
              placeholder="Type your message..."
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
  );
}
