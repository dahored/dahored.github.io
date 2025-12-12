// src/i18n/request.ts
import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

const SUPPORTED_LOCALES = ["es", "en"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

const DEFAULT_LOCALE: Locale = "es";

function isSupportedLocale(value: string | undefined): value is Locale {
  return !!value && SUPPORTED_LOCALES.includes(value as Locale);
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("locale")?.value;

  const locale: Locale = isSupportedLocale(cookieLocale)
    ? cookieLocale
    : DEFAULT_LOCALE;

  const messages = (await import(`./languages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
