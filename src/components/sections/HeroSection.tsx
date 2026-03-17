import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ChevronsDown, ArrowRight } from 'lucide-react';
import AnimatedTagline from '@/components/ui/AnimatedTagline';

// Hero is above-the-fold — no ScrollReveal (would hide content until JS hydrates)
// Use CSS keyframe animations instead (render immediately, no JS dependency)

export default async function HeroSection() {
  const t = await getTranslations('hero');
  const taglines = [t('tagline0'), t('tagline1'), t('tagline2')];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Dot grid */}
      <div className="absolute inset-0 -z-20 opacity-20 dot-grid" aria-hidden="true" />

      {/* Glow orbs */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-175 h-175 rounded-full bg-violet-600/15 blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-[5%] left-[20%] w-96 h-96 rounded-full bg-orange-500/10 blur-3xl animate-glow-pulse [animation-delay:2s]" />
        <div className="absolute top-[30%] right-[15%] w-80 h-80 rounded-full bg-fuchsia-700/10 blur-3xl animate-glow-pulse [animation-delay:1s]" />
      </div>

      {/* Content — centered */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 w-full pt-16 pb-24 flex flex-col items-center text-center gap-7">

        {/* Avatar */}
        <div className="animate-fade-slide-up" style={{ animationDelay: '0ms' }}>
          <div className="relative w-36 h-36 rounded-[40px] p-0.5" style={{ background: 'linear-gradient(135deg, #7c3aed, #c026d3, #f97316)' }}>
            <div className="w-full h-full rounded-[40px] overflow-hidden" style={{ background: '#0a0a0a' }}>
              <Image
                src="/images/photos/me/me_green_tshirt.png"
                alt="Daho"
                width={144}
                height={144}
                className="w-full h-full object-cover object-center"
                priority
              />
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="animate-fade-slide-up" style={{ animationDelay: '100ms' }}>
          <p className="text-xl text-[#6e6e73] mb-2">{t('greeting')}</p>
          <h1 className="text-8xl sm:text-9xl md:text-[10rem] font-bold leading-none" style={{ letterSpacing: '-0.02em' }}>
            <span className="bg-linear-to-r from-violet-400 via-fuchsia-300 to-orange-400 bg-clip-text text-transparent">
              {t('name')}
            </span>
          </h1>
        </div>

        {/* Tagline — LCP element, must be immediately visible */}
        <div className="animate-fade-slide-up" style={{ animationDelay: '180ms' }}>
          <AnimatedTagline
            lines={taglines}
            className="text-2xl sm:text-3xl lg:text-4xl text-[#6e6e73] font-light"
          />
        </div>

        {/* Buttons */}
        <div className="animate-fade-slide-up" style={{ animationDelay: '280ms' }}>
          <div className="flex flex-row flex-wrap gap-3 justify-center mt-8">
            <a
              href="#about"
              className="inline-flex w-fit items-center gap-3 pl-5 pr-2 py-2 rounded-full transition-opacity hover:opacity-80 cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <span className="text-sm font-semibold text-[#f5f5f7]">{t('ctaPrimary')}</span>
              <span className="w-9 h-9 bg-violet-600 rounded-full flex items-center justify-center shrink-0">
                <ArrowRight className="w-4 h-4 text-white" />
              </span>
            </a>
          </div>
        </div>

      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#6e6e73] hover:text-[#f5f5f7] transition-colors"
        aria-label={t('scrollDown')}
      >
        <ChevronsDown className="w-9 h-9 animate-bounce-slow" />
      </a>
    </section>
  );
}
