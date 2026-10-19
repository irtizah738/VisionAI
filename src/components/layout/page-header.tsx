import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';

interface PageHeaderProps {
  title?: string;
  heading?: string;
  description?: string;
  actions?: ReactNode;
  icon?: any;
  badgeText?: string;
}

export function PageHeader({ title, heading, description, actions, badgeText }: PageHeaderProps) {
  const displayTitle = title || heading || '';
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            {displayTitle}
          </h1>
          {badgeText && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
              {badgeText}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2.5 flex-wrap shrink-0">{actions}</div>}
    </div>
  );
}
