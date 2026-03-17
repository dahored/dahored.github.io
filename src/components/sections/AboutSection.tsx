import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Linkedin, ArrowRight, Code2, Globe, Sparkles } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { site } from '@/config/site';

export default async function AboutSection() {
  const t = await getTranslations('about');

  return (
    <section id="about" className="relative bg-[#0a0a0a] section-padding overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-violet-900/10 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

        <div className="text-center mb-14">
          <ScrollReveal>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#6e6e73] mb-3">
              {t('label')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#f5f5f7]" style={{ letterSpacing: '-0.02em' }}>
              {t('heading')}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={130}>
            <p className="mt-4 text-xl text-[#6e6e73] max-w-lg mx-auto">{t('subtitle')}</p>
          </ScrollReveal>
        </div>

        {/* Bento — 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Photo card (col-span-2, row-span-2) */}
          <ScrollReveal delay={100} className="sm:col-span-2 sm:row-span-2">
            <div className="relative h-72 sm:h-full min-h-80 rounded-3xl overflow-hidden">
              <Image
                src="/images/photos/me/IMG_9872.jpeg"
                alt="Diego Hernández"
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 100vw, 66vw"
                priority
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.3) 40%, transparent 70%)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.5) 0%, transparent 40%)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.4) 0%, transparent 30%)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, rgba(10,10,10,0.5) 0%, transparent 30%)' }} />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-xs font-semibold tracking-widest uppercase text-[#6e6e73] mb-1">
                  {t('subtitle')}
                </p>
                <h3 className="text-3xl sm:text-4xl font-bold text-[#f5f5f7]" style={{ letterSpacing: '-0.02em' }}>
                  {t('name')}
                </h3>
              </div>
            </div>
          </ScrollReveal>

          {/* Card — Dev */}
          <ScrollReveal delay={150}>
            <div
              className="h-full p-6 rounded-3xl flex flex-col gap-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Code2 className="w-8 h-8 text-violet-400" />
              <div>
                <p className="font-bold text-[#f5f5f7] mb-1">{t('devCardTitle')}</p>
                <p className="text-sm text-[#6e6e73] leading-relaxed">{t('devCardSub')}</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card — Open to work */}
          <ScrollReveal delay={200}>
            <div
              className="h-full p-6 rounded-3xl flex flex-col gap-4"
              style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <Sparkles className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <p className="font-bold text-[#f5f5f7] mb-1">{t('exp3Value')}</p>
                <p className="text-sm text-[#6e6e73] leading-relaxed">{t('openToWorkSub')}</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card — Beyond code */}
          <ScrollReveal delay={250}>
            <div
              className="h-full p-6 rounded-3xl flex flex-col gap-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Globe className="w-8 h-8 text-orange-400" />
              <div>
                <p className="font-bold text-[#f5f5f7] mb-1">{t('beyondCode')}</p>
                <p className="text-sm text-[#6e6e73] leading-relaxed line-clamp-4">{t('bio2')}</p>
              </div>
            </div>
          </ScrollReveal>

          {/* CTA — LinkedIn (col-span-2) */}
          <ScrollReveal delay={300} className="sm:col-span-2">
            <div
              className="h-full p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}
            >
              <div>
                <p className="font-bold text-lg text-[#f5f5f7]">{t('ctaHeading')}</p>
                <p className="text-sm text-[#6e6e73] mt-1">{t('ctaSub')}</p>
              </div>
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full transition-opacity hover:opacity-80 shrink-0 cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Linkedin className="w-4 h-4 text-[#f5f5f7]" />
                <span className="text-sm font-semibold text-[#f5f5f7]">{t('linkedinBtn')}</span>
                <span className="w-9 h-9 bg-violet-600 rounded-full flex items-center justify-center shrink-0">
                  <ArrowRight className="w-4 h-4 text-white" />
                </span>
              </a>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
