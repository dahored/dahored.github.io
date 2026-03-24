import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, getLocale } from 'next-intl/server';
import { fetchInstagramPosts, fetchInstagramAccount, fetchFacebookPage, getPostImage } from '@/lib/instagram';
import { site } from '@/config/site';
import SocialCard from '@/components/ui/SocialCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import AdventuresCarousel from '@/components/adventures/AdventuresCarousel';
import { Link } from '@/i18n/navigation';
import { Instagram, Facebook, ArrowRight, ArrowDown, ChevronsDown, Play } from 'lucide-react';
import socialStats from '@/data/social-stats.json';

const BRAND    = '#dc2626';
const GLOW     = '#991b1b';
const GRADIENT = 'linear-gradient(135deg, #991b1b 0%, #450a0a 100%)';

const YT_SVG = (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TIKTOK_SVG = (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
  </svg>
);

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('gamer');
  const locale = await getLocale();
  const url = `${site.siteUrl}/${locale}/gamer`;
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
      images: [{ url: '/images/logo/logo_daho_gaming_bg.png', width: 1200, height: 630, alt: 'Daho Gaming' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('pageTitle'),
      description: t('pageDescription'),
      images: ['/images/logo/logo_daho_gaming_bg.png'],
    },
  };
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default async function GamerPage() {
  const t = await getTranslations('gamer');
  const locale = await getLocale();
  const url = `${site.siteUrl}/${locale}/gamer`;
  const igId = process.env.IG_GAMING_ID!;

  const [posts, account, fbPage] = await Promise.allSettled([
    fetchInstagramPosts(igId, 24),
    fetchInstagramAccount(igId),
    fetchFacebookPage('dahored'),
  ]);

  const postsList   = posts.status   === 'fulfilled' ? posts.value   : [];
  const accountData = account.status === 'fulfilled' ? account.value : null;
  const fbData      = fbPage.status  === 'fulfilled' ? fbPage.value  : null;

  const featuredPost = postsList.find(p => p.media_type === 'IMAGE') ?? postsList[0];
  const featuredImg  = featuredPost ? getPostImage(featuredPost) : null;

  const ytLink     = site.worldSocials.gaming.find(s => s.label === 'YouTube')?.href  ?? '#';
  const twitchLink = site.worldSocials.gaming.find(s => s.label === 'Twitch')?.href   ?? '#';
  const tiktokLink = site.worldSocials.gaming.find(s => s.label === 'TikTok')?.href   ?? '#';
  const igLink     = site.worldSocials.gaming.find(s => s.label === 'Instagram')?.href ?? '#';

  return (
    <div className="bg-zinc-950 min-h-screen">

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Daho Gaming',
            description: t('pageDescription'),
            url,
            image: `${site.siteUrl}/images/logo/logo_daho_gaming_bg.png`,
            isPartOf: { '@type': 'Person', name: site.fullName, url: site.siteUrl },
            sameAs: site.worldSocials.gaming.map(s => s.href),
          }),
        }}
      />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full opacity-25 blur-3xl"
            style={{ background: `radial-gradient(circle, ${GLOW} 0%, #1a0000 55%, transparent 70%)` }}
          />
          <div className="absolute inset-0 opacity-[0.04] dot-grid" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-3xl mx-auto">
          <h1 className="sr-only">Daho Gaming</h1>
          <ScrollReveal>
            <Image
              src="/images/logo/logo_daho_gaming.png"
              alt="Daho Gaming"
              width={480}
              height={150}
              className="h-16 sm:h-20 lg:h-28 w-auto"
              priority
            />
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <p className="text-xl text-zinc-400 leading-relaxed max-w-xl">
              {t('description')}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={140}>
            <a
              href="#plataformas"
              className="inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full transition-opacity hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <span className="text-sm font-semibold text-[#f5f5f7]">{t('heroCta')}</span>
              <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: BRAND }}>
                <ArrowDown className="w-4 h-4 text-black" />
              </span>
            </a>
          </ScrollReveal>
        </div>

        <a href="#plataformas" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600 hover:text-zinc-300 transition-colors">
          <ChevronsDown className="w-9 h-9 animate-bounce-slow" />
        </a>
      </section>

      {/* ── BENTO STATS ──────────────────────────────────────────────────────── */}
      <section id="plataformas" className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-0 scroll-mt-20">
        <ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[220px]">

            {/* Featured post — 2×2 */}
            {featuredImg && (
              <a
                href={featuredPost?.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group col-span-2 row-span-2 relative rounded-3xl overflow-hidden"
              >
                <Image
                  src={featuredImg}
                  alt={featuredPost?.caption?.slice(0, 80) || 'Featured'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <span className="text-xs text-white/60 font-medium uppercase tracking-wider">{t('featuredPost')}</span>
                </div>
              </a>
            )}

            {/* Instagram followers */}
            <div
              className="relative rounded-3xl p-7 flex flex-col justify-between overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(131,58,180,0.15) 0%, rgba(225,48,108,0.1) 60%, rgba(252,175,69,0.08) 100%)', border: '1px solid rgba(225,48,108,0.25)' }}
            >
              <Instagram className="w-10 h-10" style={{ color: '#e1306c' }} />
              <div>
                <p className="text-4xl font-bold text-white">
                  {accountData ? formatNumber(accountData.followers_count) : '—'}
                </p>
                <p className="text-base text-zinc-400 mt-1">{t('followers')}</p>
              </div>
            </div>

            {/* YouTube subscribers */}
            <div
              className="relative rounded-3xl p-7 flex flex-col justify-between overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(255,0,0,0.15) 0%, rgba(180,0,0,0.08) 100%)', border: '1px solid rgba(255,0,0,0.25)' }}
            >
              <span className="w-10 h-10" style={{ color: '#FF0000' }}>{YT_SVG}</span>
              <div>
                <p className="text-4xl font-bold text-white">
                  {formatNumber(socialStats.youtube.gaming.subscribers)}
                </p>
                <p className="text-base text-zinc-400 mt-1">{t('subscribers')}</p>
              </div>
            </div>

            {/* TikTok followers */}
            <div
              className="relative rounded-3xl p-7 flex flex-col justify-between overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(105,201,208,0.15) 0%, rgba(0,0,0,0.08) 100%)', border: '1px solid rgba(105,201,208,0.25)' }}
            >
              <span className="w-10 h-10" style={{ color: '#69c9d0' }}>{TIKTOK_SVG}</span>
              <div>
                <p className="text-4xl font-bold text-white">
                  {formatNumber(socialStats.tiktok.gaming.followers)}
                </p>
                <p className="text-base text-zinc-400 mt-1">{t('followers')}</p>
              </div>
            </div>

            {/* Facebook page likes */}
            <div
              className="relative rounded-3xl p-7 flex flex-col justify-between overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(24,119,242,0.15) 0%, rgba(24,119,242,0.05) 100%)', border: '1px solid rgba(24,119,242,0.25)' }}
            >
              <Facebook className="w-10 h-10 text-blue-500" />
              <div>
                <p className="text-4xl font-bold text-white">
                  {fbData ? formatNumber(fbData.fan_count) : '—'}
                </p>
                <p className="text-base text-zinc-400 mt-1">{t('pageLikes')}</p>
              </div>
            </div>

            {/* Full-width tagline */}
            <div
              className="col-span-2 lg:col-span-4 relative rounded-3xl p-8 overflow-hidden flex items-center gap-6"
              style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.10) 0%, rgba(153,27,27,0.04) 100%)', border: '1px solid rgba(220,38,38,0.2)' }}
            >
              <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: GLOW }} />
              <svg className="w-14 h-14 shrink-0 relative z-10" style={{ color: BRAND }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="12" rx="3" />
                <path d="M7 13h2M8 12v2M15 13h.01M17 13h.01" />
              </svg>
              <div className="relative z-10">
                <p className="text-2xl sm:text-3xl font-bold text-white leading-tight">{t('tagline')}</p>
                <p className="text-base text-zinc-400 mt-1">{t('taglineDesc')}</p>
              </div>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* ── INSTAGRAM CAROUSEL ───────────────────────────────────────────────── */}
      {postsList.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-40 pb-24">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-2">{t('instagramLabel')}</p>
                <h2 className="text-4xl sm:text-5xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
                  {t('carouselHeading')}
                </h2>
              </div>
              <a
                href={igLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity shrink-0"
                style={{ color: BRAND }}
              >
                {t('viewAll')} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <AdventuresCarousel
              posts={postsList.slice(0, 12)}
              fallbackGradient={GRADIENT}
              brandName="Daho Gaming"
            />
          </ScrollReveal>
        </section>
      )}

      {/* ── YOUTUBE FEATURE ──────────────────────────────────────────────────── */}
      <section className="relative py-28 sm:py-40 overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-150 h-150 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: '#FF0000' }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Content */}
            <ScrollReveal>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: '#FF0000' }}>{t('ytLabel')}</p>
                <h2 className="text-5xl sm:text-6xl font-bold text-white leading-[1.05]" style={{ letterSpacing: '-0.02em' }}>
                  {t('ytHeading')}
                </h2>
                <p className="text-xl text-zinc-400 mt-6 leading-relaxed">
                  {t('ytDesc')}
                </p>
                <div className="mt-10 flex items-center gap-8">
                  <div>
                    <p className="text-5xl font-bold text-white">{formatNumber(socialStats.youtube.gaming.subscribers)}</p>
                    <p className="text-sm text-zinc-500 mt-1">{t('subscribers')}</p>
                  </div>
                  <div className="w-px h-14 bg-zinc-800" />
                  <a
                    href={ytLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full transition-opacity hover:opacity-80"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <span className="text-sm font-semibold text-[#f5f5f7]">{t('ytCta')}</span>
                    <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: '#FF0000' }}>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </span>
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Visual */}
            <ScrollReveal delay={120}>
              <a
                href={ytLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative rounded-3xl p-12 text-center overflow-hidden transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, rgba(255,0,0,0.12) 0%, rgba(120,0,0,0.08) 100%)', border: '1px solid rgba(255,0,0,0.2)' }}
              >
                <div className="absolute inset-0 pointer-events-none opacity-5" style={{ background: 'radial-gradient(circle at 50% 50%, #FF0000, transparent 70%)' }} />
                <span className="w-20 h-20 block mx-auto relative z-10" style={{ color: '#FF0000' }}>{YT_SVG}</span>
                <p className="text-7xl font-bold text-white mt-6 relative z-10">{formatNumber(socialStats.youtube.gaming.subscribers)}</p>
                <p className="text-zinc-400 mt-2 text-lg relative z-10">{t('subscribers')}</p>
                <p className="text-zinc-600 text-sm mt-1 relative z-10">@dahogaming</p>
              </a>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ── TWITCH FEATURE ───────────────────────────────────────────────────── */}
      <section className="relative py-28 sm:py-40 overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-150 h-150 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: '#9146ff' }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Visual — LEFT on desktop */}
            <ScrollReveal delay={120} className="order-2 lg:order-1">
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{ border: '1px solid rgba(145,70,255,0.3)' }}
              >
                <Image
                  src="/images/photos/gamer/IMG_0913.jpeg"
                  alt="Daho Gaming stream"
                  width={600}
                  height={400}
                  className="w-full h-80 object-cover"
                  style={{ mixBlendMode: 'luminosity', opacity: 0.65 }}
                  unoptimized
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(80,0,200,0.15) 50%, transparent 100%)' }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-zinc-300">Live on Twitch</span>
                  </div>
                  <p className="text-white font-bold text-2xl">@dahored</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Content — RIGHT on desktop */}
            <ScrollReveal className="order-1 lg:order-2">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: '#9146ff' }}>{t('twitchLabel')}</p>
                <h2 className="text-5xl sm:text-6xl font-bold text-white leading-[1.05]" style={{ letterSpacing: '-0.02em' }}>
                  {t('twitchHeading')}
                </h2>
                <p className="text-xl text-zinc-400 mt-6 leading-relaxed">
                  {t('twitchDesc')}
                </p>
                <div className="mt-10">
                  <a
                    href={twitchLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full transition-opacity hover:opacity-80"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <span className="text-sm font-semibold text-[#f5f5f7]">{t('twitchCta')}</span>
                    <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: '#9146ff' }}>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </span>
                  </a>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ── TIKTOK FEATURE ───────────────────────────────────────────────────── */}
      <section className="relative py-28 sm:py-40 overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-150 h-150 rounded-full opacity-08 blur-3xl pointer-events-none" style={{ background: '#69c9d0' }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Content */}
            <ScrollReveal>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: '#69c9d0' }}>{t('tiktokLabel')}</p>
                <h2 className="text-5xl sm:text-6xl font-bold text-white leading-[1.05]" style={{ letterSpacing: '-0.02em' }}>
                  {t('tiktokHeading')}
                </h2>
                <p className="text-xl text-zinc-400 mt-6 leading-relaxed">
                  {t('tiktokDesc')}
                </p>
                <div className="mt-10 flex items-center gap-8">
                  <div>
                    <p className="text-5xl font-bold text-white">{formatNumber(socialStats.tiktok.gaming.followers)}</p>
                    <p className="text-sm text-zinc-500 mt-1">{t('followers')}</p>
                  </div>
                  <div className="w-px h-14 bg-zinc-800" />
                  <a
                    href={tiktokLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full transition-opacity hover:opacity-80"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <span className="text-sm font-semibold text-[#f5f5f7]">{t('tiktokCta')}</span>
                    <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: '#69c9d0' }}>
                      <ArrowRight className="w-4 h-4 text-black" />
                    </span>
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Visual */}
            <ScrollReveal delay={120}>
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{ border: '1px solid rgba(105,201,208,0.25)' }}
              >
                <Image
                  src="/images/photos/gamer/IMG_0916.jpeg"
                  alt="Daho Gaming TikTok"
                  width={600}
                  height={400}
                  className="w-full h-80 object-cover"
                  style={{ mixBlendMode: 'luminosity', opacity: 0.65 }}
                  unoptimized
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,100,120,0.15) 50%, transparent 100%)' }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center gap-3">
                  <span className="w-7 h-7 shrink-0" style={{ color: '#69c9d0' }}>{TIKTOK_SVG}</span>
                  <p className="text-white font-bold text-xl">@dahored</p>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ── POSTS GRID ───────────────────────────────────────────────────────── */}
      {postsList.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-white mb-6" style={{ letterSpacing: '-0.02em' }}>
              {t('gridHeading')}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {postsList.slice(0, 8).map(post => {
              const img = getPostImage(post);
              return (
                <ScrollReveal key={post.id}>
                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square rounded-2xl overflow-hidden block"
                  >
                    {img ? (
                      <Image
                        src={img}
                        alt={post.caption?.slice(0, 80) || 'Daho Gaming'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full" style={{ background: GRADIENT }} />
                    )}
                    {post.media_type === 'VIDEO' && (
                      <span className="absolute top-2 right-2 flex items-center gap-1 text-white text-xs bg-black/60 px-2 py-0.5 rounded-full">
                        <Play className="w-3 h-3 fill-white" />
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <p className="text-white text-xs leading-snug line-clamp-3">{post.caption}</p>
                    </div>
                  </a>
                </ScrollReveal>
              );
            })}
          </div>
          <ScrollReveal>
            <div className="flex justify-center mt-10">
              <Link
                href="/gamer/posts"
                className="inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full transition-opacity hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <span className="text-sm font-semibold text-[#f5f5f7]">{t('viewAllPosts')}</span>
                <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: BRAND }}>
                  <ArrowRight className="w-4 h-4 text-white" />
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </section>
      )}

      {postsList.length === 0 && (
        <p className="text-center text-zinc-500 pb-24">{t('noPostsAvailable')}</p>
      )}

      {/* ── SÍGUEME ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-zinc-950 section-padding" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <ScrollReveal>
              <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-3">{t('followLabel')}</p>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <h2 className="text-4xl sm:text-5xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
                {t('followHeading')}
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={140}>
            <div className="flex flex-wrap justify-center gap-6">
              {site.worldSocials.gaming.map(({ href, label, iconName, color, description, highlight }) => (
                <div key={label} className="w-full sm:w-[calc(50%-12px)] xl:w-[calc(25%-18px)]">
                  <SocialCard href={href} label={label} iconName={iconName} color={color} description={description} highlight={highlight} />
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
