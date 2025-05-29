import { useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

export function useAccessibility() {
  const t = useTranslations('accessibility');

  // Handle keyboard navigation
  const handleKeyboardNavigation = useCallback((e: KeyboardEvent) => {
    // Skip to main content when pressing Tab
    if (e.key === 'Tab' && e.altKey) {
      e.preventDefault();
      const main = document.querySelector('main');
      if (main) {
        (main as HTMLElement).focus();
      }
    }
  }, []);

  // Focus trap for modals
  const trapFocus = useCallback((element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }

    element.addEventListener('keydown', handleTabKey);
    firstFocusable.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  // Set up keyboard listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardNavigation);
    return () => {
      document.removeEventListener('keydown', handleKeyboardNavigation);
    };
  }, [handleKeyboardNavigation]);

  return {
    trapFocus,
    ariaLabels: {
      skipToContent: t('skipToContent'),
      menuButton: t('menuButton'),
      closeButton: t('closeButton'),
      darkMode: t('darkMode'),
      languageSelector: t('languageSelector'),
    },
  };
} 