import { NextRequest, NextResponse } from 'next/server';
import { generateSubjectLines } from '@/ai/flows/generate-subject-lines';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, audience, tone } = body;

    if (!topic || !String(topic).trim()) {
      return NextResponse.json(
        { error: 'Email topic is required' },
        { status: 400 }
      );
    }

    const result = await generateSubjectLines({
      topic: String(topic).trim(),
      audience: audience || 'Marketing & Growth Leaders',
      tone: tone || 'Engaging & Conversion-Focused',
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to generate email campaign' },
      { status: 500 }
    );
  }
}
