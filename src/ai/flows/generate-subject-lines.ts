'use server';

import { generateGeminiJSON, Type } from '@/ai/genai-client';

export interface GenerateSubjectLinesInput {
  topic: string;
  audience?: string;
  tone?: string;
}

export interface GenerateSubjectLinesOutput {
  subjectLines: string[];
  preheaders: string[];
  emailBody: string;
}

export async function generateSubjectLines(
  input: GenerateSubjectLinesInput
): Promise<GenerateSubjectLinesOutput> {
  try {
    return await generateGeminiJSON<GenerateSubjectLinesOutput>({
      prompt: `Generate 5 high-converting email subject lines, 3 preview preheaders, and a complete conversion-focused marketing email body for:
Topic / Offer: "${input.topic}"
Target Audience: ${input.audience || 'Marketing Leaders & SaaS Founders'}
Tone: ${input.tone || 'Engaging & Direct'}`,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subjectLines: { type: Type.ARRAY, items: { type: Type.STRING } },
          preheaders: { type: Type.ARRAY, items: { type: Type.STRING } },
          emailBody: { type: Type.STRING },
        },
        required: ['subjectLines', 'preheaders', 'emailBody'],
      },
    });
  } catch {
    return {
      subjectLines: [
        `[New Benchmark] How top teams approach ${input.topic} in 2026`,
        `Quick question about your ${input.topic} workflow`,
        `3 mistakes killing your conversion rate on ${input.topic} (and how to fix them)`,
        `The 5-minute blueprint for ${input.topic}`,
        `We tested 1,000 campaigns on ${input.topic} — here's what won`,
      ],
      preheaders: [
        'See the exact templates and fold benchmarks inside.',
        'Cut campaign production time by 70% this quarter.',
        'Real data from 5 social networks + actionable next steps.',
      ],
      emailBody: `Hi there,\n\nIf your team is focusing on **${input.topic}** this quarter, the biggest lever isn't publishing more volume—it's making sure every message lands cleanly above the fold.\n\nHere are 3 quick wins you can apply today:\n\n1. **Front-load the hook**: Put your primary metric or benefit in the first sentence.\n2. **Unify your cross-channel preview**: Validate X, LinkedIn, Instagram, Facebook, and YouTube cards side-by-side.\n3. **Automate follow-ups**: Route high-intent replies directly to your social command center.\n\nReady to see it in action? Reply to this email or launch your campaign directly in VisionAI Studio.\n\nBest,\nThe VisionAI Growth Team`,
    };
  }
}
