import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import ScrollReveal from '@/components/ui/ScrollReveal';

const brands = [
  {
    slug: 'developer',
    logo: '/images/logo/logo_daho_developer.png',
    href: '/developer',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(79,70,229,0.12) 100%)',
    border: 'rgba(99,102,241,0.35)',
    glow: '#6366f1',
  },
  {
    slug: 'gaming',
    logo: '/images/logo/logo_daho_gaming.png',
    href: '/gamer',
    color: '#dc2626',
    gradient: 'linear-gradient(135deg, rgba(220,38,38,0.25) 0%, rgba(153,27,27,0.12) 100%)',
    border: 'rgba(220,38,38,0.35)',
    glow: '#dc2626',
  },
  {
    slug: 'coexist',
    logo: '/images/logo/logo_daho_coexist.png',
    href: '/coexist',
    color: '#C8344A',
    gradient: 'linear-gradient(135deg, rgba(200,52,74,0.25) 0%, rgba(159,18,57,0.12) 100%)',
    border: 'rgba(200,52,74,0.35)',
    glow: '#C8344A',
  },
  {
    slug: 'give',
    logo: '/images/logo/logo_daho_give.png',
    href: '/give',
    color: '#d97706',
    gradient: 'linear-gradient(135deg, rgba(217,119,6,0.25) 0%, rgba(180,83,9,0.12) 100%)',
    border: 'rgba(217,119,6,0.35)',
    glow: '#d97706',
  },
  {
    slug: 'adventures',
    logo: '/images/logo/logo_daho_adventures.png',
    href: '/adventures',
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, rgba(14,165,233,0.25) 0%, rgba(3,105,161,0.12) 100%)',
    border: 'rgba(14,165,233,0.35)',
    glow: '#0ea5e9',
  },
];

export default async function BrandsSection() {
  const t = await getTranslations('brands');

  return (
    <section id="brands" className="relative bg-black section-padding">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-900/10 blur-3xl pointer-events-none" aria-hidden="true" />

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
          <ScrollReveal delay={160}>
            <p className="mt-4 text-lg text-zinc-400 max-w-xl mx-auto">
              {t('subheading')}
            </p>
          </ScrollReveal>
        </div>

        {/* Mobile/tablet: horizontal scroll carousel (up to xl) */}
        <div className="xl:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-4 w-max">
            {brands.map((brand) => (
              <div key={brand.slug} className="w-[72vw] sm:w-[44vw] snap-center">
                <Link
                  href={brand.href}
                  className="group relative flex flex-col items-center justify-center rounded-3xl overflow-hidden aspect-square"
                  style={{ background: brand.gradient, border: `1px solid ${brand.border}` }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 50%, ${brand.glow}33 0%, transparent 70%)` }}
                  />
                  <div className="relative z-10 h-12 sm:h-14 flex items-center justify-center">
                    <Image src={brand.logo} alt={brand.slug} width={200} height={56} className="h-full w-auto object-contain drop-shadow-lg" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: 5-column grid (xl+) */}
        <ScrollReveal delay={160} className="hidden xl:block">
          <div className="grid grid-cols-5 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                href={brand.href}
                className="group relative flex flex-col items-center justify-center rounded-3xl overflow-hidden aspect-square transition-transform duration-300 hover:scale-[1.03]"
                style={{ background: brand.gradient, border: `1px solid ${brand.border}` }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${brand.glow}33 0%, transparent 70%)` }}
                />
                <div className="relative z-10 h-14 flex items-center justify-center">
                  <Image src={brand.logo} alt={brand.slug} width={200} height={56} className="h-full w-auto object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-105" />
                </div>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
