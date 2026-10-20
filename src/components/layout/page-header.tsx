import type { ReactNode } from "react";

interface PageHeaderProps {
  title?: string;
  heading?: string;
  description?: string;
  actions?: ReactNode;
  icon?: any;
  badgeText?: string;
}

export function PageHeader({
  title,
  heading,
  description,
  actions,
  badgeText,
}: PageHeaderProps) {
  const displayTitle = title || heading || "";
  return (
    <div className="mb-6 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-1 max-w-2xl">
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {displayTitle}
          </h1>
          {badgeText && (
            <>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                ·
              </span>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {badgeText}
              </span>
            </>
          )}
        </div>
        {description && (
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">{actions}</div>
      )}
    </div>
  );
}
