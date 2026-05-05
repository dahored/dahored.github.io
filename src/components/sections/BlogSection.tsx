import { getTranslations, getLocale } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import PostCard from '@/components/blog/PostCard';
import { Link } from '@/i18n/navigation';
import { getAllPosts } from '@/lib/blog';

export default async function BlogSection() {
  const t = await getTranslations('blog');
  const locale = await getLocale();
  const posts = getAllPosts(locale).slice(0, 3);

  return (
    <section id="blog" className="relative bg-[#0a0a0a] section-padding">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-violet-900/8 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="mb-12">
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
            <p className="text-lg text-[#6e6e73] mt-4 max-w-2xl leading-relaxed">
              {t('subheading')}
            </p>
          </ScrollReveal>
        </div>

        {/* Posts grid */}
        {posts.length > 0 && (
          <ScrollReveal delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} locale={locale} />
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* CTA */}
        <ScrollReveal delay={250}>
          <div className="flex justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full transition-opacity hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <span className="text-sm font-semibold text-[#f5f5f7]">{t('viewAllPosts')}</span>
              <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-violet-600">
                <ArrowRight className="w-4 h-4 text-white" />
              </span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
