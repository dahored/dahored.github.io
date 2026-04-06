import type { Metadata } from 'next';
import { getTranslations, getLocale } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Linkedin, ArrowRight, Code2, Gamepad2, Compass, Users } from 'lucide-react';
import { site } from '@/config/site';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about');
  const locale = await getLocale();
  const url = `${site.siteUrl}/${locale}/about`;
  return {
    title: `${t('heading')} · Daho`,
    description: t('bio1'),
    alternates: {
      canonical: url,
      languages: { es: `${site.siteUrl}/es/about`, en: `${site.siteUrl}/en/about` },
    },
    openGraph: {
      title: `${t('name')} — ${t('subtitle')}`,
      description: t('bio1'),
      url,
      images: [{ url: `${site.siteUrl}/images/og/og-cover.png` }],
    },
  };
}

export default async function AboutPage() {
  const t = await getTranslations('about');

  const worlds = [
    { icon: Code2,    color: 'text-violet-400', bg: 'bg-violet-500/10', label: 'Developer',  href: '/developer' },
    { icon: Gamepad2, color: 'text-green-400',  bg: 'bg-green-500/10',  label: 'Gamer',      href: '/gamer'     },
    { icon: Compass,  color: 'text-rose-400',   bg: 'bg-rose-500/10',   label: 'Adventures', href: '/adventures'},
    { icon: Users,    color: 'text-pink-400',   bg: 'bg-pink-500/10',   label: 'Coexist',    href: '/coexist'   },
  ];

  const stats = [
    { value: t('exp1Value'), label: t('exp1Label') },
    { value: t('exp2Value'), label: t('exp2Label') },
    { value: t('exp3Value'), label: t('exp3Label') },
  ];

  const skills = ['Vue', 'React', 'Next.js', 'TypeScript', 'React Native', 'Node.js', 'Tailwind CSS', 'Firebase'];

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f5f7] pt-20">

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-violet-400 mb-4">
              {t('label')}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 leading-tight">
              {t('heading')}
            </h1>
            <p className="text-[#a1a1a6] leading-relaxed mb-4">{t('bio1')}</p>
            <p className="text-[#a1a1a6] leading-relaxed mb-8">{t('bio2')}</p>
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0077B5] hover:bg-[#005e8f] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              <Linkedin size={16} />
              {t('linkedinBtn')}
            </a>
          </div>

          {/* Photo */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-64 h-64 rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <Image
                src="/images/photos/daho-profile.jpg"
                alt={t('name')}
                fill
                className="object-cover"
                onError={() => {}}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/06" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold text-[#f5f5f7] mb-1">{value}</p>
                <p className="text-sm text-[#6e6e73]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-xl font-semibold mb-6">{t('skillsTitle')}</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 text-sm rounded-lg text-[#a1a1a6]"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Beyond code */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 border-t border-white/06" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <h2 className="text-xl font-semibold mb-8">{t('beyondCode')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {worlds.map(({ icon: Icon, color, bg, label, href }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-3 p-5 rounded-xl hover:scale-105 transition-transform"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className={`p-3 rounded-xl ${bg}`}>
                <Icon size={22} className={color} />
              </div>
              <span className="text-sm font-medium text-[#f5f5f7]">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 border-t border-white/06" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">{t('ctaHeading')}</h2>
          <p className="text-[#a1a1a6] mb-8">{t('ctaSub')}</p>
          <a
            href={site.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
          >
            LinkedIn
            <ArrowRight size={16} />
          </a>
        </div>
      </section>

    </main>
  );
}
