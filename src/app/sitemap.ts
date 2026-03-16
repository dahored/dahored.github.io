import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { routing } from '@/i18n/routing';

const base = site.siteUrl;
const locales = routing.locales;

function url(locale: string) {
  return `${base}/${locale}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    // Root redirect (canonical home)
    {
      url: base,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Locale-specific pages with hreflang alternates
    ...locales.map((locale) => ({
      url: url(locale),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, url(l)])),
      },
    })),
  ];
}
