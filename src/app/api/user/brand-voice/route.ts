import { NextRequest, NextResponse } from 'next/server';
import { getVisionAiStore } from '@/lib/prisma';

export async function GET() {
  try {
    const { state } = getVisionAiStore();
    return NextResponse.json({ brandVoice: state.brandVoice });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to load Brand Voice Memory' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { state, save } = getVisionAiStore();

    state.brandVoice = {
      ...state.brandVoice,
      brandName:
        typeof body.brandName === 'string' && body.brandName.trim()
          ? body.brandName.trim().slice(0, 100)
          : state.brandVoice.brandName,
      tone:
        typeof body.tone === 'string' && body.tone.trim()
          ? body.tone.trim().slice(0, 150)
          : state.brandVoice.tone,
      targetAudience:
        typeof body.targetAudience === 'string' && body.targetAudience.trim()
          ? body.targetAudience.trim().slice(0, 500)
          : state.brandVoice.targetAudience,
      keyPillars:
        typeof body.keyPillars === 'string' && body.keyPillars.trim()
          ? body.keyPillars.trim().slice(0, 1000)
          : state.brandVoice.keyPillars,
      bannedWords:
        typeof body.bannedWords === 'string'
          ? body.bannedWords.trim().slice(0, 500)
          : state.brandVoice.bannedWords,
      ctaStyle:
        typeof body.ctaStyle === 'string' && body.ctaStyle.trim()
          ? body.ctaStyle.trim().slice(0, 250)
          : state.brandVoice.ctaStyle,
      enabled:
        typeof body.enabled === 'boolean'
          ? body.enabled
          : state.brandVoice.enabled,
      updatedAt: new Date().toISOString(),
    };

    save();

    return NextResponse.json({ brandVoice: state.brandVoice });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update Brand Voice Memory' },
      { status: 500 }
    );
  }
}
