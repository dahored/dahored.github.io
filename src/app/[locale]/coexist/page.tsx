import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, getLocale } from 'next-intl/server';
import CoexistFeed from '@/components/coexist/CoexistFeed';
import postsData from '@/data/coexist-posts.json';
import { site } from '@/config/site';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
    </svg>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('coexist');
  const locale = await getLocale();
  const url = `${site.siteUrl}/${locale}/coexist`;

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: 'DAHO',
      title: t('pageTitle'),
      description: t('pageDescription'),
      url,
      images: [{ url: '/images/logo/logo_daho_coexist_bg.png', width: 1200, height: 630, alt: 'Coexist by Daho' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('pageTitle'),
      description: t('pageDescription'),
      images: ['/images/logo/logo_daho_coexist_bg.png'],
    },
  };
}

export default async function CoexistPage() {
  const t = await getTranslations('coexist');
  const locale = await getLocale();

  const posts = postsData.posts;
  const allTopics = [...new Set(posts.map(p => p.topic))];
  const url = `${site.siteUrl}/${locale}/coexist`;

  return (
    <div className="bg-zinc-950 min-h-screen">

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Coexist by Daho',
            description: t('pageDescription'),
            url,
            image: `${site.siteUrl}/images/logo/logo_daho_coexist_bg.png`,
            isPartOf: { '@type': 'Person', name: site.fullName, url: site.siteUrl },
            sameAs: site.worldSocials.coexist.map(s => s.href),
          }),
        }}
      />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #C8344A 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-2xl mx-auto">
          <h1 className="sr-only">{t('pageTitle')}</h1>
          <Image
            src="/images/logo/logo_daho_coexist.png"
            alt="Coexist by Daho"
            width={320}
            height={100}
            className="h-20 w-auto"
            priority
          />

          <p className="text-lg text-zinc-400 leading-relaxed max-w-lg">
            {t('description')}
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            {site.worldSocials.coexist.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-80"
                style={{ background: 'rgba(200,52,74,0.15)', border: '1px solid rgba(200,52,74,0.3)' }}
              >
                {label === 'TikTok' && <TikTokIcon className="w-4 h-4" />}
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEED ─────────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-3">
            {t('feedLabel')}
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
            {t('feedHeading')}
          </h2>
        </div>

        <CoexistFeed
          posts={posts}
          allTopics={allTopics}
          allLabel={t('allTopics')}
          closeLabel={t('close')}
        />
      </section>

    </div>
  );
}
