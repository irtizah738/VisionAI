"use client";

import React, { useState, useRef, useEffect } from "react";
import { useFirebase } from "@/components/firebase/firebase-provider";
import { saveWorkspaceItemToFirestore } from "@/lib/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  Wand2,
  Sparkles,
  Image as ImageIcon,
  Film,
  Music,
  Globe,
  Send,
  Upload,
  Download,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Cloud,
  LogIn,
  Trash2,
  Zap,
  Brain,
  Gauge,
  Bookmark,
} from "lucide-react";

interface GroundingSource {
  uri: string;
  title: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  model?: string;
  mode?: string;
  sources?: GroundingSource[];
}

type ChatRoleMode = "general" | "marketing" | "content" | "analytics" | "fast";
type ChatModelId =
  | "gemini-4-argon"
  | "gemini-3.8-flash"
  | "gemini-3.1-flash-lite";
type StudioSection = "chat" | "image" | "video" | "music" | "search";

const VEO_LOADING_MESSAGES = [
  "Initializing Veo 3.1 video synthesis pipeline...",
  "Composing scene geometry, camera motion, and lighting...",
  "Rendering temporal frames at native aspect ratio...",
  "Finalizing high-definition MP4 video stream...",
];

export default function AIAssistantPage() {
  const { toast } = useToast();
  const {
    user: firebaseUser,
    signInWithGoogle,
    cloudWorkspaceItems,
    syncWorkspaceToFirestore,
    isSyncing,
  } = useFirebase();

  const [activeSection, setActiveSection] = useState<StudioSection>("chat");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ================= 1. MULTI-TURN GEMINI CHATBOT STATE =================
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to VisionAI Multi-Modal Studio. Choose a specialist role and Gemini model tier (`gemini-4-argon` for deep strategy, `gemini-3.8-flash` for general & live Google Search grounding, or `gemini-3.1-flash-lite` for rapid copy) to begin.",
      timestamp: "Ready",
      model: "gemini-3.8-flash",
      mode: "general",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatRoleMode>("general");
  const [selectedChatModel, setSelectedChatModel] =
    useState<ChatModelId>("gemini-3.8-flash");
  const [useSearchGrounding, setUseSearchGrounding] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ================= 2. NANO BANANA 2.1 IMAGE CREATE & EDIT STATE =================
  const [imageAction, setImageAction] = useState<"generate" | "edit">(
    "generate"
  );
  const [imagePrompt, setImagePrompt] = useState(
    "A sleek futuristic B2B command center hologram showing +142% omnichannel pipeline growth, studio lighting, crisp typography"
  );
  const [imageAspectRatio, setImageAspectRatio] = useState<
    "16:9" | "1:1" | "9:16" | "4:3" | "3:4"
  >("16:9");
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [uploadedEditImage, setUploadedEditImage] = useState<string | null>(
    null
  );
  const [uploadedEditMime, setUploadedEditMime] = useState<string>("image/png");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );
  const [generatedImageNotes, setGeneratedImageNotes] = useState<string>("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const editImageInputRef = useRef<HTMLInputElement>(null);

  // ================= 3. VEO 3.1 VIDEO GENERATION (TEXT & IMAGE-TO-VIDEO) STATE =================
  const [videoMode, setVideoMode] = useState<"text" | "image">("text");
  const [videoPrompt, setVideoPrompt] = useState(
    "Cinematic tracking shot of a modern glass marketing command center at dusk with glowing holographic data streams"
  );
  const [videoAspectRatio, setVideoAspectRatio] = useState<"16:9" | "9:16">(
    "16:9"
  );
  const [videoResolution, setVideoResolution] = useState<"720p" | "1080p">(
    "720p"
  );
  const [uploadedVideoPhoto, setUploadedVideoPhoto] = useState<string | null>(
    null
  );
  const [uploadedVideoPhotoMime, setUploadedVideoPhotoMime] =
    useState<string>("image/png");
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoStatusStep, setVideoStatusStep] = useState(0);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(
    null
  );
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoPhotoInputRef = useRef<HTMLInputElement>(null);

  // ================= 4. LYRIA 3 MUSIC GENERATION STATE =================
  const [musicPrompt, setMusicPrompt] = useState(
    "Upbeat modern electronic corporate synthwave soundtrack with crisp percussion and inspiring melodic build for a product launch video"
  );
  const [musicModel, setMusicModel] = useState<
    "lyria-3-clip-preview" | "lyria-3-pro-preview"
  >("lyria-3-clip-preview");
  const [musicRefImage, setMusicRefImage] = useState<string | null>(null);
  const [musicRefMime, setMusicRefMime] = useState<string>("image/jpeg");
  const [isMusicGenerating, setIsMusicGenerating] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(
    null
  );
  const [generatedLyrics, setGeneratedLyrics] = useState<string>("");
  const [musicError, setMusicError] = useState<string | null>(null);
  const musicImageInputRef = useRef<HTMLInputElement>(null);

  // ================= 5. GOOGLE SEARCH GROUNDING EXPLORER STATE =================
  const [searchQuery, setSearchQuery] = useState(
    "Latest 2026 B2B social media marketing engagement benchmarks and short-form video ROI statistics"
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchAnswer, setSearchAnswer] = useState<string>("");
  const [searchSources, setSearchSources] = useState<GroundingSource[]>([]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatLoading]);

  // Automatically adjust recommended model when role mode changes
  const handleSelectRoleMode = (newMode: ChatRoleMode) => {
    setChatMode(newMode);
    if (newMode === "marketing" || newMode === "analytics") {
      setSelectedChatModel("gemini-4-argon");
    } else if (newMode === "fast") {
      setSelectedChatModel("gemini-3.1-flash-lite");
    } else {
      setSelectedChatModel("gemini-3.8-flash");
    }
  };

  const persistToFirestoreIfSignedIn = async (params: {
    title: string;
    status: string;
    summary: string;
  }) => {
    if (!firebaseUser) return;
    try {
      await saveWorkspaceItemToFirestore({
        id: `ai_${Date.now()}`,
        userId: firebaseUser.uid,
        suite: "content",
        title: params.title.slice(0, 140),
        status: params.status,
        summary: params.summary.slice(0, 1800),
        primaryMetric: 100,
        secondaryMetric: 10,
      });
    } catch (err) {
      console.error("Failed to save AI artifact to Firestore:", err);
    }
  };

  // 1. Multi-Turn Chat Handler
  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput.trim();
    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: userText,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          mode: chatMode,
          model: selectedChatModel,
          history: updatedHistory,
          useSearchGrounding,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to get response from Gemini");
      }

      const assistantMsg: ChatMessage = {
        id: data.id || `ast_${Date.now()}`,
        role: "assistant",
        content: data.content || data.message || "",
        timestamp: data.timestamp || new Date().toISOString(),
        model: data.model || selectedChatModel,
        mode: chatMode,
        sources: Array.isArray(data.sources) ? data.sources : [],
      };

      setMessages((prev) => [...prev, assistantMsg]);

      await persistToFirestoreIfSignedIn({
        title: `Chat (${assistantMsg.model}): ${userText.slice(0, 60)}`,
        status: "Completed",
        summary: assistantMsg.content.slice(0, 600),
      });
    } catch (error: any) {
      toast({
        title: "Chat Error",
        description: error?.message || "Unable to reach Gemini chat endpoint.",
        variant: "destructive",
      });
    } finally {
      setIsChatLoading(false);
    }
  };

  // 2. Nano Banana 2.1 Image Create & Edit Handler
  const handleFileUploadToBase64 = (
    file: File,
    onLoaded: (dataUrl: string, mimeType: string) => void
  ) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onLoaded(reader.result, file.type || "image/png");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRunNanoBananaImage = async () => {
    if (!imagePrompt.trim() || isImageLoading) return;
    if (imageAction === "edit" && !uploadedEditImage && !generatedImageUrl) {
      toast({
        title: "Source Image Required",
        description:
          "Upload a photo or generate an image first to edit with gemini-nano-banana-2.1.",
        variant: "destructive",
      });
      return;
    }

    setIsImageLoading(true);
    try {
      const sourceForEdit =
        imageAction === "edit"
          ? uploadedEditImage || generatedImageUrl
          : undefined;

      const res = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: imageAction,
          prompt: imagePrompt.trim(),
          aspectRatio: imageAspectRatio,
          imageSize,
          imageBase64: sourceForEdit,
          imageMimeType: uploadedEditMime,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Image generation failed");
      }

      const url = data.imageUrl || data.visual?.imageUrl;
      if (url) {
        setGeneratedImageUrl(url);
        setGeneratedImageNotes(
          data.notes ||
            data.visual?.subline ||
            `Processed with ${data.model || "gemini-nano-banana-2.1"}`
        );
        await persistToFirestoreIfSignedIn({
          title: `Nano Banana 2.1 (${imageAction}): ${imagePrompt.slice(0, 60)}`,
          status: `${imageAspectRatio} · ${imageSize}`,
          summary: `Model: gemini-nano-banana-2.1 | Prompt: ${imagePrompt}`,
        });
        toast({
          title:
            imageAction === "edit"
              ? "Image Edited with Nano Banana 2.1"
              : "Image Created with Nano Banana 2.1",
          description: `Rendered in ${imageAspectRatio} (${imageSize}).`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Image Operation Failed",
        description: error?.message || "Could not process image request.",
        variant: "destructive",
      });
    } finally {
      setIsImageLoading(false);
    }
  };

  // 3. Veo 3.1 Video Generation (Text-to-Video & Image-to-Video) Handler
  const handleGenerateVeoVideo = async () => {
    if (isVideoGenerating) return;
    if (videoMode === "image" && !uploadedVideoPhoto) {
      toast({
        title: "Photo Required",
        description:
          "Please upload a starting photo to animate into a Veo 3.1 video.",
        variant: "destructive",
      });
      return;
    }
    if (!videoPrompt.trim() && !uploadedVideoPhoto) {
      toast({
        title: "Prompt Required",
        description: "Enter a video prompt to generate with Veo 3.1.",
        variant: "destructive",
      });
      return;
    }

    setIsVideoGenerating(true);
    setVideoError(null);
    setGeneratedVideoUrl(null);
    setVideoStatusStep(0);

    try {
      const startRes = await fetch("/api/ai/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: videoPrompt.trim(),
          aspectRatio: videoAspectRatio,
          resolution: videoResolution,
          imageBase64: videoMode === "image" ? uploadedVideoPhoto : undefined,
          imageMimeType: uploadedVideoPhotoMime,
        }),
      });

      const startData = await startRes.json();
      if (!startRes.ok || !startData.operationName) {
        throw new Error(
          startData.error || "Failed to start Veo 3.1 video generation."
        );
      }

      const operationName = startData.operationName;

      // Poll every 6 seconds until done
      let attempts = 0;
      while (attempts < 40) {
        await new Promise((r) => setTimeout(r, 6000));
        attempts++;
        setVideoStatusStep(attempts % VEO_LOADING_MESSAGES.length);

        const pollRes = await fetch("/api/ai/video/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationName }),
        });
        const pollData = await pollRes.json();

        if (!pollRes.ok) {
          throw new Error(pollData.error || "Error polling video status");
        }

        if (pollData.error) {
          throw new Error(
            pollData.error.message || JSON.stringify(pollData.error)
          );
        }

        if (pollData.done) {
          const dlRes = await fetch("/api/ai/video/download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationName }),
          });
          if (!dlRes.ok) {
            const errJson = await dlRes.json().catch(() => ({}));
            throw new Error(errJson.error || "Failed to download MP4 stream");
          }
          const videoBlob = await dlRes.blob();
          const objectUrl = URL.createObjectURL(videoBlob);
          setGeneratedVideoUrl(objectUrl);

          await persistToFirestoreIfSignedIn({
            title: `Veo 3.1 Video (${videoAspectRatio}): ${videoPrompt.slice(0, 60)}`,
            status: "Rendered MP4",
            summary: `Model: veo-3.1-fast-generate-preview | Mode: ${videoMode} | Aspect: ${videoAspectRatio}`,
          });

          toast({
            title: "Veo 3.1 Video Ready",
            description: `Generated ${videoAspectRatio} video using veo-3.1-fast-generate-preview.`,
          });
          break;
        }
      }
    } catch (err: any) {
      const msg =
        err?.message ||
        "Veo 3.1 generation encountered an error. Check your API key in Settings > Secrets.";
      setVideoError(msg);
      toast({
        title: "Veo 3.1 Video Notice",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsVideoGenerating(false);
    }
  };

  // 4. Lyria 3 Music Generation Handler
  const handleGenerateLyriaMusic = async () => {
    if (!musicPrompt.trim() || isMusicGenerating) return;

    setIsMusicGenerating(true);
    setMusicError(null);
    setGeneratedAudioUrl(null);
    setGeneratedLyrics("");

    try {
      const res = await fetch("/api/ai/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: musicPrompt.trim(),
          model: musicModel,
          imageBase64: musicRefImage || undefined,
          imageMimeType: musicRefMime,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.audioBase64) {
        throw new Error(data.error || "Lyria 3 music generation failed.");
      }

      // Decode base64 audio into a playable Blob URL as specified in skill docs
      const binary = atob(data.audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: data.mimeType || "audio/wav" });
      const audioUrl = URL.createObjectURL(blob);

      setGeneratedAudioUrl(audioUrl);
      setGeneratedLyrics(data.lyrics || "");

      await persistToFirestoreIfSignedIn({
        title: `Lyria 3 Audio (${musicModel}): ${musicPrompt.slice(0, 60)}`,
        status: "Generated WAV",
        summary: `Model: ${musicModel} | Prompt: ${musicPrompt}`,
      });

      toast({
        title: "Lyria 3 Audio Generated",
        description: `Created track using ${musicModel}.`,
      });
    } catch (err: any) {
      const msg =
        err?.message ||
        "Lyria 3 music generation requires a supported Gemini API key.";
      setMusicError(msg);
      toast({
        title: "Lyria 3 Music Notice",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsMusicGenerating(false);
    }
  };

  // 5. Google Search Grounding Handler
  const handleRunGroundedSearch = async () => {
    if (!searchQuery.trim() || isSearching) return;
    setIsSearching(true);
    try {
      const res = await fetch("/api/ai/search-grounding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Search grounding request failed");
      }
      setSearchAnswer(data.answer || "");
      setSearchSources(Array.isArray(data.sources) ? data.sources : []);

      await persistToFirestoreIfSignedIn({
        title: `Search Grounding: ${searchQuery.slice(0, 60)}`,
        status: `${(data.sources || []).length} Citations`,
        summary: (data.answer || "").slice(0, 600),
      });
    } catch (err: any) {
      toast({
        title: "Search Grounding Error",
        description: err?.message || "Failed to fetch live search data.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Command Header & Firebase Auth / Firestore Bar */}
      <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Gemini Multi-Modal Studio &amp; Copilot
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Multi-turn chat (`gemini-4-argon` / `gemini-3.8-flash` / `gemini-3.1-flash-lite`), Nano Banana 2.1 image creation &amp; editing, Veo 3.1 video synthesis, Lyria 3 music generation, and Google Search grounding synced with Firestore.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {firebaseUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/35 bg-emerald-500/10 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {firebaseUser.displayName || firebaseUser.email}
                </span>
                <span className="font-mono text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                  ({cloudWorkspaceItems.length} saved in Firestore)
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isSyncing}
                  onClick={() => syncWorkspaceToFirestore()}
                  className="h-7 px-2 text-xs cursor-pointer"
                >
                  <RefreshCw
                    className={`h-3 w-3 mr-1 ${isSyncing ? "animate-spin" : ""}`}
                  />
                  Sync
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => signInWithGoogle()}
                className="h-9 px-3.5 text-xs font-semibold gap-1.5 cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                Sign in with Google (Firebase Auth &amp; Firestore)
              </Button>
            )}
          </div>
        </div>

        {/* Studio Modality Switcher */}
        <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 flex-wrap">
          {(
            [
              {
                id: "chat",
                label: "Multi-Turn Gemini Chat",
                icon: MessageSquare,
                sub: "Argon / 3.8 Flash / 3.1 Lite",
                accent: "text-indigo-600 dark:text-indigo-400",
                activeBg: "bg-indigo-600 text-white shadow-2xs",
              },
              {
                id: "image",
                label: "Create & Edit Images",
                icon: ImageIcon,
                sub: "gemini-nano-banana-2.1",
                accent: "text-emerald-600 dark:text-emerald-400",
                activeBg: "bg-indigo-600 text-white shadow-2xs",
              },
              {
                id: "video",
                label: "Veo 3.1 Video Studio",
                icon: Film,
                sub: "veo-3.1-fast-generate-preview",
                accent: "text-violet-600 dark:text-violet-400",
                activeBg: "bg-indigo-600 text-white shadow-2xs",
              },
              {
                id: "music",
                label: "Lyria 3 Music Studio",
                icon: Music,
                sub: "lyria-3-clip / pro",
                accent: "text-amber-600 dark:text-amber-400",
                activeBg: "bg-indigo-600 text-white shadow-2xs",
              },
              {
                id: "search",
                label: "Google Search Grounding",
                icon: Globe,
                sub: "gemini-3.8-flash + Search",
                accent: "text-sky-600 dark:text-sky-400",
                activeBg: "bg-indigo-600 text-white shadow-2xs",
              },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  active
                    ? tab.activeBg
                    : "bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : tab.accent}`} />
                <div className="text-left">
                  <div>{tab.label}</div>
                  <div
                    className={`text-[10px] font-mono ${
                      active
                        ? "text-indigo-100"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {tab.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TAB 1: MULTI-TURN GEMINI CHAT INTERFACE ================= */}
      {activeSection === "chat" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Role & Model Configuration Panel */}
          <Card className="lg:col-span-4">
            <CardHeader className="pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <CardTitle className="text-base">
                Specialist Role &amp; Gemini Model
              </CardTitle>
              <CardDescription className="text-xs">
                Assign a system instruction persona and choose the right model tier for your task.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              {/* Role Selector */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">
                  1. Chatbot Role (System Instruction)
                </Label>
                <div className="space-y-1.5">
                  {(
                    [
                      {
                        id: "general",
                        label: "Executive Marketing Copilot",
                        desc: "Balanced omnichannel advisor (gemini-3.8-flash)",
                      },
                      {
                        id: "marketing",
                        label: "Chief GTM & Strategy Architect",
                        desc: "Complex multi-touch campaign reasoning (gemini-4-argon)",
                      },
                      {
                        id: "analytics",
                        label: "Principal Growth Data Scientist",
                        desc: "Deep attribution, CAC/LTV & ROI math (gemini-4-argon)",
                      },
                      {
                        id: "content",
                        label: "Creative Content Director",
                        desc: "Fold-aware social posts & scripts (gemini-3.8-flash)",
                      },
                      {
                        id: "fast",
                        label: "Rapid Copy & Hook Sprinter",
                        desc: "Ultra-fast micro-copy & tags (gemini-3.1-flash-lite)",
                      },
                    ] as const
                  ).map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleSelectRoleMode(role.id)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                        chatMode === role.id
                          ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-slate-100"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="font-semibold">{role.label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {role.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Explicit Model Tier Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                <Label className="text-xs font-semibold">
                  2. Gemini Model Tier
                </Label>
                <div className="grid grid-cols-1 gap-1.5">
                  {(
                    [
                      {
                        id: "gemini-4-argon" as ChatModelId,
                        name: "gemini-4-argon",
                        badge: "Complex Tasks",
                        icon: Brain,
                      },
                      {
                        id: "gemini-3.8-flash" as ChatModelId,
                        name: "gemini-3.8-flash",
                        badge: "General + Search",
                        icon: Sparkles,
                      },
                      {
                        id: "gemini-3.1-flash-lite" as ChatModelId,
                        name: "gemini-3.1-flash-lite",
                        badge: "Fast Tasks",
                        icon: Gauge,
                      },
                    ] as const
                  ).map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedChatModel(m.id)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-mono cursor-pointer ${
                          selectedChatModel === m.id
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5" />
                          {m.name}
                        </span>
                        <span className="text-[10px] opacity-85">{m.badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Google Search Grounding Toggle */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    Google Search Grounding
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Ground responses with live web citations (`googleSearch`)
                  </div>
                </div>
                <Switch
                  checked={useSearchGrounding}
                  onCheckedChange={setUseSearchGrounding}
                />
              </div>
            </CardContent>
          </Card>

          {/* Right Multi-Turn Scrollable Conversation Thread */}
          <Card className="lg:col-span-8 flex flex-col h-[640px]">
            <CardHeader className="pb-3 border-b border-slate-200/80 dark:border-slate-800 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <span>Multi-Turn Conversation Thread</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                    {selectedChatModel}
                  </span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Maintains full context history across turns with role-specific system instructions.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setMessages([
                    {
                      id: "welcome",
                      role: "assistant",
                      content: "Conversation history cleared. Ready for your next multi-turn session.",
                      timestamp: new Date().toISOString(),
                      model: selectedChatModel,
                      mode: chatMode,
                    },
                  ])
                }
                className="h-8 text-xs gap-1 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear Thread
              </Button>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-xl px-4 py-3 max-w-[85%] text-xs md:text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Display Google Search Grounding Sources if present */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 space-y-1">
                        <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          Google Search Grounding Citations:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((src, i) => (
                            <a
                              key={i}
                              href={src.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline max-w-[240px] truncate"
                            >
                              <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                              <span className="truncate">{src.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-2 flex items-center justify-between gap-3 text-[10px] opacity-70 font-mono">
                      <span>{msg.model || selectedChatModel}</span>
                      <span>
                        {!isMounted ||
                        msg.timestamp === "Ready" ||
                        Number.isNaN(new Date(msg.timestamp).getTime())
                          ? "Ready"
                          : new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 px-3 py-2">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                  <span>
                    {selectedChatModel} is reasoning ({chatMode} mode)...
                  </span>
                </div>
              )}
              <div ref={chatEndRef} />
            </CardContent>

            <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChatMessage();
                  }
                }}
                placeholder={`Ask ${selectedChatModel} (${chatMode} role)...`}
                disabled={isChatLoading}
                className="flex-1 text-xs md:text-sm"
              />
              <Button
                type="button"
                onClick={handleSendChatMessage}
                disabled={isChatLoading || !chatInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                Send
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ================= TAB 2: CREATE & EDIT IMAGES (gemini-nano-banana-2.1) ================= */}
      {activeSection === "image" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-5">
            <CardHeader className="pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <CardTitle className="text-base">
                Nano Banana 2.1 Image Studio
              </CardTitle>
              <CardDescription className="text-xs font-mono">
                Model: gemini-nano-banana-2.1
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={imageAction === "generate" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setImageAction("generate")}
                  className="text-xs cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Create Image
                </Button>
                <Button
                  type="button"
                  variant={imageAction === "edit" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setImageAction("edit")}
                  className="text-xs cursor-pointer"
                >
                  <Wand2 className="h-3.5 w-3.5 mr-1.5" />
                  Edit Image
                </Button>
              </div>

              {imageAction === "edit" && (
                <div className="space-y-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                  <Label className="text-xs font-semibold">
                    Source Image to Edit
                  </Label>
                  <input
                    ref={editImageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUploadToBase64(file, (dataUrl, mime) => {
                          setUploadedEditImage(dataUrl);
                          setUploadedEditMime(mime);
                        });
                      }
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => editImageInputRef.current?.click()}
                      className="text-xs gap-1.5 cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Upload Photo to Edit
                    </Button>
                    {(uploadedEditImage || generatedImageUrl) && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Source image ready
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  {imageAction === "edit"
                    ? "Edit Instruction Prompt"
                    : "Creation Prompt"}
                </Label>
                <Textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  rows={4}
                  placeholder={
                    imageAction === "edit"
                      ? "Describe how to modify the image (e.g., 'Add a glowing neon holographic chart in the foreground')..."
                      : "Describe the image to create with gemini-nano-banana-2.1..."
                  }
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Aspect Ratio</Label>
                  <div className="flex flex-wrap gap-1">
                    {(["16:9", "1:1", "9:16", "4:3", "3:4"] as const).map(
                      (ar) => (
                        <button
                          key={ar}
                          type="button"
                          onClick={() => setImageAspectRatio(ar)}
                          className={`px-2.5 py-1 rounded text-xs font-mono border cursor-pointer ${
                            imageAspectRatio === ar
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "border-slate-200 dark:border-slate-800"
                          }`}
                        >
                          {ar}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Resolution</Label>
                  <div className="flex gap-1">
                    {(["1K", "2K", "4K"] as const).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setImageSize(sz)}
                        className={`px-3 py-1 rounded text-xs font-mono border cursor-pointer ${
                          imageSize === sz
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleRunNanoBananaImage}
                disabled={isImageLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
              >
                {isImageLoading ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" />
                    Running gemini-nano-banana-2.1...
                  </>
                ) : imageAction === "edit" ? (
                  <>
                    <Wand2 className="h-3.5 w-3.5 mr-2" />
                    Edit Image with gemini-nano-banana-2.1
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 mr-2" />
                    Generate Image with gemini-nano-banana-2.1
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-7">
            <CardHeader className="pb-3 border-b border-slate-200/80 dark:border-slate-800 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  Rendered Visual Output
                </CardTitle>
                <CardDescription className="text-xs">
                  {generatedImageNotes ||
                    "Create or edit high-resolution visuals using gemini-nano-banana-2.1"}
                </CardDescription>
              </div>
              {generatedImageUrl && (
                <a
                  href={generatedImageUrl}
                  download="visionai-nanobanana-visual.png"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
              )}
            </CardHeader>
            <CardContent className="p-6 flex items-center justify-center min-h-[380px]">
              {generatedImageUrl ? (
                <div className="space-y-3 w-full flex flex-col items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={generatedImageUrl}
                    alt="Generated with gemini-nano-banana-2.1"
                    referrerPolicy="no-referrer"
                    className="max-h-[420px] rounded-xl border border-slate-200 dark:border-slate-800 object-contain shadow-sm"
                  />
                </div>
              ) : (
                <div className="text-center space-y-2 text-slate-400">
                  <ImageIcon className="h-10 w-10 mx-auto opacity-40" />
                  <p className="text-xs">
                    Enter a prompt on the left to create or edit an image with{" "}
                    <code className="font-mono">gemini-nano-banana-2.1</code>.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ================= TAB 3: VEO 3.1 VIDEO STUDIO (veo-3.1-fast-generate-preview) ================= */}
      {activeSection === "video" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-5">
            <CardHeader className="pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <CardTitle className="text-base">
                Veo 3.1 Video Generator
              </CardTitle>
              <CardDescription className="text-xs font-mono">
                Model: veo-3.1-fast-generate-preview
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={videoMode === "text" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVideoMode("text")}
                  className="text-xs cursor-pointer"
                >
                  <Film className="h-3.5 w-3.5 mr-1.5" />
                  Text to Video
                </Button>
                <Button
                  type="button"
                  variant={videoMode === "image" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVideoMode("image")}
                  className="text-xs cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Animate Photo to Video
                </Button>
              </div>

              {videoMode === "image" && (
                <div className="space-y-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                  <Label className="text-xs font-semibold">
                    Upload Photo to Animate (Starting Frame)
                  </Label>
                  <input
                    ref={videoPhotoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUploadToBase64(file, (dataUrl, mime) => {
                          setUploadedVideoPhoto(dataUrl);
                          setUploadedVideoPhotoMime(mime);
                        });
                      }
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => videoPhotoInputRef.current?.click()}
                      className="text-xs gap-1.5 cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Choose Photo
                    </Button>
                    {uploadedVideoPhoto && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Photo uploaded
                      </span>
                    )}
                  </div>
                  {uploadedVideoPhoto && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={uploadedVideoPhoto}
                      alt="Starting frame"
                      referrerPolicy="no-referrer"
                      className="h-24 rounded border border-slate-200 dark:border-slate-800 object-cover mt-2"
                    />
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Video Motion &amp; Scene Prompt
                </Label>
                <Textarea
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  rows={4}
                  placeholder="Describe the camera movement, lighting, and subject action..."
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Aspect Ratio (Required)
                  </Label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(
                      [
                        { id: "16:9", label: "16:9 Landscape" },
                        { id: "9:16", label: "9:16 Portrait" },
                      ] as const
                    ).map((ar) => (
                      <button
                        key={ar.id}
                        type="button"
                        onClick={() => setVideoAspectRatio(ar.id)}
                        className={`px-2.5 py-1.5 rounded text-xs font-mono border cursor-pointer ${
                          videoAspectRatio === ar.id
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        {ar.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Resolution</Label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(["720p", "1080p"] as const).map((res) => (
                      <button
                        key={res}
                        type="button"
                        onClick={() => setVideoResolution(res)}
                        className={`px-2.5 py-1.5 rounded text-xs font-mono border cursor-pointer ${
                          videoResolution === res
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleGenerateVeoVideo}
                disabled={isVideoGenerating}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
              >
                {isVideoGenerating ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" />
                    Generating Veo 3.1 Video...
                  </>
                ) : videoMode === "image" ? (
                  <>
                    <Film className="h-3.5 w-3.5 mr-2" />
                    Animate Photo with veo-3.1-fast-generate-preview
                  </>
                ) : (
                  <>
                    <Film className="h-3.5 w-3.5 mr-2" />
                    Generate Video with veo-3.1-fast-generate-preview
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-7">
            <CardHeader className="pb-3 border-b border-slate-200/80 dark:border-slate-800 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Veo 3.1 Video Output</CardTitle>
                <CardDescription className="text-xs">
                  Aspect Ratio: {videoAspectRatio} · Resolution: {videoResolution}
                </CardDescription>
              </div>
              {generatedVideoUrl && (
                <a
                  href={generatedVideoUrl}
                  download={`visionai-veo3-${videoAspectRatio.replace(":", "x")}.mp4`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download MP4
                </a>
              )}
            </CardHeader>
            <CardContent className="p-6 flex items-center justify-center min-h-[380px]">
              {isVideoGenerating ? (
                <div className="text-center space-y-3 max-w-md">
                  <RefreshCw className="h-8 w-8 mx-auto animate-spin text-indigo-600" />
                  <p className="text-sm font-semibold">
                    {VEO_LOADING_MESSAGES[videoStatusStep]}
                  </p>
                  <p className="text-xs text-slate-500">
                    Veo 3.1 (`veo-3.1-fast-generate-preview`) is synthesizing your{" "}
                    {videoAspectRatio} video. This may take up to a minute.
                  </p>
                </div>
              ) : generatedVideoUrl ? (
                <video
                  src={generatedVideoUrl}
                  controls
                  autoPlay
                  loop
                  className={`rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ${
                    videoAspectRatio === "9:16"
                      ? "max-h-[460px] aspect-[9/16]"
                      : "w-full max-h-[420px] aspect-video"
                  }`}
                />
              ) : (
                <div className="text-center space-y-2 text-slate-400 max-w-md">
                  <Film className="h-10 w-10 mx-auto opacity-40" />
                  <p className="text-xs">
                    Generate a video from text or upload a photo to animate with{" "}
                    <code className="font-mono">
                      veo-3.1-fast-generate-preview
                    </code>{" "}
                    in `16:9` or `9:16`.
                  </p>
                  {videoError && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                      {videoError}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ================= TAB 4: LYRIA 3 MUSIC STUDIO ================= */}
      {activeSection === "music" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-5">
            <CardHeader className="pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <CardTitle className="text-base">
                Lyria 3 Music &amp; Soundtrack Generator
              </CardTitle>
              <CardDescription className="text-xs font-mono">
                Models: lyria-3-clip-preview &amp; lyria-3-pro-preview
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Select Lyria 3 Model
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => setMusicModel("lyria-3-clip-preview")}
                    className={`p-2.5 rounded-lg border text-left text-xs cursor-pointer ${
                      musicModel === "lyria-3-clip-preview"
                        ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40"
                        : "border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <div className="font-mono font-semibold">
                      lyria-3-clip-preview
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Short ad &amp; social clips (up to 30 seconds)
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMusicModel("lyria-3-pro-preview")}
                    className={`p-2.5 rounded-lg border text-left text-xs cursor-pointer ${
                      musicModel === "lyria-3-pro-preview"
                        ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40"
                        : "border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <div className="font-mono font-semibold">
                      lyria-3-pro-preview
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Full-length campaign &amp; podcast tracks
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Music Style, Instruments &amp; Mood Prompt
                </Label>
                <Textarea
                  value={musicPrompt}
                  onChange={(e) => setMusicPrompt(e.target.value)}
                  rows={4}
                  placeholder="Describe the genre, tempo, instruments, and mood..."
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Optional Visual Inspiration Image
                </Label>
                <input
                  ref={musicImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUploadToBase64(file, (dataUrl, mime) => {
                        setMusicRefImage(dataUrl);
                        setMusicRefMime(mime);
                      });
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => musicImageInputRef.current?.click()}
                    className="text-xs gap-1.5 cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Attach Image for Mood
                  </Button>
                  {musicRefImage && (
                    <button
                      type="button"
                      onClick={() => setMusicRefImage(null)}
                      className="text-[11px] text-rose-500 hover:underline cursor-pointer"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              </div>

              <Button
                type="button"
                onClick={handleGenerateLyriaMusic}
                disabled={isMusicGenerating}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
              >
                {isMusicGenerating ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" />
                    Streaming Audio from {musicModel}...
                  </>
                ) : (
                  <>
                    <Music className="h-3.5 w-3.5 mr-2" />
                    Generate Music with {musicModel}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-7">
            <CardHeader className="pb-3 border-b border-slate-200/80 dark:border-slate-800 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  Lyria 3 Audio Player &amp; Lyrics
                </CardTitle>
                <CardDescription className="text-xs font-mono">
                  Active Model: {musicModel}
                </CardDescription>
              </div>
              {generatedAudioUrl && (
                <a
                  href={generatedAudioUrl}
                  download={`visionai-${musicModel}-track.wav`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download WAV
                </a>
              )}
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[380px] space-y-4">
              {generatedAudioUrl ? (
                <div className="w-full max-w-lg space-y-4">
                  <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-3">
                    <div className="text-xs font-semibold flex items-center justify-between">
                      <span>Generated Audio Track</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">
                        {musicModel}
                      </span>
                    </div>
                    <audio
                      src={generatedAudioUrl}
                      controls
                      autoPlay
                      className="w-full"
                    />
                  </div>
                  {generatedLyrics && (
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                      <div className="text-xs font-semibold">
                        Generated Lyrics / Track Metadata
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {generatedLyrics}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-2 text-slate-400 max-w-md">
                  <Music className="h-10 w-10 mx-auto opacity-40" />
                  <p className="text-xs">
                    Generate a 30-second clip (<code className="font-mono">lyria-3-clip-preview</code>) or full-length soundtrack (<code className="font-mono">lyria-3-pro-preview</code>).
                  </p>
                  {musicError && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                      {musicError}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ================= TAB 5: GOOGLE SEARCH GROUNDING (gemini-3.8-flash) ================= */}
      {activeSection === "search" && (
        <Card>
          <CardHeader className="pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Live Google Search Grounding Intelligence (`gemini-3.8-flash`)
            </CardTitle>
            <CardDescription className="text-xs">
              Query live web data using `gemini-3.8-flash` with the `googleSearch` tool and inspect verified source citations.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-5">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRunGroundedSearch();
                }}
                placeholder="Search live market benchmarks, competitor launches, or industry trends..."
                className="flex-1 text-xs md:text-sm"
              />
              <Button
                type="button"
                onClick={handleRunGroundedSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold gap-1.5 cursor-pointer shrink-0"
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Searching Google...
                  </>
                ) : (
                  <>
                    <Globe className="h-3.5 w-3.5" />
                    Run Grounded Search
                  </>
                )}
              </Button>
            </div>

            {searchAnswer && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                  {searchAnswer}
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    Verified Web Citations ({searchSources.length})
                  </div>
                  {searchSources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {searchSources.map((src, i) => (
                        <a
                          key={i}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-500 flex items-center justify-between gap-2 text-xs transition-colors"
                        >
                          <span className="font-medium truncate">
                            {src.title}
                          </span>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Grounded synthesis complete via `gemini-3.8-flash`.
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
