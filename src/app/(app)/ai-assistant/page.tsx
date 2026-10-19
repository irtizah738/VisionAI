"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Wand2, Sparkles, Settings } from "lucide-react";

// Types for our chat
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type ChatMode = "general" | "marketing" | "content" | "analytics";

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your VisionAI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>("general");

  // Function to handle sending messages
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          mode: mode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getModeDescription = (mode: ChatMode) => {
    switch (mode) {
      case "general":
        return "Ask me anything about marketing, analytics, or content creation.";
      case "marketing":
        return "Get help with campaign strategy, audience targeting, and ROI optimization.";
      case "content":
        return "Generate blog posts, social media content, and email campaigns.";
      case "analytics":
        return "Analyze your marketing data and get actionable insights.";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <PageHeader
        title="AI Assistant"
        description="Your intelligent marketing copilot"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 flex-1 gap-4 p-4">
        {/* Sidebar with different chat modes */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Chat Modes</CardTitle>
            <CardDescription>Select your assistant's focus</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={mode}
              onValueChange={(value) => setMode(value as ChatMode)}
              orientation="vertical"
              className="w-full"
            >
              <TabsList className="flex flex-col h-full space-y-2">
                <TabsTrigger value="general" className="w-full justify-start gap-2">
                  <MessageSquare className="h-4 w-4" />
                  General Assistant
                </TabsTrigger>
                <TabsTrigger value="marketing" className="w-full justify-start gap-2">
                  <Wand2 className="h-4 w-4" />
                  Marketing Strategy
                </TabsTrigger>
                <TabsTrigger value="content" className="w-full justify-start gap-2">
                  <Sparkles className="h-4 w-4" />
                  Content Creation
                </TabsTrigger>
                <TabsTrigger value="analytics" className="w-full justify-start gap-2">
                  <Settings className="h-4 w-4" />
                  Data Analysis
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Main chat area */}
        <Card className="md:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>{mode.charAt(0).toUpperCase() + mode.slice(1)} Assistant</CardTitle>
            <CardDescription>{getModeDescription(mode)}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
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
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-50 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={isLoading}
              />
              <Button onClick={sendMessage} disabled={isLoading}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
