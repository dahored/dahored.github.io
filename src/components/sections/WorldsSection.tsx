import { getTranslations } from 'next-intl/server';
import ScrollReveal from '@/components/ui/ScrollReveal';
import WorldCard from '@/components/ui/WorldCard';
import { site } from '@/config/site';

const worlds = [
  { iconName: 'Gamepad2', accent: '#f97316', nameKey: 'gaming.name',    descKey: 'gaming.description',    highlightKey: 'gaming.highlight',    socials: site.worldSocials.gaming    },
  { iconName: 'Leaf',     accent: '#10b981', nameKey: 'coexist.name',   descKey: 'coexist.description',   highlightKey: 'coexist.highlight',   socials: site.worldSocials.coexist   },
  { iconName: 'Mountain', accent: '#0ea5e9', nameKey: 'adventures.name',descKey: 'adventures.description',highlightKey: 'adventures.highlight',socials: site.worldSocials.adventures},
  { iconName: 'Heart',    accent: '#e11d48', nameKey: 'personal.name',  descKey: 'personal.description',  highlightKey: 'personal.highlight',  socials: site.worldSocials.give      },
];

export default async function WorldsSection() {
  const t = await getTranslations('worlds');

  return (
    <section id="worlds" className="relative bg-[#0a0a0a] section-padding">
      {/* Subtle background gradient */}
      <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-violet-900/10 blur-3xl pointer-events-none" aria-hidden="true" />

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

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {worlds.map((world, idx) => (
            <ScrollReveal key={world.nameKey} delay={idx * 120}>
              <WorldCard
                iconName={world.iconName}
                accent={world.accent}
                name={t(world.nameKey as Parameters<typeof t>[0])}
                description={t(world.descKey as Parameters<typeof t>[0])}
                highlight={t(world.highlightKey as Parameters<typeof t>[0])}
                socials={world.socials}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
