"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Activity, CheckCircle2, CalendarClock, Wallet, BarChart, Filter, Search, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from 'next-intl';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Campaign, campaignSchema } from "@/types/campaign";
import { format } from "date-fns";
import { CalendarIcon, SortAsc } from "lucide-react";
import { useAccessibility } from "@/hooks/use-accessibility";

// Mock data for campaigns
const mockCampaigns = [
  { id: '1', name: 'Summer Sale 2024', status: 'Active', budgetSpent: 3500, totalBudget: 5000, results: { clicks: 1200, conversions: 85 }, channel: 'Social Media' },
  { id: '2', name: 'Q3 Product Launch', status: 'Upcoming', budgetSpent: 0, totalBudget: 7500, results: {}, channel: 'Email, SEM' },
  { id: '3', name: 'Spring Awareness Q1', status: 'Completed', budgetSpent: 2000, totalBudget: 2000, results: { impressions: 50000, engagement: '12%' }, channel: 'Display Ads' },
  { id: '4', name: 'Influencer Outreach Wave 2', status: 'Active', budgetSpent: 1500, totalBudget: 4000, results: { reach: '250K', leads: 40 }, channel: 'Influencer' },
  { id: '5', name: 'Local SEO Boost', status: 'Paused', budgetSpent: 500, totalBudget: 1000, results: { rankingUp: 5, calls: 15 }, channel: 'SEO' },
];

type CampaignStatus = 'Active' | 'Upcoming' | 'Completed' | 'Paused' | 'Draft';

const getStatusIcon = (status: CampaignStatus) => {
  switch (status) {
    case 'Active': return <Activity className="h-4 w-4 text-green-500" />;
    case 'Completed': return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
    case 'Upcoming': return <CalendarClock className="h-4 w-4 text-purple-500" />;
    case 'Paused': return <Activity className="h-4 w-4 text-yellow-500" />; // Using Activity for Paused, can change
    default: return <Activity className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadgeVariant = (status: CampaignStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'Active': return 'default'; // primary color
        case 'Completed': return 'secondary'; 
        case 'Upcoming': return 'outline'; 
        case 'Paused': return 'destructive'; 
        default: return 'outline';
    }
}

export default function CampaignsPage() {
  const t = useTranslations('campaigns');
  const { ariaLabels } = useAccessibility();
  const [activeTab, setActiveTab] = useState('list');
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'social',
      platforms: [],
      content: {
        mainMessage: '',
      },
      targetAudience: {},
    },
  });

  const onSubmit = async (data: any) => {
    // TODO: Implement campaign creation
    console.log(data);
  };

  const handleCreateCampaign = () => {
    router.push('/campaign-builder');
  };

  const handleViewDetails = (campaignId: string) => {
    router.push(`/campaigns/${campaignId}`);
  };

  const handleAiOptimize = (campaignName: string) => {
    toast({
      title: "AI Optimization",
      description: `Optimizing campaign: ${campaignName}... (Simulated)`,
    });
    // In a real scenario, you would trigger an AI flow here.
  };

  return (
    <div className="space-y-6">
      <PageHeader
        heading={t('title')}
        description={t('description')}
        actions={
          <Button onClick={() => setActiveTab('create')}>
            <Plus className="mr-2 h-4 w-4" />
            {t('actions.create')}
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">{t('tabs.list')}</TabsTrigger>
          <TabsTrigger value="create">{t('tabs.create')}</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {t('actions.filter')}
              </Button>
              <Button variant="outline" size="sm">
                <SortAsc className="mr-2 h-4 w-4" />
                {t('actions.sort')}
              </Button>
            </div>
            <Input
              placeholder={t('search.placeholder')}
              className="max-w-sm"
              type="search"
              aria-label={t('search.label')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {mockCampaigns.map((campaign) => (
              <Card key={campaign.id} className="shadow-lg flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    {getStatusIcon(campaign.status as CampaignStatus)}
                  </div>
                  <CardDescription>{campaign.channel}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <div>
                    <Badge variant={getStatusBadgeVariant(campaign.status as CampaignStatus)}>{campaign.status}</Badge>
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-muted-foreground flex items-center"><Wallet className="h-4 w-4 mr-1" /> Budget</span>
                      <span>${campaign.budgetSpent.toLocaleString()} / ${campaign.totalBudget.toLocaleString()}</span>
                    </div>
                    <Progress value={(campaign.budgetSpent / campaign.totalBudget) * 100} className="h-2" />
                  </div>
                  <div className="text-sm">
                    <h4 className="font-medium mb-1 text-muted-foreground flex items-center"><BarChart className="h-4 w-4 mr-1" /> Key Results:</h4>
                    <ul className="list-disc list-inside pl-1 text-xs space-y-0.5">
                      {Object.entries(campaign.results).map(([key, value]) => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="shadow-lg flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{campaign.name}</CardTitle>
                {getStatusIcon(campaign.status as CampaignStatus)}
              </div>
              <CardDescription>{campaign.channel}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
              <div>
                <Badge variant={getStatusBadgeVariant(campaign.status as CampaignStatus)}>{campaign.status}</Badge>
              </div>
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-muted-foreground flex items-center"><Wallet className="h-4 w-4 mr-1" /> Budget</span>
                  <span>${campaign.budgetSpent.toLocaleString()} / ${campaign.totalBudget.toLocaleString()}</span>
                </div>
                <Progress value={(campaign.budgetSpent / campaign.totalBudget) * 100} className="h-2" />
              </div>
              <div className="text-sm">
                <h4 className="font-medium mb-1 text-muted-foreground flex items-center"><BarChart className="h-4 w-4 mr-1" /> Key Results:</h4>
                <ul className="list-disc list-inside pl-1 text-xs space-y-0.5">
                  {Object.entries(campaign.results).map(([key, value]) => (
                    <li key={key}><span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {value}</li>
                  ))}
                  {Object.keys(campaign.results).length === 0 && <li>No results yet.</li>}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 pt-4">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewDetails(campaign.id)}>View Details</Button>
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => handleAiOptimize(campaign.name)} // Added onClick handler
              >
                <Wand2 className="mr-2 h-4 w-4" />
                AI Optimize
              </Button>
            </CardFooter>
          </Card>
        ))}
         {campaigns.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-10">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No Campaigns Found</h3>
            <p className="text-muted-foreground">Start by creating a new campaign.</p>
          </div>
        )}
      </div>
      
      {/* Floating Action Button */}
      <Button
        onClick={handleCreateCampaign}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-xl bg-accent hover:bg-accent/90 text-accent-foreground text-lg group" // Added group for potential icon styling
        aria-label="Add New Campaign with AI"
        size="icon"
      >
        <Wand2 className="h-6 w-6 mr-0.5" /> 
        <Plus className="h-5 w-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60 group-hover:opacity-100 transition-opacity" style={{ transform: 'translate(-50%, -50%) scale(0.7)', top: 'calc(50% + 0px)', left: 'calc(50% + 0px)' }}/>

      </Button>
    </>
  );
}
