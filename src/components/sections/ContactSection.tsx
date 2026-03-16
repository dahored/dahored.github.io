import { getTranslations } from 'next-intl/server';
import { Mail, Linkedin, Github, Youtube, Twitch } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { site } from '@/config/site';

const socials = [
  { label: 'LinkedIn', href: site.socials.linkedin, Icon: Linkedin, hover: 'hover:text-[#0077B5] hover:border-[#0077B5]/40 hover:bg-[#0077B5]/10' },
  { label: 'GitHub',   href: site.socials.github,   Icon: Github,   hover: 'hover:text-white hover:border-white/20 hover:bg-white/10' },
  { label: 'YouTube',  href: site.socials.youtube,  Icon: Youtube,  hover: 'hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/10' },
  { label: 'Twitch',   href: site.socials.twitch,   Icon: Twitch,   hover: 'hover:text-[#9146FF] hover:border-[#9146FF]/40 hover:bg-[#9146FF]/10' },
];

export default async function ContactSection() {
  const t = await getTranslations('contact');

  return (
    <section id="contact" className="relative bg-black section-padding overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-150 h-64 rounded-full bg-violet-900/10 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10 text-center">

        <ScrollReveal>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#6e6e73] mb-3">
            {t('label')}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#f5f5f7] mb-4" style={{ letterSpacing: '-0.02em' }}>
            {t('heading')}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <p className="text-xl text-[#6e6e73] mb-10">
            {t('subheading')}
          </p>
        </ScrollReveal>

        {/* Primary CTA */}
        <ScrollReveal delay={200}>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full transition-opacity hover:opacity-80 mb-10"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <span className="text-sm font-semibold text-[#f5f5f7]">{t('cta')}</span>
            <span className="w-9 h-9 bg-violet-600 rounded-full flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-white" />
            </span>
          </a>
        </ScrollReveal>

        {/* Social icons */}
        <ScrollReveal delay={280}>
          <div className="flex items-center justify-center gap-3">
            {socials.map(({ label, href, Icon, hover }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`p-3 rounded-2xl text-[#6e6e73] transition-colors cursor-pointer ${hover}`}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
