
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KanbanSquare, PlusCircle, Briefcase, Zap, Clock, BarChart2, Filter, Users, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock Project Data
const mockProjects = [
  { id: "proj1", name: "Q4 Product Launch Campaign", status: "In Progress", deadline: "2024-12-15", teamSize: 5, tasksCompleted: 12, totalTasks: 20 },
  { id: "proj2", name: "Website Redesign SEO Audit", status: "Planning", deadline: "2024-11-30", teamSize: 3, tasksCompleted: 2, totalTasks: 15 },
  { id: "proj3", name: "Summer Social Media Blitz", status: "Completed", deadline: "2024-08-31", teamSize: 4, tasksCompleted: 25, totalTasks: 25 },
  { id: "proj4", name: "New Influencer Outreach Program", status: "On Hold", deadline: "2025-01-20", teamSize: 2, tasksCompleted: 0, totalTasks: 10 },
];


export default function ProjectManagementPage() {
  return (
    <>
      <PageHeader
        title="Marketing Project Planner"
        description="Organize tasks, track progress, and leverage AI for project forecasting."
        actions={
          <div className="flex items-center gap-2">
            <Button>
              <Briefcase className="mr-2 h-4 w-4" /> Create New Project
            </Button>
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Task
            </Button>
          </div>
        }
      />
      <Tabs defaultValue="board" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2 h-auto">
          <TabsTrigger value="board" className="py-2 text-sm sm:text-base">Project Board</TabsTrigger>
          <TabsTrigger value="list" className="py-2 text-sm sm:text-base">Task List</TabsTrigger>
          <TabsTrigger value="calendar" className="py-2 text-sm sm:text-base">Calendar View</TabsTrigger>
          <TabsTrigger value="reports" className="py-2 text-sm sm:text-base">AI Reports & Forecasts</TabsTrigger>
        </TabsList>

        <TabsContent value="board">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KanbanSquare className="h-6 w-6 text-primary" />
                Project Board View
              </CardTitle>
              <CardDescription>Visualize project progress with a Kanban-style board.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Example Kanban Columns */}
                {["To Do", "In Progress", "Review", "Done"].map(status => (
                  <div key={status} className="bg-muted/50 p-4 rounded-lg min-h-[200px]">
                    <h3 className="font-semibold mb-3 text-center">{status} ({status === "In Progress" ? 1 : status === "Planning" ? 1 : status === "Completed" ? 1: 0})</h3>
                    {mockProjects.filter(p => (status === "To Do" && p.status === "Planning") || (status === "In Progress" && p.status === "In Progress") || (status === "Completed" && p.status === "Completed")).slice(0,1).map(project => (
                       <Card key={project.id} className="mb-3 shadow-sm">
                         <CardHeader className="p-3">
                            <CardTitle className="text-sm">{project.name}</CardTitle>
                         </CardHeader>
                         <CardContent className="p-3 text-xs">
                            <p>Deadline: {project.deadline}</p>
                            <p>Team: {project.teamSize} members</p>
                         </CardContent>
                       </Card>
                    ))}
                     {status === "To Do" && <p className="text-xs text-muted-foreground text-center">Drag tasks here or click 'Add New Task'.</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KanbanSquare className="h-6 w-6 text-primary" />
                Task List View
              </CardTitle>
              <CardDescription>Detailed list of all tasks across projects.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[300px] bg-muted/30">
                    <KanbanSquare className="h-12 w-12 text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground text-center">Detailed task list with filters and sorting options will appear here.</p>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Project Calendar
              </CardTitle>
              <CardDescription>View project deadlines and task timelines on a calendar.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="p-6 border border-dashed rounded-md flex flex-col items-center justify-center min-h-[300px] bg-muted/30">
                    <Calendar className="h-12 w-12 text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground text-center">Interactive project calendar will be displayed here.</p>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="shadow-lg bg-accent/10 border-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <Zap className="h-6 w-6" />
                AI-Powered Reports & Forecasts
              </CardTitle>
              <CardDescription className="text-accent/80">
                Leverage AI for timeline predictions, risk assessment, and resource allocation suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-background/70">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-1.5"><Clock className="h-4 w-4" />Timeline Prediction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">AI predicts the 'Q4 Product Launch' campaign is on track, with a 85% chance of meeting the deadline.</p>
                    <Button size="sm" variant="link" className="px-0">View Details</Button>
                  </CardContent>
                </Card>
                 <Card className="bg-background/70">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-1.5"><BarChart2 className="h-4 w-4" />Resource Allocation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Consider reallocating one designer from 'Website Redesign' to 'Q4 Launch' for 2 weeks to balance workload.</p>
                     <Button size="sm" variant="link" className="px-0">Explore Options</Button>
                  </CardContent>
                </Card>
              </div>
               <div className="pt-2">
                <Label htmlFor="forecastQuery" className="text-base font-medium">Ask AI about your projects:</Label>
                <Textarea id="forecastQuery" placeholder="e.g., 'What are the main risks for the Q4 launch?' or 'Predict completion for Website Redesign.'" className="mt-1 min-h-[80px]" />
                 <Button className="mt-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Zap className="mr-2 h-4 w-4" /> Get AI Insight
                </Button>
              </div>
            </CardContent>
             <CardFooter>
                 <p className="text-xs text-muted-foreground">AI insights are simulated and based on historical project data.</p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
