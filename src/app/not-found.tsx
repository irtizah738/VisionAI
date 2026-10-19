"use client";

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  const t = useTranslations('error');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">{t('notFound.title')}</h2>
      <p className="mt-2 text-muted-foreground">{t('notFound.description')}</p>
      <Button asChild className="mt-8">
        <Link href="/">{t('notFound.backHome')}</Link>
      </Button>
    </div>
  );
} 