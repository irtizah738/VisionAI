"use client";

import { useAccessibility } from '@/hooks/use-accessibility';

export function SkipToContent() {
  const { ariaLabels } = useAccessibility();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:border focus:border-border"
      aria-label={ariaLabels.skipToContent}
    >
      {ariaLabels.skipToContent}
    </a>
  );
}

export default SkipToContent;