import type { Metadata } from 'next';
import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { fetchInstagramPosts, fetchInstagramAccount, fetchFacebookPage, getPostImage } from '@/lib/instagram';
import { site } from '@/config/site';
import SocialButton from '@/components/ui/SocialButton';
import SocialCard from '@/components/ui/SocialCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import AdventuresCarousel from '@/components/adventures/AdventuresCarousel';
import { MapPin, Instagram, Facebook, ArrowRight, ArrowDown, ChevronsDown, Play } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('adventures');
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: 'DAHO',
      title: t('pageTitle'),
      description: t('pageDescription'),
      images: [{ url: '/images/logo/logo_daho_adventures_bg.png', width: 1200, height: 630, alt: t('pageTitle') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('pageTitle'),
      description: t('pageDescription'),
      images: ['/images/logo/logo_daho_adventures_bg.png'],
    },
  };
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default async function AdventuresPage() {
  const locale = await getLocale();
  const t = await getTranslations('adventures');
  const url = `${site.siteUrl}/${locale}/adventures`;
  const igId = process.env.IG_ADVENTURES_ID!;

  const [posts, account, fbPage] = await Promise.allSettled([
    fetchInstagramPosts(igId, 24),
    fetchInstagramAccount(igId),
    fetchFacebookPage('daho.adventures'),
  ]);

  const postsList = posts.status === 'fulfilled' ? posts.value : [];
  const accountData = account.status === 'fulfilled' ? account.value : null;
  const fbData = fbPage.status === 'fulfilled' ? fbPage.value : null;

  const featuredPost = postsList.find(p => p.media_type === 'IMAGE') ?? postsList[0];
  const featuredImg = featuredPost ? getPostImage(featuredPost) : null;

  return (
    <div className="bg-zinc-950 min-h-screen">

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Daho Adventures',
            description: 'Adventures, travel and unique experiences around the world by Daho.',
            url,
            image: `${site.siteUrl}/images/logo/logo_daho_adventures_bg.png`,
            isPartOf: { '@type': 'Person', name: site.fullName, url: site.siteUrl },
            sameAs: site.worldSocials.adventures.map(s => s.href),
          }),
        }}
      />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full opacity-25 blur-3xl"
            style={{ background: 'radial-gradient(circle, #0ea5e9 0%, #0369a1 50%, transparent 70%)' }}
          />
          <div className="absolute inset-0 opacity-[0.04] dot-grid" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-3xl mx-auto">
          <h1 className="sr-only">Daho Adventures</h1>
          <ScrollReveal>
            <Image
              src="/images/logo/logo_daho_adventures.png"
              alt="Daho Adventures"
              width={360}
              height={120}
              className="h-16 w-auto"
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
              href="#sigueme"
              className="inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full transition-opacity hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <span className="text-sm font-semibold text-[#f5f5f7]">{t('heroCta')}</span>
              <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: '#4ade80' }}>
                <ArrowDown className="w-4 h-4 text-white" />
              </span>
            </a>
          </ScrollReveal>
        </div>

        {/* Scroll indicator */}
        <a href="#sigueme" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600 hover:text-zinc-300 transition-colors">
          <ChevronsDown className="w-9 h-9 animate-bounce-slow" />
        </a>
      </section>

      {/* ── BENTO STATS ──────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-16">
        <ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[220px]">

            {/* Featured post — spans 2 cols + 2 rows */}
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

            {/* Quote / tagline */}
            <div
              className="col-span-2 relative rounded-3xl p-8 overflow-hidden flex flex-col sm:flex-row sm:items-center gap-6"
              style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(14,165,233,0.04) 100%)', border: '1px solid rgba(14,165,233,0.2)' }}
            >
              <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: '#0ea5e9' }} />
              <div className="flex items-center gap-5 relative z-10">
                <MapPin className="w-14 h-14 text-sky-400 shrink-0" />
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                    {t('tagline')}
                  </p>
                  <p className="text-base text-zinc-400 mt-1">{t('taglineDesc')}</p>
                </div>
              </div>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* ── CAROUSEL ─────────────────────────────────────────────────────────── */}
      {postsList.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-2">{t('instagramLabel')}</p>
                <h2 className="text-4xl sm:text-5xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
                  {t('carouselHeading')}
                </h2>
              </div>
              <a
                href={site.worldSocials.adventures.find(s => s.label === 'Instagram')?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-sky-400 hover:text-sky-300 transition-colors shrink-0"
              >
                {t('viewAll')} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <AdventuresCarousel posts={postsList.slice(0, 12)} />
          </ScrollReveal>
        </section>
      )}

      {/* ── FULL GRID ────────────────────────────────────────────────────────── */}
      {postsList.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-white mb-6" style={{ letterSpacing: '-0.02em' }}>
              {t('gridHeading')}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {postsList.map(post => {
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
                        alt={post.caption?.slice(0, 80) || 'Daho Adventures'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)' }} />
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
        </section>
      )}

      {postsList.length === 0 && (
        <p className="text-center text-zinc-500 pb-24">{t('noPostsAvailable')}</p>
      )}

      {/* ── SÍGUEME ──────────────────────────────────────────────────────────── */}
      <section id="sigueme" className="relative bg-zinc-950 section-padding" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
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
              {site.worldSocials.adventures.map(({ href, label, iconName, color, description, highlight }) => (
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
