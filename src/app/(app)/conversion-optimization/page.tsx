
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scaling, Filter, Shuffle, Eye, ListChecks, Lightbulb, PlayCircle, ExternalLink } from "lucide-react";
import Image from "next/image";

export default function ConversionOptimizationPage() {
  return (
    <>
      <PageHeader
        title="Conversion Optimization"
        description="Identify issues affecting conversion rates and get improvement recommendations."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Funnel Bottleneck Detector Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-6 w-6 text-primary" />
              AI Funnel Bottleneck Detector
            </CardTitle>
            <CardDescription>
              Pinpoint critical drop-off points in your conversion funnels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="funnelUrl">Website URL / Funnel Entry Point</Label>
              <Input id="funnelUrl" placeholder="e.g., https://yourshop.com/landing-page" />
            </div>
            <div>
              <Label htmlFor="funnelSteps">Describe Funnel Steps (Optional)</Label>
              <Textarea id="funnelSteps" placeholder="e.g., 1. Landing Page > 2. Product Page > 3. Cart > 4. Checkout" className="min-h-[80px]" />
            </div>
            <div className="pt-2">
                <h4 className="font-semibold text-sm mb-1">Simulated Analysis:</h4>
                <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                  <strong>High Drop-off (45%) at 'Cart' page.</strong> Potential issues: Unexpected shipping costs, complex checkout form.
                  <br />Recommendation: Display shipping costs earlier, simplify form fields.
                </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <PlayCircle className="mr-2 h-4 w-4" /> Analyze Funnel (AI Simulated)
            </Button>
          </CardFooter>
        </Card>

        {/* A/B Test Idea Generator Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shuffle className="h-6 w-6 text-primary" />
              A/B Test Idea Generator
            </CardTitle>
            <CardDescription>
              Get AI-powered suggestions for impactful A/B tests.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="abPageUrl">Page URL to Optimize</Label>
              <Input id="abPageUrl" placeholder="e.g., https://yourshop.com/pricing" />
            </div>
            <div>
              <Label htmlFor="testElement">Element to Test</Label>
              <Select>
                <SelectTrigger id="testElement">
                  <SelectValue placeholder="Select element" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="headline">Headline</SelectItem>
                  <SelectItem value="cta">Call-to-Action Button</SelectItem>
                  <SelectItem value="image">Hero Image</SelectItem>
                  <SelectItem value="form">Form Layout</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-2">
                <h4 className="font-semibold text-sm mb-1">Simulated A/B Test Idea:</h4>
                <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                  For <strong>CTA on Pricing Page</strong>:
                  <br />Test A: "Start Free Trial"
                  <br />Test B: "Get Started Now"
                  <br />Hypothesis: "Get Started Now" may create more urgency.
                </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Lightbulb className="mr-2 h-4 w-4" /> Generate Test Ideas (AI Simulated)
            </Button>
          </CardFooter>
        </Card>

        {/* User Behavior Insights Card */}
        <Card className="shadow-lg md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-6 w-6 text-primary" />
              User Behavior Insights Demo
            </CardTitle>
            <CardDescription>
              Understand how users interact with your site via heatmaps, session recordings, and more. (Simulated Data)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/30 p-4 rounded-lg shadow-inner">
              <h4 className="text-lg font-semibold mb-3 text-center">Simulated User Click Map</h4>
              <div className="flex justify-center">
                <Image
                  src="https://placehold.co/600x300.png"
                  alt="Simulated User Click Map Placeholder"
                  width={600}
                  height={300}
                  data-ai-hint="click heatmap"
                  className="rounded-md border shadow-md"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">This is a visual representation of user clicks. Brighter areas indicate more clicks.</p>
            </div>

            <div>
              <h4 className="text-md font-semibold mb-2">Key Insights (Simulated):</h4>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
                <li><strong>High Drop-off:</strong> 65% of users abandon the checkout process at the 'Payment Details' step.</li>
                <li><strong>Top Exit Page:</strong> 'Services Comparison' page shows an 80% exit rate before any CTA interaction.</li>
                <li><strong>Hesitation Point:</strong> Users spend an average of 55 seconds on the 'Subscription Tier' selection page.</li>
                <li><strong>Most Clicked Element:</strong> The 'Book a Demo' button on the navigation bar is the most frequently clicked interactive element.</li>
                <li><strong>Ignored Content:</strong> The 'Terms and Conditions' link in the footer is rarely clicked, but users frequently ask support about related topics.</li>
                 <li><strong>Rage Clicks:</strong> Multiple rapid clicks detected on the 'Submit' button of the contact form, suggesting potential unresponsiveness or errors.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-md font-semibold mb-2">Actionable Suggestions (Simulated):</h4>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-accent">
                <li>Streamline the 'Payment Details' form; consider adding a progress indicator or alternative payment methods.</li>
                <li>On 'Services Comparison', add a clear summary, a "Which service is right for me?" quiz, or a direct chat prompt.</li>
                <li>For 'Subscription Tier' selection, highlight a 'Most Popular' option or provide clearer benefit summaries for each tier.</li>
                <li>Ensure the 'Terms and Conditions' are easily accessible and summarize key points proactively.</li>
                <li>Investigate the contact form for technical issues and provide immediate feedback upon submission.</li>
              </ul>
            </div>
          </CardContent>
           <CardFooter>
            <Button variant="outline" className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" /> Configure Analytics Integration
            </Button>
          </CardFooter>
        </Card>
        
        {/* AI-Driven CRO Recommendations Card */}
        <Card className="shadow-lg md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-6 w-6 text-primary" />
              AI-Driven CRO Recommendations
            </CardTitle>
            <CardDescription>
              Actionable, prioritized list of tasks to boost your conversion rates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md hover:shadow-md transition-shadow">
              <div>
                <p className="font-medium">Improve load time on product pages</p>
                <p className="text-xs text-muted-foreground">Est. Impact: +2-5% Conversion Lift. Current Avg Load: 4.5s</p>
              </div>
              <Button size="sm" variant="outline">Details</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md hover:shadow-md transition-shadow">
              <div>
                <p className="font-medium">Add trust badges to checkout page</p>
                <p className="text-xs text-muted-foreground">Est. Impact: +1-3% Conversion Lift. Reduce cart abandonment.</p>
              </div>
              <Button size="sm" variant="outline">Details</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md hover:shadow-md transition-shadow">
              <div>
                <p className="font-medium">Optimize mobile view for landing page X</p>
                <p className="text-xs text-muted-foreground">Est. Impact: +3-7% Mobile Conversion Lift. High mobile bounce rate detected.</p>
              </div>
              <Button size="sm" variant="outline">Details</Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Lightbulb className="mr-2 h-4 w-4" /> Get Full Recommendation Report (AI)
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

