import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return NextResponse.json({
    id,
    mode: 'server_managed',
    status: 'operational',
  });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return NextResponse.json({
    id,
    deleted: true,
    mode: 'server_managed',
  });
}