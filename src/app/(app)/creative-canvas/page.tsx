import { CreativeStudio } from "@/components/creative-canvas/creative-studio";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Creative Canvas & Social Graphic Studio - VisionAI",
  description:
    "Interactive visual creative designer with 1:1, 4:5, 16:9, and 9:16 layout presets, real-time typography overlays, Gemini hook suggestions, and 1-click planner export.",
};

export default function CreativeCanvasPage() {
  return <CreativeStudio />;
}
