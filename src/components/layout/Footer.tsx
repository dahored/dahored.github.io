import { getTranslations } from 'next-intl/server';
import { Github, Linkedin, Youtube, Twitch } from 'lucide-react';
import { site } from '@/config/site';

export default async function Footer() {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();

  const navLinks = [
    { href: '#about',    labelKey: 'nav.about'    },
    { href: '#stack',    labelKey: 'nav.stack'    },
    { href: '#worlds',   labelKey: 'nav.worlds'   },
    { href: '#projects', labelKey: 'nav.projects' },
    { href: '#blog',     labelKey: 'nav.blog'     },
    { href: '#contact',  labelKey: 'nav.contact'  },
  ];

  const worldLinks = [
    { href: 'https://www.youtube.com/@dahogaming',            label: 'Daho Gaming'     },
    { href: 'https://www.instagram.com/daho.coexist/',        label: 'Daho Coexist'    },
    { href: 'https://www.instagram.com/daho.adventures/',     label: 'Daho Adventures' },
    { href: 'https://www.instagram.com/diego.hernandezorrego/', label: 'Filantropía'   },
  ];

  const socialLinks = [
    { label: 'GitHub',   href: site.socials.github,   Icon: Github,   hover: 'hover:text-white hover:border-white/20 hover:bg-white/10' },
    { label: 'LinkedIn', href: site.socials.linkedin,  Icon: Linkedin, hover: 'hover:text-[#0077B5] hover:border-[#0077B5]/40 hover:bg-[#0077B5]/10' },
    { label: 'YouTube',  href: site.socials.youtube,   Icon: Youtube,  hover: 'hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/10' },
    { label: 'Twitch',   href: site.socials.twitch,    Icon: Twitch,   hover: 'hover:text-[#9146FF] hover:border-[#9146FF]/40 hover:bg-[#9146FF]/10' },
  ];

  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: '#000' }}>

      {/* Main grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <span className="font-bold text-xl tracking-tight text-[#f5f5f7]">DAHO</span>
            <p className="text-sm text-[#6e6e73] leading-relaxed max-w-xs">
              {t('description')}
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-[#3a3a3c] mb-4">
              {t('colNav')}
            </h3>
            <ul className="flex flex-col gap-3">
              {navLinks.map(({ href, labelKey }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm text-[#6e6e73] hover:text-[#f5f5f7] transition-colors"
                  >
                    {t(labelKey as Parameters<typeof t>[0])}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Worlds */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-[#3a3a3c] mb-4">
              {t('colWorlds')}
            </h3>
            <ul className="flex flex-col gap-3">
              {worldLinks.map(({ href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#6e6e73] hover:text-[#f5f5f7] transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-[#3a3a3c] mb-4">
              {t('colFollow')}
            </h3>
            <div className="flex gap-2">
              {socialLinks.map(({ label, href, Icon, hover }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`p-2 rounded-lg text-[#6e6e73] transition-colors cursor-pointer ${hover}`}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-[#3a3a3c]">
            {t('copyright', { year })}
          </p>
        </div>
      </div>

    </footer>
  );
}
