import { getTranslations } from 'next-intl/server';
import { Bell } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default async function BlogSection() {
  const t = await getTranslations('blog');
  const cats = await getTranslations('blog.categories');

  const categories = [
    cats('dev'),
    cats('gaming'),
    cats('travel'),
    cats('motivation'),
  ];

  return (
    <section id="blog" className="relative bg-[#0a0a0a] section-padding">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-violet-900/8 blur-3xl pointer-events-none" aria-hidden="true" />

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

        {/* Coming soon card */}
        <ScrollReveal delay={150}>
          <div
            className="max-w-2xl mx-auto rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center gap-6"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Bell className="w-8 h-8 text-violet-400" />

            <p className="text-xl text-[#6e6e73] leading-relaxed max-w-md">
              {t('description')}
            </p>

            {/* Category chips preview */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="px-4 py-2 rounded-full text-sm font-medium text-[#f5f5f7]"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Subscribe form */}
            <div className="w-full max-w-sm flex gap-2">
              <input
                type="email"
                placeholder={t('placeholder')}
                className="flex-1 px-4 py-2.5 rounded-full text-sm text-[#f5f5f7] placeholder:text-[#3a3a3c] outline-none transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                disabled
              />
              <button
                type="button"
                className="px-5 py-2.5 rounded-full bg-violet-600 text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled
              >
                {t('subscribe')}
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
