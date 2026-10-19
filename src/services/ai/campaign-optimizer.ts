import { Campaign } from '@/types/campaign';

export interface OptimizationSuggestion {
  type: 'content' | 'targeting' | 'timing' | 'budget';
  suggestion: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  reasoning: string;
}

export interface AudienceInsight {
  segment: string;
  affinity: number;
  interests: string[];
  demographics?: {
    ageRange?: [number, number];
    locations?: string[];
    gender?: string;
  };
}

export interface CampaignPrediction {
  metrics: {
    impressions: number;
    engagement: number;
    clicks: number;
    conversions: number;
    roi: number;
  };
  confidence: number;
  factors: {
    positive: string[];
    negative: string[];
  };
}

export class CampaignOptimizer {
  constructor(private apiKey: string) {}

  async generateOptimizations(campaign: Campaign): Promise<OptimizationSuggestion[]> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an AI marketing expert that analyzes campaigns and provides optimization suggestions.',
          },
          {
            role: 'user',
            content: `Analyze this campaign and provide optimization suggestions:
              ${JSON.stringify(campaign, null, 2)}
              
              Focus on:
              1. Content optimization
              2. Targeting improvements
              3. Timing optimization
              4. Budget allocation
              
              Provide specific, actionable suggestions with confidence levels and expected impact.`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate optimizations');
    }

    const data = await response.json();
    const suggestions = this.parseOptimizationResponse(data.choices[0].message.content);
    return suggestions;
  }

  async analyzeAudience(campaign: Campaign): Promise<AudienceInsight[]> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an AI marketing expert that analyzes campaign audiences and provides insights.',
          },
          {
            role: 'user',
            content: `Analyze the target audience for this campaign and provide detailed insights:
              ${JSON.stringify(campaign, null, 2)}
              
              Identify:
              1. Key audience segments
              2. Interest affinities
              3. Demographic patterns
              4. Geographic patterns
              
              Provide specific insights with affinity scores and confidence levels.`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze audience');
    }

    const data = await response.json();
    const insights = this.parseAudienceResponse(data.choices[0].message.content);
    return insights;
  }

  async predictPerformance(campaign: Campaign): Promise<CampaignPrediction> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an AI marketing expert that predicts campaign performance based on historical data and campaign parameters.',
          },
          {
            role: 'user',
            content: `Predict the performance for this campaign:
              ${JSON.stringify(campaign, null, 2)}
              
              Predict:
              1. Expected metrics (impressions, engagement, clicks, conversions, ROI)
              2. Confidence level
              3. Contributing factors (positive and negative)
              
              Base predictions on campaign parameters and industry benchmarks.`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to predict performance');
    }

    const data = await response.json();
    const prediction = this.parsePredictionResponse(data.choices[0].message.content);
    return prediction;
  }

  private parseOptimizationResponse(content: string): OptimizationSuggestion[] {
    // This is a simplified parser. In a real implementation,
    // you would want to use more robust parsing logic.
    try {
      return JSON.parse(content);
    } catch {
      // Fallback parsing logic for non-JSON responses
      const suggestions: OptimizationSuggestion[] = [];
      const lines = content.split('\n');
      
      let currentSuggestion: Partial<OptimizationSuggestion> = {};
      
      for (const line of lines) {
        if (line.includes('Type:')) {
          if (Object.keys(currentSuggestion).length > 0) {
            suggestions.push(currentSuggestion as OptimizationSuggestion);
            currentSuggestion = {};
          }
          currentSuggestion.type = line.split('Type:')[1].trim().toLowerCase() as any;
        } else if (line.includes('Suggestion:')) {
          currentSuggestion.suggestion = line.split('Suggestion:')[1].trim();
        } else if (line.includes('Confidence:')) {
          currentSuggestion.confidence = parseFloat(line.split('Confidence:')[1].trim());
        } else if (line.includes('Impact:')) {
          currentSuggestion.impact = line.split('Impact:')[1].trim().toLowerCase() as any;
        } else if (line.includes('Reasoning:')) {
          currentSuggestion.reasoning = line.split('Reasoning:')[1].trim();
        }
      }
      
      if (Object.keys(currentSuggestion).length > 0) {
        suggestions.push(currentSuggestion as OptimizationSuggestion);
      }
      
      return suggestions;
    }
  }

  private parseAudienceResponse(content: string): AudienceInsight[] {
    try {
      return JSON.parse(content);
    } catch {
      // Fallback parsing logic
      const insights: AudienceInsight[] = [];
      const segments = content.split('\n\n');
      
      for (const segment of segments) {
        const lines = segment.split('\n');
        const insight: Partial<AudienceInsight> = {
          interests: [],
          demographics: {},
        };
        
        for (const line of lines) {
          if (line.includes('Segment:')) {
            insight.segment = line.split('Segment:')[1].trim();
          } else if (line.includes('Affinity:')) {
            insight.affinity = parseFloat(line.split('Affinity:')[1].trim());
          } else if (line.includes('Interests:')) {
            insight.interests = line.split('Interests:')[1].trim().split(',').map(i => i.trim());
          } else if (line.includes('Age Range:')) {
            const range = line.split('Age Range:')[1].trim().split('-').map(Number);
            insight.demographics = {
              ...insight.demographics,
              ageRange: range as [number, number],
            };
          } else if (line.includes('Locations:')) {
            insight.demographics = {
              ...insight.demographics,
              locations: line.split('Locations:')[1].trim().split(',').map(l => l.trim()),
            };
          }
        }
        
        if (insight.segment && insight.affinity) {
          insights.push(insight as AudienceInsight);
        }
      }
      
      return insights;
    }
  }

  private parsePredictionResponse(content: string): CampaignPrediction {
    try {
      return JSON.parse(content);
    } catch {
      // Fallback parsing logic
      const prediction: CampaignPrediction = {
        metrics: {
          impressions: 0,
          engagement: 0,
          clicks: 0,
          conversions: 0,
          roi: 0,
        },
        confidence: 0,
        factors: {
          positive: [],
          negative: [],
        },
      };
      
      const lines = content.split('\n');
      
      for (const line of lines) {
        if (line.includes('Impressions:')) {
          prediction.metrics.impressions = parseInt(line.split('Impressions:')[1].trim(), 10);
        } else if (line.includes('Engagement:')) {
          prediction.metrics.engagement = parseFloat(line.split('Engagement:')[1].trim());
        } else if (line.includes('Clicks:')) {
          prediction.metrics.clicks = parseInt(line.split('Clicks:')[1].trim(), 10);
        } else if (line.includes('Conversions:')) {
          prediction.metrics.conversions = parseInt(line.split('Conversions:')[1].trim(), 10);
        } else if (line.includes('ROI:')) {
          prediction.metrics.roi = parseFloat(line.split('ROI:')[1].trim());
        } else if (line.includes('Confidence:')) {
          prediction.confidence = parseFloat(line.split('Confidence:')[1].trim());
        } else if (line.includes('Positive Factors:')) {
          prediction.factors.positive = line.split('Positive Factors:')[1].trim().split(',').map(f => f.trim());
        } else if (line.includes('Negative Factors:')) {
          prediction.factors.negative = line.split('Negative Factors:')[1].trim().split(',').map(f => f.trim());
        }
      }
      
      return prediction;
    }
  }
} 