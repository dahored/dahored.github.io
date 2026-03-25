import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import './globals.css';
import { site } from '@/config/site';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: 'DAHO — Diego Hernández',
    template: '%s | DAHO',
  },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: site.fullName, url: site.siteUrl }],
  creator: site.alternateName,
  openGraph: {
    type: 'website',
    siteName: 'DAHO',
    title: 'DAHO — Diego Hernández',
    description: site.description,
    url: site.siteUrl,
    images: [
      {
        url: '/images/og/og-cover.png',
        width: 1200,
        height: 630,
        alt: 'Diego Hernández — DAHO',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DAHO — Diego Hernández',
    description: site.description,
    images: ['/images/og/og-cover.png'],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/images/logo/logo_daho.png" as="image" fetchPriority="high" />
        <meta name="google-adsense-account" content="ca-pub-5119314285197382" />
      </head>
      <body className={`${geist.variable} font-sans antialiased bg-zinc-950 text-zinc-50 min-h-screen`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: site.fullName,
              alternateName: site.alternateName,
              jobTitle: site.jobTitle,
              url: site.siteUrl,
              email: site.email,
              image: `${site.siteUrl}/images/photos/me/me_green_tshirt.png`,
              description: site.description,
              nationality: { '@type': 'Country', name: 'Colombia' },
              knowsAbout: ['Frontend Development', 'React', 'Next.js', 'TypeScript', 'Gaming', 'Content Creation'],
              sameAs: site.sameAs,
            }),
          }}
        />
        {children}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5119314285197382"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <GoogleAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
