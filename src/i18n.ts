import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'es'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({ locale }) => {
  const currentLocale = locales.includes(locale as any) ? locale : defaultLocale;
  
  let messages;
  try {
    messages = (await import(`../messages/${currentLocale}.json`)).default;
  } catch {
    messages = (await import(`../messages/en.json`)).default;
  }

  return {
    messages
  };
});