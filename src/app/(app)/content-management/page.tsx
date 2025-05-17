
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, PlusCircle, Edit, Trash2, Settings2, Search } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data for content items
const mockContentItems = [
  { id: "1", title: "The Future of AI in Marketing", type: "Blog Post", status: "Published", lastModified: "2024-07-15" },
  { id: "2", title: "About Us", type: "Page", status: "Published", lastModified: "2024-07-10" },
  { id: "3", title: "Top 5 SEO Trends for 2024", type: "Blog Post", status: "Draft", lastModified: "2024-07-18" },
  { id: "4", title: "Our Services Landing Page", type: "Landing Page", status: "Published", lastModified: "2024-06-20" },
  { id: "5", title: "Case Study: VisionAI Success", type: "Case Study", status: "Review", lastModified: "2024-07-19" },
];

export default function ContentManagementPage() {
  const router = useRouter();

  return (
    <>
      <PageHeader
        title="Content Management System"
        description="Organize, create, edit, and manage all your digital content efficiently."
        actions={
          <div className="flex items-center gap-2">
            <Button onClick={() => router.push('/content-management/create')}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Content
            </Button>
            <Button variant="outline" onClick={() => router.push('/content-management/types')}>
              <Settings2 className="mr-2 h-4 w-4" /> Manage Content Types
            </Button>
          </div>
        }
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-6 w-6 text-primary" />
            Your Content Hub
          </CardTitle>
          <CardDescription>
            Oversee all your website pages, blog posts, articles, and other digital assets.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filter Placeholder */}
          <div className="flex items-center gap-2">
            <Input placeholder="Search content..." className="max-w-sm" />
            <Button variant="outline"><Search className="mr-2 h-4 w-4" /> Search</Button>
          </div>

          {/* Content Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockContentItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "Published" ? "default" :
                          item.status === "Draft" ? "secondary" : "outline"
                        }
                        className={
                          item.status === "Published" ? "bg-green-500 hover:bg-green-600" :
                          item.status === "Draft" ? "bg-yellow-500 hover:bg-yellow-600 text-black" :
                          item.status === "Review" ? "bg-blue-500 hover:bg-blue-600" : // Added specific style for "Review"
                          "border-blue-500 text-blue-500" 
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.lastModified}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-muted/50 text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
           {mockContentItems.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No content items found. Start by creating some!
              </div>
           )}

          {/* Integrated SEO Tools Section Placeholder */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Integrated SEO Tools</CardTitle>
              <CardDescription>Optimize your content for search engines directly within the CMS.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>On-page SEO analysis for each content item.</li>
                <li>Keyword suggestions and density checks.</li>
                <li>Meta tag (title, description) optimization previews.</li>
                <li>Readability scores and improvement tips.</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Access SEO Optimizer</Button>
            </CardFooter>
          </Card>

        </CardContent>
      </Card>
    </>
  );
}
