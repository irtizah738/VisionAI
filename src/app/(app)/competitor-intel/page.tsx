import { CompetitorRadar } from "@/components/competitor-intel/competitor-radar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competitive Intelligence & Share-of-Voice Radar - VisionAI",
  description:
    "Track competitor social publishing velocity, top-performing hook styles, and channel mix. AI Content Gap Finder analyzes blind spots and generates counter-content briefs.",
};

export default function CompetitorIntelPage() {
  return <CompetitorRadar />;
}
