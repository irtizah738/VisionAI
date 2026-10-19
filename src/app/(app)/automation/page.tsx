import { AutomationBuilder } from "@/components/automation/automation-builder";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Omnichannel Drip & Automation Studio - VisionAI",
  description:
    "Visual marketing trigger-condition-action workflow canvas with pre-built B2B SaaS playbooks: Blog-to-Omnichannel Drip, Social Inquiry to CRM Lead, and Re-Engagement Sequences.",
};

export default function AutomationPage() {
  return <AutomationBuilder />;
}
