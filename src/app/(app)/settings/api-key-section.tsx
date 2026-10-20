'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export interface ApiKeyItem {
  id: string;
  name: string;
  createdAt?: string | Date;
  lastUsed?: string | Date | null;
}

interface ApiKeySectionProps {
  apiKeys?: ApiKeyItem[];
}

export function ApiKeySection(_props: ApiKeySectionProps) {
  return (
    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
        <div>
          <p className="text-sm font-medium">Server-Managed Gemini AI Proxy Active</p>
          <p className="text-xs text-muted-foreground">
            All AI credentials are managed server-side via environment variables with zero client-side key exposure.
          </p>
        </div>
      </div>
      <span className="text-xs font-mono font-semibold text-emerald-500">Operational</span>
    </div>
  );
}