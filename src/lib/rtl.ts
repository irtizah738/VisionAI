import { useLocale } from 'next-intl';

export function useRtlAwareStyle(ltrStyle: string, rtlStyle: string): string {
  const locale = useLocale();
  return locale === 'ar' ? rtlStyle : ltrStyle;
}

export function isRtlLocale(locale: string): boolean {
  return locale === 'ar';
}

// Helper function to get margin/padding classes for RTL support
export function getDirectionalSpacing(direction: 'left' | 'right', size: number): string {
  const side = direction === 'left' ? '[--start]' : '[--end]';
  return `m${side}-${size}`;
}

// Helper function to get border classes for RTL support
export function getDirectionalBorder(direction: 'left' | 'right', style: string = 'solid', width: number = 1): string {
  const side = direction === 'left' ? '[--start]' : '[--end]';
  return `border-${side} border-${style} border-w-${width}`;
} 