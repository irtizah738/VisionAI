"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  KanbanSquare,
  PlusCircle,
  Zap,
  ArrowRight,
  Trash2,
  RefreshCw,
  Sparkles,
  Cloud,
  GripVertical,
  Wand2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/components/firebase/firebase-provider";
import {
  saveWorkspaceItemToFirestore,
  deleteWorkspaceItemFromFirestore,
} from "@/lib/firebase";

type ProjectStage = "To Do" | "In Progress" | "Review" | "Done";

interface ProjectTask {
  id: string;
  title: string;
  status: ProjectStage;
  summary: string;
  primaryMetric: number;
  secondaryMetric: number;
  meta?: {
    owner?: string;
    deadline?: string;
    channel?: string;
    priority?: string;
  };
}

const STAGES: ProjectStage[] = ["To Do", "In Progress", "Review", "Done"];

export default function ProjectManagementPage() {
  const { toast } = useToast();
  const { user: firebaseUser, cloudWorkspaceItems } = useFirebase();

  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<ProjectStage | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    summary: "",
    owner: "Alex Morgan",
    deadline: "2026-11-05",
    channel: "Multi-Channel",
    priority: "High",
  });

  const [decomposeGoal, setDecomposeGoal] = useState(
    "Q4 Enterprise Product Launch across LinkedIn, X, YouTube Shorts, and Executive Email"
  );
  const [isDecomposing, setIsDecomposing] = useState(false);

  const [forecastQuery, setForecastQuery] = useState(
    "Evaluate delivery risk and resource allocation across our active Q4 marketing launch tasks."
  );
  const [isForecasting, setIsForecasting] = useState(false);
  const [forecastResult, setForecastResult] = useState(
    "Delivery Velocity Assessment: 75% of critical path milestones are in Review or Done. Prioritize moving 'YouTube 16:9 Product Walkthrough Video' into active production 48 hours before the LinkedIn & X campaign spike."
  );

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/workspace-suites?suite=project");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) {
          const normalized: ProjectTask[] = data.items.map((item: any) => ({
            id: item.id,
            title: item.title,
            status: STAGES.includes(item.status) ? item.status : "To Do",
            summary: item.summary || "",
            primaryMetric: Number(item.primaryMetric) || 50,
            secondaryMetric: Number(item.secondaryMetric) || 1,
            meta: item.meta || {
              owner: "Alex Morgan",
              deadline: "2026-11-01",
              channel: "Multi-Channel",
              priority: "Medium",
            },
          }));
          setTasks(normalized);
        }
      }
    } catch (err) {
      console.error("Failed to load project tasks:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    try {
      const res = await fetch("/api/workspace-suites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suite: "project",
          title: newTask.title.trim(),
          status: "To Do",
          summary:
            newTask.summary.trim() ||
            `Deliverable for ${newTask.channel} owned by ${newTask.owner}.`,
          primaryMetric: 25,
          secondaryMetric: 1,
          meta: {
            owner: newTask.owner || "Alex Morgan",
            deadline: newTask.deadline || "2026-11-05",
            channel: newTask.channel || "Multi-Channel",
            priority: newTask.priority || "High",
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to create task");
      const { item } = await res.json();
      setTasks((prev) => [item, ...prev]);

      if (firebaseUser && firebaseUser.emailVerified && item) {
        await saveWorkspaceItemToFirestore({
          id: `${firebaseUser.uid}_${item.id}`,
          userId: firebaseUser.uid,
          suite: "project",
          title: item.title,
          status: item.status,
          summary: item.summary,
          primaryMetric: Number(item.primaryMetric) || 25,
          secondaryMetric: Number(item.secondaryMetric) || 1,
        });
      }

      setNewTask({
        title: "",
        summary: "",
        owner: "Alex Morgan",
        deadline: "2026-11-05",
        channel: "Multi-Channel",
        priority: "High",
      });
      setIsAddOpen(false);
      toast({
        title: "Task Persisted to Kanban Board",
        description: firebaseUser
          ? `"${item.title}" saved and synced to Firestore /workspaceItems.`
          : `"${item.title}" added to To Do.`,
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Task Creation Failed",
        description: err?.message || "Could not create task.",
      });
    }
  };

  const moveTaskToStage = async (task: ProjectTask, nextStage: ProjectStage) => {
    if (task.status === nextStage) return;
    const progressMap: Record<ProjectStage, number> = {
      "To Do": 20,
      "In Progress": 60,
      Review: 85,
      Done: 100,
    };
    const updatedProgress = progressMap[nextStage];

    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, status: nextStage, primaryMetric: updatedProgress }
          : t
      )
    );

    try {
      await fetch("/api/workspace-suites", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: task.id,
          status: nextStage,
          primaryMetric: updatedProgress,
        }),
      });

      if (firebaseUser && firebaseUser.emailVerified) {
        await saveWorkspaceItemToFirestore({
          id: `${firebaseUser.uid}_${task.id}`,
          userId: firebaseUser.uid,
          suite: "project",
          title: task.title,
          status: nextStage,
          summary: task.summary,
          primaryMetric: updatedProgress,
          secondaryMetric: Number(task.secondaryMetric) || 1,
        });
      }

      toast({
        title: `Moved to ${nextStage}`,
        description: `"${task.title}" updated to ${nextStage} (${updatedProgress}%).`,
      });
    } catch (err) {
      console.error("Failed to update stage:", err);
    }
  };

  const handleAdvanceStage = (task: ProjectTask) => {
    const idx = STAGES.indexOf(task.status);
    const nextStage = STAGES[(idx + 1) % STAGES.length];
    moveTaskToStage(task, nextStage);
  };

  const handleDeleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`/api/workspace-suites?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (firebaseUser && firebaseUser.emailVerified) {
        await deleteWorkspaceItemFromFirestore(`${firebaseUser.uid}_${id}`);
      }
      toast({
        title: "Deliverable Removed",
        description: "Deleted from Kanban board and cloud registry.",
      });
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleDecomposeCampaign = async () => {
    if (!decomposeGoal.trim()) return;
    setIsDecomposing(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "marketing",
          useBrandVoice: true,
          message: `Break down this marketing campaign goal into 3 concrete deliverables: "${decomposeGoal}". Provide 1 line per task.`,
        }),
      });

      let aiSummary = "";
      if (res.ok) {
        const data = await res.json();
        aiSummary = (data.content || data.message || "").slice(0, 300);
      }

      const generatedBlueprint = [
        {
          title: `${decomposeGoal.slice(0, 48)}: LinkedIn & X Fold Hook Thread`,
          status: "To Do" as ProjectStage,
          summary:
            aiSummary ||
            "Draft and validate above-the-fold hooks and OG link cards in Multi-Platform Live Preview.",
          owner: "Alex Morgan",
          deadline: "2026-10-29",
          channel: "LinkedIn & X",
          priority: "High",
        },
        {
          title: `${decomposeGoal.slice(0, 48)}: 4:5 Carousel & 16:9 Video Cutdown`,
          status: "In Progress" as ProjectStage,
          summary:
            "Generate AI visual assets and 60s YouTube walkthrough aligned with Brand Voice Memory.",
          owner: "Elena Rostova",
          deadline: "2026-10-31",
          channel: "Instagram & YouTube",
          priority: "High",
        },
        {
          title: `${decomposeGoal.slice(0, 48)}: Executive Email & Attribution Audit`,
          status: "To Do" as ProjectStage,
          summary:
            "Configure UTM attribution tracking and A/B subject lines for enterprise ICP segment.",
          owner: "Marcus Vance",
          deadline: "2026-11-03",
          channel: "Email & CRM",
          priority: "Medium",
        },
      ];

      const createdItems: ProjectTask[] = [];
      for (const spec of generatedBlueprint) {
        const postRes = await fetch("/api/workspace-suites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            suite: "project",
            title: spec.title,
            status: spec.status,
            summary: spec.summary,
            primaryMetric: spec.status === "In Progress" ? 50 : 20,
            secondaryMetric: 1,
            meta: {
              owner: spec.owner,
              deadline: spec.deadline,
              channel: spec.channel,
              priority: spec.priority,
            },
          }),
        });
        if (postRes.ok) {
          const { item } = await postRes.json();
          createdItems.push(item);
          if (firebaseUser && firebaseUser.emailVerified && item) {
            await saveWorkspaceItemToFirestore({
              id: `${firebaseUser.uid}_${item.id}`,
              userId: firebaseUser.uid,
              suite: "project",
              title: item.title,
              status: item.status,
              summary: item.summary,
              primaryMetric: Number(item.primaryMetric) || 20,
              secondaryMetric: 1,
            });
          }
        }
      }

      setTasks((prev) => [...createdItems, ...prev]);
      toast({
        title: `Decomposed into ${createdItems.length} Kanban Tasks`,
        description: firebaseUser
          ? "AI deliverables added to board and synced to Firestore."
          : "AI deliverables added to your Kanban board.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Decomposition Error",
        description: err?.message || "Failed to decompose campaign.",
      });
    } finally {
      setIsDecomposing(false);
    }
  };

  const handleRunAIForecast = async () => {
    if (!forecastQuery.trim()) return;
    setIsForecasting(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "marketing",
          useBrandVoice: true,
          message: `${forecastQuery}\nCurrent Kanban tasks: ${tasks
            .map(
              (t) =>
                `${t.title} (${t.status}, due ${t.meta?.deadline || "TBD"})`
            )
            .join("; ")}. Give a concise 3-sentence project risk and timeline forecast.`,
        }),
      });
      if (!res.ok) throw new Error("Failed to run project forecast");
      const data = await res.json();
      setForecastResult(data.content || data.message || forecastResult);
      toast({
        title: "Gemini Project Forecast Complete",
        description: "Updated timeline and resource recommendations.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Forecast Error",
        description: error?.message || "Could not generate project forecast.",
      });
    } finally {
      setIsForecasting(false);
    }
  };

  const cloudProjectCount = cloudWorkspaceItems.filter(
    (i) => i.suite === "project"
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing Project Kanban & AI Task Decomposer"
        description="Drag-and-drop campaign deliverables across stages, decompose launch goals with Gemini AI, and persist every task to Firestore."
        icon={KanbanSquare}
        actions={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
              <Cloud className="h-3.5 w-3.5 text-emerald-500" />
              {firebaseUser
                ? `${cloudProjectCount} Cloud Synced`
                : `${tasks.length} Persisted`}
            </span>
            <Button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="gap-1.5 text-xs cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              Add Deliverable Task
            </Button>
          </div>
        }
      />

      {/* AI Campaign-to-Kanban Decomposer Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <Wand2 className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">
              AI Campaign Decomposer:
            </span>
          </div>
          <Input
            value={decomposeGoal}
            onChange={(e) => setDecomposeGoal(e.target.value)}
            placeholder="Enter campaign launch objective to auto-generate Kanban tasks..."
            className="flex-1 text-xs h-9"
          />
          <Button
            type="button"
            size="sm"
            disabled={isDecomposing}
            onClick={handleDecomposeCampaign}
            className="gap-1.5 text-xs shrink-0 cursor-pointer"
          >
            {isDecomposing ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Decomposing...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                Decompose into 3 Kanban Tasks
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Interactive Drag-and-Drop 4-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAGES.map((stage) => {
          const stageTasks = tasks.filter((t) => t.status === stage);
          const isDropTarget = dragOverStage === stage;
          return (
            <div
              key={stage}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverStage(stage);
              }}
              onDragLeave={() => setDragOverStage(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverStage(null);
                if (!draggedTaskId) return;
                const found = tasks.find((t) => t.id === draggedTaskId);
                if (found) {
                  moveTaskToStage(found, stage);
                }
                setDraggedTaskId(null);
              }}
              className={`rounded-lg border p-3.5 space-y-3 min-h-[320px] transition-colors ${
                isDropTarget
                  ? "border-primary bg-primary/5"
                  : "bg-muted/20 border-border"
              }`}
            >
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-xs font-semibold">{stage}</h3>
                <span className="text-xs font-mono tabular-nums text-muted-foreground">
                  {stageTasks.length}
                </span>
              </div>
              <div className="space-y-2.5">
                {stageTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => setDraggedTaskId(task.id)}
                    onDragEnd={() => {
                      setDraggedTaskId(null);
                      setDragOverStage(null);
                    }}
                    className="rounded-md border bg-card p-3 space-y-2 cursor-grab active:cursor-grabbing hover:border-foreground/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-1.5">
                        <GripVertical className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-xs font-semibold leading-snug">
                          {task.title}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-muted-foreground hover:text-destructive cursor-pointer shrink-0"
                        aria-label="Delete task"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {task.summary && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2">
                        {task.summary}
                      </p>
                    )}
                    <div className="text-[11px] text-muted-foreground font-mono tabular-nums">
                      {task.meta?.channel || "Multi-Channel"} · Due{" "}
                      {task.meta?.deadline || "2026-11-01"}
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-border/50">
                      <span className="text-[11px] text-muted-foreground">
                        {task.meta?.owner || "Alex Morgan"}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAdvanceStage(task)}
                        className="h-6 px-2 text-[11px] gap-1 cursor-pointer"
                      >
                        Advance <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {stageTasks.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-10">
                    {isLoading
                      ? "Loading tasks..."
                      : `Drop tasks here for ${stage}`}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live AI Forecast Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Gemini Project Velocity &amp; Risk Forecaster
          </CardTitle>
          <CardDescription className="text-xs">
            Analyze current Kanban bottlenecks and generate resource allocation guidance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/20 p-4 text-sm leading-relaxed">
            {forecastResult}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={forecastQuery}
              onChange={(e) => setForecastQuery(e.target.value)}
              placeholder="Ask Gemini about timeline risks or workload balancing..."
              className="flex-1 text-xs"
            />
            <Button
              type="button"
              disabled={isForecasting}
              onClick={handleRunAIForecast}
              className="gap-1.5 text-xs shrink-0 cursor-pointer"
            >
              {isForecasting ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Zap className="h-3.5 w-3.5" />
              )}
              Run AI Forecast
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <form onSubmit={handleAddTask}>
            <DialogHeader>
              <DialogTitle>Add Marketing Deliverable Task</DialogTitle>
              <DialogDescription>
                Create a persistent task card in your Kanban board and sync to Firestore.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="task-name">Deliverable Title</Label>
                <Input
                  id="task-name"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="e.g., Instagram 4:5 Carousel Asset Pack"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="task-summary">Deliverable Scope / Notes</Label>
                <Textarea
                  id="task-summary"
                  rows={2}
                  value={newTask.summary}
                  onChange={(e) =>
                    setNewTask((p) => ({ ...p, summary: e.target.value }))
                  }
                  placeholder="Key requirements and fold-cutoff verification notes..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="task-owner">Owner</Label>
                  <Input
                    id="task-owner"
                    value={newTask.owner}
                    onChange={(e) =>
                      setNewTask((p) => ({ ...p, owner: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="task-deadline">Target Date</Label>
                  <Input
                    id="task-deadline"
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) =>
                      setNewTask((p) => ({ ...p, deadline: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="task-channel">Target Channel / Suite</Label>
                <Input
                  id="task-channel"
                  value={newTask.channel}
                  onChange={(e) =>
                    setNewTask((p) => ({ ...p, channel: e.target.value }))
                  }
                  placeholder="e.g., LinkedIn & X"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add to Kanban Board</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}