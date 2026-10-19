"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Campaign } from '@/types/campaign';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, DollarSign, Target, Send, Save } from "lucide-react";
import { format } from "date-fns";

export interface CampaignFormProps {
  campaign: Campaign;
  onSave?: (updated: Partial<Campaign>) => void;
}

export function CampaignForm({ campaign, onSave }: CampaignFormProps) {
  const t = useTranslations('campaigns');
  const { toast } = useToast();
  const [name, setName] = useState(campaign?.name || '');
  const [description, setDescription] = useState(campaign?.description || '');
  const [mainMessage, setMainMessage] = useState(campaign?.content?.mainMessage || '');
  const [callToAction, setCallToAction] = useState(campaign?.content?.callToAction || '');
  const [budget, setBudget] = useState(campaign?.budget?.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
      name,
      description,
      budget: budget ? parseFloat(budget) : undefined,
      content: {
        ...campaign.content,
        mainMessage,
        callToAction,
      },
    };
    if (onSave) {
      onSave(updatedData);
    }
    toast({
      title: "Campaign Updated",
      description: `Changes to "${name}" have been saved successfully.`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Overview</CardTitle>
          <CardDescription>View and edit the campaign parameters and content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter campaign name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign-budget">Budget ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="campaign-budget"
                  type="number"
                  className="pl-9"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 5000"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaign-desc">Description</Label>
            <Textarea
              id="campaign-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Campaign objective and description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="main-message">Main Marketing Message</Label>
            <Textarea
              id="main-message"
              value={mainMessage}
              onChange={(e) => setMainMessage(e.target.value)}
              placeholder="The core copy for ads and content"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cta">Call to Action (CTA)</Label>
            <Input
              id="cta"
              value={callToAction}
              onChange={(e) => setCallToAction(e.target.value)}
              placeholder="e.g. Sign up now, Get 20% off"
            />
          </div>

          {campaign?.platforms && campaign.platforms.length > 0 && (
            <div className="space-y-2">
              <Label>Target Platforms</Label>
              <div className="flex flex-wrap gap-2 pt-1">
                {campaign.platforms.map((p) => (
                  <Badge key={p} variant="secondary" className="capitalize">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {campaign?.startDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
              <Calendar className="h-4 w-4" />
              <span>
                Started: {format(new Date(campaign.startDate), 'PPP')}
                {campaign.endDate && ` • Ends: ${format(new Date(campaign.endDate), 'PPP')}`}
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t pt-4">
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default CampaignForm;
