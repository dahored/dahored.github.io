import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { routing } from '@/i18n/routing';

const base = site.siteUrl;
const locales = routing.locales;

function url(path: string, locale: string) {
  return `${base}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: '',              priority: 1,    freq: 'weekly'  as const },
    { path: '/developer',   priority: 0.9,  freq: 'monthly' as const },
    { path: '/gamer',       priority: 0.9,  freq: 'monthly' as const },
    { path: '/coexist',priority: 0.9,  freq: 'monthly' as const },
    { path: '/adventures',  priority: 0.9,  freq: 'monthly' as const },
    { path: '/give',        priority: 0.9,  freq: 'monthly' as const },
  ];

  return [
    // Root
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    // All locale × route combinations with hreflang
    ...staticRoutes.flatMap(({ path, priority, freq }) =>
      locales.map((locale) => ({
        url: url(path, locale),
        lastModified: now,
        changeFrequency: freq,
        priority,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, url(path, l)])),
        },
      }))
    ),
  ];
}
