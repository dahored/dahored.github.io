import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ExternalLink } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

const techStack = ['Next.js 15', 'React 19', 'Tailwind CSS', 'Firebase', 'i18n'];

export default async function ProjectsSection() {
  const t = await getTranslations('projects');

  return (
    <section id="projects" className="relative bg-black section-padding">
      {/* Glow */}
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-orange-900/10 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#6e6e73] mb-3">
              {t('label')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#f5f5f7]" style={{ letterSpacing: '-0.02em' }}>
              {t('heading')}
            </h2>
          </ScrollReveal>
        </div>

        {/* Featured project card */}
        <ScrollReveal delay={150}>
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Background gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 70% 60% at 30% 50%, rgba(124,58,237,0.10) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 75% 50%, rgba(249,115,22,0.06) 0%, transparent 70%)',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col items-center gap-8 p-10 lg:p-16 text-center">
              {/* Logo */}
              <div className="shrink-0">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36">
                  <div className="absolute inset-0 rounded-2xl bg-violet-600/20 blur-xl scale-110" />
                  <Image
                    src="/images/projects/myappcube-logo.png"
                    alt="myappcube logo"
                    width={144}
                    height={144}
                    className="relative z-10 rounded-2xl shadow-2xl"
                    sizes="144px"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-5 items-center max-w-2xl">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-violet-400 mb-4" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
                    ⭐ {t('featured')}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-bold text-[#f5f5f7]" style={{ letterSpacing: '-0.02em' }}>
                    myappcube
                  </h3>
                  <p className="mt-1 text-xl text-[#6e6e73]">
                    {t('myappcube.tagline')}
                  </p>
                </div>

                <p className="text-xl text-[#6e6e73] leading-relaxed">
                  {t('myappcube.description')}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg text-sm font-medium text-[#f5f5f7]"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href="https://myappcube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full transition-opacity hover:opacity-80"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <span className="text-sm font-semibold text-[#f5f5f7]">{t('myappcube.cta')}</span>
                  <span className="w-9 h-9 bg-violet-600 rounded-full flex items-center justify-center shrink-0">
                    <ExternalLink className="w-4 h-4 text-white" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
