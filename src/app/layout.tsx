import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "VisionAI - Omnichannel Marketing & Growth Workspace",
  description:
    "Plan, preview, automate, and analyze omnichannel marketing campaigns from a unified workspace.",
  openGraph: {
    title: "VisionAI - Omnichannel Marketing & Growth Workspace",
    description:
      "Plan, preview, automate, and analyze omnichannel marketing campaigns from a unified workspace.",
  },
};

const supportedLocales = ["en", "es"];

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let locale = "en";
  try {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
    if (cookieLocale && supportedLocales.includes(cookieLocale)) {
      locale = cookieLocale;
    }
  } catch {
    // Fallback to default locale
  }

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    messages = (await import(`../../messages/en.json`)).default;
  }

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=JetBrains+Mono:wght@400..700&family=Plus+Jakarta+Sans:wght@400..800&display=swap"
        />
      </head>
      <body
        suppressHydrationWarning
        className="font-sans antialiased tracking-[-0.011em]"
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

