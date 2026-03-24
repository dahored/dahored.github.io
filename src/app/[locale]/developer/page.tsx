import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import {
  ArrowRight, Linkedin, Mail, ChevronsDown,
  Monitor, Smartphone, Wrench, GitBranch, Languages,
  Flame, ShieldCheck, Megaphone,
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import SocialButton from '@/components/ui/SocialButton';
import SocialCard from '@/components/ui/SocialCard';
import ExperienceScrollSection from '@/components/sections/ExperienceScrollSection';
import PhotoZoomSection from '@/components/sections/PhotoZoomSection';
import ProjectsCarousel from '@/components/ui/ProjectsCarousel';
import type { ProjectSlide } from '@/components/ui/ProjectsCarousel';
import { site } from '@/config/site';

// ─── Stack data (same as StackSection) ────────────────────────────────────────
const skillGroups = [
  {
    key: 'web', icon: Monitor, color: 'text-violet-400',
    skills: [
      { name: 'Vue' }, { name: 'Nuxt' }, { name: 'React' }, { name: 'Next.js' },
      { name: 'TypeScript' }, { name: 'JavaScript' }, { name: 'Tailwind CSS' },
    ],
  },
  {
    key: 'mobile', icon: Smartphone, color: 'text-orange-400',
    skills: [
      { name: 'React Native' },
      { name: 'Firebase', Icon: Flame },
      { name: 'Zustand' },
      { name: 'RevenueCat', Icon: ShieldCheck },
      { name: 'AdMob', Icon: Megaphone },
    ],
  },
  {
    key: 'tools', icon: Wrench, color: 'text-[#6e6e73]',
    skills: [
      { name: 'Git', Icon: GitBranch },
      { name: 'Zod' },
      { name: 'i18n', Icon: Languages },
    ],
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Developer',
    description: 'Senior Front End Developer — 10+ years building modern web and mobile products at scale.',
  };
}

export default async function DeveloperPage() {
  const t = await getTranslations('developer');
  const ts = await getTranslations('stack');
  const tp = await getTranslations('projects');

  return (
    <div className="bg-black min-h-screen">

      {/* ── 1. HERO — heading full screen ───────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-black pt-20 pb-16 overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-violet-600/20 blur-3xl animate-glow-pulse" />
        </div>
        <div className="absolute inset-0 opacity-[0.07] dot-grid" aria-hidden="true" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-8">
          <h1 className="sr-only">Daho Developer</h1>
          <ScrollReveal delay={60}>
            <Image
              src="/images/logo/logo_daho_developer.png"
              alt="Daho Developer"
              width={280}
              height={80}
              className="h-16 sm:h-20 lg:h-28 w-auto"
            />
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <p className="text-xl text-zinc-400 leading-relaxed max-w-xl text-center">
              {t('hero.subtitle')}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={180}>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full transition-opacity hover:opacity-80 cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Linkedin className="w-4 h-4 text-[#f5f5f7]" />
                <span className="text-sm font-semibold text-[#f5f5f7]">{t('cta.linkedin')}</span>
                <span className="w-9 h-9 bg-violet-600 rounded-full flex items-center justify-center shrink-0">
                  <ArrowRight className="w-4 h-4 text-white" />
                </span>
              </a>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full transition-opacity hover:opacity-80 cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span className="text-sm font-semibold text-[#f5f5f7]">{t('cta.contact')}</span>
                <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <Mail className="w-4 h-4 text-[#f5f5f7]" />
                </span>
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Scroll indicator */}
        <a href="#bio" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#6e6e73] hover:text-[#f5f5f7] transition-colors">
          <ChevronsDown className="w-9 h-9 animate-bounce-slow" />
        </a>
      </section>

      {/* ── 2. PHOTO ZOOM ───────────────────────────────────────────────────── */}
      <PhotoZoomSection
        src="/images/photos/me/IMG_9872.jpeg"
        alt="Diego Hernández — Developer"
        label="Senior Front End Developer"
        heading="Diego Hernández"
      />

      {/* ── 3. STATS STRIP ──────────────────────────────────────────────────── */}
      <section className="bg-black" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-10">
          {[
            {
              sup: t('hero.stat1Label'), value: t('hero.stat1Value'), sub: 'de experiencia en la industria',
              gradient: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)',
            },
            {
              sup: t('hero.stat2Label'), value: t('hero.stat2Value'), sub: 'empresas líderes a nivel global',
              gradient: 'linear-gradient(135deg, #34d399 0%, #06b6d4 100%)',
            },
            {
              sup: t('hero.stat3Label'), value: t('hero.stat3Value'), sub: 'líneas de código escritas',
              gradient: 'linear-gradient(135deg, #fb923c 0%, #f472b6 100%)',
            },
          ].map(({ sup, value, sub, gradient }, i) => (
            <ScrollReveal key={sup} delay={i * 80}>
              <div className="flex flex-col gap-2 py-4 items-center text-center sm:items-start sm:text-left">
                <p className="text-sm text-[#6e6e73]">{sup}</p>
                <p
                  className="font-bold"
                  style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                    background: gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {value}
                </p>
                <p className="text-sm text-[#6e6e73] leading-snug max-w-45">{sub}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── 4. BIO ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-black section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <ScrollReveal>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#6e6e73] mb-4">{t('bio.label')}</p>
          </ScrollReveal>
          <ScrollReveal delay={60}>
            <h2
              className="font-bold text-[#f5f5f7] mb-10"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
            >
              {t('bio.heading')}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="max-w-2xl flex flex-col gap-5">
              <p className="text-lg text-[#6e6e73] leading-relaxed">{t('bio.text1')}</p>
              <p className="text-lg text-[#6e6e73] leading-relaxed">{t('bio.text2')}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 5. OPEN TO WORK ─────────────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(16,185,129,0.04)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div>
              <p className="font-semibold text-[#f5f5f7]">{t('bio.openToWork')}</p>
              <p className="text-sm text-[#6e6e73]">{t('bio.openToWorkSub')}</p>
            </div>
          </div>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full transition-opacity hover:opacity-80 cursor-pointer shrink-0"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}
          >
            <span className="text-sm font-semibold text-emerald-400">{t('cta.contact')}</span>
            <span className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
              <Mail className="w-3.5 h-3.5 text-white" />
            </span>
          </a>
        </div>
      </section>

      {/* ── 3. EXPERIENCE ───────────────────────────────────────────────────── */}
      <ExperienceScrollSection />

      {/* ── 4. STACK ────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0a0a0a] section-padding">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(124,58,237,0.06),transparent)] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-14">
            <ScrollReveal>
              <p className="text-xs font-semibold tracking-widest uppercase text-[#6e6e73] mb-3">{ts('label')}</p>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#f5f5f7]" style={{ letterSpacing: '-0.02em' }}>
                {ts('heading')}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={130}>
              <p className="mt-4 text-xl text-[#6e6e73] max-w-lg mx-auto">{ts('subheading')}</p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skillGroups.map((group, i) => (
              <ScrollReveal key={group.key} delay={200 + i * 120}>
                <div
                  className="h-full p-6 rounded-3xl flex flex-col gap-5"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="flex items-center gap-3">
                    <group.icon className={`w-5 h-5 ${group.color}`} />
                    <span className="font-semibold text-2xl text-[#f5f5f7]">{ts(`group.${group.key}`)}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map(({ name, Icon }: { name: string; Icon?: React.ComponentType<{ className?: string }> }) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#f5f5f7]"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        {Icon && <Icon className="w-3 h-3 opacity-70" />}
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. FEATURED PROJECT ─────────────────────────────────────────────── */}
      <section className="relative bg-black section-padding">
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-orange-900/8 blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <ScrollReveal>
              <p className="text-xs font-semibold tracking-widest uppercase text-[#6e6e73] mb-3">{tp('label')}</p>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#f5f5f7]" style={{ letterSpacing: '-0.02em' }}>
                {tp('heading')}
              </h2>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={150}>
            <ProjectsCarousel projects={[
              {
                id: 'myappcube',
                name: 'myappcube',
                tagline: tp('myappcube.tagline'),
                banner: '/images/projects/myappcube-banner.png',
                logo: '/images/projects/myappcube-logo.png',
                href: 'https://myappcube.com',
                exploreLabel: tp('myappcube.cta'),
              } satisfies ProjectSlide,
            ]} />
          </ScrollReveal>
        </div>
      </section>

      {/* ── 6. SOCIALS ──────────────────────────────────────────────────────── */}
      <section className="relative bg-black section-padding" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <ScrollReveal>
              <p className="text-xs font-semibold tracking-widest uppercase text-[#6e6e73] mb-3">Sígueme</p>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#f5f5f7]" style={{ letterSpacing: '-0.02em' }}>
                Encuéntrame en
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={140}>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {site.worldSocials.developer.map(({ href, label, iconName, color, description, highlight }) => (
                <SocialCard key={label} href={href} label={label} iconName={iconName} color={color} description={description} highlight={highlight} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 7. CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0a0a0a] section-padding overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-150 h-64 rounded-full bg-violet-900/10 blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center gap-8">
          <ScrollReveal>
            <div className="flex flex-col items-center gap-4">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#6e6e73]">{t('exp.label')}</p>
              <h2 className="text-5xl sm:text-6xl font-bold text-[#f5f5f7]" style={{ letterSpacing: '-0.02em' }}>
                {t('cta.heading')}
              </h2>
              <p className="text-xl text-[#6e6e73]">{t('cta.sub')}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full transition-opacity hover:opacity-80 cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Linkedin className="w-4 h-4 text-[#f5f5f7]" />
                <span className="text-sm font-semibold text-[#f5f5f7]">{t('cta.linkedin')}</span>
                <span className="w-9 h-9 bg-violet-600 rounded-full flex items-center justify-center shrink-0">
                  <ArrowRight className="w-4 h-4 text-white" />
                </span>
              </a>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full transition-opacity hover:opacity-80 cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span className="text-sm font-semibold text-[#f5f5f7]">{t('cta.contact')}</span>
                <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <Mail className="w-4 h-4 text-[#f5f5f7]" />
                </span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
