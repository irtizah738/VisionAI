"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Palette,
  Sparkles,
  Download,
  Share2,
  Image as ImageIcon,
  Type as TypeIcon,
  Layers,
  Wand2,
  Check,
  Copy,
  RefreshCw,
  Plus,
  Send,
  Calendar,
  Clock,
  Layout,
  Sliders,
  ChevronRight,
  Eye,
  Maximize2,
  Trash2,
  Bookmark,
  Zap,
  ArrowRight,
  Flame,
  Star,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

// Aspect Ratio Types
export type AspectRatioType = "1:1" | "4:5" | "16:9" | "9:16";

export interface AspectRatioConfig {
  label: string;
  sub: string;
  width: number;
  height: number;
  cssAspect: string;
  iconName: string;
}

export const ASPECT_RATIOS: Record<AspectRatioType, AspectRatioConfig> = {
  "1:1": {
    label: "1:1 Square",
    sub: "1080 x 1080 (Insta / LinkedIn)",
    width: 1080,
    height: 1080,
    cssAspect: "aspect-square",
    iconName: "1:1",
  },
  "4:5": {
    label: "4:5 Portrait",
    sub: "1080 x 1350 (Insta Feed)",
    width: 1080,
    height: 1350,
    cssAspect: "aspect-[4/5]",
    iconName: "4:5",
  },
  "16:9": {
    label: "16:9 Landscape",
    sub: "1920 x 1080 (Twitter / YouTube)",
    width: 1920,
    height: 1080,
    cssAspect: "aspect-video",
    iconName: "16:9",
  },
  "9:16": {
    label: "9:16 Story / Reel",
    sub: "1080 x 1920 (Reels / TikTok)",
    width: 1080,
    height: 1920,
    cssAspect: "aspect-[9/16]",
    iconName: "9:16",
  },
};

// Brand Palettes
export interface BrandPalette {
  id: string;
  name: string;
  bgStart: string;
  bgEnd: string;
  headlineColor: string;
  subheadColor: string;
  ctaBg: string;
  ctaText: string;
  accent: string;
}

export const PALETTES: BrandPalette[] = [
  {
    id: "vision-dark",
    name: "VisionAI Emerald Dark",
    bgStart: "#09090B",
    bgEnd: "#18181B",
    headlineColor: "#FFFFFF",
    subheadColor: "#A1A1AA",
    ctaBg: "#10B981",
    ctaText: "#000000",
    accent: "#10B981",
  },
  {
    id: "cyber-indigo",
    name: "Cyber Indigo",
    bgStart: "#0B0F19",
    bgEnd: "#1E1B4B",
    headlineColor: "#FFFFFF",
    subheadColor: "#C7D2FE",
    ctaBg: "#6366F1",
    ctaText: "#FFFFFF",
    accent: "#818CF8",
  },
  {
    id: "sunset-glow",
    name: "Sunset Coral",
    bgStart: "#18181B",
    bgEnd: "#27272A",
    headlineColor: "#FFFFFF",
    subheadColor: "#FECDD3",
    ctaBg: "#F43F5E",
    ctaText: "#FFFFFF",
    accent: "#FB7185",
  },
  {
    id: "electric-amber",
    name: "Electric Amber",
    bgStart: "#0F172A",
    bgEnd: "#1E293B",
    headlineColor: "#FFFFFF",
    subheadColor: "#FDE68A",
    ctaBg: "#F59E0B",
    ctaText: "#000000",
    accent: "#FBBF24",
  },
  {
    id: "clean-monochrome",
    name: "Lux Monochrome Gold",
    bgStart: "#000000",
    bgEnd: "#171717",
    headlineColor: "#FFFFFF",
    subheadColor: "#E5E5E5",
    ctaBg: "#D97706",
    ctaText: "#FFFFFF",
    accent: "#F59E0B",
  },
  {
    id: "ocean-cyan",
    name: "Ocean Cyan",
    bgStart: "#030712",
    bgEnd: "#0F172A",
    headlineColor: "#FFFFFF",
    subheadColor: "#A5F3FC",
    ctaBg: "#06B6D4",
    ctaText: "#000000",
    accent: "#22D3EE",
  },
];

// Curated Background Presets
export const BACKGROUND_PRESETS = [
  {
    id: "preset-mesh-1",
    name: "Cyber Grid Mesh",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    tag: "Abstract Tech",
  },
  {
    id: "preset-mesh-2",
    name: "Neon Glassmorphism",
    url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
    tag: "3D Gradient",
  },
  {
    id: "preset-mesh-3",
    name: "Dark Tech Matrix",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    tag: "Data AI",
  },
  {
    id: "preset-mesh-4",
    name: "Minimalist Studio",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    tag: "Architecture",
  },
  {
    id: "preset-mesh-5",
    name: "Vibrant Gradient Wave",
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
    tag: "Gradient",
  },
  {
    id: "preset-mesh-6",
    name: "Deep Space Nebula",
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80",
    tag: "Space",
  },
];

export interface HookSuggestion {
  headline: string;
  subhead: string;
  ctaBadge: string;
  hookCategory: string;
  badgeColorHex?: string;
}

export function CreativeStudio() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas Config State
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>("1:1");
  const [headline, setHeadline] = useState("Scale Your Growth with AI Automation");
  const [subhead, setSubhead] = useState(
    "Unify social publishing, automated copy, and real-time ROI tracking in one command workspace."
  );
  const [ctaBadge, setCtaBadge] = useState("SWIPE FOR PROOF ->");
  const [brandHandle, setBrandHandle] = useState("@VisionAI_HQ");
  const [selectedPalette, setSelectedPalette] = useState<BrandPalette>(PALETTES[0]);

  // Typography & Styling
  const [headlineFontSize, setHeadlineFontSize] = useState(56);
  const [headlineWeight, setHeadlineWeight] = useState<"bold" | "extrabold" | "normal">("extrabold");
  const [headlineHighlight, setHeadlineHighlight] = useState<"none" | "box" | "pill">("box");
  const [subheadFontSize, setSubheadFontSize] = useState(24);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");

  // Background Options
  const [bgType, setBgType] = useState<"gradient" | "image" | "solid">("gradient");
  const [bgImageSrc, setBgImageSrc] = useState<string>(BACKGROUND_PRESETS[0].url);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(65); // Dark tint overlay %
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiStyle, setAiStyle] = useState("Cyberpunk Neon Tech Card");
  const [isGeneratingAiImage, setIsGeneratingAiImage] = useState(false);

  // AI Hook Generator
  const [hookTopic, setHookTopic] = useState("");
  const [isGeneratingHooks, setIsGeneratingHooks] = useState(false);
  const [hookSuggestions, setHookSuggestions] = useState<HookSuggestion[]>([]);

  // Planner Export Modal
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportedDataUrl, setExportedDataUrl] = useState<string>("");
  const [postCaption, setPostCaption] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "twitter",
    "linkedin",
    "instagram",
  ]);
  const [scheduledDate, setScheduledDate] = useState("2026-10-19");
  const [scheduledTime, setScheduledTime] = useState("16:00");
  const [isPublishingToPlanner, setIsPublishingToPlanner] = useState(false);

  // Saved Canvas Templates
  const [savedTemplates, setSavedTemplates] = useState<Array<{ id: string; name: string; date: string; data: any }>>([]);

  // Load saved templates on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("visionai_creative_canvas_templates");
      if (stored) {
        setSavedTemplates(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Sync palette selection with elements
  const applyPalette = (pal: BrandPalette) => {
    setSelectedPalette(pal);
  };

  // Helper function to render text with line wrap on HTML5 Canvas
  const drawWrappedText = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number,
      align: "left" | "center" | "right",
      hasHighlightBox: "none" | "box" | "pill",
      textColor: string,
      boxBgColor: string
    ) => {
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = "";

      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }

      ctx.save();
      ctx.textAlign = align;
      let startY = y;

      lines.forEach((line) => {
        const metrics = ctx.measureText(line);
        let drawX = x;
        if (align === "center") {
          drawX = x;
        } else if (align === "right") {
          drawX = x;
        }

        if (hasHighlightBox === "box" || hasHighlightBox === "pill") {
          ctx.save();
          const paddingX = 20;
          const paddingY = 10;
          let bgX = drawX;
          if (align === "left") {
            bgX = drawX - 10;
          } else if (align === "center") {
            bgX = drawX - metrics.width / 2 - paddingX;
          } else if (align === "right") {
            bgX = drawX - metrics.width - paddingX;
          }

          ctx.fillStyle = boxBgColor;
          if (hasHighlightBox === "pill") {
            // Draw rounded pill behind each line
            ctx.beginPath();
            const radius = 16;
            const w = metrics.width + paddingX * 2;
            const h = lineHeight;
            const topY = startY - lineHeight + 12;
            ctx.roundRect(bgX, topY, w, h, radius);
            ctx.fill();
          } else {
            // Rectangular backdrop
            const topY = startY - lineHeight + 12;
            ctx.fillRect(bgX, topY, metrics.width + paddingX * 2, lineHeight);
          }
          ctx.restore();
        }

        // Draw shadow/glow
        ctx.shadowColor = "rgba(0,0,0,0.6)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        ctx.fillStyle = textColor;
        ctx.fillText(line, drawX, startY);
        startY += lineHeight;
      });

      ctx.restore();
      return startY;
    },
    []
  );

  // Render Canvas Drawing
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = ASPECT_RATIOS[aspectRatio];
    canvas.width = config.width;
    canvas.height = config.height;

    const w = canvas.width;
    const h = canvas.height;

    // 1. Draw Background
    if (bgType === "solid") {
      ctx.fillStyle = selectedPalette.bgStart;
      ctx.fillRect(0, 0, w, h);
    } else if (bgType === "gradient") {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, selectedPalette.bgStart);
      grad.addColorStop(1, selectedPalette.bgEnd);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Subtle ambient glowing accent circle
      const radial = ctx.createRadialGradient(w * 0.8, h * 0.2, 50, w * 0.8, h * 0.2, w * 0.6);
      radial.addColorStop(0, `${selectedPalette.accent}33`);
      radial.addColorStop(1, "transparent");
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, w, h);
    } else if (bgType === "image" && bgImageSrc) {
      // Draw background image if loaded
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // Draw object-cover image
        const imgAspect = img.width / img.height;
        const canvasAspect = w / h;
        let drawWidth = w;
        let drawHeight = h;
        let offsetX = 0;
        let offsetY = 0;

        if (imgAspect > canvasAspect) {
          drawWidth = h * imgAspect;
          offsetX = (w - drawWidth) / 2;
        } else {
          drawHeight = w / imgAspect;
          offsetY = (h - drawHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // Draw Dark Tint Overlay for readability
        if (overlayOpacity > 0) {
          ctx.fillStyle = `rgba(9, 9, 11, ${overlayOpacity / 100})`;
          ctx.fillRect(0, 0, w, h);
        }

        drawOverlayElements(ctx, w, h);
      };
      img.onerror = () => {
        // Fallback to gradient if image fails
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, selectedPalette.bgStart);
        grad.addColorStop(1, selectedPalette.bgEnd);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        drawOverlayElements(ctx, w, h);
      };
      img.src = bgImageSrc;
      return;
    }

    // Draw Dark Tint Overlay for non-image or pre-render
    if (bgType !== "image" && overlayOpacity > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity / 200})`;
      ctx.fillRect(0, 0, w, h);
    }

    drawOverlayElements(ctx, w, h);
  }, [
    aspectRatio,
    bgType,
    bgImageSrc,
    overlayOpacity,
    selectedPalette,
    headline,
    subhead,
    ctaBadge,
    brandHandle,
    headlineFontSize,
    headlineWeight,
    headlineHighlight,
    subheadFontSize,
    textAlign,
    drawWrappedText,
  ]);

  // Overlay Elements Drawing
  const drawOverlayElements = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const paddingX = w * 0.08;
    const paddingY = h * 0.08;

    // 1. Draw Top Brand Logo / Handle Pill
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    const brandText = brandHandle || "@VisionAI_HQ";
    ctx.font = `600 ${Math.round(w * 0.024)}px Inter, system-ui, sans-serif`;
    const brandMetrics = ctx.measureText(brandText);
    const pillW = brandMetrics.width + 50;
    const pillH = Math.round(w * 0.045);

    // Position top left or top right
    const pillX = paddingX;
    const pillY = paddingY;

    // Glass pill background
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Brand Dot
    ctx.beginPath();
    ctx.arc(pillX + 20, pillY + pillH / 2, 6, 0, Math.PI * 2);
    ctx.fillStyle = selectedPalette.accent;
    ctx.fill();

    // Brand Text
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.fillText(brandText, pillX + 36, pillY + pillH / 2 + 6);
    ctx.restore();

    // 2. Draw Headline & Subhead Area
    const contentWidth = w - paddingX * 2;
    let alignX = paddingX;
    if (textAlign === "center") {
      alignX = w / 2;
    } else if (textAlign === "right") {
      alignX = w - paddingX;
    }

    // Scale font size based on canvas width (normalized to 1080)
    const fontScale = w / 1080;
    const actualHeadlineSize = Math.round(headlineFontSize * fontScale);
    const actualSubheadSize = Math.round(subheadFontSize * fontScale);

    // Calculate Y start
    let currentY = h * 0.28;
    if (aspectRatio === "9:16") {
      currentY = h * 0.32;
    } else if (aspectRatio === "16:9") {
      currentY = h * 0.24;
    }

    // Set Headline font
    const weightCss = headlineWeight === "extrabold" ? "800" : headlineWeight === "bold" ? "700" : "500";
    ctx.font = `${weightCss} ${actualHeadlineSize}px Inter, system-ui, sans-serif`;

    const nextY = drawWrappedText(
      ctx,
      headline,
      alignX,
      currentY,
      contentWidth,
      actualHeadlineSize * 1.22,
      textAlign,
      headlineHighlight,
      selectedPalette.headlineColor,
      "rgba(9, 9, 11, 0.85)"
    );

    // 3. Draw Subhead Text
    if (subhead.trim()) {
      ctx.font = `400 ${actualSubheadSize}px Inter, system-ui, sans-serif`;
      const subheadY = nextY + 24 * fontScale;

      drawWrappedText(
        ctx,
        subhead,
        alignX,
        subheadY,
        contentWidth,
        actualSubheadSize * 1.4,
        textAlign,
        "none",
        selectedPalette.subheadColor,
        "transparent"
      );
    }

    // 4. Draw CTA Badge Pill at Bottom
    if (ctaBadge.trim()) {
      ctx.save();
      const badgeFontSize = Math.round(26 * fontScale);
      ctx.font = `700 ${badgeFontSize}px Inter, system-ui, sans-serif`;
      const badgeMetrics = ctx.measureText(ctaBadge);

      const bPaddingX = 36 * fontScale;
      const bPaddingY = 18 * fontScale;
      const bWidth = badgeMetrics.width + bPaddingX * 2;
      const bHeight = badgeFontSize + bPaddingY * 2;

      let bX = paddingX;
      if (textAlign === "center") {
        bX = (w - bWidth) / 2;
      } else if (textAlign === "right") {
        bX = w - paddingX - bWidth;
      }

      let bY = h - paddingY - bHeight - 10;
      if (aspectRatio === "9:16") {
        bY = h - paddingY * 1.5 - bHeight;
      }

      // Draw Badge Glow
      ctx.shadowColor = selectedPalette.ctaBg;
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 4;

      // Draw Rounded Pill
      ctx.fillStyle = selectedPalette.ctaBg;
      ctx.beginPath();
      ctx.roundRect(bX, bY, bWidth, bHeight, bHeight / 2);
      ctx.fill();

      // CTA Text
      ctx.shadowBlur = 0;
      ctx.fillStyle = selectedPalette.ctaText;
      ctx.textAlign = "center";
      ctx.fillText(ctaBadge, bX + bWidth / 2, bY + bHeight / 2 + badgeFontSize * 0.35);

      ctx.restore();
    }
  };

  // Re-render canvas whenever dependencies change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // AI Image Background Generator Call
  const handleGenerateAiBackground = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Enter a description for the background visual you want to generate.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingAiImage(true);
    try {
      const res = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          prompt: aiPrompt,
          aspectRatio,
          style: aiStyle,
        }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        setBgImageSrc(data.imageUrl);
        setBgType("image");
        toast({
          title: "AI Background Generated!",
          description: "Applied Gemini visual backdrop to canvas.",
        });
      } else {
        throw new Error(data.error || "Failed to generate image");
      }
    } catch (e: any) {
      toast({
        title: "Generation Notice",
        description: e.message || "Applied default high-contrast preset backdrop.",
      });
      // Fallback to random preset
      setBgImageSrc(BACKGROUND_PRESETS[Math.floor(Math.random() * BACKGROUND_PRESETS.length)].url);
      setBgType("image");
    } finally {
      setIsGeneratingAiImage(false);
    }
  };

  // AI Creative Hook Suggestions Generator Call
  const handleGenerateHooks = async () => {
    setIsGeneratingHooks(true);
    try {
      const res = await fetch("/api/ai/creative-hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: hookTopic || headline,
          tone: "bold & punchy",
        }),
      });

      const data = await res.json();
      if (data.suggestions && data.suggestions.length > 0) {
        setHookSuggestions(data.suggestions);
        toast({
          title: "Gemini Hooks Ready!",
          description: `Generated ${data.suggestions.length} high-converting visual copy suggestions.`,
        });
      }
    } catch (e: any) {
      toast({
        title: "Hook Generator Error",
        description: "Could not fetch AI hooks at this time.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingHooks(false);
    }
  };

  // Apply suggestion to canvas
  const applyHookSuggestion = (item: HookSuggestion) => {
    setHeadline(item.headline);
    setSubhead(item.subhead);
    setCtaBadge(item.ctaBadge);
    if (item.badgeColorHex) {
      setSelectedPalette((prev) => ({
        ...prev,
        ctaBg: item.badgeColorHex!,
      }));
    }
    toast({
      title: "Hook Applied!",
      description: "Updated canvas headline, subhead, and CTA badge.",
    });
  };

  // High-Res Image Download
  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `visionai-graphic-${aspectRatio.replace(":", "x")}-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    toast({
      title: "Graphic Exported!",
      description: "Downloaded high-resolution PNG to your device.",
    });
  };

  // Open Export & Attach Modal
  const handleOpenExportModal = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    setExportedDataUrl(dataUrl);

    // Pre-fill social post caption
    const caption = `${headline}\n\n${subhead}\n\nExplore more: https://visionai.studio/launch\n\n#GrowthMarketing #SocialStrategy #AIStudio`;
    setPostCaption(caption);
    setExportModalOpen(true);
  };

  // 1-Click Publish to Social Planner Queue
  const handlePublishToPlanner = async () => {
    setIsPublishingToPlanner(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: postCaption,
          platforms: selectedPlatforms,
          network: selectedPlatforms[0] || "twitter",
          scheduledTime: `${scheduledDate} at ${scheduledTime}`,
          dateKey: scheduledDate,
          status: "scheduled",
          mediaUrl: exportedDataUrl,
          handle: brandHandle,
        }),
      });

      if (res.ok) {
        toast({
          title: "Attached & Queued in Social Planner!",
          description: `Post scheduled for ${scheduledDate} with your custom graphic visual attached.`,
        });
        setExportModalOpen(false);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to schedule post");
      }
    } catch (e: any) {
      toast({
        title: "Planner Export Error",
        description: e.message || "Could not add post to planner queue.",
        variant: "destructive",
      });
    } finally {
      setIsPublishingToPlanner(false);
    }
  };

  // Save Template to Local Storage
  const handleSaveTemplate = () => {
    const templateData = {
      id: `tpl-${Date.now()}`,
      name: headline.slice(0, 30) || "Untitled Graphic",
      date: new Date().toLocaleDateString(),
      data: {
        aspectRatio,
        headline,
        subhead,
        ctaBadge,
        brandHandle,
        selectedPalette,
        headlineFontSize,
        headlineWeight,
        headlineHighlight,
        subheadFontSize,
        textAlign,
        bgType,
        bgImageSrc,
        overlayOpacity,
      },
    };

    const updated = [templateData, ...savedTemplates];
    setSavedTemplates(updated);
    try {
      localStorage.setItem("visionai_creative_canvas_templates", JSON.stringify(updated));
    } catch (e) {
      // ignore
    }

    toast({
      title: "Template Saved!",
      description: "Added graphic design preset to your workspace collection.",
    });
  };

  // Load Template
  const handleLoadTemplate = (tpl: any) => {
    const d = tpl.data;
    if (!d) return;
    if (d.aspectRatio) setAspectRatio(d.aspectRatio);
    if (d.headline) setHeadline(d.headline);
    if (d.subhead !== undefined) setSubhead(d.subhead);
    if (d.ctaBadge) setCtaBadge(d.ctaBadge);
    if (d.brandHandle) setBrandHandle(d.brandHandle);
    if (d.selectedPalette) setSelectedPalette(d.selectedPalette);
    if (d.headlineFontSize) setHeadlineFontSize(d.headlineFontSize);
    if (d.headlineWeight) setHeadlineWeight(d.headlineWeight);
    if (d.headlineHighlight) setHeadlineHighlight(d.headlineHighlight);
    if (d.subheadFontSize) setSubheadFontSize(d.subheadFontSize);
    if (d.textAlign) setTextAlign(d.textAlign);
    if (d.bgType) setBgType(d.bgType);
    if (d.bgImageSrc) setBgImageSrc(d.bgImageSrc);
    if (d.overlayOpacity !== undefined) setOverlayOpacity(d.overlayOpacity);

    toast({
      title: "Template Loaded",
      description: `Loaded design "${tpl.name}".`,
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-background text-foreground">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400">
              <Palette className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                AI Creative Canvas & Social Graphic Studio
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                  Gemini Visual Studio
                </Badge>
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Design scroll-stopping social visuals with layout presets, real-time typography overlays, AI hook suggestions, and 1-click planner attachment.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleSaveTemplate} className="gap-2">
            <Bookmark className="h-4 w-4 text-emerald-400" />
            Save Template
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadImage} className="gap-2">
            <Download className="h-4 w-4 text-blue-400" />
            Export PNG
          </Button>
          <Button
            onClick={handleOpenExportModal}
            className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium shadow-md shadow-emerald-950/20"
          >
            <Send className="h-4 w-4" />
            Export & Attach to Social Post
          </Button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Canvas Control Studio Tabs (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <Card className="border-border/60 shadow-sm bg-card/50 backdrop-blur">
            <CardHeader className="pb-3 border-b border-border/40">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-emerald-400" />
                  Design Studio Controls
                </CardTitle>
                <Badge variant="secondary" className="text-xs font-mono">
                  {aspectRatio} ({ASPECT_RATIOS[aspectRatio].width}x{ASPECT_RATIOS[aspectRatio].height})
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <Tabs defaultValue="layout" className="w-full">
                <TabsList className="grid grid-cols-4 w-full bg-muted/60 p-1 rounded-lg mb-4">
                  <TabsTrigger value="layout" className="text-xs gap-1.5">
                    <Layout className="h-3.5 w-3.5" />
                    Layout
                  </TabsTrigger>
                  <TabsTrigger value="text" className="text-xs gap-1.5">
                    <TypeIcon className="h-3.5 w-3.5" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="background" className="text-xs gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Backdrop
                  </TabsTrigger>
                  <TabsTrigger value="ai-hooks" className="text-xs gap-1.5">
                    <Wand2 className="h-3.5 w-3.5 text-emerald-400" />
                    AI Hooks
                  </TabsTrigger>
                </TabsList>

                {/* TAB 1: Layout & Aspect Ratio */}
                <TabsContent value="layout" className="space-y-5">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 block">
                      1. Select Social Aspect Ratio
                    </Label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {(Object.keys(ASPECT_RATIOS) as AspectRatioType[]).map((key) => {
                        const item = ASPECT_RATIOS[key];
                        const isSelected = aspectRatio === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setAspectRatio(key)}
                            className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/50"
                                : "border-border/60 hover:border-border bg-background/50 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className="font-semibold text-sm text-foreground">{item.label}</span>
                              {isSelected && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                            </div>
                            <span className="text-[11px] opacity-80">{item.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 block">
                      2. Brand Palette Presets
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {PALETTES.map((pal) => {
                        const isSel = selectedPalette.id === pal.id;
                        return (
                          <button
                            key={pal.id}
                            type="button"
                            onClick={() => applyPalette(pal)}
                            className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                              isSel
                                ? "border-emerald-500 bg-emerald-500/10 text-foreground"
                                : "border-border/50 bg-background/30 hover:border-border"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-5 h-5 rounded-full border border-white/20 shadow-sm flex-shrink-0"
                                style={{
                                  background: `linear-gradient(135deg, ${pal.bgStart}, ${pal.ctaBg})`,
                                }}
                              />
                              <span className="text-xs font-medium truncate">{pal.name}</span>
                            </div>
                            {isSel && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Brand Handle / Tag
                    </Label>
                    <Input
                      value={brandHandle}
                      onChange={(e) => setBrandHandle(e.target.value)}
                      placeholder="@VisionAI_HQ"
                      className="bg-background/60 text-sm"
                    />
                  </div>
                </TabsContent>

                {/* TAB 2: Text Overlay Controls */}
                <TabsContent value="text" className="space-y-4">
                  {/* Headline Input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-foreground">Headline Title</Label>
                      <span className="text-[11px] text-muted-foreground font-mono">{headline.length} chars</span>
                    </div>
                    <Textarea
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="Enter scroll-stopping headline..."
                      className="bg-background/60 text-sm min-h-[70px] resize-none"
                    />
                  </div>

                  {/* Headline Styling */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Font Size ({headlineFontSize}px)</Label>
                      <Slider
                        value={[headlineFontSize]}
                        min={32}
                        max={90}
                        step={2}
                        onValueChange={(val) => setHeadlineFontSize(val[0])}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Highlight Badge</Label>
                      <Select
                        value={headlineHighlight}
                        onValueChange={(val: any) => setHeadlineHighlight(val)}
                      >
                        <SelectTrigger className="h-8 text-xs bg-background/60">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="box">Dark Box Box</SelectItem>
                          <SelectItem value="pill">Rounded Pill</SelectItem>
                          <SelectItem value="none">No Background</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Alignment & Weight */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Alignment</Label>
                      <div className="flex items-center gap-1 bg-background/60 p-1 rounded-md border border-border/50">
                        <Button
                          variant={textAlign === "left" ? "secondary" : "ghost"}
                          size="sm"
                          className="h-7 text-xs flex-1"
                          onClick={() => setTextAlign("left")}
                        >
                          Left
                        </Button>
                        <Button
                          variant={textAlign === "center" ? "secondary" : "ghost"}
                          size="sm"
                          className="h-7 text-xs flex-1"
                          onClick={() => setTextAlign("center")}
                        >
                          Center
                        </Button>
                        <Button
                          variant={textAlign === "right" ? "secondary" : "ghost"}
                          size="sm"
                          className="h-7 text-xs flex-1"
                          onClick={() => setTextAlign("right")}
                        >
                          Right
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Font Weight</Label>
                      <Select
                        value={headlineWeight}
                        onValueChange={(val: any) => setHeadlineWeight(val)}
                      >
                        <SelectTrigger className="h-8 text-xs bg-background/60">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="extrabold">Extra Bold</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                          <SelectItem value="normal">Medium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Subhead Input */}
                  <div className="space-y-1.5 pt-2 border-t border-border/40">
                    <Label className="text-xs font-semibold text-foreground">Subhead / Body Text</Label>
                    <Textarea
                      value={subhead}
                      onChange={(e) => setSubhead(e.target.value)}
                      placeholder="Add supporting value statement..."
                      className="bg-background/60 text-xs min-h-[60px] resize-none"
                    />
                    <div className="flex items-center gap-3 pt-1">
                      <Label className="text-[11px] text-muted-foreground">Subhead Size ({subheadFontSize}px)</Label>
                      <Slider
                        value={[subheadFontSize]}
                        min={16}
                        max={36}
                        step={2}
                        onValueChange={(val) => setSubheadFontSize(val[0])}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* CTA Badge Pill */}
                  <div className="space-y-1.5 pt-2 border-t border-border/40">
                    <Label className="text-xs font-semibold text-foreground">CTA Badge Label</Label>
                    <Input
                      value={ctaBadge}
                      onChange={(e) => setCtaBadge(e.target.value)}
                      placeholder="e.g. SWIPE FOR PROOF ->"
                      className="bg-background/60 text-xs"
                    />
                  </div>
                </TabsContent>

                {/* TAB 3: Backdrop Studio */}
                <TabsContent value="background" className="space-y-4">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Backdrop Mode
                    </Label>
                    <div className="grid grid-cols-3 gap-1.5 bg-background/60 p-1 rounded-lg border border-border/50">
                      <Button
                        variant={bgType === "gradient" ? "secondary" : "ghost"}
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => setBgType("gradient")}
                      >
                        Gradient
                      </Button>
                      <Button
                        variant={bgType === "image" ? "secondary" : "ghost"}
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => setBgType("image")}
                      >
                        Image Presets
                      </Button>
                      <Button
                        variant={bgType === "solid" ? "secondary" : "ghost"}
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => setBgType("solid")}
                      >
                        Solid Color
                      </Button>
                    </div>
                  </div>

                  {/* AI Visual Background Generator */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/20 via-card to-background border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs font-semibold text-emerald-300">
                          Gemini Visual Background Generator
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        AI Image Model
                      </Badge>
                    </div>

                    <Input
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. Glowing cybernetic data mesh with neon emerald highlights"
                      className="bg-background/80 text-xs"
                    />

                    <div className="flex items-center gap-2">
                      <Select value={aiStyle} onValueChange={setAiStyle}>
                        <SelectTrigger className="h-8 text-xs bg-background/80 flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cyberpunk Neon Tech Card">Cyberpunk Neon</SelectItem>
                          <SelectItem value="Sleek Dark B2B SaaS Minimal">Sleek Dark B2B</SelectItem>
                          <SelectItem value="Soft Pastel Gradient Glassmorphism">Soft Pastel Glass</SelectItem>
                          <SelectItem value="Abstract 3D Geometric Mesh">3D Geometric Mesh</SelectItem>
                          <SelectItem value="Executive High-Contrast Studio">Executive Studio</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        size="sm"
                        disabled={isGeneratingAiImage}
                        onClick={handleGenerateAiBackground}
                        className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                      >
                        {isGeneratingAiImage ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Wand2 className="h-3.5 w-3.5" />
                        )}
                        Generate
                      </Button>
                    </div>
                  </div>

                  {/* Dark Vignette Overlay Slider */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <Label className="text-muted-foreground">Dark Tint Vignette Overlay</Label>
                      <span className="font-mono text-emerald-400">{overlayOpacity}%</span>
                    </div>
                    <Slider
                      value={[overlayOpacity]}
                      min={0}
                      max={90}
                      step={5}
                      onValueChange={(val) => setOverlayOpacity(val[0])}
                    />
                  </div>

                  {/* Preset Backgrounds Gallery */}
                  {bgType === "image" && (
                    <div className="space-y-2 pt-2 border-t border-border/40">
                      <Label className="text-xs font-semibold text-foreground block">Curated Stock Backdrops</Label>
                      <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                        {BACKGROUND_PRESETS.map((preset) => {
                          const isAct = bgImageSrc === preset.url;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => {
                                setBgImageSrc(preset.url);
                                setBgType("image");
                              }}
                              className={`relative aspect-video rounded-md overflow-hidden border text-left group transition-all ${
                                isAct ? "border-emerald-500 ring-2 ring-emerald-500/50" : "border-border/50 hover:border-border"
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-end p-1">
                                <span className="text-[10px] text-white font-medium truncate drop-shadow">{preset.name}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* TAB 4: Gemini AI Hooks */}
                <TabsContent value="ai-hooks" className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-card border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs font-semibold">Gemini Copy & Hook Engine</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400">
                        Auto Copy
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Enter your topic or campaign target to generate high-converting headline, subhead, and CTA badge pairs.
                    </p>

                    <div className="flex items-center gap-2">
                      <Input
                        value={hookTopic}
                        onChange={(e) => setHookTopic(e.target.value)}
                        placeholder="e.g. Black Friday AI SaaS Promotion"
                        className="bg-background/80 text-xs flex-1"
                      />
                      <Button
                        size="sm"
                        disabled={isGeneratingHooks}
                        onClick={handleGenerateHooks}
                        className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                      >
                        {isGeneratingHooks ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Wand2 className="h-3.5 w-3.5" />
                        )}
                        Suggest Hooks
                      </Button>
                    </div>
                  </div>

                  {/* Hook Suggestion Results List */}
                  <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                    {hookSuggestions.length === 0 ? (
                      <div className="text-center py-8 border border-dashed rounded-xl border-border/60">
                        <Wand2 className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                        <p className="text-xs text-muted-foreground">
                          Click "Suggest Hooks" to generate high-converting creative copy.
                        </p>
                      </div>
                    ) : (
                      hookSuggestions.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-border/60 bg-background/50 hover:border-emerald-500/50 transition-all space-y-2 group"
                        >
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                              {item.hookCategory || "Suggested Hook"}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => applyHookSuggestion(item)}
                              className="h-6 text-[11px] text-emerald-400 hover:bg-emerald-500/10 gap-1 px-2"
                            >
                              Apply to Canvas
                              <ChevronRight className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-foreground line-clamp-2">{item.headline}</h4>
                            <p className="text-[11px] text-muted-foreground line-clamp-2">{item.subhead}</p>
                          </div>

                          <div className="pt-1 flex items-center justify-between">
                            <Badge
                              className="text-[10px] font-mono text-black font-semibold"
                              style={{ backgroundColor: item.badgeColorHex || "#10B981" }}
                            >
                              {item.ctaBadge}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Saved Workspace Templates Card */}
          {savedTemplates.length > 0 && (
            <Card className="border-border/60 bg-card/40">
              <CardHeader className="py-3 px-4 border-b border-border/40">
                <CardTitle className="text-xs font-semibold flex items-center gap-2">
                  <Bookmark className="h-3.5 w-3.5 text-emerald-400" />
                  Saved Graphic Templates ({savedTemplates.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 max-h-40 overflow-y-auto space-y-1.5">
                {savedTemplates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-background/50 hover:bg-background/80 border border-border/40 text-xs transition-all"
                  >
                    <div className="flex flex-col truncate pr-2">
                      <span className="font-medium text-foreground truncate">{tpl.name}</span>
                      <span className="text-[10px] text-muted-foreground">{tpl.date}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleLoadTemplate(tpl)}
                      className="h-6 text-[10px] text-emerald-400 hover:bg-emerald-500/10 px-2"
                    >
                      Load
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Live Interactive Canvas Viewport (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center gap-4">
          <Card className="w-full border-border/60 bg-card/60 backdrop-blur shadow-lg overflow-hidden flex flex-col items-center p-6">
            <div className="flex items-center justify-between w-full pb-4 mb-4 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-semibold">Live Canvas Preview</span>
                <Badge variant="outline" className="text-[11px] font-mono border-emerald-500/30 text-emerald-400">
                  {ASPECT_RATIOS[aspectRatio].label}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Real-Time HD Canvas Render</span>
              </div>
            </div>

            {/* Canvas Container with Max Constraints */}
            <div className="relative w-full flex items-center justify-center p-2 rounded-2xl bg-black/40 border border-border/50 shadow-inner overflow-hidden min-h-[420px]">
              {/* Actual HTML5 Canvas Element */}
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[580px] rounded-xl shadow-2xl object-contain border border-white/10 transition-all"
                style={{
                  aspectRatio:
                    aspectRatio === "1:1"
                      ? "1/1"
                      : aspectRatio === "4:5"
                      ? "4/5"
                      : aspectRatio === "16:9"
                      ? "16/9"
                      : "9/16",
                }}
              />
            </div>

            {/* Preview Toolbar */}
            <div className="flex items-center justify-between w-full pt-4 mt-2 border-t border-border/40 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-[10px]">
                  PNG / 300 DPI Export Ready
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={handleDownloadImage} className="h-7 text-xs gap-1">
                  <Download className="h-3.5 w-3.5 text-blue-400" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleOpenExportModal}
                  className="h-7 text-xs gap-1 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
                >
                  <Send className="h-3.5 w-3.5" />
                  Attach to Social Post
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Export & Attach to Social Post Modal */}
      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent className="max-w-xl bg-card border-border/80">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Send className="h-5 w-5 text-emerald-400" />
              Attach Graphic to Social Planner Post
            </DialogTitle>
            <DialogDescription className="text-xs">
              Attach your newly created visual canvas directly into the VisionAI omnichannel social media planner queue.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-3">
            {/* Left Thumbnail */}
            <div className="md:col-span-5 flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">Visual Canvas Attachment</Label>
              <div className="relative rounded-xl overflow-hidden border border-border/60 bg-black/40 aspect-square flex items-center justify-center p-1 shadow-md">
                {exportedDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={exportedDataUrl} alt="Export preview" className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground animate-pulse" />
                )}
              </div>
              <Badge variant="outline" className="text-[10px] justify-center border-emerald-500/30 text-emerald-400 font-mono">
                {ASPECT_RATIOS[aspectRatio].label}
              </Badge>
            </div>

            {/* Right Form */}
            <div className="md:col-span-7 space-y-3">
              <div>
                <Label className="text-xs font-semibold text-foreground mb-1 block">Social Post Copy</Label>
                <Textarea
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  placeholder="Enter social post content..."
                  className="bg-background/80 text-xs min-h-[110px] resize-none"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground mb-1.5 block">Target Channels</Label>
                <div className="flex flex-wrap gap-1.5">
                  {["twitter", "linkedin", "instagram", "facebook", "youtube"].map((net) => {
                    const isSelected = selectedPlatforms.includes(net);
                    return (
                      <button
                        key={net}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedPlatforms(selectedPlatforms.filter((p) => p !== net));
                          } else {
                            setSelectedPlatforms([...selectedPlatforms, net]);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-md border text-xs capitalize transition-all ${
                          isSelected
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-medium"
                            : "bg-background/40 border-border/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {net}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <Label className="text-[11px] text-muted-foreground mb-1 block">Scheduled Date</Label>
                  <Input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="h-8 text-xs bg-background/80"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground mb-1 block">Time</Label>
                  <Input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="h-8 text-xs bg-background/80"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 border-t border-border/40 pt-3">
            <Button variant="ghost" size="sm" onClick={() => setExportModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={isPublishingToPlanner || selectedPlatforms.length === 0}
              onClick={handlePublishToPlanner}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              {isPublishingToPlanner ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              Add to Social Planner Queue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
