import { getTranslations } from 'next-intl/server';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ProjectsCarousel from '@/components/ui/ProjectsCarousel';
import type { ProjectSlide } from '@/components/ui/ProjectsCarousel';

export default async function ProjectsSection() {
  const t = await getTranslations('projects');

  const projects: ProjectSlide[] = [
    {
      id: 'myappcube',
      name: 'myappcube',
      tagline: t('myappcube.tagline'),
      banner: '/images/projects/myappcube-banner.png',
      logo: '/images/projects/myappcube-logo.png',
      href: 'https://myappcube.com',
      exploreLabel: t('myappcube.cta'),
    },
  ];

  return (
    <section id="projects" className="relative bg-black section-padding">
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-orange-900/10 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
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

        <ScrollReveal delay={150}>
          <ProjectsCarousel projects={projects} />
        </ScrollReveal>
      </div>
    </section>
  );
}
