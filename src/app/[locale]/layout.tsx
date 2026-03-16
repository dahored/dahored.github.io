import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { site } from '@/config/site';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = `${site.siteUrl}/${locale}`;

  const alternateLanguages = Object.fromEntries(
    routing.locales.map((l) => [l, `${site.siteUrl}/${l}`])
  );

  const localeTitle: Record<string, string> = {
    es: 'DAHO — Diego Hernández | Senior Frontend Developer',
    en: 'DAHO — Diego Hernández | Senior Frontend Developer',
  };

  const localeDescription: Record<string, string> = {
    es: 'Senior Front End Developer con 10+ años de experiencia. Gamer, Creador de contenido y Coexister. Creador de myappcube.',
    en: 'Senior Front End Developer with 10+ years of experience. Gamer, Content Creator & Coexister. Creator of myappcube.',
  };

  return {
    title: localeTitle[locale] ?? localeTitle.en,
    description: localeDescription[locale] ?? localeDescription.en,
    alternates: {
      canonical,
      languages: alternateLanguages,
    },
    openGraph: {
      url: canonical,
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      alternateLocale: locale === 'es' ? 'en_US' : 'es_ES',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
