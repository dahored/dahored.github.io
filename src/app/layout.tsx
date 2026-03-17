import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { site } from '@/config/site';

const GA_ID = 'G-FDPG9H95RT';

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
  icons: {
    icon: '/images/logo/favicon.png',
    apple: '/images/logo/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
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

        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
        <Script id="ga-init" strategy="lazyOnload">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}</Script>
      </body>
    </html>
  );
}
