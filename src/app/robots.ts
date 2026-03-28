import type { MetadataRoute } from 'next';
import { site } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/_next/static/media/',
        '/manifest.webmanifest',
        '/admin/',
      ],
    },
    sitemap: `${site.siteUrl}/sitemap.xml`,
  };
}
