
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SmilePlus, Smartphone, Search, Lightbulb, Bot, ZoomIn } from "lucide-react";

export default function CustomerExperiencePage() {
  return (
    <>
      <PageHeader
        title="Customer Experience Optimization"
        description="Tools and AI insights to enhance user satisfaction and site performance for better search rankings."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Site Performance Audit Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-6 w-6 text-primary" />
              Site Performance Audit
            </CardTitle>
            <CardDescription>
              Analyze your website's speed and Core Web Vitals. (Simulated)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="performanceUrl">Website URL to Audit</Label>
              <Input id="performanceUrl" placeholder="e.g., https://yourwebsite.com" />
            </div>
            <div className="pt-2 space-y-3">
              <h4 className="font-semibold text-sm mb-1">Simulated Metrics:</h4>
              <div>
                <div className="flex justify-between text-xs mb-0.5">
                  <span>Largest Contentful Paint (LCP)</span>
                  <span className="font-medium">2.1s <Badge variant="default" className="ml-1 bg-green-500 hover:bg-green-600">Good</Badge></span>
                </div>
                <Progress value={70} className="h-2" indicatorClassName="bg-green-500"/>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-0.5">
                  <span>Cumulative Layout Shift (CLS)</span>
                   <span className="font-medium">0.05 <Badge variant="default" className="ml-1 bg-green-500 hover:bg-green-600">Good</Badge></span>
                </div>
                <Progress value={90} className="h-2" indicatorClassName="bg-green-500"/>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-0.5">
                  <span>First Input Delay (FID) / Interaction to Next Paint (INP)</span>
                   <span className="font-medium">150ms <Badge variant="default" className="ml-1 bg-yellow-500 hover:bg-yellow-600">Needs Impr.</Badge></span>
                </div>
                <Progress value={50} className="h-2" indicatorClassName="bg-yellow-500"/>
              </div>
               <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
                  <strong>AI Suggestion:</strong> Consider optimizing image sizes on the homepage to improve LCP. Defer non-critical JavaScript to enhance INP.
                </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <ZoomIn className="mr-2 h-4 w-4" /> Analyze Performance (Simulated)
            </Button>
          </CardFooter>
        </Card>

        {/* Mobile Experience Optimizer Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-6 w-6 text-primary" />
              Mobile Experience Optimizer
            </CardTitle>
            <CardDescription>
              Ensure your site is user-friendly on all mobile devices. (Simulated)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mobileUrl">Website URL to Check</Label>
              <Input id="mobileUrl" placeholder="e.g., https://yourwebsite.com" />
            </div>
            <div className="pt-2">
              <h4 className="font-semibold text-sm mb-2">Mobile-Friendliness Checklist (Simulated):</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5">
                <li className="flex items-center"><SmilePlus className="h-4 w-4 mr-2 text-green-500"/> Responsive Design: Viewport configured correctly.</li>
                <li className="flex items-center"><SmilePlus className="h-4 w-4 mr-2 text-green-500"/> Touch Target Size: Buttons and links are easy to tap.</li>
                <li className="flex items-center"><Search className="h-4 w-4 mr-2 text-yellow-500"/> Font Readability: Some text may be too small.</li>
                <li className="flex items-center"><SmilePlus className="h-4 w-4 mr-2 text-green-500"/> No Intrusive Interstitials: Pop-ups are not disruptive.</li>
              </ul>
               <p className="text-xs text-muted-foreground bg-muted/50 p-2 mt-3 rounded-md">
                  <strong>AI Suggestion:</strong> Increase base font size by 2px for mobile view. Ensure touch targets have at least 48x48px tap area.
                </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Bot className="mr-2 h-4 w-4" /> Check Mobile Usability (AI)
            </Button>
          </CardFooter>
        </Card>

        {/* AI-Driven Accessibility Enhancer Card */}
        <Card className="shadow-lg md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-primary" />
              Accessibility Enhancer (AI Suggestions)
            </CardTitle>
            <CardDescription>
              Get AI-powered tips to make your website more accessible to all users.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-muted/50 rounded-md hover:shadow-sm transition-shadow">
              <h5 className="font-medium mb-1">Improve Image Accessibility</h5>
              <p className="text-xs text-muted-foreground">
                <strong>AI Tip:</strong> Ensure all meaningful images have descriptive alt text. For decorative images, use an empty alt attribute (alt="").
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-md hover:shadow-sm transition-shadow">
              <h5 className="font-medium mb-1">Enhance Keyboard Navigation</h5>
              <p className="text-xs text-muted-foreground">
                <strong>AI Tip:</strong> Verify that all interactive elements (links, buttons, form fields) are focusable and operable using only a keyboard. Check for visible focus indicators.
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-md hover:shadow-sm transition-shadow">
              <h5 className="font-medium mb-1">Check Color Contrast</h5>
              <p className="text-xs text-muted-foreground">
                <strong>AI Tip:</strong> Use tools to check that text and background colors meet WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text).
              </p>
            </div>
             <div className="p-3 bg-muted/50 rounded-md hover:shadow-sm transition-shadow">
              <h5 className="font-medium mb-1">Provide Clear Form Labels</h5>
              <p className="text-xs text-muted-foreground">
                <strong>AI Tip:</strong> Ensure all form inputs have associated, visible labels. Use `aria-label` or `aria-labelledby` for elements where a visible label is not feasible.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <Bot className="mr-2 h-4 w-4" /> Get More Accessibility Tips (AI)
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
