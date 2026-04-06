import type { Metadata } from 'next';
import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, FileText } from 'lucide-react';
import { site } from '@/config/site';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('terms');
  const locale = await getLocale();
  const url = `${site.siteUrl}/${locale}/terms`;
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    alternates: {
      canonical: url,
      languages: { es: `${site.siteUrl}/es/terms`, en: `${site.siteUrl}/en/terms` },
    },
    robots: { index: true, follow: true },
  };
}

export default async function TermsPage() {
  const t = await getTranslations('terms');
  const lastUpdated = 'April 6, 2026';

  const sections = [
    { title: t('s1Title'), body: t('s1Body') },
    { title: t('s2Title'), body: t('s2Body') },
    { title: t('s3Title'), body: t('s3Body') },
    { title: t('s4Title'), body: t('s4Body') },
    { title: t('s5Title'), body: t('s5Body') },
    { title: t('s6Title'), body: t('s6Body') },
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f5f7] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#6e6e73] hover:text-[#f5f5f7] transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          {t('backHome')}
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-sky-500/10">
            <FileText size={20} className="text-sky-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{t('heading')}</h1>
        </div>
        <p className="text-sm text-[#6e6e73] mb-10">
          {t('lastUpdated', { date: lastUpdated })}
        </p>

        {/* Intro */}
        <p className="text-[#a1a1a6] leading-relaxed mb-12 text-base">
          {t('intro')}
        </p>

        {/* Sections */}
        <div className="flex flex-col gap-10">
          {sections.map(({ title, body }, i) => (
            <section key={i}>
              <h2 className="text-lg font-semibold text-[#f5f5f7] mb-3">
                {i + 1}. {title}
              </h2>
              <p className="text-[#a1a1a6] leading-relaxed">{body}</p>
            </section>
          ))}

          {/* Contact */}
          <section>
            <h2 className="text-lg font-semibold text-[#f5f5f7] mb-3">
              7. {t('s7Title')}
            </h2>
            <p className="text-[#a1a1a6] leading-relaxed mb-2">{t('s7Body')}</p>
            <a
              href={`mailto:${site.email}`}
              className="text-sky-400 hover:text-sky-300 transition-colors text-sm"
            >
              {site.email}
            </a>
          </section>
        </div>

        {/* Divider */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#6e6e73] hover:text-[#f5f5f7] transition-colors"
          >
            <ArrowLeft size={14} />
            {t('backHome')}
          </Link>
        </div>

      </div>
    </main>
  );
}
