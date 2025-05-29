import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next-intl/client';
import { locales } from '@/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languageNames = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  ar: 'العربية'
};

export function LanguageSelector() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    // Update the URL with the new locale
    router.replace(pathname, { locale: newLocale });
    // Update document direction for RTL support
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="flex items-center space-x-2">
      <Select
        value={locale}
        onValueChange={handleLanguageChange}
        aria-label={t('language')}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder={t('language')} />
        </SelectTrigger>
        <SelectContent>
          {locales.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {languageNames[loc as keyof typeof languageNames]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 