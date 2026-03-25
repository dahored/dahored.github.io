import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';
import PostCard from '@/components/blog/PostCard';
import BlogFilter from '@/components/blog/BlogFilter';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  const allPosts = getAllPosts(locale);
  const featuredPost = allPosts.find((p) => p.featured);
  const remainingPosts = allPosts.filter((p) => !p.featured || p.slug !== featuredPost?.slug);

  return (
    <main className="min-h-screen bg-black text-[#f5f5f7]">
      {/* Hero */}
      <section className="pt-40 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-4 max-w-2xl">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#6e6e73]">{t('label')}</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              {t('heading')}
            </h1>
            <p className="text-lg text-[#6e6e73] leading-relaxed">
              {t('subheading')}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 flex flex-col gap-16">
        {/* Featured post */}
        {featuredPost && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#6e6e73]">
                {t('featured')}
              </span>
            </div>
            <PostCard post={featuredPost} locale={locale} featured />
          </section>
        )}

        {/* All posts with filter */}
        <section>
          <BlogFilter
            posts={remainingPosts}
            locale={locale}
            labels={{
              all: t('filterAll'),
              ia: t('filterIa'),
              desarrollo: t('filterDesarrollo'),
              herramientas: t('filterHerramientas'),
              allPostsCount: t('allPostsCount'),
            }}
          />
        </section>
      </div>
    </main>
  );
}
