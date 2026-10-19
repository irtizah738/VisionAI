"use client";

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languageNames: Record<string, string> = {
  en: 'English',
  es: 'Español',
};

export function LanguageSelector() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    router.refresh();
  };

  return (
    <div className="flex items-center space-x-2">
      <Select
        value={locale || 'en'}
        onValueChange={handleLanguageChange}
        aria-label={t('language')}
      >
        <SelectTrigger className="w-[110px] h-9 text-xs">
          <SelectValue placeholder={t('language')} />
        </SelectTrigger>
        <SelectContent>
          {locales.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {languageNames[loc] || loc}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default LanguageSelector;