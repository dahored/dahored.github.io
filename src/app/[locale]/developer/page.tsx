import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import {
  Code2, Sparkles, ArrowRight, Linkedin, Mail,
  Monitor, Smartphone, Wrench, GitBranch, Languages,
  Flame, ShieldCheck, Megaphone, ExternalLink,
  Building2, Calendar,
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
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

  return (
    <div className="bg-black min-h-screen">

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-16">
        {/* Glow orbs */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-175 h-175 rounded-full bg-violet-600/12 blur-3xl animate-glow-pulse" />
          <div className="absolute bottom-[10%] right-[15%] w-96 h-96 rounded-full bg-orange-500/8 blur-3xl animate-glow-pulse [animation-delay:2s]" />
        </div>
        {/* Dot grid */}
        <div className="absolute inset-0 -z-20 opacity-10 dot-grid" aria-hidden="true" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-24 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Left: text */}
          <div className="flex-1 flex flex-col gap-8 text-center lg:text-left items-center lg:items-start">
            <ScrollReveal>
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-violet-400"
                style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)' }}
              >
                <Code2 className="w-3.5 h-3.5" />
                {t('hero.label')}
              </span>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#f5f5f7] leading-tight"
                style={{ letterSpacing: '-0.03em' }}
              >
                {t('hero.heading')}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={140}>
              <p className="text-xl text-[#6e6e73] max-w-lg leading-relaxed">
                {t('hero.subtitle')}
              </p>
            </ScrollReveal>

            {/* Stats */}
            <ScrollReveal delay={200}>
              <div className="flex gap-6 sm:gap-10">
                {[
                  { value: t('hero.stat1Value'), label: t('hero.stat1Label') },
                  { value: t('hero.stat2Value'), label: t('hero.stat2Label') },
                  { value: t('hero.stat3Value'), label: t('hero.stat3Label') },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-3xl sm:text-4xl font-bold text-[#f5f5f7]" style={{ letterSpacing: '-0.02em' }}>{value}</p>
                    <p className="text-xs text-[#6e6e73] mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* CTAs */}
            <ScrollReveal delay={260}>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
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

          {/* Right: portrait photo */}
          <ScrollReveal delay={100} className="shrink-0">
            {/*
              IMAGE 1 — PORTRAIT / HERO PHOTO
              Foto profesional o "at work":
              · Tú en tu escritorio, de pie con laptop, o fondo tech/bokeh
              · Formato vertical (portrait), mínimo 600×800 px
              · Guárdala en: /public/images/photos/developer/portrait.jpg
            */}
            <div
              className="relative w-72 h-96 sm:w-80 sm:h-112 rounded-3xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Image
                src="/images/photos/me/IMG_9872.jpeg"
                alt="Diego Hernández — Developer"
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 288px, 320px"
                priority
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
              {/* Open to work badge */}
              <div className="absolute bottom-5 left-5 right-5">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400"
                  style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t('bio.openToWork')}
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ── 2. BIO BENTO ────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0a0a0a] section-padding overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-violet-900/8 blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-14">
            <ScrollReveal>
              <p className="text-xs font-semibold tracking-widest uppercase text-[#6e6e73] mb-3">{t('bio.label')}</p>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#f5f5f7]" style={{ letterSpacing: '-0.02em' }}>
                {t('bio.heading')}
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Bio text card — col-span-2 */}
            <ScrollReveal delay={100} className="sm:col-span-2">
              <div
                className="h-full p-8 rounded-3xl flex flex-col gap-5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Code2 className="w-8 h-8 text-violet-400" />
                <p className="text-[#6e6e73] leading-relaxed">{t('bio.text1')}</p>
                <p className="text-[#6e6e73] leading-relaxed">{t('bio.text2')}</p>
              </div>
            </ScrollReveal>

            {/* Open to work card */}
            <ScrollReveal delay={150}>
              <div
                className="h-full p-6 rounded-3xl flex flex-col gap-4"
                style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <Sparkles className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <p className="font-bold text-[#f5f5f7] mb-1">{t('bio.openToWork')}</p>
                  <p className="text-sm text-[#6e6e73] leading-relaxed">{t('bio.openToWorkSub')}</p>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ── 3. EXPERIENCE ───────────────────────────────────────────────────── */}
      <section className="relative bg-black section-padding">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(124,58,237,0.05),transparent)] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-14">
            <ScrollReveal>
              <p className="text-xs font-semibold tracking-widest uppercase text-[#6e6e73] mb-3">{t('exp.label')}</p>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#f5f5f7]" style={{ letterSpacing: '-0.02em' }}>
                {t('exp.heading')}
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* NICE */}
            <ScrollReveal delay={100}>
              <div
                className="h-full p-8 rounded-3xl flex flex-col gap-6"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}
                  >
                    <Building2 className="w-6 h-6 text-violet-400" />
                  </div>
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-[#6e6e73]"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <Calendar className="w-3 h-3" />
                    {t('exp.nice.period')}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-violet-400 mb-1">{t('exp.nice.company')}</p>
                  <h3 className="text-2xl font-bold text-[#f5f5f7] mb-3">{t('exp.nice.role')}</h3>
                  <p className="text-[#6e6e73] leading-relaxed">{t('exp.nice.desc')}</p>
                </div>
                {/*
                  IMAGE 2 — WORKSPACE / SETUP PHOTO
                  Foto de tu setup de trabajo:
                  · Escritorio con monitores, teclado mecánico, luces
                  · Vista frontal o ligeramente lateral
                  · Formato horizontal (landscape), mínimo 800×450 px
                  · Guárdala en: /public/images/photos/developer/setup.jpg
                */}
                <div
                  className="w-full h-36 rounded-2xl overflow-hidden flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}
                >
                  <p className="text-xs text-[#3a3a3c] text-center px-4">
                    📷 Foto de tu workspace / setup<br />
                    <span className="opacity-60">800×450px → /images/photos/developer/setup.jpg</span>
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Playvox */}
            <ScrollReveal delay={180}>
              <div
                className="h-full p-8 rounded-3xl flex flex-col gap-6"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}
                  >
                    <Building2 className="w-6 h-6 text-orange-400" />
                  </div>
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-[#6e6e73]"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <Calendar className="w-3 h-3" />
                    {t('exp.playvox.period')}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-orange-400 mb-1">{t('exp.playvox.company')}</p>
                  <h3 className="text-2xl font-bold text-[#f5f5f7] mb-3">{t('exp.playvox.role')}</h3>
                  <p className="text-[#6e6e73] leading-relaxed">{t('exp.playvox.desc')}</p>
                </div>
                {/*
                  IMAGE 3 — WORKING / TEAM PHOTO (optional)
                  Foto "at work" o en equipo / reunión:
                  · Tú frente al computador, en una videollamada, o colaborando
                  · Formato horizontal, mínimo 800×450 px
                  · Guárdala en: /public/images/photos/developer/work.jpg
                */}
                <div
                  className="w-full h-36 rounded-2xl overflow-hidden flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}
                >
                  <p className="text-xs text-[#3a3a3c] text-center px-4">
                    📷 Foto &quot;at work&quot; o colaborando<br />
                    <span className="opacity-60">800×450px → /images/photos/developer/work.jpg</span>
                  </p>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ── 4. STACK ────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0a0a0a] section-padding">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(124,58,237,0.06),transparent)] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
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
          <div className="text-center mb-16">
            <ScrollReveal>
              <p className="text-xs font-semibold tracking-widest uppercase text-[#6e6e73] mb-3">Proyecto</p>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#f5f5f7]" style={{ letterSpacing: '-0.02em' }}>
                myappcube
              </h2>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={150}>
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 70% 60% at 30% 50%, rgba(124,58,237,0.10) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 75% 50%, rgba(249,115,22,0.06) 0%, transparent 70%)',
                }}
                aria-hidden="true"
              />
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 p-10 lg:p-16">

                {/* Logo */}
                <div className="shrink-0">
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36">
                    <div className="absolute inset-0 rounded-2xl bg-violet-600/20 blur-xl scale-110" />
                    <Image
                      src="/images/projects/myappcube-logo.png"
                      alt="myappcube"
                      width={144}
                      height={144}
                      className="relative z-10 rounded-2xl shadow-2xl"
                      sizes="144px"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4 text-center lg:text-left">
                  <div>
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-violet-400 mb-3"
                      style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}
                    >
                      ⭐ Indie Studio
                    </span>
                    <p className="text-xl text-[#6e6e73]">Fundador & Desarrollador</p>
                  </div>
                  <p className="text-[#6e6e73] leading-relaxed max-w-lg">
                    Estudio de juegos móviles indie. Dos juegos sociales disponibles en iOS y Android: El Infiltrado y Oculto. Construido con React Native, Firebase, RevenueCat y AdMob.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    {['React Native', 'Next.js', 'Firebase', 'TypeScript', 'i18n'].map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 rounded-lg text-sm font-medium text-[#f5f5f7]"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    <a
                      href="https://myappcube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full transition-opacity hover:opacity-80 cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <span className="text-sm font-semibold text-[#f5f5f7]">Ver sitio</span>
                      <span className="w-9 h-9 bg-violet-600 rounded-full flex items-center justify-center shrink-0">
                        <ExternalLink className="w-4 h-4 text-white" />
                      </span>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 6. CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0a0a0a] section-padding overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-150 h-64 rounded-full bg-violet-900/10 blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center gap-8">
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
