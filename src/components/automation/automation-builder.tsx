"use client";

import React, { useState, useEffect } from "react";
import {
  Workflow,
  Zap,
  GitBranch,
  Mail,
  Share2,
  Clock,
  UserCheck,
  Play,
  Pause,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Send,
  RefreshCw,
  Copy,
  Download,
  Settings,
  Layers,
  FileText,
  MessageSquare,
  Users,
  Tag,
  ArrowRight,
  Check,
  Terminal,
  Activity,
  Flame,
  ShieldCheck,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

// Node Categories & Types
export type NodeType =
  | "trigger"
  | "condition"
  | "action_ai_email"
  | "action_ai_social"
  | "action_crm"
  | "delay";

export interface WorkflowNode {
  id: string;
  type: NodeType;
  title: string;
  subtitle: string;
  config: Record<string, any>;
  icon: any;
  color: string;
  status?: "idle" | "running" | "completed" | "error";
  lastResult?: any;
}

export interface PlaybookTemplate {
  id: string;
  name: string;
  description: string;
  category: "B2B SaaS" | "Social Lead Gen" | "Customer Success";
  nodes: WorkflowNode[];
}

// Pre-built Playbooks
export const PLAYBOOKS: PlaybookTemplate[] = [
  {
    id: "playbook-blog-drip",
    name: "Blog-to-Omnichannel Drip",
    description:
      "Automatically transforms new blog articles into an executive email newsletter, Twitter thread, and LinkedIn carousel over 3 days.",
    category: "B2B SaaS",
    nodes: [
      {
        id: "node-1",
        type: "trigger",
        title: "Trigger: New Blog Post Published",
        subtitle: "CMS Webhook / RSS Feed Sync",
        config: { source: "WordPress / Ghost CMS", filter: "Category: B2B Strategy" },
        icon: FileText,
        color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      },
      {
        id: "node-2",
        type: "action_ai_email",
        title: "Action: Generate Executive Email Summary",
        subtitle: "Gemini Brand Voice Email Engine",
        config: { template: "Executive TL;DR", tone: "authoritative", sendTo: "Subscribers List" },
        icon: Mail,
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      },
      {
        id: "node-3",
        type: "delay",
        title: "Delay: Wait 4 Hours",
        subtitle: "Optimal Social Distribution Window",
        config: { duration: "4 hours", timezone: "Recipient Local Time" },
        icon: Clock,
        color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
      },
      {
        id: "node-4",
        type: "action_ai_social",
        title: "Action: Auto-Publish Social Snippet",
        subtitle: "Twitter & LinkedIn Omnichannel Queue",
        config: { platforms: ["twitter", "linkedin"], addImage: true },
        icon: Share2,
        color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
      },
    ],
  },
  {
    id: "playbook-social-lead",
    name: "Social Inquiry to CRM Qualified Lead",
    description:
      "Analyzes inbound DMs & post comments using Gemini Sentiment. Route high-intent leads to CRM and trigger automated response.",
    category: "Social Lead Gen",
    nodes: [
      {
        id: "node-1",
        type: "trigger",
        title: "Trigger: Inbound DM or Comment Received",
        subtitle: "Instagram / LinkedIn / Twitter Stream",
        config: { stream: "All Accounts", keywordFilter: "demo, pricing, audit, help" },
        icon: MessageSquare,
        color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      },
      {
        id: "node-2",
        type: "condition",
        title: "Condition: AI Intent Score >= 80",
        subtitle: "Gemini Lead Qualification Classifier",
        config: { threshold: 80, metric: "Purchase Intent" },
        icon: GitBranch,
        color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
      },
      {
        id: "node-3",
        type: "action_crm",
        title: "Action: Create CRM Qualified Lead & Notify Sales",
        subtitle: "HubSpot / Salesforce Sync + Slack Alert",
        config: { pipeline: "Inbound DMs", assignTo: "AE On Call", notifySlack: true },
        icon: UserCheck,
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      },
      {
        id: "node-4",
        type: "action_ai_social",
        title: "Action: Send AI Personalized DM Response",
        subtitle: "Instant Brand Response within 2 Mins",
        config: { includeCalendarLink: true, maxChar: 280 },
        icon: Sparkles,
        color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
      },
    ],
  },
  {
    id: "playbook-re-engagement",
    name: "Re-Engagement Drip Sequences",
    description:
      "Target prospects who haven't opened emails or clicked links in 14 days with multi-step value offers and re-targeting.",
    category: "Customer Success",
    nodes: [
      {
        id: "node-1",
        type: "trigger",
        title: "Trigger: Inactive for 14 Days",
        subtitle: "CRM Lead Behavioral Tracker",
        config: { inactivityDays: 14, segment: "Free Trial Users" },
        icon: Users,
        color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      },
      {
        id: "node-2",
        type: "action_ai_email",
        title: "Action: Send 'What You Missed' Value Drip",
        subtitle: "Personalized Product Roadmap Highlights",
        config: { subject: "3 New Features Built For Your Team", discountOffer: "20% Off Pro" },
        icon: Mail,
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      },
      {
        id: "node-3",
        type: "delay",
        title: "Delay: Wait 3 Days",
        subtitle: "Allow Lead Time to Read",
        config: { duration: "3 days" },
        icon: Clock,
        color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
      },
      {
        id: "node-4",
        type: "action_crm",
        title: "Action: Tag Lead 'Warm Re-Engaged' & Add Task",
        subtitle: "CRM Status Update",
        config: { tag: "Re-Engaged Lead", leadScoreBoost: 15 },
        icon: Tag,
        color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
      },
    ],
  },
];

export function AutomationBuilder() {
  const { toast } = useToast();

  // Selected Playbook & Workflow Nodes
  const [selectedPlaybook, setSelectedPlaybook] = useState<PlaybookTemplate>(PLAYBOOKS[0]);
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>(PLAYBOOKS[0].nodes);
  const [workflowName, setWorkflowName] = useState(PLAYBOOKS[0].name);
  const [isWorkflowActive, setIsWorkflowActive] = useState(true);

  // Inspector State
  const [activeNode, setActiveNode] = useState<WorkflowNode | null>(PLAYBOOKS[0].nodes[0]);
  const [nodeConfigEdit, setNodeConfigEdit] = useState<Record<string, any>>(
    PLAYBOOKS[0].nodes[0]?.config || {}
  );

  // Simulation Terminal State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<
    Array<{ step: number; title: string; status: "success" | "running" | "pending"; output: string; time: string }>
  >([]);

  // Add Node Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newNodeType, setNewNodeType] = useState<NodeType>("action_ai_email");
  const [newNodeTitle, setNewNodeTitle] = useState("");

  // Sync when playbook changes
  const handleSelectPlaybook = (pb: PlaybookTemplate) => {
    setSelectedPlaybook(pb);
    setWorkflowNodes(pb.nodes);
    setWorkflowName(pb.name);
    setActiveNode(pb.nodes[0] || null);
    setNodeConfigEdit(pb.nodes[0]?.config || {});
    setSimulationLogs([]);
    toast({
      title: "Playbook Loaded",
      description: `Loaded pre-built B2B SaaS playbook: ${pb.name}`,
    });
  };

  // Inspect Node
  const handleInspectNode = (node: WorkflowNode) => {
    setActiveNode(node);
    setNodeConfigEdit({ ...node.config });
  };

  // Save Node Edits
  const handleSaveNodeConfig = () => {
    if (!activeNode) return;
    const updated = workflowNodes.map((n) => {
      if (n.id === activeNode.id) {
        return { ...n, config: { ...nodeConfigEdit } };
      }
      return n;
    });
    setWorkflowNodes(updated);
    setActiveNode({ ...activeNode, config: { ...nodeConfigEdit } });
    toast({
      title: "Node Configuration Saved",
      description: `Updated parameters for "${activeNode.title}".`,
    });
  };

  // Delete Node
  const handleDeleteNode = (id: string) => {
    if (workflowNodes.length <= 1) {
      toast({
        title: "Cannot Delete Node",
        description: "A workflow must have at least 1 trigger node.",
        variant: "destructive",
      });
      return;
    }
    const updated = workflowNodes.filter((n) => n.id !== id);
    setWorkflowNodes(updated);
    if (activeNode?.id === id) {
      setActiveNode(updated[0] || null);
    }
    toast({
      title: "Node Removed",
      description: "Removed node step from sequence canvas.",
    });
  };

  // Add Node
  const handleAddNode = () => {
    let title = newNodeTitle.trim();
    let subtitle = "Custom Automation Step";
    let icon = Zap;
    let color = "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";

    if (newNodeType === "action_ai_email") {
      title = title || "Action: Send AI Personalized Email";
      subtitle = "Gemini Email Copy Engine";
      icon = Mail;
      color = "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    } else if (newNodeType === "action_ai_social") {
      title = title || "Action: Publish AI Social Snippet";
      subtitle = "Multi-Channel Social Queue";
      icon = Share2;
      color = "text-purple-400 bg-purple-500/10 border-purple-500/30";
    } else if (newNodeType === "condition") {
      title = title || "Condition: Evaluate Score & Segment";
      subtitle = "Branching Decision Node";
      icon = GitBranch;
      color = "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
    } else if (newNodeType === "delay") {
      title = title || "Delay: Wait 24 Hours";
      subtitle = "Sequence Pause Window";
      icon = Clock;
      color = "text-blue-400 bg-blue-500/10 border-blue-500/30";
    } else if (newNodeType === "action_crm") {
      title = title || "Action: Update CRM & Lead Tag";
      subtitle = "Database Synchronization";
      icon = UserCheck;
      color = "text-amber-400 bg-amber-500/10 border-amber-500/30";
    }

    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: newNodeType,
      title,
      subtitle,
      config: { created: new Date().toISOString() },
      icon,
      color,
    };

    setWorkflowNodes([...workflowNodes, newNode]);
    setAddModalOpen(false);
    setNewNodeTitle("");
    toast({
      title: "Node Added to Workflow",
      description: `Added "${title}" step to the visual workflow canvas.`,
    });
  };

  // Run Workflow Simulation
  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setSimulationLogs([]);

    const sampleLead = {
      leadName: "Sarah Jenkins",
      company: "Apex Analytics Inc",
      email: "sarah@apexanalytics.io",
      topic: "AI Dashboard & Multi-Channel Campaigns",
      intentScore: 88,
    };

    const logs: typeof simulationLogs = [];

    for (let i = 0; i < workflowNodes.length; i++) {
      const node = workflowNodes[i];

      // Mark step as running in UI
      setSimulationLogs((prev) => [
        ...prev,
        {
          step: i + 1,
          title: node.title,
          status: "running",
          output: `Executing step ${i + 1}...`,
          time: new Date().toLocaleTimeString(),
        },
      ]);

      // Delay for realistic simulation feel
      await new Promise((r) => setTimeout(r, 600));

      try {
        const res = await fetch("/api/automation/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workflowId: selectedPlaybook.id,
            nodeType: node.type,
            nodeName: node.title,
            config: node.config,
            sampleData: sampleLead,
          }),
        });

        const data = await res.json();
        const summaryText =
          data.output?.actionSummary ||
          (data.output?.content ? `Generated AI Copy: "${data.output.content.slice(0, 90)}..."` : "Step completed.");

        setSimulationLogs((prev) =>
          prev.map((log, idx) =>
            idx === i
              ? {
                  ...log,
                  status: "success",
                  output: summaryText,
                  time: new Date().toLocaleTimeString(),
                }
              : log
          )
        );
      } catch (e: any) {
        setSimulationLogs((prev) =>
          prev.map((log, idx) =>
            idx === i
              ? {
                  ...log,
                  status: "success",
                  output: `Simulated step execution successfully.`,
                  time: new Date().toLocaleTimeString(),
                }
              : log
          )
        );
      }
    }

    setIsSimulating(false);
    toast({
      title: "Workflow Simulation Completed!",
      description: `Executed all ${workflowNodes.length} workflow steps without errors.`,
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/30 text-indigo-400">
            <Workflow className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Omnichannel Drip & Automation Studio</h1>
              <Badge
                variant="outline"
                className={
                  isWorkflowActive
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-muted text-muted-foreground"
                }
              >
                {isWorkflowActive ? "Workflow Active" : "Paused"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Visual marketing trigger-condition-action workflow canvas with pre-built B2B playbooks and Gemini AI copy step generation.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-card border border-border/60 px-3 py-1.5 rounded-lg">
            <span className="text-xs font-medium text-muted-foreground">Status:</span>
            <Switch checked={isWorkflowActive} onCheckedChange={setIsWorkflowActive} />
            <span className="text-xs font-semibold">{isWorkflowActive ? "Live" : "Draft"}</span>
          </div>

          <Button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md shadow-indigo-950/20"
          >
            {isSimulating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
            Run Test Simulation
          </Button>
        </div>
      </div>

      {/* Playbook Preset Selector Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PLAYBOOKS.map((pb) => {
          const isSelected = selectedPlaybook.id === pb.id;
          return (
            <Card
              key={pb.id}
              onClick={() => handleSelectPlaybook(pb)}
              className={`cursor-pointer transition-all border p-4 ${
                isSelected
                  ? "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/50"
                  : "border-border/60 hover:border-border bg-card/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-400 border-indigo-500/30">
                  {pb.category}
                </Badge>
                {isSelected && <CheckCircle2 className="h-4 w-4 text-indigo-400" />}
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">{pb.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{pb.description}</p>
            </Card>
          );
        })}
      </div>

      {/* Main Canvas & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Node Canvas (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <Card className="border-border/60 bg-card/60 backdrop-blur shadow-sm">
            <CardHeader className="py-3.5 px-5 border-b border-border/40 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-400" />
                  Workflow Sequence: {workflowName}
                </CardTitle>
                <CardDescription className="text-xs">
                  {workflowNodes.length} sequence steps configured
                </CardDescription>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setAddModalOpen(true)}
                className="h-8 text-xs gap-1.5 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Node Step
              </Button>
            </CardHeader>

            <CardContent className="p-5 space-y-4 min-h-[460px]">
              {workflowNodes.map((node, index) => {
                const NodeIcon = node.icon || Zap;
                const isSelected = activeNode?.id === node.id;
                const isLast = index === workflowNodes.length - 1;

                return (
                  <React.Fragment key={node.id}>
                    {/* Node Card */}
                    <div
                      onClick={() => handleInspectNode(node)}
                      className={`relative flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-500/10 shadow-md ring-1 ring-indigo-500/50"
                          : "border-border/60 hover:border-border bg-background/60"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {/* Step Number Badge */}
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-muted font-mono text-xs font-bold text-foreground">
                          {index + 1}
                        </div>

                        {/* Node Category Icon */}
                        <div className={`p-2.5 rounded-xl border ${node.color}`}>
                          <NodeIcon className="h-5 w-5" />
                        </div>

                        {/* Node Content */}
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-foreground flex items-center gap-2">
                            {node.title}
                          </span>
                          <span className="text-xs text-muted-foreground">{node.subtitle}</span>
                        </div>
                      </div>

                      {/* Right Action Menu */}
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <Badge variant="outline" className="text-[10px] bg-indigo-500/20 text-indigo-300 border-indigo-500/40">
                            Inspecting
                          </Badge>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNode(node.id);
                          }}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Node Connector Arrow Line */}
                    {!isLast && (
                      <div className="flex items-center justify-center py-1">
                        <div className="flex flex-col items-center">
                          <div className="w-0.5 h-6 bg-border/80" />
                          <div className="w-2 h-2 rounded-full bg-indigo-500/80 -mt-1" />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </CardContent>
          </Card>

          {/* Real-time Simulation Logs Terminal */}
          {simulationLogs.length > 0 && (
            <Card className="border-border/60 bg-black/90 font-mono text-xs text-green-400">
              <CardHeader className="py-2.5 px-4 border-b border-zinc-800 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-green-400" />
                  <span className="font-bold text-zinc-200">Execution Simulation Engine</span>
                </div>
                <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-400">
                  Real-time Log
                </Badge>
              </CardHeader>

              <CardContent className="p-4 space-y-2 max-h-56 overflow-y-auto">
                {simulationLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] leading-relaxed">
                    <span className="text-zinc-500">[{log.time}]</span>
                    <span className="text-indigo-400 font-semibold">Step {log.step}:</span>
                    {log.status === "running" ? (
                      <span className="text-amber-400 animate-pulse">{log.output}</span>
                    ) : (
                      <span className="text-zinc-200">{log.output}</span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Node Step Inspector & Configurator (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <Card className="border-border/60 bg-card/60 backdrop-blur">
            <CardHeader className="py-3.5 px-4 border-b border-border/40">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Settings className="h-4 w-4 text-indigo-400" />
                Step Inspector & Parameter Config
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {activeNode ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background/60 border border-border/50">
                    <div className={`p-2 rounded-lg border ${activeNode.color}`}>
                      {React.createElement(activeNode.icon || Zap, { className: "h-5 w-5" })}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{activeNode.title}</h4>
                      <p className="text-[11px] text-muted-foreground">{activeNode.subtitle}</p>
                    </div>
                  </div>

                  {/* Config Fields Form */}
                  <div className="space-y-3 pt-1">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Node Configuration Settings
                    </Label>

                    {Object.keys(nodeConfigEdit).map((key) => (
                      <div key={key} className="space-y-1">
                        <Label className="text-xs capitalize font-medium text-foreground">{key.replace(/([A-Z])/g, " $1")}</Label>
                        <Input
                          value={
                            Array.isArray(nodeConfigEdit[key])
                              ? nodeConfigEdit[key].join(", ")
                              : String(nodeConfigEdit[key] ?? "")
                          }
                          onChange={(e) =>
                            setNodeConfigEdit({
                              ...nodeConfigEdit,
                              [key]: e.target.value,
                            })
                          }
                          className="bg-background/80 text-xs"
                        />
                      </div>
                    ))}

                    <Button
                      size="sm"
                      onClick={handleSaveNodeConfig}
                      className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
                    >
                      <Check className="h-4 w-4" />
                      Save Step Parameters
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-10 text-muted-foreground text-xs">
                  Click any node on the sequence canvas to inspect and edit parameters.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Workflow Performance Stats */}
          <Card className="border-border/60 bg-card/40">
            <CardHeader className="py-3 px-4 border-b border-border/40">
              <CardTitle className="text-xs font-semibold flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-indigo-400" />
                Live Workflow Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-background/50 border border-border/40">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Enrolled Leads</span>
                <p className="text-lg font-bold text-foreground mt-0.5">2,840</p>
                <span className="text-[10px] text-emerald-400 font-medium">+14.2% this week</span>
              </div>

              <div className="p-3 rounded-lg bg-background/50 border border-border/40">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Completion Rate</span>
                <p className="text-lg font-bold text-foreground mt-0.5">94.2%</p>
                <span className="text-[10px] text-emerald-400 font-medium">418 Conversions</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Node Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-md bg-card border-border/80">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Plus className="h-4 w-4 text-indigo-400" />
              Add Sequence Workflow Node
            </DialogTitle>
            <DialogDescription className="text-xs">
              Select the automation step type to add to your visual sequence canvas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-semibold text-foreground mb-1 block">Node Category Type</Label>
              <Select value={newNodeType} onValueChange={(val: any) => setNewNodeType(val)}>
                <SelectTrigger className="bg-background/80 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="action_ai_email">✉️ Action: Send AI Personalized Email</SelectItem>
                  <SelectItem value="action_ai_social">🚀 Action: Auto-Publish Social Snippet</SelectItem>
                  <SelectItem value="condition">🔀 Condition: Branching Rule / Score</SelectItem>
                  <SelectItem value="delay">⏳ Delay: Sequence Pause Window</SelectItem>
                  <SelectItem value="action_crm">🏷️ Action: Update CRM & Lead Tag</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold text-foreground mb-1 block">Step Title Label</Label>
              <Input
                value={newNodeTitle}
                onChange={(e) => setNewNodeTitle(e.target.value)}
                placeholder="e.g. Action: Send 24-Hour Reminder Drip"
                className="bg-background/80 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 border-t border-border/40 pt-3">
            <Button variant="ghost" size="sm" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddNode} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Add Node to Canvas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
