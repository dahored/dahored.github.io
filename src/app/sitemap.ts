import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { routing } from '@/i18n/routing';
import { getAllPosts } from '@/lib/blog';

const base = site.siteUrl;
const locales = routing.locales;

function url(path: string, locale: string) {
  return `${base}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: '',             priority: 1,   freq: 'weekly'  as const },
    { path: '/developer',  priority: 0.9, freq: 'monthly' as const },
    { path: '/gamer',      priority: 0.9, freq: 'monthly' as const },
    { path: '/coexist',    priority: 0.9, freq: 'monthly' as const },
    { path: '/adventures', priority: 0.9, freq: 'monthly' as const },
    { path: '/give',       priority: 0.9, freq: 'monthly' as const },
    { path: '/blog',       priority: 0.8, freq: 'weekly'  as const },
  ];

  // Collect all blog slugs per locale, deduplicate across locales
  const slugsByLocale: Record<string, Set<string>> = {};
  for (const locale of locales) {
    slugsByLocale[locale] = new Set(getAllPosts(locale).map((p) => p.slug));
  }
  // Union of all slugs
  const allSlugs = new Set([...Object.values(slugsByLocale).flatMap((s) => [...s])]);

  const blogEntries: MetadataRoute.Sitemap = Array.from(allSlugs).flatMap((slug) => {
    // Build per-locale URLs (only for locales that have this slug)
    const langs: Record<string, string> = {};
    for (const locale of locales) {
      if (slugsByLocale[locale].has(slug)) {
        langs[locale] = url(`/blog/${slug}`, locale);
      }
    }
    return locales
      .filter((locale) => slugsByLocale[locale].has(slug))
      .map((locale) => ({
        url: url(`/blog/${slug}`, locale),
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        alternates: { languages: langs },
      }));
  });

  return [
    // Root
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    // Static pages
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
    // Blog posts
    ...blogEntries,
  ];
}
