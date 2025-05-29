import { useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { announce } from '@/components/a11y/announcer';
import { useTranslations } from 'next-intl';

type ShortcutHandler = (e: KeyboardEvent) => void;

export function useKeyboardShortcuts() {
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const t = useTranslations('accessibility');

  const handleShortcuts = useCallback<ShortcutHandler>((e) => {
    // Only handle shortcuts when holding Command/Control
    if (!e.metaKey && !e.ctrlKey) return;

    switch (e.key) {
      // Theme toggle (Cmd/Ctrl + Shift + T)
      case 'T':
        if (e.shiftKey) {
          e.preventDefault();
          const newTheme = theme === 'dark' ? 'light' : 'dark';
          setTheme(newTheme);
          announce(t('darkMode'), false);
        }
        break;

      // Navigation shortcuts
      case 'h':
        e.preventDefault();
        router.push('/');
        break;
      case 'd':
        e.preventDefault();
        router.push('/dashboard');
        break;
      case 's':
        e.preventDefault();
        router.push('/settings');
        break;

      // Search (Cmd/Ctrl + K)
      case 'k':
        e.preventDefault();
        // Trigger search modal/command palette
        break;
    }
  }, [theme, setTheme, router, t]);

  useEffect(() => {
    document.addEventListener('keydown', handleShortcuts);
    return () => {
      document.removeEventListener('keydown', handleShortcuts);
    };
  }, [handleShortcuts]);

  return {
    shortcuts: {
      themeToggle: 'Cmd/Ctrl + Shift + T',
      home: 'Cmd/Ctrl + H',
      dashboard: 'Cmd/Ctrl + D',
      settings: 'Cmd/Ctrl + S',
      search: 'Cmd/Ctrl + K',
    },
  };
} 