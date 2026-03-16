import { getTranslations } from 'next-intl/server';
import { Monitor, Smartphone, Wrench, GitBranch, Languages, Flame, ShieldCheck, Megaphone, type LucideIcon } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

type Skill = { name: string; icon?: LucideIcon };
type SkillGroup = { key: string; icon: LucideIcon; skills: Skill[] };

const skillGroups: SkillGroup[] = [
  {
    key: 'web',
    icon: Monitor,
    skills: [
      { name: 'Vue' }, { name: 'Nuxt' }, { name: 'React' }, { name: 'Next.js' },
      { name: 'TypeScript' }, { name: 'JavaScript' }, { name: 'Tailwind CSS' },
    ],
  },
  {
    key: 'mobile',
    icon: Smartphone,
    skills: [
      { name: 'React Native' },
      { name: 'Firebase', icon: Flame },
      { name: 'Zustand' },
      { name: 'RevenueCat', icon: ShieldCheck },
      { name: 'AdMob', icon: Megaphone },
    ],
  },
  {
    key: 'tools',
    icon: Wrench,
    skills: [
      { name: 'Git', icon: GitBranch },
      { name: 'Zod' },
      { name: 'i18n', icon: Languages },
    ],
  },
];

const groupColors: Record<string, { icon: string }> = {
  web:    { icon: 'text-violet-400' },
  mobile: { icon: 'text-orange-400' },
  tools:  { icon: 'text-[#6e6e73]' },
};

export default async function StackSection() {
  const t = await getTranslations('stack');

  return (
    <section id="stack" className="relative bg-black section-padding">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(124,58,237,0.06),transparent)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
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
          <ScrollReveal delay={150}>
            <p className="mt-4 text-xl text-[#6e6e73] max-w-lg mx-auto">{t('subheading')}</p>
          </ScrollReveal>
        </div>

        {/* Skill groups */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skillGroups.map((group, i) => {
            const colors = groupColors[group.key];
            return (
              <ScrollReveal key={group.key} delay={200 + i * 120}>
                <div
                  className="h-full p-6 rounded-3xl flex flex-col gap-5"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {/* Group header */}
                  <div className="flex items-center gap-3">
                    <group.icon className={`w-5 h-5 ${colors.icon}`} />
                    <span className="font-semibold text-2xl text-[#f5f5f7]">
                      {t(`group.${group.key}`)}
                    </span>
                  </div>
                  {/* Skill badges */}
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map(({ name, icon: Icon }) => (
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
            );
          })}
        </div>

      </div>
    </section>
  );
}
